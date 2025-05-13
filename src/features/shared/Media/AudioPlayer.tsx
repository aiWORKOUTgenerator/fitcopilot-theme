import { AlertCircle, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import logger from '../../../utils/logger';
import { AudioMediaProps } from './types';

const AudioPlayer = forwardRef<HTMLAudioElement, AudioMediaProps>(({
    src,
    autoPlay = false,
    loop = false,
    controls = true,
    className = '',
    onLoad,
    ariaLabel = 'Audio content',
    _showWaveform = true,
    showArtwork = true,
    artworkSrc,
    _onPlay,
    _onPause,
    _onEnded,
    _onError,
    _onTimeUpdate,
    _onDurationChange,
    _onVolumeChange,
    ...divProps
}, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const progressRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const internalAudioRef = useRef<HTMLAudioElement>(null);

    // Use passed ref or internal ref
    const audioRef = (ref as React.RefObject<HTMLAudioElement>) || internalAudioRef;

    // Format time as MM:SS
    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Handle play/pause toggle
    const handlePlayPause = (): void => {
        if (!audioRef.current || hasError) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => {
                logger.error("Audio playback failed:", error);
                setHasError(true);
            });
        }
    };

    // Handle volume toggle
    const handleVolumeToggle = (): void => {
        if (!audioRef.current) return;
        const newMuted = !isMuted;
        audioRef.current.muted = newMuted;
        setIsMuted(newMuted);
    };

    // Handle volume change
    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!audioRef.current || !volumeRef.current) return;

        const rect = volumeRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newVolume = Math.max(0, Math.min(1, pos));

        audioRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    // Handle progress bar click
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!audioRef.current || !progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pos * audioRef.current.duration;
    };

    // Handle retry
    const handleRetry = (): void => {
        if (!audioRef.current) return;
        setHasError(false);
        setIsLoading(true);
        audioRef.current.load();
        audioRef.current.play().catch(error => {
            logger.error("Audio playback failed:", error);
            setHasError(true);
        });
    };

    // Update play state when audio state changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = (): void => setIsPlaying(true);
        const handlePause = (): void => setIsPlaying(false);
        const handleTimeUpdate = (): void => setCurrentTime(audio.currentTime);
        const handleDurationChange = (): void => setDuration(audio.duration);
        const handleVolumeChange = (): void => {
            setVolume(audio.volume);
            setIsMuted(audio.muted);
        };
        const handleLoadedData = (): void => {
            setIsLoading(false);
            setHasError(false);
            onLoad?.();
        };
        const handleError = (e: Event): void => {
            logger.error("Audio error:", e);
            setHasError(true);
            setIsLoading(false);
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('volumechange', handleVolumeChange);
        audio.addEventListener('loadeddata', handleLoadedData);
        audio.addEventListener('error', handleError);

        // Auto play if specified
        if (autoPlay && !hasError) {
            audio.play().catch(e => {
                logger.error("Audio autoplay failed:", e);
                setHasError(true);
            });
        }

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('volumechange', handleVolumeChange);
            audio.removeEventListener('loadeddata', handleLoadedData);
            audio.removeEventListener('error', handleError);
        };
    }, [audioRef, autoPlay, hasError, onLoad]);

    // Update progress bar width
    useEffect(() => {
        if (progressRef.current && duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressRef.current.style.width = `${progress}%`;
        }
    }, [currentTime, duration]);

    return (
        <div
            className={`audio-player ${className}`}
            data-testid="audio-player"
            {...divProps}
        >
            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={src}
                loop={loop}
                preload="metadata"
                aria-label={ariaLabel}
                controls={false} // We use custom controls
                className="audio-player__element"
            >
                Your browser does not support HTML5 audio.
            </audio>

            {/* Artwork */}
            {showArtwork && artworkSrc && (
                <div className="audio-player__artwork">
                    <img src={artworkSrc} alt="" className="audio-player__artwork-image" />
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="audio-player__loading">
                    <svg className="audio-player__spinner" viewBox="0 0 50 50">
                        <circle
                            className="audio-player__spinner-path"
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
                <div className="audio-player__error">
                    <AlertCircle className="audio-player__error-icon" />
                    <p className="audio-player__error-text">
                        There was an error playing this audio.
                    </p>
                    <button
                        type="button"
                        className="audio-player__error-retry"
                        onClick={handleRetry}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Custom Controls */}
            {controls && !hasError && (
                <div className="audio-player__controls">
                    {/* Play/Pause Button */}
                    <button
                        type="button"
                        className="audio-player__play-button"
                        onClick={handlePlayPause}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        disabled={isLoading}
                    >
                        {isPlaying ? (
                            <Pause className="audio-player__icon" />
                        ) : (
                            <Play className="audio-player__icon" />
                        )}
                    </button>

                    {/* Progress Bar */}
                    <div className="audio-player__progress-container">
                        <div
                            ref={progressRef}
                            className="audio-player__progress-bar"
                            onClick={handleProgressClick}
                            role="slider"
                            aria-label="Audio progress"
                            aria-valuemin={0}
                            aria-valuemax={duration}
                            aria-valuenow={currentTime}
                            tabIndex={0}
                        >
                            <div className="audio-player__progress" />
                        </div>
                        <div className="audio-player__time">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    {/* Volume Control */}
                    <div className="audio-player__volume-container">
                        <button
                            type="button"
                            className="audio-player__volume-button"
                            onClick={handleVolumeToggle}
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? (
                                <VolumeX className="audio-player__icon" />
                            ) : (
                                <Volume2 className="audio-player__icon" />
                            )}
                        </button>
                        <div
                            ref={volumeRef}
                            className="audio-player__volume-bar"
                            onClick={handleVolumeChange}
                            role="slider"
                            aria-label="Volume"
                            aria-valuemin={0}
                            aria-valuemax={1}
                            aria-valuenow={volume}
                            tabIndex={0}
                        >
                            <div
                                className="audio-player__volume-level"
                                style={{ width: `${volume * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer; 