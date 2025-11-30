import React, { useEffect, useState, lazy, Suspense } from "react";
import { SearchHeaderDiv, SideBar } from "../../Components/index";
import { useParams } from "react-router-dom";
import { getVideoById } from "../../Features/Video/getVideos";

import {
  getVideoData,
  useToggleLike,
  useToggleSubscribe,
} from "../../Features/LikeAndSubscribe/getAndChangeVideoData";
import { useCachedVideo } from "../../Features/useCachedVideos";
import { useVideoComments } from "../../Features/Comments/useVideoComments";
import { useInView } from "react-intersection-observer";

// Lazily loaded heavy components
const VideoPlayer = lazy(() => import("../../Components/index").then(m => ({ default: m.VideoPlayer })));
//React.lazy only works with default exports, so you must wrap it inside a .then() that re-exports it as default.
const VideoEngagementBar = lazy(() => import("../../Components/Video/VideoEngagementBar"));
const ReplyInput = lazy(() => import("../../Components/Comments/ReplyInput"));
const CommentItem = lazy(() => import("../../Components/Comments/Comment"));

// Loader Component
function Loader() {
  return (
    <div className="w-full h-40 bg-gray-300 animate-pulse rounded-xl flex items-center justify-center">
      Loading…
    </div>
  );
}

function WatchVideo() {
  const { _id } = useParams();

  //SideBar
  const [sidebarisOpen, setsidebarIsOpen] = useState(false);

  // Check cached video
  const videoCache = useCachedVideo(_id);
  const shouldFetch = !videoCache;

  // Fetch video only if not cached
  const { data, isLoading } = getVideoById(_id, shouldFetch);
  const video = videoCache ?? data;

  const { data: videoData } = getVideoData(_id);
  const { mutate: toggleSub } = useToggleSubscribe(video?.ownerId, _id);
  const { mutate: toggleLike } = useToggleLike(_id);

  // COMMENTS
  const { ref, inView } = useInView();
  const {
    data: CommentData,
    isLoading: commentLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVideoComments(_id);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const totalLoadedComments =
    CommentData?.pages?.reduce((total, page) => total + page.docs.length, 0) ||
    0;

  return (
    <div className="text-2xl bg-background border-0 p-3 rounded-lg min-h-screen relative">
      {/* Header */}
      <SearchHeaderDiv isOpen={() => setsidebarIsOpen((prev) => !prev)} />

      {/* Sidebar */}
      <SideBar isOpen={sidebarisOpen} onClose={() => setsidebarIsOpen(false)} />

      <div className="flex flex-col lg:flex-row gap-3 py-5 md:px-8 justify-between">
        
        {/* LEFT SECTION */}
        <div className="flex flex-col rounded-2xl gap-3 w-full lg:w-[55vw]">

          {/* VIDEO PLAYER */}
          <div className="rounded-2xl overflow-hidden aspect-video relative">
            <Suspense fallback={<Loader />}>
              {video ? (
                <VideoPlayer videoId={video.publicId} />
              ) : (
                <div className="absolute inset-0 bg-background-300 animate-pulse"></div>
              )}
            </Suspense>
          </div>

          {/* ENGAGEMENT BAR */}
          <Suspense fallback={<Loader />}>
            <VideoEngagementBar
              video={video}
              videoData={videoData}
              onSubscribe={() => toggleSub()}
              onLike={() => toggleLike()}
            />
          </Suspense>
        </div>

        {/* RIGHT SECTION: DETAILS */}
        <div className="lg:min-w-100 max-w-100 rounded-2xl bg-accent  p-5 shadow-sm ">
          <h1 className="text-xl md:text-2xl font-semibold text-text leading-snug">
            {video?.title}
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            {video?.views} views • {new Date(video?.createdAt).toDateString()}
          </p>
          <div className="my-4 border-b border-gray-300"></div>
          <p className="text-sm md:text-base text-text1 whitespace-pre-line leading-relaxed">
            {video?.description}
          </p>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="md:mx-8 px-5 bg-background rounded-2xl py-5 text-text">
        Comments ({totalLoadedComments})

        <Suspense fallback={<Loader />}>
          <ReplyInput videoId={_id} />
        </Suspense>

        <Suspense fallback={<Loader />}>
          {CommentData?.pages
            ?.flatMap((page) => page.docs)
            .map((comment) => (
              <CommentItem key={comment?._id} comment={comment} videoId={_id} />
            ))}
        </Suspense>
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

export default WatchVideo;
