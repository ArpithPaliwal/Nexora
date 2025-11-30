import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new apiError(400, "Invalid channel ID");
    }

    //total videos

     const totalViewsAgg = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" }, totalLikes: { $sum: "$likes" } } }
    ]);
    
    const totalViews = totalViewsAgg[0]?.totalViews || 0;
    const totalLikes = totalViewsAgg[0]?.totalLikes || 0;
    const totalSubscribers = await Subscription.countDocuments({channel:channelId})

    return res.status(200).json(new apiResponse(200,{totalLikes,totalViews,totalSubscribers},"total views , likes ,subscribers fetched succesfully "))

})


const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Validate channel ID
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new apiError(400, "Invalid channel ID");
    }

    
    const channelVideos = await Video.find({ owner: channelId })
        .populate(
            "owner",
            "username avatar fullName" 
        )
        .sort({ createdAt: -1 }); 

    if (!channelVideos.length) {
        return res
            .status(200)
            .json(new apiResponse(200, [], "No videos found for this channel"));
    }

    return res
        .status(200)
        .json(new apiResponse(200, channelVideos, "Channel videos fetched successfully"));
});


export {
    getChannelStats, 
    getChannelVideos
    }