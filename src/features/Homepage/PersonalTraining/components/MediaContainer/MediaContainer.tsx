import { AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import logger from '../../../../../utils/logger';
import VideoPlayer, { VideoSource } from '../VideoPlayer/VideoPlayer';
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

    /**
     * Theme for the video player
     * @default 'default'
     */
    theme?: 'default' | 'gym' | 'sports' | 'wellness';

    /**
     * Whether to prioritize WordPress data
     * @default true
     */
    useWordPressData?: boolean;
}

/**
 * MediaContainer component for consistent display of images and videos in PersonalTraining section
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
  children,
  theme = 'default',
  useWordPressData = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState(src);
  const [resolvedPoster, setResolvedPoster] = useState(poster);
  const [resolvedAlt, setResolvedAlt] = useState(alt);

  // Load and prioritize WordPress data if available
  useEffect(() => {
    if (type === 'video' && useWordPressData) {
      logger.debug('MediaContainer: Checking for WordPress video data...');

      // First try to get data from fitcopilotVideoData
      let videoData = window.fitcopilotVideoData?.personalTraining?.featuredTrainer;
      logger.debug('MediaContainer: Checking fitcopilotVideoData:', videoData);

      // If not found, try athleteDashboardData
      if (!videoData && window.athleteDashboardData?.wpData?.videoData) {
        videoData = window.athleteDashboardData.wpData.videoData.personalTraining?.featuredTrainer;
        logger.debug('MediaContainer: Found video data in athleteDashboardData:', videoData);
      }

      if (videoData) {
        const { url, image, title } = videoData;

        if (url && url.trim() !== '') {
          logger.debug('MediaContainer: Using WordPress video URL:', url);
          setResolvedSrc(url);
        } else {
          logger.debug('MediaContainer: WordPress video URL is empty, using fallback:', src);
        }

        if (image && image.trim() !== '') {
          logger.debug('MediaContainer: Using WordPress poster image:', image);
          setResolvedPoster(image);
        } else if (poster) {
          logger.debug('MediaContainer: WordPress image is empty, using provided poster:', poster);
        }

        if (title && title.trim() !== '') {
          logger.debug('MediaContainer: Using WordPress video title for alt text:', title);
          setResolvedAlt(title);
        } else if (alt) {
          logger.debug('MediaContainer: WordPress title is empty, using provided alt text:', alt);
        }
      } else {
        logger.debug('MediaContainer: No WordPress video data found, using fallback values');
        logger.debug('MediaContainer: Fallback video URL:', src);
        logger.debug('MediaContainer: Fallback poster:', poster);
        logger.debug('MediaContainer: Fallback alt text:', alt);

        // Log the complete athleteDashboardData object for debugging
        if (window.athleteDashboardData) {
          logger.debug('MediaContainer: athleteDashboardData:', window.athleteDashboardData);
        }
      }
    }
  }, [src, poster, alt, type, useWordPressData]);

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
          src={resolvedSrc}
          poster={resolvedPoster}
          fallbackSrc={fallbackSrc}
          controls={controls}
          loop={loop}
          muted={muted}
          autoPlay={autoPlay}
          autoPlayOnScroll={autoPlayOnScroll}
          ariaLabel={resolvedAlt}
          aspectRatio={aspectRatio}
          className="media-content"
          theme={theme}
        />
      ) : (
        <img
          src={resolvedSrc}
          alt={resolvedAlt}
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