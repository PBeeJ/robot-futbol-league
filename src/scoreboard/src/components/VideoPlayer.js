/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState, useRef } from "react";
import { playVideo } from "../websockets";

export default function VideoPlayer({ isFullScreen, video }) {
  const [src, setSrc] = useState(undefined);
  const videoRef = useRef();

  const handleEnded = () => {
    console.log("ended");
    playVideo(null);
  };

  useEffect(() => {
    videoRef.current.addEventListener("ended", handleEnded);
    return () => {
      videoRef.current.removeEventListener("ended", handleEnded);
    };
}, []);

  useEffect(() => {
    if (video !== src) {
       setSrc(video);
    } else {
      videoRef.current.pause();
    }
  }, [video]);

  return (
    <video
      controls
      ref={videoRef}
      src={video}
      autoPlay
      style={{
        display: src ? "block" : "none",
        position: "absolute",
        top: isFullScreen ? 20 : "auto",
        left: isFullScreen ? 20 : "auto",
        bottom: 20,
        right: 20,
        width: isFullScreen ? "100%" : 320,
        height: isFullScreen ? "100%" : 180,
        zIndex: 2,
     }}
    />
  );
}
