import { Pause, Play } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import logger from '../../../../../utils/logger';
import { DEFAULT_VIDEO_CONFIG } from '../../constants';
import { useVideoPlayer } from '../../hooks';
import { VideoPlayerProps } from './types';

/**
 * VideoPlayer component for displaying interactive video content
 * Provides play/pause controls, progress tracking, and time display
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoRef,
  src = DEFAULT_VIDEO_CONFIG.src,
  poster = DEFAULT_VIDEO_CONFIG.poster,
  variant = 'default',
  className = '',
  style = {},
  _autoplay = false,
  loop = true,
  muted = true,
  controls,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate
}) => {
  // Local state for video player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Use video player hook for enhanced functionality
  const {
    safeVideoPlay,
    safeVideoPause
  } = useVideoPlayer();

  // Default controls configuration
  const defaultControls = {
    showPlayPause: true,
    showProgress: true,
    showTime: true,
    showVolume: false,
    showFullscreen: false,
    buttonSize: 'md' as const,
    overlayOpacity: 0.3
  };

  const finalControls = { ...defaultControls, ...controls };

  // Container classes
  const containerClasses = [
    'video-player',
    'relative',
    'h-full',
    'w-full',
    'flex',
    'flex-col',
    className
  ].filter(Boolean).join(' ');

  // Update play state when video state changes
  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;
        setCurrentTime(current);
        setDuration(total);
        onTimeUpdate?.(current, total);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef, onPlay, onPause, onEnded, onTimeUpdate]);

  // Handle play/pause button click
  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        safeVideoPause(videoRef.current);
      } else {
        await safeVideoPlay(videoRef.current);
      }
    } catch (error) {
      logger.error("Video playback failed:", error);
    }
  };

  // Format time display
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className={containerClasses}
      style={style}
      data-variant={variant}
      role="region"
      aria-label="Video player"
    >
      {/* Video element container */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="h-full w-full object-cover rounded-md"
          muted={muted}
          loop={loop}
          playsInline
          preload="metadata"
          aria-label="Video content"
        />

        {/* Overlay with controls */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
          }`}
          style={{ 
            backgroundColor: `rgba(0, 0, 0, ${finalControls.overlayOpacity})` 
          }}
        >
          {/* Play/Pause button */}
          {finalControls.showPlayPause && (
            <button
              className={`rounded-full bg-violet-500/80 flex items-center justify-center hover:bg-violet-600/80 transition-colors ${
                finalControls.buttonSize === 'sm' ? 'h-8 w-8' :
                  finalControls.buttonSize === 'lg' ? 'h-16 w-16' :
                    'h-12 w-12'
              }`}
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause 
                  size={finalControls.buttonSize === 'sm' ? 16 : finalControls.buttonSize === 'lg' ? 32 : 24} 
                  className="text-white" 
                />
              ) : (
                <Play 
                  size={finalControls.buttonSize === 'sm' ? 16 : finalControls.buttonSize === 'lg' ? 32 : 24} 
                  className="text-white ml-1" 
                />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Video controls */}
      <div className="mt-3">
        {/* Progress bar */}
        {finalControls.showProgress && (
          <div className="video-progress mb-2">
            <div
              className="video-progress-bar bg-gradient-to-r from-violet-500 to-purple-600 h-1 rounded-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`
              }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Video progress: ${Math.round(progressPercentage)}%`}
            />
          </div>
        )}

        {/* Time display */}
        {finalControls.showTime && (
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 