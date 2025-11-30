import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReplyCommentApi } from "../../API/videoCommentApi";
import { useState } from "react";


export default function ReplyInput({ parentCommentId, videoId }) {
  const [content, setContent] = useState("");
  const qc = useQueryClient();

  const addReplyMutation = useMutation({
    mutationFn:()=>addReplyCommentApi(videoId,content,parentCommentId),
    onSuccess:async () => {
      await qc.invalidateQueries(["replies", parentCommentId]);
      setContent("");
    },
  });

  return (
    <div className="mt-2">
      <input
        className="border px-3 py-2 w-full rounded-2xl text-sm p-3"
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={addReplyMutation.mutate}
        className="mt-1 text-blue-600 text-sm"
      >
        Reply
      </button>
    </div>
  );
}
