import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

const TweetForm = lazy(() =>
  import("../../Components/DashBoard/TweetForm")
);

function CreateTweet() {
  const { userId } = useParams();

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Suspense
        fallback={
          <div className="p-10 text-center text-gray-600 text-xl">
            Loading form…
          </div>
        }
      >
        <TweetForm userId={userId}/>
      </Suspense>
    </div>
  );
}

export default CreateTweet;
