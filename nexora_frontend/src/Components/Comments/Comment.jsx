import { useState } from "react";
import ReplyList from "../Comments/CommentReply";
import { TimeAgo } from "../../Hooks/TimeAgo";
import ReplyInput from "./ReplyInput";
import EditInput from "./EditComment";
import useDeleteComment from "./DeleteComment";

export default function CommentItem({ comment }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(false);
  
  const deleteComment = useDeleteComment();

  return (
    <div className="border-b py-3 text-base">
      {/* Comment Header */}
      <div className="flex gap-2 items-start">
        <img src={comment?.avatar} className="w-8 h-8 rounded-full" />

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment?.username}</span>
            <p className="text-gray-700 text-sm">
              {TimeAgo(comment?.createdAt)}
            </p>
          </div>

          {!showEditBox ? (
            <p>{comment?.content}</p>
          ) : (
            <EditInput
              commentId={comment._id}
              oldContent={comment.content}
              onClose={() => {
                setShowEditBox(false);
              }}
            />
          )}

          {/* Actions */}
          <div className="flex gap-3 text-sm mt-1 text-gray-600">
            <button onClick={() => setShowReplyBox(!showReplyBox)}>
              Reply
            </button>
            {comment?.replyCount > 0 && (
              <button onClick={() => setShowReplies((prev) => !prev)}>
                {showReplies
                  ? "Hide Replies"
                  : `View Replies (${comment?.replyCount})`}
              </button>
            )}
            {comment?.isOwner && (
              <>
                <button onClick={() => setShowEditBox(true)}>Edit</button>
                <button onClick={() => deleteComment(comment?._id)}>
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Reply Input */}
          {showReplyBox && (
            <ReplyInput
              parentCommentId={comment._id}
              videoId={comment.videoId}
            />
          )}

          {/* Nested Replies */}
          {showReplies && <ReplyList parentCommentId={comment?._id} />}
        </div>
      </div>
    </div>
  );
}
