import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

const VideoForm = lazy(() =>
  import("../../Components/DashBoard/VideoForm")
);

function UploadVideo() {
  const { userId, videoId } = useParams();

  return (
    <div>
      <Suspense
        fallback={
          <div className="p-10 text-center text-gray-600 text-lg">
            Loading form…
          </div>
        }
      >
        <VideoForm mode="create" userId={userId} videoId={videoId} />
      </Suspense>
    </div>
  );
}

export default UploadVideo;
