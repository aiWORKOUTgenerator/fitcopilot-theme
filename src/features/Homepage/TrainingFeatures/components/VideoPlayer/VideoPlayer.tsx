import { AlertCircle, Pause, Play } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import logger from '../../../../../utils/logger';
import './VideoPlayer.scss';

/**
 * Video source definitions
 */
export interface VideoSource {
    /**
     * Video source URL
     */
    src: string;

    /**
     * Video type
     */
    type: 'video/mp4' | 'video/webm' | 'video/ogg';
}

/**
 * Video player props
 */
export interface VideoPlayerProps {
    /**
     * Primary video source URL
     * @required
     */
    src: string;

    /**
     * Optional fallback sources if primary source fails to load
     * Can be a single string URL or an array of VideoSource objects
     */
    fallbackSrc?: string | VideoSource[];

    /**
     * Poster image to display before video plays
     * Strongly recommended for better user experience
     */
    poster?: string;

    /**
     * Whether to show controls overlay
     * @default true
     */
    controls?: boolean;

    /**
     * Whether video should loop when it reaches the end
     * @default true
     */
    loop?: boolean;

    /**
     * Whether video should be muted
     * Required for autoplay in most browsers
     * @default true
     */
    muted?: boolean;

    /**
     * Whether to play automatically when component mounts
     * Note: Most browsers require muted=true for autoplay to work
     * @default false
     */
    autoPlay?: boolean;

    /**
     * Whether to autoplay when the video comes into view
     * @default true
     */
    autoPlayOnScroll?: boolean;

    /**
     * Optional CSS class name to apply to container
     */
    className?: string;

    /**
     * Accessibility label for the video
     * Important for screen readers
     * @default 'Video content'
     */
    ariaLabel?: string;

    /**
     * Callback function to be called when the video ends
     */
    onEnded?: () => void;
}

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
 * - Autoplay on scroll into view
 * 
 * @component
 * @example
 * // Basic usage
 * <VideoPlayer src="/path/to/video.mp4" />
 * 
 * @example
 * // Advanced usage
 * <VideoPlayer 
 *   ref={videoRef}
 *   src="/path/to/video.mp4"
 *   fallbackSrc={[
 *     { src: "/path/to/video.webm", type: "video/webm" }
 *   ]}
 *   poster="/path/to/poster.jpg"
 *   controls={true}
 *   muted={true}
 *   autoPlay={false}
 *   autoPlayOnScroll={true}
 *   ariaLabel="Training demonstration video"
 * />
 */
const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
    ({
        src,
        fallbackSrc,
        poster,
        controls = true,
        loop = true,
        muted = true,
        autoPlay = false,
        autoPlayOnScroll = true,
        className = '',
        ariaLabel = 'Video content',
        onEnded
    }, ref) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration, setDuration] = useState(0);
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);
        const [sources, setSources] = useState<VideoSource[]>([]);
        const [isInView, setIsInView] = useState(false);
        const progressRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const internalVideoRef = useRef<HTMLVideoElement>(null);

        // Use passed ref or internal ref
        const videoRef = (ref as React.RefObject<HTMLVideoElement>) || internalVideoRef;

        // Process sources on mount
        useEffect(() => {
            const videoSources: VideoSource[] = [];

            // Add primary source
            videoSources.push({
                src: src,
                type: getVideoTypeFromUrl(src)
            });

            // Add fallback sources
            if (fallbackSrc) {
                if (typeof fallbackSrc === 'string') {
                    videoSources.push({
                        src: fallbackSrc,
                        type: getVideoTypeFromUrl(fallbackSrc)
                    });
                } else if (Array.isArray(fallbackSrc)) {
                    videoSources.push(...fallbackSrc);
                }
            }

            setSources(videoSources);
        }, [src, fallbackSrc]);

        // Set up intersection observer for autoplay on scroll
        useEffect(() => {
            if (!autoPlayOnScroll || !containerRef.current) return;

            const handleIntersection = (entries: IntersectionObserverEntry[]) => {
                const [entry] = entries;
                setIsInView(entry.isIntersecting);
            };

            const options = {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.5 // 50% of the element is visible
            };

            const observer = new IntersectionObserver(handleIntersection, options);
            const currentContainer = containerRef.current;
            observer.observe(currentContainer);

            return () => {
                if (currentContainer) {
                    observer.unobserve(currentContainer);
                }
                observer.disconnect();
            };
        }, [autoPlayOnScroll]);

        // Handle autoplay on scroll
        useEffect(() => {
            if (!autoPlayOnScroll || !videoRef.current || hasError) return;

            if (isInView) {
                videoRef.current.currentTime = 0; // Always start from the beginning
                videoRef.current.play().catch(e => {
                    logger.error("Video autoplay failed:", e);
                });
            } else if (videoRef.current.played.length > 0) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Reset to first frame when out of view
            }
        }, [isInView, autoPlayOnScroll, hasError, videoRef]);

        // Helper to determine video type from URL
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

        // Format time as MM:SS
        const formatTime = (timeInSeconds: number) => {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        // Handle play/pause toggle
        const handlePlayPause = () => {
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

            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);
            const handleTimeUpdate = () => setCurrentTime(video.currentTime);
            const handleDurationChange = () => setDuration(video.duration);
            const handleLoadedData = () => {
                setIsLoading(false);
                setHasError(false);

                // Ensure the first frame is shown
                if (!isPlaying && !autoPlay) {
                    video.currentTime = 0.1; // Small offset to show the first actual frame
                    setTimeout(() => {
                        if (video && !isPlaying) {
                            video.currentTime = 0;
                        }
                    }, 100);
                }
            };
            const handleError = (e: Event) => {
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
            if (autoPlay && !hasError && !autoPlayOnScroll) {
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
        }, [videoRef, autoPlay, hasError, isPlaying, autoPlayOnScroll]);

        // Update progress bar width based on current time
        useEffect(() => {
            if (progressRef.current && duration > 0) {
                const progressPercentage = (currentTime / duration) * 100;
                progressRef.current.style.width = `${progressPercentage}%`;
            }
        }, [currentTime, duration]);

        return (
            <div
                className={`video-container ${className} ${isInView && isPlaying && autoPlayOnScroll ? 'autoplaying' : ''}`}
                ref={containerRef}
            >
                {/* Video element with sources */}
                <div className="video-wrapper">
                    <video
                        ref={videoRef}
                        poster={poster}
                        loop={loop}
                        muted={muted}
                        playsInline
                        preload="metadata"
                        onClick={controls ? handlePlayPause : undefined}
                        aria-label={ariaLabel}
                        onEnded={onEnded}
                    >
                        {/* Render all sources */}
                        {sources.map((source, index) => (
                            <source key={index} src={source.src} type={source.type} />
                        ))}
                        {/* Fallback text for browsers that don't support video */}
                        Your browser does not support HTML video playback.
                    </video>

                    {/* Loading indicator */}
                    {isLoading && !hasError && (
                        <div className="video-overlay">
                            <svg
                                className="loading-indicator"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray="40 60"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Error indicator */}
                    {hasError && (
                        <div className="video-overlay">
                            <div className="error-container">
                                <AlertCircle size={32} className="error-icon" />
                                <p className="error-message">Unable to load video</p>
                            </div>
                        </div>
                    )}

                    {/* Play/pause overlay */}
                    {controls && !hasError && (
                        <div
                            className={`video-overlay transition-opacity duration-300
                                ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                        >
                            <button
                                className="control-button"
                                onClick={handlePlayPause}
                                aria-label={isPlaying ? "Pause video" : "Play video"}
                            >
                                {isPlaying ? (
                                    <Pause size={24} />
                                ) : (
                                    <Play size={24} className="ml-1" />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Video progress bar */}
                {!hasError && (
                    <div className="mt-3">
                        <div className="video-progress">
                            <div ref={progressRef} className="video-progress-bar"></div>
                        </div>

                        {/* Time display */}
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer; 