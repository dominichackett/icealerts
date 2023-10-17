import { useEffect, useRef } from 'react';

type VideoPlayerPropsType = {
  stream: MediaStream | null;
  isMuted: boolean;
};

const VideoPlayer = ({ stream, isMuted }: VideoPlayerPropsType) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [videoRef, stream]);

  return (
    <video
      ref={videoRef}
      muted={isMuted}
      autoPlay
      className=" border-2 border-black"
    />
  );
};

export default VideoPlayer;
