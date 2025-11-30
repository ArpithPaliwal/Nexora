import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const TweetForm = lazy(() =>
  import("../../Components/DashBoard/TweetForm")
);

const EditTweet = () => {
  const { userId, tweetId } = useParams();
  const queryClient = useQueryClient();

  // Get cached tweet pages (infinite query)
  const cached = queryClient.getQueryData(["Tweets", userId]);

  const tweet =
    cached?.pages
      ?.flatMap((page) => page?.data?.docs || [])
      ?.find((t) => t?._id === tweetId);

  if (!tweet) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        Loading tweet...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-600 text-lg">
          Loading form…
        </div>
      }
    >
      <TweetForm
        userId={userId}
        tweet={tweet._id}
        content={tweet.content}
        mode="edit"
      />
    </Suspense>
  );
};

export default EditTweet;
