import mongoose, { isValidObjectId } from 'mongoose';
import { Playlist } from '../models/playlist.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    // Validate user authentication
    if (!req.user || !req.user._id) {
        throw new apiError(
            401,
            'Unauthorized request. Please log in to create a playlist.'
        );
    }

    // Validate required fields
    if (!name || name.trim().length === 0) {
        throw new apiError(400, 'Playlist name is required.');
    }

    // limit description length
    if (description && description.length > 300) {
        throw new apiError(
            400,
            'Description too long. Max 300 characters allowed.'
        );
    }

    //Check if playlist with same name already exists for this user
    const existingPlaylist = await Playlist.findOne({
        name: name.trim(),
        owner: req.user._id
    });

    if (existingPlaylist) {
        try {
            if (fs.existsSync(tempFolder)) {
                const files = fs.readdirSync(tempFolder);
                files.forEach((file) => {
                    const filePath = path.join(tempFolder, file);
                    fs.unlinkSync(filePath);
                    console.log('Deleted file:', filePath);
                });
                console.log('All files in temp folder deleted.');
            }
        } catch (err) {
            console.error('Error deleting files in temp folder:', err);
        }
        throw new apiError(409, 'You already have a playlist with this name.');
    }
    let coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new apiError(
            400,
            'coverImage file is required ,, path not found'
        );
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // Create playlist
    const playlist = await Playlist.create({
        name: name.trim(),
        description: description?.trim() || '',
        owner: req.user._id,
        coverImage: coverImage?.url || ''
    });

    //Double check creation success
    if (!playlist) {
        throw new apiError(
            500,
            'Something went wrong while creating the playlist.'
        );
    }

    //Return success response
    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                playlist,
                'New playlist created successfully. You can now add videos to it.'
            )
        );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate input
    if (!userId) {
        throw new apiError(400, 'User ID is required.');
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
        throw new apiError(404, 'User not found.');
    }

    // Fetch all playlists of that user
    const allPlaylists = await Playlist.find({ owner: userId }).sort({
        createdAt: -1
    });

    // If no playlists exist
    if (!allPlaylists || allPlaylists.length === 0) {
        return res
            .status(200)
            .json(
                new apiResponse(200, [], 'No playlists found for this user.')
            );
    }

    // Return successful response
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                allPlaylists,
                'All playlists fetched successfully.'
            )
        );
});


const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, 'Invalid or missing playlist ID.');
    }

    // Agg pipeline: capture playlist owner first, then lookup videos and video owners
    const playlistAgg = await Playlist.aggregate([
        // match the playlist
        { $match: { _id: new mongoose.Types.ObjectId(playlistId) } },

        // keep playlist owner in a stable field before unwinding videos
        {
            $addFields: {
                playlistOwner: "$owner"
            }
        },

        // lookup videos
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },

        // unwind videos array so we can lookup each video's owner
        { $unwind: { path: "$videos", preserveNullAndEmptyArrays: true } },

        // lookup owner for each video
        {
            $lookup: {
                from: "users",
                localField: "videos.owner",
                foreignField: "_id",
                as: "videoOwner"
            }
        },
        { $unwind: { path: "$videoOwner", preserveNullAndEmptyArrays: true } },

        // project fields we need for grouping
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                coverImage: 1,
                // keep playlistOwner (an ObjectId)
                playlistOwner: 1,

                // video fields
                videoId: "$videos._id",
                title: "$videos.title",
                descriptionVideo: "$videos.description",
                thumbnail: "$videos.thumbnail",
                duration: "$videos.duration",
                views: "$videos.views",
                videoFile: "$videos.videoFile",
                videoCreatedAt: "$videos.createdAt",

                // video owner flattened
                ownerId: "$videoOwner._id",
                ownerUsername: "$videoOwner.username",
                ownerAvatar: "$videoOwner.avatar"
            }
        },

        // group back to one document with videos array
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                description: { $first: "$description" },
                coverImage: { $first: "$coverImage" },

                // bring back playlistOwner (ObjectId)
                owner: { $first: "$playlistOwner" },

                videos: {
                    $push: {
                        _id: "$videoId",
                        title: "$title",
                        description: "$descriptionVideo",
                        thumbnail: "$thumbnail",
                        duration: "$duration",
                        views: "$views",
                        videoFile: "$videoFile",
                        createdAt: "$videoCreatedAt",
                        username: "$ownerUsername",
                        avatar: "$ownerAvatar"
                    }
                }
            }
        }
    ]);

    if (!playlistAgg || !playlistAgg.length) {
        throw new apiError(404, "Playlist not found.");
    }

    // single playlist doc
    const playlist = playlistAgg[0];

    // compute boolean isOwner by comparing ObjectId strings
    const playlistOwnerIdStr = playlist.owner ? String(playlist.owner) : null;
    const requesterIdStr = req.user && req.user._id ? String(req.user._id) : null;
    const isOwner = playlistOwnerIdStr !== null && requesterIdStr !== null && playlistOwnerIdStr === requesterIdStr;

    // Remove raw owner id if you want frontend to see only boolean:
    // (optional — keep if you still need owner id)
    delete playlist.owner;

    // attach only boolean
    playlist.isOwner = isOwner;

    return res.status(200).json(
        new apiResponse(200, playlist, "Playlist fetched successfully.")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Validate input
    if (!playlistId || !videoId) {
        throw new apiError(400, 'Playlist ID and Video ID are required.');
    }

    // Find playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, 'Playlist not found.');
    }

    // Verify playlist ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(
            403,
            'You are not authorized to modify this playlist.'
        );
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, 'Video not found.');
    }

    //. Prevent duplicate entries
    const alreadyExists = playlist.videos.some(
        (v) => v.toString() === videoId.toString()
    );
    if (alreadyExists) {
        throw new apiError(409, 'This video is already in the playlist.');
    }

    // Add video and save
    playlist.videos.push(videoId);
    await playlist.save();

    //  Populate only videos
    const updatedPlaylist =
        await Playlist.findById(playlistId).populate('videos');

    // Send response
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                'Video added to playlist successfully.'
            )
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    //  Validate user authentication
    if (!req.user || !req.user._id) {
        throw new apiError(
            401,
            'Unauthorized request. Please log in to modify playlists.'
        );
    }

    //  Validate params
    if (!playlistId || !videoId) {
        throw new apiError(400, 'Playlist ID and Video ID are required.');
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, 'Playlist not found.');
    }

    // Ensure user owns this playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(
            403,
            'You are not authorized to modify this playlist.'
        );
    }

    // Check if the video exists in the playlist
    const videoIndex = playlist.videos.findIndex(
        (v) => v.toString() === videoId.toString()
    );

    if (videoIndex === -1) {
        throw new apiError(404, 'This video is not in the playlist.');
    }

    // Remove the video
    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    // Return updated playlist with populated videos
    const updatedPlaylist =
        await Playlist.findById(playlistId).populate('videos');

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                'Video removed from playlist successfully.'
            )
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, 'Invalid or missing playlist ID.');
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, 'Playlist not found.');
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(
            403,
            'You are not authorized to delete this playlist.'
        );
    }

    await playlist.deleteOne();

    return res
        .status(200)
        .json(new apiResponse(200, null, 'Playlist deleted successfully.'));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, 'Invalid or missing playlist ID.');
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, 'Playlist not found.');
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(
            403,
            'You are not authorized to update this playlist.'
        );
    }

    if (name && name.trim() === '') {
        throw new apiError(400, 'Playlist name cannot be empty.');
    }
    if (description && description.length > 300) {
        throw new apiError(
            400,
            'Description too long. Max 300 characters allowed.'
        );
    }

    //Update fields

    playlist.name = name.trim();

    playlist.description = description;

    await playlist.save();

    const updatedPlaylist =
        await Playlist.findById(playlistId).populate('videos');

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                'Playlist updated successfully.'
            )
        );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
