
import React from "react";


function AvatarAndCoverImage({ avatar , coverImage ,username}) {
  

  return (
    <div className="relative w-full h-fit mb-30 md:mb-0">
      <div className="w-full h-50 rounded-2xl overflow-hidden border-2 border-[#0175FE]">
        <img
          src={coverImage || "/nexora.png"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute 
    left-1/2 -translate-x-1/2     
    md:left-12 md:translate-x-0  
    -bottom-25
    md:-bottom-15 
    flex flex-col items-center md:items-start">
        <img
          src={avatar || "/nexora.png"}
          alt="Avatar"
          className="w-30 h-30 rounded-full border-4 border-white object-cover shadow-lg"
        />
        <h1 className="md:mx-7 text-text mb-2 md:mb-0">{username}</h1>
      </div>
    </div>
  );
}

export default AvatarAndCoverImage;
