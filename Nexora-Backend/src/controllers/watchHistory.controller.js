import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { Watchhistory } from '../models/watchhistory.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

const watchHistory = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const aggregateQuery = Watchhistory.aggregate([
        {
            $match: { watchedBy: userId }
        },

        {
            $lookup: {
                from: 'videos',
                localField: 'video',
                foreignField: '_id',
                as: 'videoDetails'
            }
        },
        { $unwind: '$videoDetails' },

        {
            $lookup: {
                from: 'users',
                localField: 'watchedBy',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        { $unwind: '$userDetails' },

        {
            $project: {
                _id:'$videoDetails._id' ,
                historyCreatedAt: '$createdAt',

                title: '$videoDetails.title',
                description: '$videoDetails.description',
                views: '$videoDetails.views',
                createdAt: '$videoDetails.createdAt',
                thumbnail: '$videoDetails.thumbnail',
                videoFile: '$videoDetails.videoFile',
                publicId: '$videoDetails.publicId',
                duration: '$videoDetails.duration',

                ownerId: '$userDetails._id',
                username: '$userDetails.username',
                avatar: '$userDetails.avatar'
            }
        }
    ]);

    const options = {
        page,
        limit,
        sort: { historyCreatedAt: -1 }
    };

    const result = await Watchhistory.aggregatePaginate(
        aggregateQuery,
        options
    );

    return res
        .status(200)
        .json(
            new apiResponse(200, result, 'Watch history fetched successfully')
        );
});

export {watchHistory}