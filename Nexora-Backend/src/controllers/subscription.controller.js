import mongoose, { isValidObjectId } from 'mongoose';
import { User } from '../models/user.model.js';
import { Subscription } from '../models/subscription.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const checkSubscription = asyncHandler(async(req,res)=>{
     const { subscriberId } = req.params;
    // TODO: toggle subscription
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new apiError(400, 'Invalid channel ID');
    }
    
    const subscriberExists = await User.findById(subscriberId);
    if (!subscriberExists) throw new apiError(404, 'Channel not found');

    const exists = await Subscription.exists({
        channel: subscriberId,
        subscriber: req.user._id
    });
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                exists ? 'unsubscribe' : 'subscribe'
            )
        );
})
const toggleSubscription = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    // TODO: toggle subscription
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new apiError(400, 'Invalid channel ID');
    }
    
    const subscriberExists = await User.findById(subscriberId);
    if (!subscriberExists) throw new apiError(404, 'Channel not found');

    const existingSubscribe = await Subscription.findOne({
        channel: subscriberId,
        subscriber: req.user._id
    });
    if (existingSubscribe) {
        await existingSubscribe.deleteOne();
    } else {
        await Subscription.create({
            channel: subscriberId,
            subscriber: req.user._id
        });
    }
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                existingSubscribe ? 'unsubscribed' : 'subscribed'
            )
        );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new apiError(400, 'Invalid channel ID');
    }
    const subscriberExists = await User.findById(subscriberId);
    if (!subscriberExists) throw new apiError(404, 'Channel not found');

    const channelSubscribers = await Subscription.find({channel:subscriberId}).populate('subscriber', 'username fullName avatar');

    return res.status(200).json(new apiResponse(200,channelSubscribers,"all subscribers fetched succesfully"))


});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new apiError(400, 'Invalid channel ID');
    }
    const subscriberExists = await User.findById(subscriberId);
    if (!subscriberExists) throw new apiError(404, 'Channel not found');

    const subscribedChannels = await Subscription.find({subscriber:subscriberId}).populate('channel', 'username fullName avatar');

    return res.status(200).json(new apiResponse(200,subscribedChannels,"all subscribed channels fetched succesfully"))
});

const getSubscriberCount = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new apiError(400, "Invalid channel ID");
    }

    // Ensure channel exists
    const subscriberExists = await User.findById(subscriberId);
    if (!subscriberExists) {
        throw new apiError(404, "Channel not found");
    }

    // Count subscribers
    const count = await Subscription.countDocuments({ channel: subscriberId });

    return res.status(200).json(
        new apiResponse(
            200,
            { count },
            "subscriber count fetched successfully"
        )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels,checkSubscription ,getSubscriberCount};
