import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjsduration from "dayjs/plugin/duration";
function VideoCard({ video }) {
  dayjs.extend(relativeTime);
  dayjs.extend(dayjsduration);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const {
    title,
    username,
    views,
    createdAt,
    duration,
    description,
    publicId,
    thumbnail,
    avatar,
    _id,
    ownerId
  } = video;

  
  // Cloudinary Preview Clip (3 sec)
  const previewUrl = `https://res.cloudinary.com/${
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }/video/upload/e_preview:duration_5/${publicId}.mp4`;

  // Full Thumbnail
  const thumbnailUrl = thumbnail
    ? thumbnail
    : `https://res.cloudinary.com/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/video/upload/${publicId}.jpg`;

  return (
    <div
      onClick={() => navigate(`/watch/${_id}`)}
      className=" m-w-fit rounded-3xl bg-accent shadow-md p-3 cursor-pointer hover:shadow-xl transition-all duration-200"
    >
      {/* Video Container */}
      <div
        className="relative w-full h-[150px] rounded-2xl overflow-hidden bg-black "
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Thumbnail */}
        {!hover && (
          <>
            <img
              src={thumbnailUrl}
              className="w-full h-full object-cover "
              alt="thumbnail"
            />
          </>
        )}

        {/* Preview Video */}
        {hover && (
          <video
            src={previewUrl}
            muted
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover"
          ></video>
        )}

        {/* Duration Tag */}
        <span className="absolute bottom-2  right-2 px-2 py-2px text-xs font-semibold bg-black/70 text-white rounded-md">
          {dayjs.duration(duration, "seconds").format("m:ss")}
        </span>
      </div>

      {/* Text Section */}
      <div className="relative mt-8">
        <img
          src={avatar}
          alt="avatar"
          className="z-1  absolute -top-12 left-2 rounded-2xl w-10 h-10 "
        />
        <h3 className="font-semibold text-[15px] leading-tight line-clamp-2 text-text">
          {title}
        </h3>

        <p className="text-sm text-text1 mt-1">{username}</p>

        <p className="text-sm text-gray-500">
          {Intl.NumberFormat("en", { notation: "compact" }).format(views)}
          &nbsp;views • {dayjs(createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
}

export default VideoCard;
