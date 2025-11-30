import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import {Subscription} from "../models/subscription.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { apiResponse } from "../utils/apiResponse.js";
export const getViedoDetails = asyncHandler(async (req,res)=>{
    const { videoId } = req.params;
    const userId = req.user._id;


    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, 'Invalid video ID');
    }

    const video = await Video.findById(videoId).populate("owner", "_id username avatar");
    if (!video) throw new apiError(404, 'Video not found');


    const likeCount = await Like.countDocuments({video:videoId})
    const likeStatus = await Like.exists({video: videoId,likedBy:userId})

    

    const subscribeStatus = await Subscription.exists({channel:video.owner._id,subscriber:userId})
    const subscriberCount = await Subscription.countDocuments({channel:video.owner._id})
    

    
    return res.status(200).json(
    new apiResponse(200, {
      
      likeCount,
      likeStatus: !!likeStatus,
      subscribeStatus: !!subscribeStatus,
      subscriberCount
    },"fetched video details ")
  );
})