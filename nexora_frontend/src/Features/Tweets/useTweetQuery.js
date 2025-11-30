import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllTweets } from "../../API/TweetApi";

export const useGetAllTweets = () => {
  return useInfiniteQuery({
    queryKey: ["tweets"],
    queryFn: getAllTweets,
    getNextPageParam: (lastPage, allPages) => {
     
      return lastPage.data.length === 10 ? allPages.data.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 4
  });
};
