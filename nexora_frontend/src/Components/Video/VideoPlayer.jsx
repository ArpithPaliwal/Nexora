import React, { useEffect, useRef } from "react";

function VideoPlayer({ videoId }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  
  useEffect(() => {
    // Load Cloudinary CSS if not already loaded
    if (!document.getElementById("cld-video-player-css")) {
      const link = document.createElement("link");
      link.id = "cld-video-player-css";
      link.rel = "stylesheet";
      link.href =
        "https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.css";
      document.head.appendChild(link);
    }

    // Load Cloudinary JS if not already loaded
    if (!document.getElementById("cld-video-player-script")) {
      const script = document.createElement("script");
      script.id = "cld-video-player-script";
      script.src =
        "https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Poll until Cloudinary is available
    const interval = setInterval(() => {
      if (window.cloudinary && videoRef.current && !playerRef.current) {
        playerRef.current = window.cloudinary.videoPlayer(videoRef.current, {
          cloud_name: "dhpol6fzb", // replace with your cloud name
        });

        playerRef.current.source(videoId, {
          sourceTypes: ["hls"], // can add "dash" later if needed
        });

        clearInterval(interval);
      } else if (playerRef.current && videoId) {
        // If videoId changes, update source dynamically
        playerRef.current.source(videoId, { sourceTypes: ["hls"] });
      }
    }, 300);

    return () => {
      clearInterval(interval);
      
    };
  }, [videoId]); // re-run effect if videoId changes

  return (
    
      <video
        ref={videoRef}
        className="cld-video-player  object-cover rounded-2xl p-0"
        controls
        
        autoPlay
        playsInline
        style={{ width: "100%", height: "100%"  }}
      ></video>
    
  );
}

export default VideoPlayer;
