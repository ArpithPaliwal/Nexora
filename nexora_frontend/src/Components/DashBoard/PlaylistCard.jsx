import React from "react";
import { useNavigate } from "react-router-dom";

export default function PlaylistCard({ playlist ,description=""}) {
  
  
  
  return (
    <div
      className=" m-w-fit rounded-3xl bg-accent shadow-md p-3 cursor-pointer hover:shadow-xl transition-all duration-200 "
      
    >
      {/* Cover Image */}
      <div className="w-full h-40 rounded-xl overflow-hidden bg-accent">
        <img
          src={playlist?.coverImage}
          alt={playlist?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title + Avatar */}
      <div className="flex items-center gap-3 mt-3">
        

        <h3 className="text-lg font-semibold text-text truncate">
          {playlist?.name}
        </h3>
        
      </div>
      <h3 className="text-text1">{description}</h3>
    </div>
  );
}
