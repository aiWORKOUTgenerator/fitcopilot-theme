import { AlertCircle, Pause, Play } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import logger from '../../../utils/logger';
import { VideoMediaProps } from './types';

const VideoPlayer = forwardRef<HTMLVideoElement, VideoMediaProps>(({
    src,
    poster,
    autoPlay = false,
    muted = true,
    loop = true,
    controls = true,
    className = '',
    onLoad,
    ariaLabel = 'Video content',
    aspectRatio = '16:9',
    allowPictureInPicture = false,
    ...rest
}, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const progressRef = useRef<HTMLDivElement>(null);
    const internalVideoRef = useRef<HTMLVideoElement>(null);

    // Use passed ref or internal ref
    const videoRef = (ref as React.RefObject<HTMLVideoElement>) || internalVideoRef;

    // Format time as MM:SS
    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Handle play/pause toggle
    const handlePlayPause = (): void => {
        if (!videoRef.current || hasError) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(error => {
                logger.error("Video playback failed:", error);
                setHasError(true);
            });
        }
    };

    // Handle progress bar click
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!videoRef.current || !progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * videoRef.current.duration;
    };

    // Handle retry
    const handleRetry = (): void => {
        if (!videoRef.current) return;
        setHasError(false);
        setIsLoading(true);
        videoRef.current.load();
        videoRef.current.play().catch(error => {
            logger.error("Video playback failed:", error);
            setHasError(true);
        });
    };

    // Update play state when video state changes
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = (): void => setIsPlaying(true);
        const handlePause = (): void => setIsPlaying(false);
        const handleTimeUpdate = (): void => setCurrentTime(video.currentTime);
        const handleDurationChange = (): void => setDuration(video.duration);
        const handleLoadedData = (): void => {
            setIsLoading(false);
            setHasError(false);
            onLoad?.();
        };
        const handleError = (e: Event): void => {
            logger.error("Video error:", e);
            setHasError(true);
            setIsLoading(false);
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('error', handleError);

        // Auto play if specified
        if (autoPlay && !hasError) {
            video.play().catch(e => {
                logger.error("Video autoplay failed:", e);
                setHasError(true);
            });
        }

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('durationchange', handleDurationChange);
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('error', handleError);
        };
    }, [videoRef, autoPlay, hasError, onLoad]);

    // Update progress bar width
    useEffect(() => {
        if (progressRef.current && duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressRef.current.style.width = `${progress}%`;
        }
    }, [currentTime, duration]);

    // Calculate aspect ratio style
    const getAspectRatioStyle = (): React.CSSProperties => {
        if (aspectRatio === 'cover') {
            return { paddingBottom: '56.25%' }; // 16:9 default for cover
        }

        // Parse aspect ratio string (e.g., "16:9")
        const [width, height] = aspectRatio.split(':').map(Number);
        if (!width || !height) {
            return { paddingBottom: '56.25%' }; // Default to 16:9
        }

        const paddingBottom = `${(height / width) * 100}%`;
        return { paddingBottom };
    };

    return (
        <div
            className={`video-player ${className}`}
            style={getAspectRatioStyle()}
            data-testid="video-player"
            {...rest}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                loop={loop}
                muted={muted}
                playsInline
                preload="metadata"
                aria-label={ariaLabel}
                controls={false} // We use custom controls
                className="video-player__element"
                disablePictureInPicture={!allowPictureInPicture}
            >
                Your browser does not support HTML5 video.
            </video>

            {/* Loading State */}
            {isLoading && (
                <div className="video-player__loading">
                    <svg className="video-player__spinner" viewBox="0 0 50 50">
                        <circle
                            className="video-player__spinner-path"
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            strokeWidth="5"
                        />
                    </svg>
                </div>
            )}

            {/* Error State */}
            {hasError && (
                <div className="video-player__error">
                    <AlertCircle className="video-player__error-icon" />
                    <p className="video-player__error-text">
                        There was an error playing this video.
                    </p>
                    <button
                        type="button"
                        className="video-player__error-retry"
                        onClick={handleRetry}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Custom Controls */}
            {controls && !hasError && (
                <div className="video-player__controls">
                    {/* Play/Pause Button */}
                    <button
                        type="button"
                        className="video-player__play-button"
                        onClick={handlePlayPause}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        disabled={isLoading}
                    >
                        {isPlaying ? (
                            <Pause className="video-player__icon" />
                        ) : (
                            <Play className="video-player__icon" />
                        )}
                    </button>

                    {/* Progress Bar */}
                    <div className="video-player__progress-container">
                        <div
                            ref={progressRef}
                            className="video-player__progress-bar"
                            onClick={handleProgressClick}
                            role="slider"
                            aria-label="Video progress"
                            aria-valuemin={0}
                            aria-valuemax={duration}
                            aria-valuenow={currentTime}
                            tabIndex={0}
                        >
                            <div className="video-player__progress" />
                        </div>
                        <div className="video-player__time">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer; 