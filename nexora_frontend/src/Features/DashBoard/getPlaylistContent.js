import { useQuery } from "@tanstack/react-query";
import { getPlaylistContent } from "../../API/PlaylistApi";

export const usePlaylistContent = (playlistId) => {
  return useQuery({
    queryKey: ["PlaylistContent", playlistId],
    queryFn: () => getPlaylistContent(playlistId),
    enabled: !!playlistId, 
    staleTime: 1000 * 60 * 5, 
  });
};
