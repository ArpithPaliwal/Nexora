import { useInfiniteQuery } from "@tanstack/react-query";

import { getCommentReplyApi } from "../../API/videoCommentApi";

export const useCommentReplies = (parentCommentId) =>
  useInfiniteQuery({
    queryKey: ["comment_replies", parentCommentId],
    queryFn:()=> getCommentReplyApi(parentCommentId),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });
