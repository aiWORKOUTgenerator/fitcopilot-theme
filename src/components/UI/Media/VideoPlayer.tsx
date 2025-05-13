import { AlertCircle, Pause, Play } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
    convertToMediaSources,
    LegacyVideoPlayerProps,
    MediaSource,
    VideoPlayerProps
} from '../../../types/media';
import logger from '../../../utils/logger';
import './VideoPlayer.scss';

/**
 * VideoPlayer component for displaying video content with custom controls
 * 
 * Features:
 * - Multiple video source support with fallbacks
 * - Custom play/pause controls with elegant overlay
 * - Progress bar with time display
 * - Loading state with spinner
 * - Error handling with user feedback
 * - Design system integration
 * - Accessibility support
 * - Responsive design
 * - Reduced motion support
 * 
 * @component
 */
const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps | LegacyVideoPlayerProps>(
    (props, ref) => {
        // Detect if using legacy props or new props format
        const isLegacyProps = 'src' in props;

        // Normalize props to new format
        const normalizedProps: VideoPlayerProps = isLegacyProps
            ? {
                _variant: 'video',
                sources: convertToMediaSources(
                    (props as LegacyVideoPlayerProps).src,
                    (props as LegacyVideoPlayerProps).fallbackSrc
                ),
                poster: (props as LegacyVideoPlayerProps).poster,
                controls: (props as LegacyVideoPlayerProps).controls ?? true,
                loop: (props as LegacyVideoPlayerProps).loop ?? true,
                muted: (props as LegacyVideoPlayerProps).muted ?? true,
                autoPlay: (props as LegacyVideoPlayerProps).autoPlay ?? false,
                className: (props as LegacyVideoPlayerProps).className ?? '',
                ariaLabel: (props as LegacyVideoPlayerProps).ariaLabel ?? 'Video content',
                // Add default values for new props
                aspectRatio: '16:9',
            }
            : props as VideoPlayerProps;

        const {
            sources,
            poster,
            controls = true,
            loop = true,
            muted = true,
            autoPlay = false,
            className = '',
            ariaLabel = 'Video content',
            aspectRatio = '16:9',
            tracks = [],
            allowPictureInPicture = false,
            _allowFullscreen = true,
            _playbackRate = 1,
            _onPlaybackRateChange,
            // Destructure additional props
            ...restProps
        } = normalizedProps;

        const [isPlaying, setIsPlaying] = useState(false);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration, setDuration] = useState(0);
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);
        const [sourcesState, setSourcesState] = useState<MediaSource[]>([]);
        const progressRef = useRef<HTMLDivElement>(null);
        const internalVideoRef = useRef<HTMLVideoElement>(null);

        // Use passed ref or internal ref
        const videoRef = (ref as React.RefObject<HTMLVideoElement>) || internalVideoRef;

        // Helper to determine video type from URL if not specified
        const getVideoTypeFromUrl = (url: string): string => {
            const extension = url.split('.').pop()?.toLowerCase();
            switch (extension) {
                case 'mp4':
                    return 'video/mp4';
                case 'webm':
                    return 'video/webm';
                case 'ogv':
                    return 'video/ogg';
                default:
                    return 'video/mp4';
            }
        };

        // Process sources on mount
        useEffect(() => {
            // Ensure all sources have a type if not provided
            const processedSources: MediaSource[] = sources.map(source => ({
                ...source,
                type: source.type || getVideoTypeFromUrl(source.src)
            }));

            setSourcesState(processedSources);
        }, [sources]);

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
        }, [videoRef, autoPlay, hasError]);

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
                {...restProps}
            >
                {/* Video Element */}
                <video
                    ref={videoRef}
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
                    {sourcesState.map((source, index) => (
                        <source
                            key={`${source.src}-${index}`}
                            src={source.src}
                            type={source.type}
                        />
                    ))}

                    {tracks.map((track, index) => (
                        <track
                            key={`${track.src}-${index}`}
                            src={track.src}
                            kind={track.kind}
                            label={track.label}
                            srcLang={track.srcLang}
                            default={track.default}
                        />
                    ))}

                    Your browser does not support HTML5 video.
                </video>

                {/* Custom Controls */}
                {controls && (
                    <div className="video-player__controls">
                        {/* Play/Pause Button */}
                        <button
                            type="button"
                            className="video-player__play-button"
                            onClick={handlePlayPause}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                            disabled={hasError}
                        >
                            {isPlaying ? (
                                <Pause className="video-player__icon" />
                            ) : (
                                <Play className="video-player__icon" />
                            )}
                        </button>

                        {/* Progress Bar */}
                        <div className="video-player__progress-container">
                            <div className="video-player__progress-bar">
                                <div
                                    ref={progressRef}
                                    className="video-player__progress"
                                />
                            </div>
                            <div className="video-player__time">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading Indicator */}
                {isLoading && !hasError && (
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
                            Failed to load video. Please try again later.
                        </p>
                        <button
                            type="button"
                            className="video-player__error-retry"
                            onClick={() => {
                                setHasError(false);
                                setIsLoading(true);
                                if (videoRef.current) {
                                    videoRef.current.load();
                                    videoRef.current.play().catch(e => {
                                        logger.error("Video retry failed:", e);
                                        setHasError(true);
                                        setIsLoading(false);
                                    });
                                }
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer; 