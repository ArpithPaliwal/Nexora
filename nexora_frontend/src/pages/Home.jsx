import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQuery } from "../redux/features/queryState/querySlice";

import { useInView } from "react-intersection-observer";
import { getVideos } from "../Features/Video/getVideos";

import {
  SearchHeaderDiv,
  SideBar,
  VideoCard,
  LoadingVideoCardList,
} from "../Components";
import SortBar from "../Components/SortBar";

function Home() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.query.query);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { ref, inView } = useInView();

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = getVideos(query, sortBy, sortType);

  const menuItems = useMemo(
    () => ["All", "Coding", "Gaming", "Cooking", "Boxing", "Swimming"],
    []
  );

  // Trigger infinite scroll
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Extract all videos safely
  const allVideos =
    data?.pages?.flatMap((page) => page?.data?.docs || []) || [];

  const isEmpty = !isLoading && allVideos.length === 0;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sortBy, sortType]);
// bg-[#eaebeb]
  return (
    <div className="text-2xl  bg-background p-3 rounded-lg min-h-[100vh]relative">
      {/* Header */}
      <SearchHeaderDiv isOpen={() => setIsOpen((prev) => !prev)} />

      {/* Sidebar */}
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Category Menu */}
      <div className="flex lg:justify-between flex-col lg:flex-row justify-end ">
        <ul className="flex my-5 gap-5 text-xl overflow-x-auto scrollbar-hide ">
          {menuItems.map((item, index) => (
            <li
              key={item}
              onClick={() => {
                setActiveIndex(index);
                dispatch(setQuery(item === "All" ? "" : item));
              }}
              className={`
              cursor-pointer p-1 px-6 rounded-2xl transition whitespace-nowrap 
              ${
                activeIndex === index
                  ? "bg-blue-500 text-white"
                  : "bg-accent text-gray-500"
              }
            `}
            >
              {item}
            </li>
          ))}
        </ul>
        <SortBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortType={sortType}
          setSortType={setSortType}
        />
      </div>
      {/* Loading */}
      {isLoading && <LoadingVideoCardList />}

      {/* Error */}
      {isError && (
        <div className="text-center text-red-600 mt-10 text-lg">
          {error?.message || "Failed to load videos. Please try again."}
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="text-center text-gray-700 mt-12 text-lg font-semibold">
          No videos found.
        </div>
      )}

      {/* Videos */}
      {!isLoading && !isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {allVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

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

export default Home;
