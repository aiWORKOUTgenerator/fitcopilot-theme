import { useCallback, useEffect, useRef, useState } from 'react';
import {
    MediaErrorInfo,
    MediaPlayerControls,
    MediaPlayerState,
    UseMediaPlayerOptions
} from '../types/media';
import { VendorExtendedDocument } from '../types/vendor';
import logger from '../utils/logger';
import {
    documentHasMsFullscreen,
    documentHasWebkitFullscreen,
    hasMsFullscreenMethods,
    hasWebkitFullscreenMethods,
    supportsPictureInPicture
} from '../utils/typeGuards/mediaApiGuards';

/**
 * Custom hook for controlling media elements (audio and video)
 * with comprehensive type safety and consistent behavior.
 * 
 * @param options Configuration options for the media player
 * @returns Media player state and controls
 */
export const useMediaPlayer = (options: UseMediaPlayerOptions = {}): {
    state: MediaPlayerState;
    controls: MediaPlayerControls;
} => {
  const {
    initialPlaybackRate = 1,
    initialVolume = 1,
    _autoAdvance = false, // Prefix with underscore to mark as intentionally unused
    autoPlay = false,
    playWhenVisible = false,
    onEnded,
    onPlay,
    onPause,
    onError
  } = options;

  // Media element reference
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);

  // Intersection observer for visibility detection
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Media player state
  const [state, setState] = useState<MediaPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: initialPlaybackRate,
    isMuted: false,
    volume: initialVolume,
    isSeeking: false,
    hasEnded: false,
    isBuffering: false,
    isMetadataLoaded: false,
    buffered: null,
    hasError: false,
    error: null
  });

  // Function to set partial state
  const setPartialState = useCallback((partialState: Partial<MediaPlayerState>) => {
    setState(prevState => ({ ...prevState, ...partialState }));
  }, []);

  // Initialize media element
  const initMediaElement = useCallback((element: HTMLVideoElement | HTMLAudioElement | null) => {
    mediaRef.current = element;

    if (element) {
      // Set initial values
      element.playbackRate = initialPlaybackRate;
      element.volume = initialVolume;

      // Update state with element properties
      setPartialState({
        currentTime: element.currentTime,
        duration: element.duration || 0,
        isMetadataLoaded: element.readyState >= 1,
        buffered: element.buffered,
        isMuted: element.muted,
        volume: element.volume
      });
    }
  }, [initialPlaybackRate, initialVolume, setPartialState]);

  // Get media element
  const getMediaElement = useCallback((): HTMLVideoElement | HTMLAudioElement | null => {
    return mediaRef.current;
  }, []);

  // Play media
  const play = useCallback(async (): Promise<void> => {
    const media = mediaRef.current;
    if (!media) return;

    try {
      setPartialState({ isBuffering: true });
      await media.play();
      setPartialState({
        isPlaying: true,
        isBuffering: false,
        hasEnded: false
      });
      onPlay?.();
    } catch (error) {
      const mediaError: MediaErrorInfo = {
        code: media.error?.code,
        message: 'Failed to play media',
        error: error instanceof Error ? error : new Error(String(error)),
        details: { src: media.currentSrc }
      };

      setPartialState({
        isPlaying: false,
        isBuffering: false,
        hasError: true,
        error: mediaError
      });

      onError?.(mediaError);
      logger.error('Media play error:', error);
    }
  }, [onError, onPlay, setPartialState]);

  // Pause media
  const pause = useCallback((): void => {
    const media = mediaRef.current;
    if (!media) return;

    media.pause();
    setPartialState({ isPlaying: false });
    onPause?.();
  }, [onPause, setPartialState]);

  // Toggle play/pause
  const togglePlay = useCallback(async (): Promise<void> => {
    if (state.isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [state.isPlaying, play, pause]);

  // Seek to specific time
  const seek = useCallback((time: number): void => {
    const media = mediaRef.current;
    if (!media) return;

    // Clamp time between 0 and duration
    const clampedTime = Math.min(Math.max(0, time), state.duration);

    try {
      media.currentTime = clampedTime;
      setPartialState({
        currentTime: clampedTime,
        isSeeking: true
      });
    } catch (error) {
      logger.error('Media seek error:', error);
    }
  }, [state.duration, setPartialState]);

  // Skip forward by seconds
  const skipForward = useCallback((seconds = 10): void => {
    const media = mediaRef.current;
    if (!media) return;

    seek(media.currentTime + seconds);
  }, [seek]);

  // Skip backward by seconds
  const skipBackward = useCallback((seconds = 10): void => {
    const media = mediaRef.current;
    if (!media) return;

    seek(media.currentTime - seconds);
  }, [seek]);

  // Set playback rate
  const setPlaybackRate = useCallback((rate: number): void => {
    const media = mediaRef.current;
    if (!media) return;

    media.playbackRate = rate;
    setPartialState({ playbackRate: rate });
  }, [setPartialState]);

  // Mute media
  const mute = useCallback((): void => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = true;
    setPartialState({ isMuted: true });
  }, [setPartialState]);

  // Unmute media
  const unmute = useCallback((): void => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = false;
    setPartialState({ isMuted: false });
  }, [setPartialState]);

  // Toggle mute/unmute
  const toggleMute = useCallback((): void => {
    if (state.isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [state.isMuted, mute, unmute]);

  // Set volume
  const setVolume = useCallback((volume: number): void => {
    const media = mediaRef.current;
    if (!media) return;

    // Clamp volume between 0 and 1
    const clampedVolume = Math.min(Math.max(0, volume), 1);

    media.volume = clampedVolume;
    setPartialState({ volume: clampedVolume });

    // If volume is set to 0, mute the media
    if (clampedVolume === 0 && !media.muted) {
      media.muted = true;
      setPartialState({ isMuted: true });
    }
    // If volume is greater than 0 and media is muted, unmute it
    else if (clampedVolume > 0 && media.muted) {
      media.muted = false;
      setPartialState({ isMuted: false });
    }
  }, [setPartialState]);

  // Video-specific functions - only defined when media is a video element
  const enterFullscreen = useCallback(async (): Promise<void> => {
    const media = mediaRef.current as HTMLVideoElement;
    if (!media || !(media instanceof HTMLVideoElement)) return;

    try {
      if (media.requestFullscreen) {
        await media.requestFullscreen();
      } else if (hasWebkitFullscreenMethods(media)) {
        await media.webkitRequestFullscreen();
      } else if (hasMsFullscreenMethods(media)) {
        await media.msRequestFullscreen();
      }
    } catch (error) {
      logger.error('Fullscreen error:', error);
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async (): Promise<void> => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (documentHasWebkitFullscreen()) {
        await (document as VendorExtendedDocument).webkitExitFullscreen();
      } else if (documentHasMsFullscreen()) {
        await (document as VendorExtendedDocument).msExitFullscreen();
      }
    } catch (error) {
      logger.error('Exit fullscreen error:', error);
    }
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async (): Promise<void> => {
    if (document.fullscreenElement) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  // Enter picture-in-picture (video only)
  const enterPictureInPicture = useCallback(async (): Promise<void> => {
    const media = mediaRef.current as HTMLVideoElement;
    if (!media || !(media instanceof HTMLVideoElement)) return;

    try {
      if (document.pictureInPictureElement !== media && supportsPictureInPicture(media)) {
        await media.requestPictureInPicture();
      }
    } catch (error) {
      logger.error('Picture-in-picture error:', error);
    }
  }, []);

  // Exit picture-in-picture
  const exitPictureInPicture = useCallback(async (): Promise<void> => {
    try {
      if (document.pictureInPictureElement && document.exitPictureInPicture) {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      logger.error('Exit picture-in-picture error:', error);
    }
  }, []);

  // Toggle picture-in-picture
  const togglePictureInPicture = useCallback(async (): Promise<void> => {
    if (document.pictureInPictureElement) {
      await exitPictureInPicture();
    } else {
      await enterPictureInPicture();
    }
  }, [enterPictureInPicture, exitPictureInPicture]);

  // Set up media event listeners
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleTimeUpdate = () => {
      setPartialState({ currentTime: media.currentTime });
    };

    const handleDurationChange = () => {
      setPartialState({ duration: media.duration });
    };

    const handleProgress = () => {
      setPartialState({ buffered: media.buffered });
    };

    const handleSeeking = () => {
      setPartialState({ isSeeking: true });
    };

    const handleSeeked = () => {
      setPartialState({ isSeeking: false });
    };

    const handlePlaying = () => {
      setPartialState({
        isPlaying: true,
        isBuffering: false,
        hasEnded: false
      });
    };

    const handlePause = () => {
      setPartialState({ isPlaying: false });
    };

    const handleEnded = () => {
      setPartialState({
        isPlaying: false,
        hasEnded: true,
        currentTime: media.duration
      });

      if (onEnded) {
        onEnded();
      }

      // Auto-advance logic would go here if needed
    };

    const handleVolumeChange = () => {
      setPartialState({
        volume: media.volume,
        isMuted: media.muted
      });
    };

    const handleRateChange = () => {
      setPartialState({ playbackRate: media.playbackRate });
    };

    const handleLoadedMetadata = () => {
      setPartialState({
        isMetadataLoaded: true,
        duration: media.duration,
        currentTime: media.currentTime
      });
    };

    const handleWaiting = () => {
      setPartialState({ isBuffering: true });
    };

    const handleError = (_e: Event) => {
      const media = mediaRef.current;
      if (!media) return;

      const mediaError: MediaErrorInfo = {
        code: media.error?.code,
        message: media.error ? media.error.message : 'Unknown media error',
        details: {
          src: media.currentSrc,
          readyState: media.readyState
        }
      };

      setPartialState({
        hasError: true,
        error: mediaError,
        isBuffering: false
      });

      if (onError) {
        onError(mediaError);
      }

      logger.error('Media error:', media.error);
    };

    // Attach event listeners
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('durationchange', handleDurationChange);
    media.addEventListener('progress', handleProgress);
    media.addEventListener('seeking', handleSeeking);
    media.addEventListener('seeked', handleSeeked);
    media.addEventListener('playing', handlePlaying);
    media.addEventListener('pause', handlePause);
    media.addEventListener('ended', handleEnded);
    media.addEventListener('volumechange', handleVolumeChange);
    media.addEventListener('ratechange', handleRateChange);
    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('waiting', handleWaiting);
    media.addEventListener('error', handleError);

    // Set initial values
    media.playbackRate = state.playbackRate;
    media.volume = state.volume;
    media.muted = state.isMuted;

    // Auto-play if specified
    if (autoPlay && !state.hasError) {
      play().catch(e => {
        logger.warn('Autoplay prevented:', e);
      });
    }

    // Cleanup
    return () => {
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('durationchange', handleDurationChange);
      media.removeEventListener('progress', handleProgress);
      media.removeEventListener('seeking', handleSeeking);
      media.removeEventListener('seeked', handleSeeked);
      media.removeEventListener('playing', handlePlaying);
      media.removeEventListener('pause', handlePause);
      media.removeEventListener('ended', handleEnded);
      media.removeEventListener('volumechange', handleVolumeChange);
      media.removeEventListener('ratechange', handleRateChange);
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('waiting', handleWaiting);
      media.removeEventListener('error', handleError);
    };
  }, [
    autoPlay,
    onEnded,
    onError,
    play,
    setPartialState,
    state.hasError,
    state.isMuted,
    state.playbackRate,
    state.volume
  ]);

  // Set up intersection observer for playWhenVisible
  useEffect(() => {
    if (!playWhenVisible || !mediaRef.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !state.isPlaying && !state.hasEnded) {
        play().catch(e => {
          logger.warn('Visibility-triggered play prevented:', e);
        });
      } else if (!entry.isIntersecting && state.isPlaying) {
        pause();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.5
    });

    observerRef.current.observe(mediaRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pause, play, playWhenVisible, state.hasEnded, state.isPlaying]);

  // Assemble and return media controls and state
  const controls: MediaPlayerControls = {
    play,
    pause,
    togglePlay,
    seek,
    skipForward,
    skipBackward,
    setPlaybackRate,
    mute,
    unmute,
    toggleMute,
    setVolume,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    enterPictureInPicture,
    exitPictureInPicture,
    togglePictureInPicture,
    initMediaElement,
    getMediaElement
  };

  return { state, controls };
}; 