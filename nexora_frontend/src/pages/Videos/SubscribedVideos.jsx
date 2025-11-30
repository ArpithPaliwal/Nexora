import React, { useEffect, useState } from "react";
import {
  SearchHeaderDiv,
  SideBar,
  VideoCard,
  LoadingVideoCardList,
} from "../../Components/index";

import { useInView } from "react-intersection-observer";
import { getSubscribedVideos } from "../../Features/Video/getVideos";

function SubscribedVideos() {
  const { ref, inView } = useInView();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = getSubscribedVideos();

  // Trigger infinite loading
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Extract all videos from paginated response
  const allVideos =
    data?.pages?.flatMap((page) => page?.data?.docs || []) || [];

  const isEmpty = !isLoading && allVideos.length === 0;

  return (
    <div className="text-2xl bg-background border-0 p-3 rounded-lg min-h-screen relative">
      <SearchHeaderDiv isOpen={() => setIsOpen((prev) => !prev)} />
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* 1. Loading */}
      {isLoading && <LoadingVideoCardList />}

      {/* 2. Error */}
      {isError && (
        <div className="text-center text-red-600 mt-10 text-lg">
          {error?.message || "Something went wrong while fetching videos."}
        </div>
      )}

      {/* 3. Empty State */}
      {isEmpty && (
        <div className="text-center text-gray-700 mt-12 text-lg font-semibold">
          You haven't subscribed to any channels yet.
        </div>
      )}

      {/* 4. Video Grid */}
      {!isLoading && !isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {allVideos.map((video) => (
            <VideoCard key={video?._id} video={video} />
          ))}
        </div>
      )}

      {/* 5. Infinite Scroll Load Indicator */}
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

export default SubscribedVideos;
