import React, { useEffect } from 'react';
import VideoCard from '../Video/VideoCard';
import { useInView } from 'react-intersection-observer';

function WatchHistory({ query }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = query;

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {data?.pages
          ?.flatMap((page) => page?.docs)
          .map((video) => (
            <VideoCard key={video._id} video={video} />
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

export default WatchHistory;
