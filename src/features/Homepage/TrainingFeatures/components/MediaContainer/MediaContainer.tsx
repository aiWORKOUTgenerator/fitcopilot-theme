import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import VideoPlayer from '../VideoPlayer';
import { VideoSource } from '../VideoPlayer/VideoPlayer';
import './MediaContainer.scss';

/**
 * Props for the MediaContainer component
 * 
 * @interface MediaContainerProps
 */
export interface MediaContainerProps {
    /**
     * Media source URL
     * @required
     */
    src: string;

    /**
     * Type of media ('image' or 'video')
     * @default 'image'
     */
    type?: 'image' | 'video';

    /**
     * Aspect ratio of the media container (CSS aspect-ratio format)
     * @default '16/9'
     */
    aspectRatio?: string;

    /**
     * Fallback color to show when loading or on error
     * @default 'var(--color-gray-800)'
     */
    fallbackColor?: string;

    /**
     * Alt text for image or aria-label for video
     * @default ''
     */
    alt?: string;

    /**
     * Optional poster image for video
     */
    poster?: string;

    /**
     * Optional fallback sources for video
     */
    fallbackSrc?: string | VideoSource[];

    /**
     * Whether to show controls for video
     * @default true
     */
    controls?: boolean;

    /**
     * Whether to loop the video
     * @default true
     */
    loop?: boolean;

    /**
     * Whether to mute the video
     * @default true
     */
    muted?: boolean;

    /**
     * Whether to autoplay the video
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
     * Optional children to render inside the container (e.g., overlay text)
     */
    children?: React.ReactNode;
}

/**
 * MediaContainer component for consistent display of images and videos
 * 
 * @component
 * @example
 * // Basic image usage
 * <MediaContainer 
 *   src="/path/to/image.jpg" 
 *   type="image" 
 *   alt="Description of image" 
 * />
 * 
 * @example
 * // Basic video usage
 * <MediaContainer 
 *   src="/path/to/video.mp4" 
 *   type="video" 
 *   alt="Description of video"
 * />
 * 
 * @example
 * // With overlay content
 * <MediaContainer src="/path/to/image.jpg">
 *   <div className="overlay-content">Text on top of media</div>
 * </MediaContainer>
 */
const MediaContainer: React.FC<MediaContainerProps> = ({
    src,
    type = 'image',
    aspectRatio = '16/9',
    fallbackColor = 'var(--color-gray-800)',
    alt = '',
    poster,
    fallbackSrc,
    controls = true,
    loop = true,
    muted = true,
    autoPlay = false,
    autoPlayOnScroll = true,
    className = '',
    children
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Handle media load event
    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    // Handle media error event
    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div
            className={`media-container ${className}`}
            style={{
                aspectRatio: aspectRatio,
                backgroundColor: fallbackColor
            }}
        >
            {/* Media Content */}
            {type === 'video' ? (
                <VideoPlayer
                    src={src}
                    poster={poster}
                    fallbackSrc={fallbackSrc}
                    controls={controls}
                    loop={loop}
                    muted={muted}
                    autoPlay={autoPlay}
                    autoPlayOnScroll={autoPlayOnScroll}
                    ariaLabel={alt}
                    className="media-content"
                />
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className="media-content"
                    loading="lazy"
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}

            {/* Loading State */}
            {isLoading && type === 'image' && (
                <div className="media-loading-state">
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

            {/* Error State */}
            {hasError && type === 'image' && (
                <div className="media-error-state">
                    <AlertCircle size={24} />
                    <span>Unable to load media</span>
                </div>
            )}

            {/* Optional Overlay Content */}
            {children && <div className="media-overlay-content">{children}</div>}
        </div>
    );
};

export default MediaContainer; 