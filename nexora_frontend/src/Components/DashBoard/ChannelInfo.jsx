import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toggleSubscribeApi } from "../../API/videoDataApi";

function ChannelInfo({ data, userId }) {
  const queryClient = useQueryClient();

  const handleSubscribe = async () => {
    await toggleSubscribeApi(userId);
    await queryClient.invalidateQueries(["userAvatarAndCoverImage", userId]);
    await queryClient.invalidateQueries(["userChannelData", userId]);
  };

  return (
    <div
      className="
      md:mx-3
      w-full
        md:w-1/3
        
        bg-accent
        rounded-2xl 
        px-6
        py-3
        border border-gray-200
        shadow-lg
        font-xs
      "
    >
      
      <div className="flex flex-col gap leading-tight ">

        {/* Username */}
        <div className="flex justify-between gap-10">
          <span className="text-gray-500 ">Username:</span>
          <span className="text-text1 ">{data?.username}</span>
        </div>

        {/* Full Name */}
        <div className="flex justify-between gap-10">
          <span className="text-gray-500 ">Fullname:</span>
          <span className="text-text1 ">{data?.fullName}</span>
        </div>

        {/* Subscribers */}
        <div className="flex justify-between">
          <span className="text-gray-500 ">Subscribers:</span>
          <span className="text-text1 ">
            {data?.subscribersCount}
          </span>
        </div>

        {/* Subscribed To */}
        <div className="flex justify-between ">
          <span className="text-gray-500 ">Subscribed To:</span>
          <span className="text-text1 ">
            {data?.channelsSubscribedToCount}
          </span>
        </div>

      </div>

      {/* Subscribe Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubscribe}
          className={`
            px-6 py-2
            rounded-xl 
            font-semibold 
            text-base
            transition-all duration-300
            shadow-md border 
            ${
              data?.isSubscribed
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "bg-accent text-text border-blue-600 hover:bg-blue-50"
            }
          `}
        >
          {data?.isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
    </div>
  );
}

export default ChannelInfo;
