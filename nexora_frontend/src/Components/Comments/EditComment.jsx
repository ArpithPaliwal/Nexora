import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditCommentApi } from "../../API/videoCommentApi";
import { useState } from "react";

export default function EditInput({ commentId, oldContent, onClose }) {
  const [content, setContent] = useState(oldContent);

  const qc = useQueryClient();

  const EditMutation = useMutation({
    mutationFn: () => EditCommentApi(commentId, content),
    onSuccess: async () => {
      onClose(), await qc.invalidateQueries(["replies", commentId]);

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
        onClick={EditMutation.mutate}
        className="mt-1 text-blue-600 text-sm"
      >
        Reply
      </button>
    </div>
  );
}
