import { useQuery } from "@tanstack/react-query";
import { getUserPlaylist } from "../../API/PlaylistApi";

export const useGetUserPlaylists = (userId, enabled ) => {
  return useQuery({
    queryKey: ["Playlist", userId],
    queryFn: () => getUserPlaylist(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};
