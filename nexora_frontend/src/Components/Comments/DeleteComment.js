import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCommentApi } from "../../API/videoCommentApi";

export default function useDeleteComment() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (commentId) => DeleteCommentApi(commentId),

    onSuccess: async (_, commentId) => {
      // Refresh both comment lists and reply lists
      await qc.invalidateQueries(["comments"]);
      await qc.invalidateQueries(["replies", commentId]);
    }
  });

  return mutation.mutate;  // return only the callable delete function
}
