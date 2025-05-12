import { AlertCircle, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
    AudioPlayerProps,
    MediaSource
} from '../../../types/media';
import logger from '../../../utils/logger';
import './AudioPlayer.scss';

/**
 * AudioPlayer component for playing audio content with custom controls
 * 
 * Features:
 * - Multiple audio source support with fallbacks
 * - Custom play/pause and volume controls
 * - Progress bar with time display
 * - Loading state with spinner
 * - Error handling with user feedback
 * - Optional track information display
 * - Accessibility support
 * 
 * @component
 */
const AudioPlayer = forwardRef<HTMLAudioElement, AudioPlayerProps>(
    (props, ref) => {
        const {
            sources,
            tracks = [],
            autoPlay = false,
            loop = false,
            muted = false,
            controls = true,
            preload = 'metadata',
            showWaveform = false,
            showArtwork = false,
            artworkSrc,
            title,
            artist,
            className = '',
            ariaLabel = 'Audio content',
            allowDownload = false,
            downloadFilename,
            visualizationColor = '#4f46e5',
            // Destructure additional props
            ...restProps
        } = props;

        const [isPlaying, setIsPlaying] = useState(false);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration, setDuration] = useState(0);
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);
        const [isMuted, setIsMuted] = useState(muted);
        const [volume, setVolume] = useState(1);
        const progressRef = useRef<HTMLDivElement>(null);
        const internalAudioRef = useRef<HTMLAudioElement>(null);
        const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

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
        const handleToggleMute = (): void => {
            if (!audioRef.current) return;

            const newMutedState = !isMuted;
            setIsMuted(newMutedState);

            if (audioRef.current) {
                audioRef.current.muted = newMutedState;
            }
        };

        // Handle volume change
        const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);

            if (audioRef.current) {
                audioRef.current.volume = newVolume;

                // If volume is set to 0, mute the audio. Otherwise, unmute it.
                if (newVolume === 0 && !isMuted) {
                    setIsMuted(true);
                    audioRef.current.muted = true;
                } else if (newVolume > 0 && isMuted) {
                    setIsMuted(false);
                    audioRef.current.muted = false;
                }
            }
        };

        // Handle seek when clicking on progress bar
        const handleSeek = (e: React.MouseEvent<HTMLDivElement>): void => {
            if (!audioRef.current || duration === 0) return;

            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            const newTime = clickPosition * duration;

            if (audioRef.current) {
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        };

        // Update audio state listeners
        useEffect(() => {
            const audio = audioRef.current;
            if (!audio) return;

            const handlePlay = (): void => setIsPlaying(true);
            const handlePause = (): void => setIsPlaying(false);
            const handleTimeUpdate = (): void => setCurrentTime(audio.currentTime);
            const handleDurationChange = (): void => setDuration(audio.duration);
            const handleLoadedData = (): void => {
                setIsLoading(false);
                setHasError(false);
            };
            const handleError = (e: Event): void => {
                logger.error("Audio error:", e);
                setHasError(true);
                setIsLoading(false);
            };
            const handleVolumeChangeEvent = (): void => {
                setVolume(audio.volume);
                setIsMuted(audio.muted);
            };

            audio.addEventListener('play', handlePlay);
            audio.addEventListener('pause', handlePause);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('durationchange', handleDurationChange);
            audio.addEventListener('loadeddata', handleLoadedData);
            audio.addEventListener('error', handleError);
            audio.addEventListener('volumechange', handleVolumeChangeEvent);

            // Set initial states
            audio.volume = volume;
            audio.muted = isMuted;

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
                audio.removeEventListener('loadeddata', handleLoadedData);
                audio.removeEventListener('error', handleError);
                audio.removeEventListener('volumechange', handleVolumeChangeEvent);
            };
        }, [audioRef, autoPlay, hasError, isMuted, volume]);

        // Update progress bar width
        useEffect(() => {
            if (progressRef.current && duration > 0) {
                const progress = (currentTime / duration) * 100;
                progressRef.current.style.width = `${progress}%`;
            }
        }, [currentTime, duration]);

        // Draw waveform visualization if enabled
        useEffect(() => {
            if (showWaveform && waveformCanvasRef.current && isPlaying && !hasError) {
                const canvas = waveformCanvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                let animationFrameId: number;

                const drawWaveform = () => {
                    if (!audioRef.current) return;

                    // Create audio context and analyzer
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const analyzer = audioContext.createAnalyser();
                    analyzer.fftSize = 256;

                    // Connect audio element to analyzer
                    const source = audioContext.createMediaElementSource(audioRef.current);
                    source.connect(analyzer);
                    analyzer.connect(audioContext.destination);

                    const bufferLength = analyzer.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    const WIDTH = canvas.width;
                    const HEIGHT = canvas.height;

                    const renderFrame = () => {
                        animationFrameId = requestAnimationFrame(renderFrame);

                        analyzer.getByteFrequencyData(dataArray);

                        ctx.clearRect(0, 0, WIDTH, HEIGHT);
                        ctx.fillStyle = visualizationColor;

                        const barWidth = (WIDTH / bufferLength) * 2.5;
                        let x = 0;

                        for (let i = 0; i < bufferLength; i++) {
                            const barHeight = (dataArray[i] / 255) * HEIGHT;

                            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                            x += barWidth + 1;
                        }
                    };

                    renderFrame();
                };

                drawWaveform();

                return () => {
                    cancelAnimationFrame(animationFrameId);
                };
            }
        }, [showWaveform, isPlaying, hasError, visualizationColor]);

        return (
            <div
                className={`audio-player ${className} ${showArtwork ? 'with-artwork' : ''}`}
                data-testid="audio-player"
                {...restProps}
            >
                {/* Audio Element */}
                <audio
                    ref={audioRef}
                    loop={loop}
                    muted={isMuted}
                    preload={preload}
                    aria-label={ariaLabel}
                    controls={false} // We use custom controls
                    className="audio-player__element"
                >
                    {sources.map((source: MediaSource, index: number) => (
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

                    Your browser does not support HTML5 audio.
                </audio>

                {/* Album Artwork */}
                {showArtwork && artworkSrc && (
                    <div className="audio-player__artwork">
                        <img
                            src={artworkSrc}
                            alt={title ? `Album artwork for ${title}` : 'Album artwork'}
                            className="audio-player__artwork-image"
                        />
                    </div>
                )}

                {/* Track Information */}
                {(title || artist) && (
                    <div className="audio-player__info">
                        {title && <div className="audio-player__title">{title}</div>}
                        {artist && <div className="audio-player__artist">{artist}</div>}
                    </div>
                )}

                {/* Waveform Visualization */}
                {showWaveform && (
                    <div className="audio-player__visualization">
                        <canvas
                            ref={waveformCanvasRef}
                            className="audio-player__waveform"
                            width={300}
                            height={50}
                        />
                    </div>
                )}

                {/* Custom Controls */}
                {controls && (
                    <div className="audio-player__controls">
                        {/* Play/Pause Button */}
                        <button
                            type="button"
                            className="audio-player__play-button"
                            onClick={handlePlayPause}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                            disabled={hasError}
                        >
                            {isPlaying ? (
                                <Pause className="audio-player__icon" />
                            ) : (
                                <Play className="audio-player__icon" />
                            )}
                        </button>

                        {/* Progress Bar */}
                        <div
                            className="audio-player__progress-container"
                            onClick={handleSeek}
                        >
                            <div className="audio-player__progress-bar">
                                <div
                                    ref={progressRef}
                                    className="audio-player__progress"
                                />
                            </div>
                            <div className="audio-player__time">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>

                        {/* Volume Controls */}
                        <div className="audio-player__volume-container">
                            <button
                                type="button"
                                className="audio-player__volume-button"
                                onClick={handleToggleMute}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? (
                                    <VolumeX className="audio-player__icon" />
                                ) : (
                                    <Volume2 className="audio-player__icon" />
                                )}
                            </button>
                            <input
                                type="range"
                                className="audio-player__volume-slider"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                aria-label="Volume"
                            />
                        </div>

                        {/* Download Button */}
                        {allowDownload && sources.length > 0 && (
                            <a
                                href={sources[0].src}
                                download={downloadFilename || true}
                                className="audio-player__download-button"
                                aria-label="Download audio file"
                            >
                                Download
                            </a>
                        )}
                    </div>
                )}

                {/* Loading Indicator */}
                {isLoading && !hasError && (
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
                            Failed to load audio. Please try again later.
                        </p>
                        <button
                            type="button"
                            className="audio-player__error-retry"
                            onClick={() => {
                                setHasError(false);
                                setIsLoading(true);
                                if (audioRef.current) {
                                    audioRef.current.load();
                                    audioRef.current.play().catch(e => {
                                        logger.error("Audio retry failed:", e);
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

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer; 