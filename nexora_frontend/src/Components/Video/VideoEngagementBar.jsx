import { useNavigate } from "react-router-dom";
import { ThumbsUp } from "../icons/icons";


export default function VideoEngagementBar({
  video,
  videoData,
  onSubscribe,
  onLike,
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-accent p-3 flex flex-col md:flex-row items-center rounded-2xl gap-4 sm:gap-6 md:gap-8 justify-between">

      {/* Avatar + Username + Subscriber Count */}
      <div className="flex items-center gap-3" onClick={()=>navigate(`/DashBoard/${video.ownerId}`)}>
        {video && (
          <img
            src={video.avatar}
            alt="avatar"
            className="rounded-full w-10 h-10 md:w-14 md:h-14 border-2 border-[#0175FE]"
          />
        )}

        <div>
          {video && (
            <p className="text-sm md:text-xl text-text1 font-semibold">
              {video.username}
            </p>
          )}

          {videoData && (
            <p className="text-xs md:text-sm text-gray-600">
              {videoData.subscriberCount} Subscribers
            </p>
          )}
        </div>
      </div>

      {/* Subscribe + Like*/}
      <div className="flex gap-10">
        <button
          className={`px-3 md:px-5 py-1 md:py-2 rounded-2xl text-sm md:text-lg font-medium border-2 transition ${
            videoData?.subscribeStatus
              ? "border-[#0175FE] bg-[#0175FE] text-white"
              : "border-[#0175FE] bg-accent text-text"
          }`}
          onClick={onSubscribe}
        >
          {videoData?.subscribeStatus ? "Subscribed" : "Subscribe"}
        </button>

        {/* Like Section */}
        <div className="flex border-2 border-[#0175FE] px-2 py-1 rounded-2xl gap-2 items-center text-text ">
          <button className="transition" onClick={onLike}>
            {videoData?.likeStatus ? (
              <ThumbsUp
                color="[#0175FE]"
                className="fill-[#0175FE] transition"
                size={28}
              />
            ) : (
              <ThumbsUp
                color="#0175FE"
                className="transition"
                size={25.5}
              />
            )}
          </button>

          |

          <div className="text-sm md:text-lg text-text font-semibold">
            {videoData?.likeCount} Likes
          </div>
        </div>
      </div>
    </div>
  );
}
