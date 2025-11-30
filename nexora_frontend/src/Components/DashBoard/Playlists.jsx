import React from "react";
import { useNavigate } from "react-router-dom";
import PlaylistCard from "./PlaylistCard";
import { deletePlaylist } from "../../API/PlaylistApi";
import { useQueryClient } from "@tanstack/react-query";

function Playlists({ query, isOwner, userId }) {
  const navigate = useNavigate();
  

  // Backend gives: { success, message, data: [...] }
  const {data,isLoading,error} = query
  const playlists= data?.data
  
  
  const queryClient = useQueryClient();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading playlists</div>;

  return (
    <div>
      {isOwner && (
        <div className="flex justify-end">
          <button
            className="bg-[#0175FE] mx-5 text-white rounded-2xl p-2 cursor-pointer"
            onClick={() => navigate(`/CreatePlaylist/${userId}`)}
          >
            Create Playlist
          </button>
        </div>
      )}

      {!playlists?.length ? (
        <div className="text-center text-gray-600 mt-6">
          No playlists found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-6 w-162">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="bg-accent rounded-2xl">
              <div
                onClick={() =>
                  navigate(`/PlaylistContent/${playlist?._id}/${userId}`)
                }
              >
                <PlaylistCard playlist={playlist} />
              </div>

              {isOwner && (
                <div className="text-sm p-3 flex justify-around">
                  <button
                    className="bg-[#0175FE] text-white rounded-2xl p-2 px-8 cursor-pointer"
                    onClick={() =>
                      navigate(`/EditPlaylist/${userId}/${playlist?._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white rounded-2xl p-2 px-6 cursor-pointer"
                    onClick={async () => {
                      await deletePlaylist(playlist._id);
                      await queryClient.invalidateQueries({
                        queryKey: ["Playlist", userId],
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Playlists;
