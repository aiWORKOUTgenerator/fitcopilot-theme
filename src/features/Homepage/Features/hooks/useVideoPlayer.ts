import { useCallback, useEffect, useRef, useState } from 'react';
import logger from '../../../../utils/logger';
import { VideoPlayerState } from '../types';
import { checkAutoplaySupport, safeVideoPause, safeVideoPlay } from '../utils';

/**
 * Custom hook for managing video player state and controls
 * Provides comprehensive video management with error handling and autoplay detection
 * 
 * @param autoplayOnHover - Whether to autoplay video on hover interactions
 * @param respectReducedMotion - Whether to respect reduced motion preferences
 * @returns Object containing video state, ref, and control functions
 * 
 * @example
 * ```tsx
 * const { videoRef, state, controls } = useVideoPlayer(true);
 * 
 * <video ref={videoRef} />
 * <button onClick={controls.togglePlay}>
 *   {state.isPlaying ? 'Pause' : 'Play'}
 * </button>
 * ```
 */
export const useVideoPlayer = (
  autoplayOnHover: boolean = false,
  respectReducedMotion: boolean = true
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Video player state
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isMuted: true,
    volume: 1,
    isFullscreen: false,
    isLoading: false,
    error: null
  });

  // Autoplay support detection
  const [autoplaySupported, setAutoplaySupported] = useState<boolean | null>(null);

  /**
   * Updates video state from video element
   */
  const updateVideoState = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setState(prevState => ({
      ...prevState,
      currentTime: video.currentTime,
      duration: video.duration || 0,
      volume: video.volume,
      isMuted: video.muted,
      isLoading: video.readyState < 3
    }));
  }, []);

  /**
   * Handles video play event
   */
  const handlePlay = useCallback(() => {
    setState(prevState => ({ ...prevState, isPlaying: true, error: null }));
    logger.debug('Video started playing');
  }, []);

  /**
   * Handles video pause event
   */
  const handlePause = useCallback(() => {
    setState(prevState => ({ ...prevState, isPlaying: false }));
    logger.debug('Video paused');
  }, []);

  /**
   * Handles video ended event
   */
  const handleEnded = useCallback(() => {
    setState(prevState => ({ ...prevState, isPlaying: false }));
    logger.debug('Video ended');
  }, []);

  /**
   * Handles video error event
   */
  const handleError = useCallback((error: Event) => {
    const errorMessage = 'Video playback error occurred';
    setState(prevState => ({ 
      ...prevState, 
      isPlaying: false, 
      isLoading: false,
      error: errorMessage 
    }));
    logger.error('Video error:', error);
  }, []);

  /**
   * Handles video loading start
   */
  const handleLoadStart = useCallback(() => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
  }, []);

  /**
   * Handles video can play event
   */
  const handleCanPlay = useCallback(() => {
    setState(prevState => ({ ...prevState, isLoading: false }));
    updateVideoState();
  }, [updateVideoState]);

  /**
   * Plays the video safely with error handling
   */
  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await safeVideoPlay(video);
    } catch (error) {
      const errorMessage = 'Failed to play video';
      setState(prevState => ({ ...prevState, error: errorMessage }));
      logger.error('Video play failed:', error);
    }
  }, []);

  /**
   * Pauses the video safely
   */
  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    safeVideoPause(video);
  }, []);

  /**
   * Toggles play/pause state
   */
  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  /**
   * Sets video volume
   * @param volume - Volume level (0-1)
   */
  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    video.volume = clampedVolume;
    setState(prevState => ({ ...prevState, volume: clampedVolume }));
  }, []);

  /**
   * Toggles mute state
   */
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setState(prevState => ({ ...prevState, isMuted: video.muted }));
  }, []);

  /**
   * Seeks to specific time
   * @param time - Time in seconds
   */
  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration || 0, time));
    updateVideoState();
  }, [updateVideoState]);

  /**
   * Handles feature hover for autoplay
   * @param isHovering - Whether feature is being hovered
   */
  const handleFeatureHover = useCallback((isHovering: boolean) => {
    if (!autoplayOnHover || !autoplaySupported) return;

    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (isHovering) {
      play();
    } else {
      pause();
    }
  }, [autoplayOnHover, autoplaySupported, respectReducedMotion, play, pause]);

  /**
   * Resets video to beginning
   */
  const reset = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    pause();
    updateVideoState();
  }, [pause, updateVideoState]);

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', updateVideoState);
    video.addEventListener('volumechange', updateVideoState);

    // Cleanup
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', updateVideoState);
      video.removeEventListener('volumechange', updateVideoState);
    };
  }, [handlePlay, handlePause, handleEnded, handleError, handleLoadStart, handleCanPlay, updateVideoState]);

  // Check autoplay support on mount
  useEffect(() => {
    checkAutoplaySupport().then(setAutoplaySupported);
  }, []);

  // Control functions
  const controls = {
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    seekTo,
    reset,
    handleFeatureHover
  };

  return {
    videoRef,
    state,
    controls,
    // Utility properties
    autoplaySupported,
    canAutoplay: autoplaySupported && !respectReducedMotion,
    // Direct state access for convenience
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    hasError: !!state.error
  };
}; 