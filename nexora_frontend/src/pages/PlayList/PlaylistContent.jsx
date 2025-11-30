import React from "react";

import { usePlaylistContent } from "../../Features/DashBoard/getPlaylistContent";
import { useNavigate, useParams } from "react-router-dom";
import VideoCard from "../../Components/Video/VideoCard";
import PlaylistCard from "../../Components/DashBoard/PlaylistCard";
import { removeVideoFromPlaylist } from "../../API/PlaylistApi";
import { useQueryClient } from "@tanstack/react-query";

export function PlaylistContent() {
  const { playlistId, userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePlaylistContent(playlistId);
  const queryClient = useQueryClient();
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading playlist</p>;

  const playlist = data?.data;




  return (
    <div className="bg-background ">
      <button
        className="text-white px-5 py-1.5 bg-[#0175FE] m-5 rounded-2xl  "
        onClick={() => navigate(`/DashBoard/${userId}`)}
      >
        Back
      </button>

      <div
        className="
          flex 
          flex-col 
          lg:flex-row 
          gap-12
           bg-background p-3 rounded-lg min-h-screen
         justify-around
          
          
          
        "
      >
        <div className=" max-w-100 ">
          <PlaylistCard
            playlist={playlist}
            description={playlist?.description}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 bg-accent p-5 w-200 rounded-2xl">

          { playlist?.videos && playlist?.videos.map((video) => (
            <div key={video?._id}>
              {/* Playlist Video Card */}
              <VideoCard video={video} />
              {(
                <button
                  className="bg-red-500 text-white rounded-2xl p-2 px-4 mx-10 my-5 cursor-pointer"
                  onClick={async () => {
                    await removeVideoFromPlaylist(playlist?._id, video?._id),
                      await queryClient.invalidateQueries({
                        queryKey: ["PlaylistContent", playlist?._id],
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ["All Videos", userId]
                      });
                  }}
                >
                  Remove Video From Playlist
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlaylistContent;
