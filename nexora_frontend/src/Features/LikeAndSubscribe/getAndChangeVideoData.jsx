import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getLikeCount,
  getLikeStatus,
  getVideoDetailsApi,toggleSubscribeApi,toggleLikeApi
} from "../../API/videoDataApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const getVideoData = (videoId) => {
  return useQuery({
    queryKey: ["videoDetails", videoId],
    queryFn: () => getVideoDetailsApi(videoId),
    refetchInterval: 5 * 1000 * 60,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true, // If user returns to the tab → refresh data
    refetchOnReconnect: true,
  });
};



export const useToggleSubscribe = (channelId,videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleSubscribeApi(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries(["videoDetails", videoId]);
      
    }
  });
};

export const useToggleLike = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLikeApi(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries(["videoDetails", videoId]);
      
    }
  });
};

export { getVideoData };
