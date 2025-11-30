import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

const PlaylistForm = lazy(() =>
  import("../../Components/DashBoard/PlaylistForm")
);

function CreatePlaylist() {
  const { userId } = useParams();

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Suspense
        fallback={
          <div className="p-10 text-center text-gray-600 text-xl">
            Loading form…
          </div>
        }
      >
        <PlaylistForm userId={userId} mode="create" />
      </Suspense>
    </div>
  );
}

export default CreatePlaylist;
