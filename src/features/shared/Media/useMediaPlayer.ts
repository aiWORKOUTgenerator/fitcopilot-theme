import { useCallback, useRef, useState } from 'react';

export interface MediaPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
}

export const useMediaPlayer = () => {
  const [state, setState] = useState<MediaPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
  });
  const ref = useRef<HTMLMediaElement | null>(null);

  // Typed event handlers
  const handlePlay = useCallback(() => setState(s => ({ ...s, isPlaying: true })), []);
  const handlePause = useCallback(() => setState(s => ({ ...s, isPlaying: false })), []);
  const handleTimeUpdate = useCallback(() => {
    if (ref.current) setState(s => ({ ...s, currentTime: ref.current!.currentTime }));
  }, []);
  const handleLoadedMetadata = useCallback(() => {
    if (ref.current) setState(s => ({ ...s, duration: ref.current!.duration }));
  }, []);
  const handleVolumeChange = useCallback(() => {
    if (ref.current) setState(s => ({
      ...s,
      volume: ref.current!.volume,
      isMuted: ref.current!.muted,
    }));
  }, []);

  return {
    ref,
    state,
    handlePlay,
    handlePause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleVolumeChange,
  };
}; 