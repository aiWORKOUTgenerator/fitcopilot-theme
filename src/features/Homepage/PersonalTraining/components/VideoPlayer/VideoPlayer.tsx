import { Pause, Play } from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ErrorMessage, Loading } from '../../../../../components/UI';
import useAsyncEffect from '../../../../../hooks/useAsyncEffect';
import useEventCallback from '../../../../../hooks/useEventCallback';
import logger from '../../../../../utils/logger';
import './VideoPlayer.scss';

// Create a component-specific logger
const videoLogger = logger.addContext('VideoPlayer');

/**
 * Interface representing a video source with URL and content type
 * 
 * @interface VideoSource
 * @property {string} src - URL of the video source
 * @property {string} type - MIME type of the video (e.g., 'video/mp4')
 * @property {string} [quality] - Quality label for the source (e.g., '720p', '1080p')
 * @property {number} [size] - File size in bytes for bandwidth estimation
 */
export interface VideoSource {
    /**
     * Video source URL
     */
    src: string;

    /**
     * Video type
     */
    type: string;

    /**
     * Quality label (e.g., '360p', '720p', '1080p')
     */
    quality?: string;

    /**
     * File size in bytes for bandwidth considerations
     */
    size?: number;

    /**
     * Whether this is preferred for mobile devices
     */
    mobileOptimized?: boolean;
}

/**
 * Props for the VideoPlayer component
 * 
 * @interface VideoPlayerProps
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
     * Multiple quality options for the video
     * If provided, the component will choose the best quality based on network conditions
     */
    qualitySources?: VideoSource[];

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
     * Aspect ratio of the video container
     * Format: 'width/height' (e.g., '16/9', '4/3', '1/1')
     * @default '16/9'
     */
    aspectRatio?: string;

    /**
     * Theme variant for styling video controls
     * @default 'default'
     */
    theme?: 'default' | 'gym' | 'sports' | 'wellness';

    /**
     * Connection speed preference for choosing quality
     * If undefined, will auto-detect
     */
    connectionPreference?: 'low' | 'medium' | 'high' | 'auto';

    /**
     * Callback when video encounters an error
     */
    onError?: (error: Event) => void;

    /**
     * Action to take when video errors
     */
    errorAction?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Utility function to check if a URL is from a streaming service
 * 
 * @param url - The URL to check
 * @returns Whether the URL is from a streaming service
 */
const isStreamingServiceUrl = (url: string): boolean => {
    // Check for common streaming services
    const streamingDomains = [
        'youtube.com', 'youtu.be',
        'vimeo.com',
        'wistia.com',
        'dailymotion.com',
        'facebook.com/watch',
        'twitch.tv'
    ];

    try {
        const urlObj = new URL(url);
        return streamingDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
        return false; // Invalid URL
    }
};

/**
 * Utility function to convert YouTube URLs to embedded format
 * 
 * @param url - The YouTube URL to convert
 * @param autoPlay - Whether to autoplay the video
 * @returns Embedded YouTube URL
 */
const getYouTubeEmbedUrl = (url: string, autoPlay: boolean): string => {
    // If already an embed URL, possibly add autoplay
    if (url.includes('youtube.com/embed/')) {
        const hasAutoplay = url.includes('autoplay=1');
        if (autoPlay && !hasAutoplay) {
            return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
        } else if (!autoPlay && hasAutoplay) {
            return url.replace('autoplay=1', 'autoplay=0');
        }
        return url;
    }

    // Handle various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        // Valid YouTube ID
        const videoId = match[2];
        return `https://www.youtube.com/embed/${videoId}${autoPlay ? '?autoplay=1' : ''}`;
    }

    // If not matched, return original
    return url;
};

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
 * - Support for external streaming services (YouTube, etc.)
 * - Responsive quality selection based on network conditions
 * 
 * @component
 * @example
 * // Basic usage
 * <VideoPlayer src="/path/to/video.mp4" />
 * 
 * @example
 * // Advanced usage with responsive quality
 * <VideoPlayer 
 *   ref={videoRef}
 *   src="/path/to/video.mp4"
 *   qualitySources={[
 *     { src: "/path/to/video-360p.mp4", type: "video/mp4", quality: "360p", size: 5242880, mobileOptimized: true },
 *     { src: "/path/to/video-720p.mp4", type: "video/mp4", quality: "720p", size: 15728640 },
 *     { src: "/path/to/video-1080p.mp4", type: "video/mp4", quality: "1080p", size: 31457280 }
 *   ]}
 *   poster="/path/to/poster.jpg"
 *   controls={true}
 *   muted={true}
 *   autoPlay={false}
 *   autoPlayOnScroll={true}
 *   ariaLabel="Training demonstration video"
 *   aspectRatio="16/9"
 *   theme="gym"
 *   connectionPreference="auto"
 * />
 */
const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
    ({
        src,
        fallbackSrc,
        qualitySources,
        poster,
        controls = true,
        loop = true,
        muted = true,
        autoPlay = false,
        autoPlayOnScroll = true,
        className = '',
        ariaLabel = 'Video content',
        aspectRatio = '16/9',
        theme = 'default',
        connectionPreference = 'auto',
        onError,
        errorAction
    }, ref) => {
        // Refs
        const videoRef = useRef<HTMLVideoElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const timeoutRef = useRef<NodeJS.Timeout | null>(null);
        const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

        // State
        const [isPlaying, setIsPlaying] = useState(autoPlay);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration, setDuration] = useState(0);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<Error | null>(null);
        const [activeSrc, setActiveSrc] = useState<string | null>(null);
        const [isExternalVideo, setIsExternalVideo] = useState(false);
        const [connectionSpeed, setConnectionSpeed] = useState<'low' | 'medium' | 'high'>('medium');

        // Get the appropriate video element
        const video = ref ? (ref as React.RefObject<HTMLVideoElement>).current : videoRef.current;

        // Check connection speed for quality adjustment
        useAsyncEffect(async () => {
            if (!connectionPreference || connectionPreference === 'auto') {
                try {
                    const startTime = Date.now();
                    const response = await fetch('/assets/bandwidth-test.jpg', { method: 'HEAD' });
                    const endTime = Date.now();

                    if (!response.ok) throw new Error('Network response was not ok');

                    const duration = endTime - startTime;

                    if (duration < 100) {
                        setConnectionSpeed('high');
                    } else if (duration < 300) {
                        setConnectionSpeed('medium');
                    } else {
                        setConnectionSpeed('low');
                    }

                    videoLogger.debug('Connection speed detected', { duration, speed: connectionSpeed });
                } catch (err) {
                    videoLogger.warn('Could not test connection speed', err);
                    // Default to medium on error
                    setConnectionSpeed('medium');
                }
            } else {
                setConnectionSpeed(connectionPreference);
            }
        }, [connectionPreference], (error) => {
            videoLogger.error('Error checking connection speed', error);
        });

        // Setup autoplay on scroll if enabled
        useEffect(() => {
            if (!autoPlayOnScroll || !containerRef.current) return;

            const handleIntersection = (entries: IntersectionObserverEntry[]) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && video && !isPlaying) {
                        // When the video comes into view, play it
                        try {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                    // Auto-play was prevented, likely due to browser policy
                                    videoLogger.debug('Autoplay prevented', { error });
                                });
                            }
                        } catch (error) {
                            videoLogger.warn('Error during autoplay on scroll', error);
                        }
                    }
                });
            };

            intersectionObserverRef.current = new IntersectionObserver(handleIntersection, {
                threshold: 0.5, // Trigger when 50% of the video is visible
            });

            intersectionObserverRef.current.observe(containerRef.current);

            // Cleanup observer on unmount
            return () => {
                if (intersectionObserverRef.current) {
                    intersectionObserverRef.current.disconnect();
                }
            };
        }, [autoPlayOnScroll, isPlaying, video]);

        // Utility functions
        const getVideoTypeFromUrl = useCallback((url: string): string => {
            const extension = url.split('.').pop()?.toLowerCase();
            if (!extension) return 'video/mp4'; // Default

            switch (extension) {
                case 'mp4': return 'video/mp4';
                case 'webm': return 'video/webm';
                case 'ogv': return 'video/ogg';
                case 'mov': return 'video/quicktime';
                default: return `video/${extension}`;
            }
        }, []);

        // Format time for display (MM:SS)
        const formatTime = useCallback((timeInSeconds: number) => {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, []);

        // Handle play/pause toggling
        const handlePlayPause = useCallback(() => {
            if (!video) return;

            if (isPlaying) {
                video.pause();
            } else {
                video.play().catch((error) => {
                    videoLogger.warn('Error playing video', error);
                    setError(new Error('Could not play video. Check your browser settings or try unmuting.'));
                });
            }
        }, [isPlaying, video]);

        // Handle retry after error
        const handleRetry = useCallback(() => {
            if (!video) return;

            setError(null);
            setLoading(true);

            // Try to reload the video
            video.load();

            if (autoPlay) {
                video.play().catch((error) => {
                    videoLogger.warn('Error during retry autoplay', error);
                    setError(new Error('Could not play video after retry.'));
                });
            }
        }, [autoPlay, video]);

        // Event handlers
        const handlePlay = useCallback(() => setIsPlaying(true), []);
        const handlePause = useCallback(() => setIsPlaying(false), []);
        const handleTimeUpdate = useCallback(() => {
            if (video) setCurrentTime(video.currentTime);
        }, [video]);
        const handleDurationChange = useCallback(() => {
            if (video) setDuration(video.duration);
        }, [video]);

        const handleLoadedData = useCallback(() => {
            videoLogger.debug('Video loaded', { src: activeSrc });
            setLoading(false);

            if (autoPlay && video) {
                video.play().catch((error) => {
                    videoLogger.warn('Autoplay prevented', error);
                    // Don't set error here as this is usually a browser policy issue
                });
            }
        }, [activeSrc, autoPlay, video]);

        // Handle video errors
        const handleError = useEventCallback((e: Event) => {
            const errorEvent = e as ErrorEvent;
            const errorMessage = errorEvent.message || 'An error occurred while loading the video.';

            videoLogger.error('Video error', {
                error: errorEvent,
                currentSrc: video?.currentSrc
            });

            setLoading(false);
            setError(new Error(errorMessage));

            // Call the error handler if provided
            if (onError) {
                onError(e);
            }
        }, [onError, video]);

        // Setup event listeners
        useEffect(() => {
            if (!video) return;

            // Add event listeners
            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);
            video.addEventListener('timeupdate', handleTimeUpdate);
            video.addEventListener('durationchange', handleDurationChange);
            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('error', handleError);

            // Store the current timeout ref to use in cleanup
            const currentTimeoutRef = timeoutRef.current;

            // Cleanup
            return () => {
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener('durationchange', handleDurationChange);
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('error', handleError);

                // Clear any pending timeouts using the captured reference
                if (currentTimeoutRef) {
                    clearTimeout(currentTimeoutRef);
                }
            };
        }, [
            video,
            handlePlay,
            handlePause,
            handleTimeUpdate,
            handleDurationChange,
            handleLoadedData,
            handleError
        ]);

        // Prepare video sources based on props and network conditions
        const getActiveSources = useCallback(() => {
            // External video handling
            if (isStreamingServiceUrl(src)) {
                setIsExternalVideo(true);
                const embedUrl = src.includes('youtube.com') || src.includes('youtu.be')
                    ? getYouTubeEmbedUrl(src, autoPlay)
                    : src;
                setActiveSrc(embedUrl);
                return;
            }

            // Local video sources
            setIsExternalVideo(false);
            if (qualitySources && qualitySources.length > 0) {
                // Choose source based on connection speed
                let selectedSource = qualitySources[0];

                if (connectionSpeed === 'low') {
                    // Find smallest size or mobile optimized
                    selectedSource = qualitySources.find(s => s.mobileOptimized) ||
                        [...qualitySources].sort((a, b) => (a.size || 0) - (b.size || 0))[0];
                } else if (connectionSpeed === 'high') {
                    // Find highest quality
                    selectedSource = [...qualitySources].sort((a, b) => (b.size || 0) - (a.size || 0))[0];
                }

                setActiveSrc(selectedSource.src);
            } else {
                // Use primary source
                setActiveSrc(src);
            }
        }, [autoPlay, connectionSpeed, qualitySources, src]);

        // Theme class helper
        const getThemeClass = useMemo(() => {
            return theme === 'default' ? '' : `video-player-theme-${theme}`;
        }, [theme]);

        // Initialize active source on mount and when dependencies change
        useEffect(() => {
            getActiveSources();
        }, [getActiveSources, src, qualitySources, connectionSpeed]);

        // Prepare the error action object for ErrorMessage component
        const errorActionProps = useMemo(() => {
            if (errorAction) {
                return errorAction;
            }
            return {
                label: 'Retry',
                onClick: handleRetry
            };
        }, [errorAction, handleRetry]);

        // Handle iframe errors
        const handleIframeError = useCallback((e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
            // Convert synthetic event to standard event for the error handler
            const errorEvent = new ErrorEvent('error', {
                message: 'Failed to load external video',
                error: new Error('Iframe loading error')
            });

            handleError(errorEvent);
        }, [handleError]);

        if (isExternalVideo) {
            // Render iframe for external videos
            return (
                <div
                    ref={containerRef}
                    className={`video-player-container ${className} ${getThemeClass}`}
                    style={{ aspectRatio }}
                >
                    {loading && <Loading />}
                    {error && (
                        <ErrorMessage
                            message={error.message}
                            action={errorActionProps}
                        />
                    )}
                    {activeSrc && (
                        <iframe
                            src={activeSrc}
                            className="video-player-iframe"
                            title={ariaLabel}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setLoading(false)}
                            onError={handleIframeError}
                        ></iframe>
                    )}
                </div>
            );
        }

        // Render native video player
        return (
            <div
                ref={containerRef}
                className={`video-player-container ${className} ${getThemeClass}`}
                style={{ aspectRatio }}
            >
                {/* Video element */}
                <video
                    ref={ref || videoRef}
                    className="video-player"
                    poster={poster}
                    loop={loop}
                    muted={muted}
                    playsInline
                    aria-label={ariaLabel}
                >
                    {activeSrc && <source src={activeSrc} type={getVideoTypeFromUrl(activeSrc)} />}

                    {/* Fallback sources */}
                    {fallbackSrc && typeof fallbackSrc === 'string' && (
                        <source src={fallbackSrc} type={getVideoTypeFromUrl(fallbackSrc)} />
                    )}

                    {fallbackSrc && Array.isArray(fallbackSrc) && fallbackSrc.map((source, index) => (
                        <source
                            key={index}
                            src={typeof source === 'string' ? source : source.src}
                            type={typeof source === 'string' ? getVideoTypeFromUrl(source) : source.type}
                        />
                    ))}

                    Your browser does not support the video tag.
                </video>

                {/* Loading indicator */}
                {loading && <Loading />}

                {/* Error state */}
                {error && (
                    <ErrorMessage
                        message={error.message}
                        action={errorActionProps}
                    />
                )}

                {/* Video controls */}
                {controls && !loading && !error && (
                    <div className="video-player-controls">
                        {/* Play/pause button */}
                        <button
                            className="video-player-play-button"
                            onClick={handlePlayPause}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause /> : <Play />}
                        </button>

                        {/* Progress bar */}
                        <div className="video-player-progress">
                            <progress
                                value={currentTime}
                                max={duration || 100}
                                onClick={(e) => {
                                    if (!video) return;

                                    const progressRect = e.currentTarget.getBoundingClientRect();
                                    const clickPosition = (e.clientX - progressRect.left) / progressRect.width;
                                    video.currentTime = clickPosition * duration;
                                }}
                            />

                            {/* Time display */}
                            <div className="video-player-time">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer; 