import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addVideoToPlaylist } from "../../API/PlaylistApi";
import Toast from "../../Utils/Toast";
import { useGetUserPlaylists } from "../../Features/DashBoard/useGetUserPlaylists";

export default function AddToPlaylistModal({ userId, videoId, onClose }) {
  const [toast, setToast] = React.useState(null);
  const queryClient = useQueryClient();

  // Get playlists from existing query (NO new fetch)
  const cached = queryClient.getQueryData(["Playlist", userId]);
  
  //  backend returns: { success, message, data: [...] }
  const apidata = useGetUserPlaylists(userId)
  const playlists = cached?.data || apidata?.data || []; // safe fallback
  
  
  
  const handleAdd = async (playlistId) => {
    try {
      await addVideoToPlaylist(playlistId, videoId);
      setToast({ type: "success", message: "Video added to playlist!" });

      setTimeout(onClose, 700);

      // Invalidate playlist cache to update after adding
      queryClient.invalidateQueries(["PlaylistContent",playlistId]);
    } catch (e) {
      setToast({ type: "error", message: e.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-accent p-5 rounded-xl w-[350px] shadow-lg">
        <h2 className="text-xl text-text font-bold mb-4">Add to Playlist</h2>

        {/* No loading because we do not fetch here */}

        {playlists.length === 0 && (
          <p className="text-gray-600 text-center">
            No playlist created.
          </p>
        )}

        {playlists.length > 0 &&
          playlists.map((pl) => (
            <button
              key={pl._id}
              onClick={() => handleAdd(pl._id)}
              className="w-full bg-gray-100 text-gray-700 p-2 rounded-lg my-1 hover:bg-gray-200"
            >
              {pl.name}
            </button>
          ))}

        <button
          className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
