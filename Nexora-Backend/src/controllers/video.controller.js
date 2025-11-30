import { User } from '../models/user.model.js';
import { Video } from '../models/video.model.js';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary, cloudinary } from '../utils/cloudinary.js';
import mongoose, { isValidObjectId } from 'mongoose';
import { Comment } from '../models/comment.model.js';
import { Like } from '../models/like.model.js';
import { Watchhistory } from '../models/watchhistory.model.js';
import { Subscription } from '../models/subscription.model.js';
//get all videos
const getAllVideos = asyncHandler(async (req, res) => {
    let { query, sortBy, sortType, userId } = req.query;
    //see if the tag of video is public , select tht
    //then search the words in query in the indexed title and descripotion
    //then retrive the owner and views and created at
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    sortBy = sortBy || 'createdAt';
    sortType = sortType || 'desc';
    console.log(query);

    const queryFilterMatch = { isPublished: true };
    if (query && query != '') {
        queryFilterMatch.$text = { $search: query }; // search in title/description
    }
    //the above is same as this, querfiltermatch is just an object
    /* {
            $match: { isPublished: true }
        },
        {
            $match: { $text: { $search: query } }
        },
    */
    const aggregate = Video.aggregate([
        {
            $match: queryFilterMatch
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        {
            $unwind: '$ownerDetails'
        },
        {
            $project: {
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                thumbnail: 1,
                videoFile: 1,
                publicId: 1,
                duration: 1,
                username: '$ownerDetails.username',
                avatar: '$ownerDetails.avatar',
                ownerId: `$ownerDetails._id`,
                owner: 1
            }
        }
    ]);
    // Use aggregatePaginate
    const options = {
        page,
        limit,
        sort: { [sortBy]: sortType === 'asc' ? 1 : -1 }
    };

    const result = await Video.aggregatePaginate(aggregate, options);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                result,
                'all availabe videos fetched succefully'
            )
        );
});
const getSubscribedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 1. Get subscribed channel IDs
    const subscriptions = await Subscription.find({ subscriber: userId }).select("channel");

    const subscribedChannelIds = subscriptions.map((s) => s.channel);

    if (subscribedChannelIds.length === 0) {
        return res.status(200).json(new apiResponse(200, [], "No subscribed channels"));
    }

    // 2. Build query: only fetch videos from subscribed channels
    const aggregate = Video.aggregate([
        {
            $match: {
                owner: { $in: subscribedChannelIds },
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" },
        {
            $project: {
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                thumbnail: 1,
                duration: 1,
                videoFile: 1,

                ownerId: "$ownerDetails._id",
                username: "$ownerDetails.username",
                avatar: "$ownerDetails.avatar"
            }
        }
    ]);

    const options = {
        page,
        limit,
        sort: { createdAt: -1 }
    };

    const result = await Video.aggregatePaginate(aggregate, options);

    return res.status(200).json(
        new apiResponse(200, result, "Subscribed videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    //get the video from public /temp along with its thumbnail
    //upload to cloudinary
    //and done

    const { title, description } = req.body;
    console.log(title, description);

    //const publishBooleanFlag = JSON.parse(isPublished.toLowerCase());

    const localPathVideo = req.files?.videoFile[0]?.path;
    const localPaththumbnail = req.files?.thumbnail[0]?.path;

    if (!localPathVideo) {
        throw new apiError(401, 'video file is required , path not found');
    }
    if (!localPaththumbnail) {
        throw new apiError(401, 'thumbnail is required , path not found');
    }

    //upload on cloudinary
    console.log('Uploading to Cloudinary:', localPathVideo);
    const videoFile = await uploadOnCloudinary(localPathVideo);

    console.log('Uploading to Cloudinary:', localPaththumbnail);
    const thumbnail = await uploadOnCloudinary(localPaththumbnail);

    if (!videoFile) {
        throw new apiError(401, 'failed to upload video on cloudinary');
    }
    if (!thumbnail) {
        throw new apiError(401, 'failed to upload thumbnail on cloudinary');
    }
    if (!localPathVideo || !localPaththumbnail) {
        throw new apiError(400, 'Both video and thumbnail are required');
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        publicId: videoFile.public_id,
        thumbnail: thumbnail.url,
        title,
        description,
        isPublished: true,
        owner: req.user._id,
        duration: videoFile.duration,
        views: 0
    });
    return res
        .status(200)
        .json(
            new apiResponse(200, video, 'succesfully uploaded to cloudinary ')
        );
});

const getVideoById = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, 'Invalid video ID');
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    ).populate('owner', 'username avatar _id');

    if (!video) {
        throw new apiError(404, 'Video not found');
    }
    await Watchhistory.deleteMany({ video: videoId, watchedBy: req.user._id });

    // Create a fresh document
    await Watchhistory.create({
        video: videoId,
        watchedBy: req.user._id
    });
    // FLATTEN VIDEO
    const result = {
        _id: video._id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        views: video.views,
        isPublished: video.isPublished,
        videoFile: video.videoFile,
        publicId: video.publicId,
        thumbnail: video.thumbnail,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,

        // Flattening owner fields
        ownerId: video.owner?._id,
        username: video.owner?.username,
        avatar: video.owner?.avatar
    };

    return res
        .status(200)
        .json(new apiResponse(200, result, 'Video fetched successfully'));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new apiError(401, 'no id recived');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(401, 'no video of this id found');
    }
    if (req.user._id.toString() == video.owner.toString()) {
        const localPaththumbnail = req.file?.path;
        const { title, description } = req.body;
        let thumbnail;

        try {
            const oldThumbnail = video.thumbnail?.public_id;

            console.log('Uploading to Cloudinary:', localPaththumbnail);

            thumbnail = await uploadOnCloudinary(localPaththumbnail);
            if (localPaththumbnail == undefined) {
                video.title = title;
                video.description = description;
            } else {
                if (thumbnail && oldThumbnail) {
                    const imageURL = video.thumbnail;
                    //get public id from url
                    const getPublicId = (imageURL) =>
                        imageURL.split('/').pop().split('.')[0];

                    const PublicId = getPublicId(imageURL);

                    await cloudinary.uploader.destroy(PublicId);
                }
                video.thumbnail = thumbnail.url;
                video.title = title;
                video.description = description;
                video.thumbnail;
            }
        } catch (error) {
            return error?.message || 'failed to upate thumbnail';
        }

        await video.save();
    } else {
        throw new apiError(401, 'you are not authorised to edit this video');
    }

    return res.status(200).json(
        new apiResponse(200, {
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnailc
        })
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new apiError(401, 'no id recived');
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(401, 'no video of this id found');
    }

    if (req.user._id.toString() == video.owner.toString()) {
        const imageURL = video.thumbnail;

        const getPublicId = (imageURL) =>
            imageURL.split('/').pop().split('.')[0];

        const PublicId = getPublicId(imageURL);
        await cloudinary.uploader.destroy(PublicId);
        await Video.findByIdAndDelete(videoId);

        // delete the comments too
        await Comment.deleteMany({ video: videoId });
    }
    return res
        .status(200)
        .json(new apiError(200, 'video deleted succesfully '));
});

const getUserVideos = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new apiError(400, 'Invalid or missing user ID');
    }

    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Build aggregate
    const aggregate = Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
                isPublished: true // optional — remove if needed
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        { $unwind: '$ownerDetails' },
        {
            $project: {
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                thumbnail: 1,
                videoFile: 1,
                publicId: 1,
                duration: 1,
                ownerId: '$ownerDetails._id',
                username: '$ownerDetails.username',
                avatar: '$ownerDetails.avatar'
            }
        }
    ]);

    // Paginate them
    const options = {
        page,
        limit,
        sort: { createdAt: -1 } // newest first
    };

    const result = await Video.aggregatePaginate(aggregate, options);

    return res
        .status(200)
        .json(new apiResponse(200, result, 'User videos fetched successfully'));
});

export {
    getAllVideos,
    getUserVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getSubscribedVideos
};
