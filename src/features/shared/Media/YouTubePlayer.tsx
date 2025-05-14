import React, { useEffect, useRef, useState } from 'react';
import logger from '../../../utils/logger';
import { YouTubeMediaProps } from './types';

/**
 * A component for embedding YouTube videos with enhanced functionality
 */
const YouTubePlayer: React.FC<YouTubeMediaProps> = ({
    videoId,
    width = 640,
    height = 360,
    autoPlay = false,
    muted = false,
    showRelated = false,
    className = '',
    alt,
    caption,
    ...rest
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [ytApiReady, setYtApiReady] = useState(typeof window !== 'undefined' && window.YT !== undefined);

    // Load YouTube API Script
    useEffect(() => {
        if (ytApiReady) return;

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Define callback for when YouTube API is ready
        window.onYouTubeIframeAPIReady = () => {
            setYtApiReady(true);
        };

        return () => {
            // Cleanup global callback
            window.onYouTubeIframeAPIReady = null;
        };
    }, [ytApiReady]);

    // Initialize YouTube player
    useEffect(() => {
        if (!ytApiReady || !containerRef.current) return;

        try {
            playerRef.current = new window.YT.Player(containerRef.current, {
                width,
                height,
                videoId,
                playerVars: {
                    autoplay: autoPlay ? 1 : 0,
                    mute: muted ? 1 : 0,
                    rel: showRelated ? 1 : 0,
                    modestbranding: 1,
                    playsinline: 1,
                },
                events: {
                    onReady: () => {
                        setIsLoading(false);
                    },
                    onError: () => {
                        logger.error('YouTube Player Error', { videoId });
                        setHasError(true);
                        setIsLoading(false);
                    },
                },
            });
        } catch (error) {
            logger.error('YouTube Player Initialization Error', { error, videoId });
            setHasError(true);
            setIsLoading(false);
        }

        return () => {
            // Cleanup player
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (error) {
                    logger.error('YouTube Player Destroy Error', { error });
                }
            }
        };
    }, [ytApiReady, videoId, width, height, autoPlay, muted, showRelated]);

    return (
        <div
            className={`youtube-player__container ${className}`}
            style={{ width: `${width}px`, height: `${height}px` }}
            data-autoplay={autoPlay.toString()}
            data-muted={muted.toString()}
            {...rest}
        >
            {/* YouTube Player Container */}
            <div ref={containerRef} className="youtube-player__element">
                {/* This div will be replaced by the YT player */}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="youtube-player__loading">
                    <div className="youtube-player__spinner"></div>
                </div>
            )}

            {/* Error State */}
            {hasError && (
                <div className="youtube-player__error">
                    <p className="youtube-player__error-text">
                        Error loading YouTube video. Please try again later.
                    </p>
                    <button
                        className="youtube-player__retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Caption */}
            {caption && (
                <div className="youtube-player__caption">
                    {caption}
                </div>
            )}
        </div>
    );
};

export default YouTubePlayer; 