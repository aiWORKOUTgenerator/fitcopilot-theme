import React, { useEffect, useRef, useState } from 'react';
import logger from '../../../utils/logger';
import './styles/YouTubePlayer.scss';
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
    startTime = 0,
    _alt,
    caption,
    onLoad,
    onError,
    ...rest
}) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [player, setPlayer] = useState<YT.Player | null>(null);

    // Load YouTube API Script
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

            // Create YouTube API callback
            window.onYouTubeIframeAPIReady = initializePlayer;

            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        } else {
            // API already loaded
            initializePlayer();
        }

        function initializePlayer() {
            if (!playerRef.current) return;

            try {
                const ytPlayer = new window.YT.Player(playerRef.current, {
                    videoId,
                    width: width.toString(),
                    height: height.toString(),
                    playerVars: {
                        autoplay: autoPlay ? 1 : 0,
                        mute: muted ? 1 : 0,
                        start: startTime,
                        playsinline: 1,
                        modestbranding: 1,
                        rel: showRelated ? 1 : 0
                    },
                    events: {
                        onReady: handleReady,
                        onError: handleError,
                        onStateChange: handleStateChange
                    }
                });

                setPlayer(ytPlayer);
            } catch (error) {
                logger.error('YouTube Player Initialization Error', { error, videoId });
                setHasError(true);
                setIsLoading(false);
                onError?.();
            }
        }

        return () => {
            // Cleanup
            if (player) {
                player.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    const handleReady = () => {
        setIsLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        logger.error('YouTube Player Error', { videoId });
        setHasError(true);
        setIsLoading(false);
        onError?.();
    };

    const handleStateChange = (event: YT.OnStateChangeEvent) => {
        // Handle state changes if needed
        if (event.data === window.YT.PlayerState.ENDED) {
            // Video ended
        }
    };

    return (
        <div
            className={`youtube-player__container ${className}`}
            style={{ width: `${width}px`, height: `${height}px` }}
            data-autoplay={autoPlay.toString()}
            data-muted={muted.toString()}
            {...rest}
        >
            {/* YouTube Player Container */}
            <div ref={playerRef} className="youtube-player__element">
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