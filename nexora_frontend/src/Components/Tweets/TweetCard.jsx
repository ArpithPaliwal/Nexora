import React from "react";

function TweetCard({ tweet }) {
    
    
  return (
    <div className="bg-accent shadow-md hover:shadow-lg transition-shadow  w-70 md:w-200  min-h-30 duration-200 rounded-2xl p-4 border border-gray-200 max-w-lg mx-auto">
      
      {/* USER INFO */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={tweet.owner?.avatar}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <h3 className="font-semibold text-text">{tweet.owner?.username}</h3>
          <p className="text-xs text-text1">
            {new Date(tweet.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <p className="text-text1 text-sm leading-relaxed whitespace-pre-wrap">
        {tweet.content}
      </p>

    </div>
  );
}

export default TweetCard;
