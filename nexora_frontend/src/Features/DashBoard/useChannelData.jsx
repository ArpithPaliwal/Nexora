import { useQuery } from "@tanstack/react-query";
import { getUserChannelApi } from "../../API/userApi";

export const useChannelData = (userId) => useQuery({
    queryKey: ["userAvatarAndCoverImage", userId],
    queryFn: () => getUserChannelApi(userId),
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 10,
  });