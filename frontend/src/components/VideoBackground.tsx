import React from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  fallbackImageUrl: string;
  children: React.ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl, fallbackImageUrl, children }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 min-h-full min-w-full object-cover"
        poster={fallbackImageUrl}
      >
        <source src={videoUrl} type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <img
          src={fallbackImageUrl}
          alt="Background"
          className="absolute top-0 left-0 min-h-full min-w-full object-cover"
        />
      </video>
      <div className="absolute inset-0 bg-black/50" /> {/* Darker overlay for better text readability */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}

export default VideoBackground;