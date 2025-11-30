import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const PlaylistForm = lazy(() =>
  import("../../Components/DashBoard/PlaylistForm")
);

const EditPlaylist = () => {
  const { userId, playlistId } = useParams();
  const queryClient = useQueryClient();

  const cached = queryClient.getQueryData(["Playlist", userId]);
  const playlists = cached?.data || [];

  const playlist = playlists?.find((p) => p?._id === playlistId);

  if (!playlist) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        Loading ...
      </div>
    );
  }

  return (
    <div  className="w-full h-full flex justify-center items-center">
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-600 text-lg ">
          Loading form…
        </div>
      }
    >
      <PlaylistForm
        mode="edit"
        playlistId={playlist._id}
        userId={userId}
        name={playlist.name}
        description={playlist.description}
      />
    </Suspense>
    </div>
  );
};

export default EditPlaylist;
