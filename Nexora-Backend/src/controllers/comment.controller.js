
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from "mongoose";
import { apiResponse } from "../utils/apiResponse.js";
import { Comment } from '../models/comment.model.js';


// const getVideoComments = asyncHandler(async (req,res)=>{
//     const {videoId} = req.params
//     const {page=1,limit=10}= req.query

//     if(!mongoose.Types.ObjectId.isValid(videoId)){
//         throw new apiError(401,"invaid videoId")
//     }
//     const aggregate = Comment.aggregate([
//         {
//             $match:{
//                 video: new mongoose.Types.ObjectId(videoId)
//             }
//         },
//         {
//             $lookup:{
//                 from:"users",
//                 localField:"owner",
//                 foreignField:"_id",
//                 as:"ownerDetails"
//             }
//         },
//         {
//             $unwind: "$ownerDetails",
//         },
//         {
//             $project: {
//                 content: 1,
//                 createdAt: 1,
//                 "ownerDetails.username": 1,
//                 "ownerDetails.avatar": 1,
//             },
//         },

//     ])
//     const options={
//         page,
//         limit,
//         sort:{createdAt:1}
//     }
//     const result = await Comment.aggregatePaginate(aggregate, options);

//     return res.status(200).json(new apiResponse(200,result.docs,"all comment fetched succesfully of the video"))
// })
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(401, "Invalid videoId");
    }
    
    const aggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                parentComment: null
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
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "parentComment",
                as: "replies"
            }
        },
        {
            $addFields: {
                replyCount: { $size: "$replies" }
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                replyCount: 1,
                username: "$ownerDetails.username",
                avatar: "$ownerDetails.avatar",
                ownerId:"$ownerDetails._id",
                videoId:"$video",
                isOwner: {
          $eq: ["$ownerDetails._id", new mongoose.Types.ObjectId(req.user._id)]
        }
            }
        }
    ]);

    const options = {
        page,
        limit,
        sort: { createdAt: -1 }
    };

    const result = await Comment.aggregatePaginate(aggregate, options);
    
    return res.status(200).json(
        new apiResponse(200, result, "Comments fetched successfully")
    );
});

// const addComment = asyncHandler(async (req, res) => {
//     const { content } = req.body;
//     const { videoId } = req.params;

//     if (!content || !videoId) {
//         return res
//             .status(400)
//             .json(new apiResponse(400, null, "Content and videoId are required"));
//     }

//     const comment = await Comment.create({
//         content,
//         video: videoId,
//         owner: req.user._id,
//     });

//     const populatedComment = await Comment.findById(comment._id)
//         .populate("owner", "username avatar fullName");

    
//     const responseComment = {
//         _id: populatedComment._id,
//         content: populatedComment.content,
//         video: populatedComment.video,
//         ownerId: populatedComment.owner._id,
//         username: populatedComment.owner.username,
//         avatar: populatedComment.owner.avatar,
//         createdAt: populatedComment.createdAt,
//     };

//     return res
//         .status(200)
//         .json(new apiResponse(200, responseComment, "Comment added successfully"));
// });
const addComment = asyncHandler(async (req, res) => {
    const { content, parentCommentId } = req.body;
    const { videoId } = req.params;

    if (!content || !videoId) {
        return res.status(400).json(
            new apiResponse(400, null, "Content and videoId are required")
        );
    }

    if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
        return res.status(400).json(
            new apiResponse(400, null, "Invalid parentCommentId")
        );
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
        parentComment: parentCommentId || null
    });

    const populated = await Comment.findById(comment._id)
        .populate("owner", "username avatar fullName");

    const responseComment = {
        _id: populated._id,
        content: populated.content,
        video: populated.video,
        parentComment: populated.parentComment,
        ownerId: populated.owner._id,
        username: populated.owner.username,
        avatar: populated.owner.avatar,
        createdAt: populated.createdAt,
    };

    return res.status(200).json(
        new apiResponse(200, responseComment, "Comment added successfully")
    );
});

const updateComment = asyncHandler(async (req,res)=>{
    const { content } = req.body;
    const {commentId}= req.params;

     if (!content || !commentId) {
        return res
            .status(400)
            .json(new apiResponse(400, null, "Content and commentId are required"));
    }
    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res
            .status(400)
            .json(new apiResponse(400, null, "Invalid comment ID"));
    }
    const populatedComment = await Comment.findByIdAndUpdate(commentId,{content},{new:true}).populate("owner", "username avatar fullName");

   if (!populatedComment) {
        return res
            .status(404)
            .json(new apiResponse(404, null, "Comment not found"));
    }
   

    
    const responseComment = {
        _id: populatedComment._id,
        content: populatedComment.content,
        video: populatedComment.video,
        ownerId: populatedComment.owner._id,
        username: populatedComment.owner.username,
        avatar: populatedComment.owner.avatar,
        createdAt: populatedComment.createdAt,
    };

    return res.status(200).json(new apiResponse(200,responseComment,"comment updated sucessfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

   
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found");
    }

    
    
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to delete this comment");
    }


    await Comment.findByIdAndDelete(commentId);


    
    return res
        .status(200)
        .json(new apiResponse(200, {}, "Comment deleted successfully"));
});

// const getCommentReplies = asyncHandler(async (req, res) => {
//     const { commentId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(commentId)) {
//         throw new apiError(400, "Invalid comment ID");
//     }

//     const replies = await Comment.find({ parentComment: commentId })
//         .populate("owner", "username avatar")
//         .sort({ createdAt: 1 });

//     return res.status(200).json(
//         new apiResponse(200, replies, "Replies fetched successfully")
//     );
// });
const getCommentReplies = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    const aggregate = Comment.aggregate([
        {
            $match: {
                parentComment: new mongoose.Types.ObjectId(commentId)
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

        // Optional: count nested replies of replies (2nd level)
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "parentComment",
                as: "childReplies"
            }
        },
        {
            $addFields: {
                replyCount: { $size: "$childReplies" }
            }
        },

        {
            $project: {
                content: 1,
                createdAt: 1,
                parentComment: 1,
                replyCount: 1,
                username: "$ownerDetails.username",
                avatar: "$ownerDetails.avatar",
                ownerId: "$ownerDetails._id",
                videoId: "$video",
                // Important: send isOwner flag
                isOwner: {
                    $eq: [
                        "$ownerDetails._id",
                        new mongoose.Types.ObjectId(req.user._id)
                    ]
                }
            }
        }
    ]);

    const options = {
        page,
        limit,
        sort: { createdAt: 1 }
    };

    const result = await Comment.aggregatePaginate(aggregate, options);

    return res.status(200).json(
        new apiResponse(200, result, "Replies fetched successfully")
    );
});


export {getVideoComments,addComment,updateComment,deleteComment,getCommentReplies}