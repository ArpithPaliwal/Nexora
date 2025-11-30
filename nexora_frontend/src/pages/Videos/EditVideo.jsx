import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const VideoForm = lazy(() =>
  import("../../Components/DashBoard/VideoForm")
);

const EditVideo = () => {
  const { userId, videoId } = useParams();
  const queryClient = useQueryClient();

  const allVideos = queryClient.getQueryData(["All Videos", userId]);
 

  const video = allVideos?.pages
    ?.flatMap((page) => page.docs)
    ?.find((v) => v._id === videoId);


  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-600 text-lg">
          Loading form…
        </div>
      }
    >
      <VideoForm
        mode="edit"
        title={video?.title}
        description={video?.description}
        videoId={videoId}
        userId={userId}
      />
    </Suspense>
  );
};

export default EditVideo;
