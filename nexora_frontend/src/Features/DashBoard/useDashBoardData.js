import { useInfiniteQuery } from "@tanstack/react-query";
import { getLikedVideos, getUserVideos } from "../../API/videoApi";
import { getWatchHistory } from "../../API/userApi";
import { getUserTweets } from "../../API/TweetApi";

export function useDashboardData(section, userId, enabled) {
  const PAGINATED = ["All Videos", "Liked Videos", "Watch History", "Tweets"];
  const isPaginated = PAGINATED.includes(section);

  return useInfiniteQuery({
    queryKey: [section, userId],
    enabled: !enabled && isPaginated && !!userId,
    queryFn: ({ pageParam = 1 }) => {
      switch (section) {
        case "All Videos": return getUserVideos(userId, pageParam);
        case "Liked Videos": return getLikedVideos(pageParam);
        case "Watch History": return getWatchHistory(pageParam);
        case "Tweets": return getUserTweets(userId);
      }
    },
    getNextPageParam: (lastPage) => {
  const pageData = lastPage?.data?.data;
  if (!pageData) return undefined;

  return pageData.hasNextPage ? pageData.nextPage : undefined;
}

  });
}
