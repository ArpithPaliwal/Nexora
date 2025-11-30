import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useGetAllTweets } from "../../Features/Tweets/useTweetQuery";
import TweetCard from "../../Components/Tweets/TweetCard";

import { SearchHeaderDiv, SideBar } from "../../Components/index";
function Tweets() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllTweets();
  const { ref, inView } = useInView();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="text-2xl bg-background border-0  border-blue-50 p-3 rounded-lg min-h-screen ">
      <SearchHeaderDiv isOpen={() => setIsOpen((prev) => !prev)} />
      {/*side bar  */}
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {isLoading && "Loading........."}
      <div className="flex justify-center flex-col gap-5   mt-6 ">
        {data?.pages
          ?.flatMap((page) => page?.data?.docs) // flatten all pages into one array of videos
          .map((tweet) => (
            <TweetCard key={tweet._id} tweet={tweet} />
          ))}
      </div>
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

export default Tweets;
