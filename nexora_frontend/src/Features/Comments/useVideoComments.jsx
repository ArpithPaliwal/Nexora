import { useInfiniteQuery } from "@tanstack/react-query";
import { videoCommentsApi } from "../../API/videoCommentApi";

export const useVideoComments = (videoId) =>
  useInfiniteQuery({
    queryKey: ["comments", videoId],

    queryFn: ({ pageParam}) =>
      videoCommentsApi(videoId, pageParam),

    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });