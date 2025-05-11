import { Pause, Play } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { ErrorMessage, Loading } from '../../../../../components/UI';
import logger from '../../../../../utils/logger';
import './VideoPlayer.scss';

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
        handler: () => void;
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
        const [isPlaying, setIsPlaying] = useState(false);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration, setDuration] = useState(0);
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);
        const [errorDetails, setErrorDetails] = useState<string | undefined>(undefined);
        const [sources, setSources] = useState<VideoSource[]>([]);
        const [selectedQuality, setSelectedQuality] = useState<string | undefined>(undefined);
        const [isInView, setIsInView] = useState(false);
        const [connectionSpeed, setConnectionSpeed] = useState<'low' | 'medium' | 'high'>('medium');
        const progressRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const internalVideoRef = useRef<HTMLVideoElement>(null);

        // Check if source is from streaming service
        const isStreaming = isStreamingServiceUrl(src);

        // Get appropriate embed URL for streaming services
        const streamingUrl = isStreaming && src.includes('youtube') ? getYouTubeEmbedUrl(src, autoPlay) : src;

        // Use passed ref or internal ref
        const videoRef = (ref as React.RefObject<HTMLVideoElement>) || internalVideoRef;

        // Detect connection speed for quality selection
        useEffect(() => {
            // Skip detection if streaming or connection preference is explicitly set
            if (isStreaming || connectionPreference !== 'auto') {
                if (connectionPreference !== 'auto') {
                    setConnectionSpeed(connectionPreference);
                }
                return;
            }

            const checkConnectionSpeed = async () => {
                try {
                    const startTime = Date.now();
                    const response = await fetch('/connectivity-test.json', {
                        method: 'GET',
                        cache: 'no-cache'
                    });
                    if (!response.ok) throw new Error('Network response was not ok');
                    await response.json();
                    const endTime = Date.now();
                    const duration = endTime - startTime;

                    // Determine connection speed based on response time
                    if (duration < 100) {
                        setConnectionSpeed('high');
                    } else if (duration < 500) {
                        setConnectionSpeed('medium');
                    } else {
                        setConnectionSpeed('low');
                    }
                } catch (error) {
                    logger.warn('Connection speed test failed:', error);
                    setConnectionSpeed('medium'); // Default to medium on error
                }
            };

            // Run the speed test
            checkConnectionSpeed();
        }, [isStreaming, connectionPreference]);

        // Process sources and select appropriate quality
        useEffect(() => {
            if (isStreaming) return;

            let allSources: VideoSource[] = [];
            let quality: string | undefined = undefined;

            // Process quality sources if provided
            if (qualitySources && qualitySources.length > 0) {
                allSources = [...qualitySources];

                // Select appropriate quality based on connection speed
                const isMobile = window.innerWidth < 768;

                if (isMobile) {
                    // Prefer mobile-optimized source if available
                    const mobileSource = qualitySources.find(s => s.mobileOptimized);
                    if (mobileSource) {
                        quality = mobileSource.quality;
                    } else {
                        // Otherwise select based on connection
                        switch (connectionSpeed) {
                            case 'low':
                                quality = qualitySources
                                    .sort((a, b) => (a.size || 0) - (b.size || 0))[0]?.quality;
                                break;
                            case 'medium':
                                // Middle quality
                                quality = qualitySources[Math.floor(qualitySources.length / 2)]?.quality;
                                break;
                            case 'high':
                                quality = qualitySources
                                    .sort((a, b) => (b.size || 0) - (a.size || 0))[0]?.quality;
                                break;
                        }
                    }
                } else {
                    // Desktop - select based on connection
                    // Define midIndex outside the switch to avoid lexical declaration issues
                    let midIndex = 0;

                    switch (connectionSpeed) {
                        case 'low':
                            quality = qualitySources
                                .sort((a, b) => (a.size || 0) - (b.size || 0))[0]?.quality;
                            break;
                        case 'medium':
                            // Middle quality or slightly higher
                            midIndex = Math.min(
                                Math.floor(qualitySources.length / 2) + 1,
                                qualitySources.length - 1
                            );
                            quality = qualitySources[midIndex]?.quality;
                            break;
                        case 'high':
                            quality = qualitySources
                                .sort((a, b) => (b.size || 0) - (a.size || 0))[0]?.quality;
                            break;
                    }
                }

                setSelectedQuality(quality);
            } else {
                // Add primary source
                allSources.push({
                    src: src,
                    type: getVideoTypeFromUrl(src)
                });

                // Add fallback sources
                if (fallbackSrc) {
                    if (typeof fallbackSrc === 'string') {
                        allSources.push({
                            src: fallbackSrc,
                            type: getVideoTypeFromUrl(fallbackSrc)
                        });
                    } else if (Array.isArray(fallbackSrc)) {
                        allSources.push(...fallbackSrc);
                    }
                }
            }

            setSources(allSources);
        }, [src, fallbackSrc, qualitySources, isStreaming, connectionSpeed]);

        // Set up Intersection Observer for autoplay on scroll
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
        }, [autoPlayOnScroll, isStreaming]);

        // Handle autoplay on scroll
        useEffect(() => {
            if (!autoPlayOnScroll || !videoRef.current || hasError || isStreaming) return;

            if (isInView) {
                videoRef.current.currentTime = 0; // Always start from the beginning
                videoRef.current.play().catch(e => {
                    logger.error("Video autoplay failed:", e);
                });
            } else if (videoRef.current.played.length > 0) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Reset to first frame when out of view
            }
        }, [isInView, autoPlayOnScroll, hasError, isStreaming, videoRef]);

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

        // Handle retry after error
        const handleRetry = () => {
            setHasError(false);
            setIsLoading(true);

            if (videoRef.current) {
                videoRef.current.load();

                // Try playing again
                setTimeout(() => {
                    if (videoRef.current) {
                        videoRef.current.play().catch(error => {
                            logger.error("Video retry failed:", error);
                            setHasError(true);
                            setIsLoading(false);
                        });
                    }
                }, 1000);
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

                if (onError) {
                    onError(e);
                }
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
        }, [autoPlay, hasError, isPlaying, autoPlayOnScroll, isStreaming, onError, videoRef]);

        // Update progress bar width based on current time
        useEffect(() => {
            if (progressRef.current && duration > 0 && !isStreaming) {
                const progressPercentage = (currentTime / duration) * 100;
                progressRef.current.style.width = `${progressPercentage}%`;
            }
        }, [currentTime, duration, isStreaming]);

        // Filter sources based on selected quality
        const getActiveSources = () => {
            if (!selectedQuality || !qualitySources) {
                return sources;
            }

            // Place the selected quality source first, followed by other sources as fallbacks
            return [
                ...sources.filter(s => s.quality === selectedQuality),
                ...sources.filter(s => s.quality !== selectedQuality)
            ];
        };

        // Get dynamic styles based on theme
        const getThemeClass = () => {
            switch (theme) {
                case 'gym':
                    return 'theme-gym';
                case 'sports':
                    return 'theme-sports';
                case 'wellness':
                    return 'theme-wellness';
                default:
                    return '';
            }
        };

        return (
            <div
                className={`video-container ${className} ${isInView && isPlaying && autoPlayOnScroll ? 'autoplaying' : ''} ${isStreaming ? 'streaming-video' : ''} ${getThemeClass()}`}
                ref={containerRef}
                style={{ aspectRatio }}
            >
                {/* Streaming video (iframe) */}
                {isStreaming ? (
                    <div className="video-wrapper">
                        <iframe
                            src={streamingUrl}
                            title={ariaLabel}
                            frameBorder="0"
                            className="streaming-frame"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <>
                        {/* Local video with sources */}
                        <div className="video-wrapper" style={{ paddingBottom: aspectRatio === '16/9' ? '56.25%' : aspectRatio === '4/3' ? '75%' : aspectRatio === '1/1' ? '100%' : '56.25%' }}>
                            <video
                                ref={videoRef}
                                poster={poster}
                                loop={loop}
                                muted={muted}
                                playsInline
                                preload="metadata"
                                onClick={controls ? handlePlayPause : undefined}
                                aria-label={ariaLabel}
                            >
                                {/* Render active sources */}
                                {getActiveSources().map((source, index) => (
                                    <source key={index} src={source.src} type={source.type} />
                                ))}
                                {/* Fallback text for browsers that don't support video */}
                                Your browser does not support HTML video playback.
                            </video>

                            {/* Loading indicator */}
                            {isLoading && !hasError && (
                                <div className="video-overlay loading-state">
                                    <Loading
                                        size="medium"
                                        variant="accent"
                                        label="Loading video"
                                    />
                                </div>
                            )}

                            {/* Error indicator */}
                            {hasError && (
                                <div className="video-overlay error-state">
                                    <ErrorMessage
                                        message="Unable to load video"
                                        details={errorDetails}
                                        action={
                                            errorAction ? {
                                                label: errorAction.label,
                                                onClick: errorAction.handler
                                            } : {
                                                label: "Try Again",
                                                onClick: handleRetry
                                            }
                                        }
                                        className="video-error-message"
                                    />
                                </div>
                            )}

                            {/* Play/pause overlay */}
                            {controls && !hasError && (
                                <div
                                    className={`video-overlay controls-overlay transition-opacity duration-300
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

                        {/* Video progress bar (only for local videos) */}
                        {!hasError && (
                            <div className="video-controls-container mt-3">
                                <div className="video-progress">
                                    <div ref={progressRef} className="video-progress-bar"></div>
                                </div>

                                {/* Time display */}
                                <div className="time-display">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>

                                {/* Quality indicator - shows when multiple qualities are available */}
                                {selectedQuality && (
                                    <div className="quality-indicator">
                                        <span className="quality-label">{selectedQuality}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer; 