import mongoose from 'mongoose';
import { Like } from '../models/like.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Video } from '../models/video.model.js';
import { Comment } from '../models/comment.model.js';
import { Tweet } from '../models/tweet.model.js';


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, 'Invalid video ID');
    }

    const video = await Video.findById(videoId);
    if (!video) throw new apiError(404, 'Video not found');

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        await existingLike.deleteOne();
    } else {
        await Like.create({ video: videoId, likedBy: userId });
    }

    const likesCount = await Like.countDocuments({ video: videoId });

    return res.status(200).json(
        new apiResponse(200, {
            likesCount,
            likedByUser: !existingLike
        }, existingLike ? 'Video unliked' : 'Video liked')
    );
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, 'Invalid comment ID');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) throw new apiError(404, 'Comment not found');

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
        await existingLike.deleteOne();
    } else {
        await Like.create({ comment: commentId, likedBy: userId });
    }

    const likesCount = await Like.countDocuments({ comment: commentId });

    return res.status(200).json(
        new apiResponse(200, {
            likesCount,
            likedByUser: !existingLike
        }, existingLike ? 'Comment unliked' : 'Comment liked')
    );
});


const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, 'Invalid tweet ID');
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new apiError(404, 'Tweet not found');

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (existingLike) {
        await existingLike.deleteOne();
    } else {
        await Like.create({ tweet: tweetId, likedBy: userId });
    }

    const likesCount = await Like.countDocuments({ tweet: tweetId });

    return res.status(200).json(
        new apiResponse(200, {
            likesCount,
            likedByUser: !existingLike
        }, existingLike ? 'Tweet unliked' : 'Tweet liked')
    );
});
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    
    const aggregateQuery = Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoData"
            }
        },
        { $unwind: "$videoData" },

        {
            $lookup: {
                from: "users",
                localField: "videoData.owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" },

        {
            $project: {
                _id: "$videoData._id",
                title: "$videoData.title",
                description: "$videoData.description",
                views: "$videoData.views",
                createdAt: "$videoData.createdAt",
                thumbnail: "$videoData.thumbnail",
                videoFile: "$videoData.videoFile",
                publicId: "$videoData.publicId",
                duration: "$videoData.duration",
                ownerId: "$ownerDetails._id",
                username: "$ownerDetails.username",
                avatar: "$ownerDetails.avatar",
            }
        }
    ]);

    const options = {
        page,
        limit,
        sort: { createdAt: -1 }
    };

    const result = await Like.aggregatePaginate(aggregateQuery, options);

    return res.status(200).json(
        new apiResponse(200, result, "Liked videos fetched successfully")
    );
});



const getLikeVideoStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, 'Invalid video ID');
    }

    const video = await Video.findById(videoId);
    if (!video) throw new apiError(404, 'Video not found');

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    

    const likesCount = await Like.countDocuments({ video: videoId });

    return res.status(200).json(
        new apiResponse(200, {
            likesCount,
            likedByUser: !existingLike
        }, existingLike ? 'Video unliked' : 'Video liked')
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos ,getLikeVideoStatus};
