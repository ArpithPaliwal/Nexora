import React, { lazy, Suspense } from "react";
import { LoadingVideoCardList } from "../../Components";

// Lazy load all heavy dashboard sections
const AllVideos = lazy(() => import("../../Components/DashBoard/AllVideos"));
const LikedVideos = lazy(() => import("../../Components/DashBoard/LikedVideos"));
const WatchHistory = lazy(() => import("../../Components/DashBoard/WatchHistory"));
const Playlists = lazy(() => import("../../Components/DashBoard/Playlists"));
const Tweets = lazy(() => import("../../Components/DashBoard/Tweets"));

// Reusable fallback loader
const Loader = (
  <div className="p-10 text-center">
    <LoadingVideoCardList />
  </div>
);

export function renderSection(
  section,
  query,
  isOwner,
  userId,
  showModal,
  setShowModal,
  selectedVideoId,
  setSelectedVideoId
) {
  const { data, isLoading, error } = query;
  if (!data) {
  return <div>No content found</div>;
}



  if (isLoading) return Loader;
  if (error) return <div>Error loading section</div>;

  const wrap = (node) => <Suspense fallback={Loader}>{node}</Suspense>;

  // -----------------------------
  // HANDLE PLAYLIST SECTION
  // -----------------------------
  if (section === "Playlists") {
        // SAFE

    return wrap(
      <Playlists query={query} isOwner={isOwner} userId={userId} />
    );
  }

  // -----------------------------


  switch (section) {
    case "All Videos":
      return wrap(
        <AllVideos
          query={query}
          isOwner={isOwner}
          userId={userId}
          showModal={showModal}
          setShowModal={setShowModal}
          selectedVideoId={selectedVideoId}
          setSelectedVideoId={setSelectedVideoId}
        />
      );

    case "Liked Videos":
      return wrap(<LikedVideos query={query} />);

    case "Watch History":
      return wrap(<WatchHistory query={query} />);

    case "Tweets":
      return wrap(<Tweets query={query} isOwner={isOwner} userId={userId} />);

    default:
      return <div>No content found</div>;
  }
}

