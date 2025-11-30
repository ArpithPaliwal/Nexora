import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ----------------------------------------
   CREATE TWEET
---------------------------------------- */
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new apiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  const populatedTweet = await Tweet.findById(tweet._id).populate(
    "owner",
    "username avatar fullName"
  );

  const response = {
    _id: populatedTweet._id,
    content: populatedTweet.content,
    ownerId: populatedTweet.owner._id,
    username: populatedTweet.owner.username,
    avatar: populatedTweet.owner.avatar,
    createdAt: populatedTweet.createdAt,
  };

  return res
    .status(201)
    .json(new apiResponse(201, response, "Tweet created successfully"));
});

/* ----------------------------------------
   GET USER TWEETS (Paginated)
---------------------------------------- */
const getUserTweets = asyncHandler(async (req, res) => {
  const{ userId} = req.params


  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const aggregate = Tweet.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        content: 1,
        createdAt: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
        "owner.fullName": 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const options = {
    page,
    limit,
  };

  const result = await Tweet.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new apiResponse(200, result, "User tweets fetched successfully"));
});

/* ----------------------------------------
   GET ALL TWEETS (Paginated)
---------------------------------------- */
const getAllTweets = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const aggregate = Tweet.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        content: 1,
        createdAt: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
        "owner.fullName": 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const options = {
    page,
    limit,
  };

  const result = await Tweet.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new apiResponse(200, result, "All tweets fetched successfully"));
});

/* ----------------------------------------
   UPDATE TWEET
---------------------------------------- */
const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content || content.trim() === "") {
    throw new apiError(400, "Tweet content is required");
  }

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }

  // Ownership check
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to edit this tweet");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  ).populate("owner", "username avatar fullName");

  const response = {
    _id: updatedTweet._id,
    content: updatedTweet.content,
    ownerId: updatedTweet.owner._id,
    username: updatedTweet.owner.username,
    avatar: updatedTweet.owner.avatar,
    createdAt: updatedTweet.createdAt,
  };

  return res
    .status(200)
    .json(new apiResponse(200, response, "Tweet updated successfully"));
});

/* ----------------------------------------
   DELETE TWEET
---------------------------------------- */
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }

  // Ownership check
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to delete this tweet");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Tweet deleted successfully"));
});

export {
  createTweet,
  getUserTweets,
  getAllTweets,
  updateTweet,
  deleteTweet,
};
