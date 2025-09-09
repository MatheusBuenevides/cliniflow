import { forwardRef, useEffect } from 'react';

interface VideoPlayerProps {
  stream: MediaStream | null;
  isLocal: boolean;
  className?: string;
  muted?: boolean;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ stream, isLocal, className = '', muted = false }, ref) => {
    useEffect(() => {
      if (ref && 'current' in ref && ref.current && stream) {
        ref.current.srcObject = stream;
      }
    }, [stream, ref]);

    return (
      <video
        ref={ref}
        className={className}
        autoPlay
        playsInline
        muted={isLocal || muted}
        style={{
          transform: isLocal ? 'scaleX(-1)' : 'none', // Espelhar vídeo local
        }}
      />
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
