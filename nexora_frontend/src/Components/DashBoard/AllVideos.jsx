import React, { useEffect } from "react";
import AddToPlaylistModal from "./AddToPlaylistModal";
import { useNavigate } from "react-router-dom";
import VideoCard from "../Video/VideoCard";
import { dleteVideo } from "../../API/videoApi";
import { useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

function AllVideos({
  section,
  query,
  isOwner,
  userId,
  showModal,
  setShowModal,
  selectedVideoId,
  setSelectedVideoId
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = query;

  // Intersection Observer
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {showModal && (
        <AddToPlaylistModal
          userId={userId}
          videoId={selectedVideoId}
          onClose={() => setShowModal(false)}
        />
      )}

      {isOwner && (
        <div className="flex justify-end">
          <button
            className="bg-[#0175FE] mx-5 text-white rounded-2xl p-2 cursor-pointer"
            onClick={() => navigate(`/UploadVideo/${userId}`)}
          >
            Create Video
          </button>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {data?.pages
          ?.flatMap((page) => page?.docs)
          .map((video) => (
            <div key={video._id} className="bg-accent rounded-2xl">
              <VideoCard video={video} />

              {isOwner && (
                <div className="text-sm p-3 flex justify-around">
                  <button
                    className="bg-[#0175FE] text-white rounded-2xl p-2 px-4 cursor-pointer"
                    onClick={() =>
                      navigate(`/EditVideo/${userId}/${video._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white rounded-2xl p-2 px-4 cursor-pointer"
                    onClick={async () => {
                      await dleteVideo(video?._id);
                      await queryClient.invalidateQueries({
                        queryKey: ["All Videos", userId],
                      });
                    }}
                  >
                    Delete
                  </button>

                  <button
                    className="bg-green-700 text-white rounded-2xl p-2 cursor-pointer"
                    onClick={() => {
                      setSelectedVideoId(video._id);
                      setShowModal(true);
                    }}
                  >
                    Add to Playlist
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div
          ref={ref}
          className="w-full h-10 flex justify-center items-center mt-4"
        >
          {isFetchingNextPage ? "Loading..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}

export default AllVideos;
