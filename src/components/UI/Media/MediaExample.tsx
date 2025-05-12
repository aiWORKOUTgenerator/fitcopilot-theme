import React, { useEffect, useRef } from 'react';
import { useMediaPlayer } from '../../../hooks';
import { MediaPlayer } from './index';
import './MediaExample.scss';

/**
 * MediaExample component demonstrates how to use the MediaPlayer component
 * with different variants and configuration options.
 * 
 * This is a demonstration component that shows proper usage of the
 * discriminated union pattern for type safety.
 */
const MediaExample: React.FC = () => {
    return (
        <div className="media-examples">
            <h2>Media Player Examples</h2>

            <section className="example">
                <h3>Video Player Example</h3>
                <p>Using discriminated union with _variant: 'video'</p>
                <MediaPlayer
                    _variant="video"
                    sources={[
                        {
                            src: "https://example.com/video.mp4",
                            type: "video/mp4",
                            isDefault: true
                        },
                        {
                            src: "https://example.com/video.webm",
                            type: "video/webm"
                        }
                    ]}
                    poster="https://example.com/poster.jpg"
                    aspectRatio="16:9"
                    controls={true}
                    muted={true}
                    autoPlay={false}
                    loop={true}
                    allowPictureInPicture={true}
                    allowFullscreen={true}
                    ariaLabel="Example workout video"
                />
            </section>

            <section className="example">
                <h3>Audio Player Example</h3>
                <p>Using discriminated union with _variant: 'audio'</p>
                <MediaPlayer
                    _variant="audio"
                    sources={[
                        {
                            src: "https://example.com/audio.mp3",
                            type: "audio/mpeg",
                            isDefault: true
                        },
                        {
                            src: "https://example.com/audio.ogg",
                            type: "audio/ogg"
                        }
                    ]}
                    showWaveform={true}
                    showArtwork={true}
                    artworkSrc="https://example.com/album-art.jpg"
                    title="Workout Motivation Mix"
                    artist="FitCopilot"
                    controls={true}
                    loop={false}
                    allowDownload={true}
                    downloadFilename="workout-mix.mp3"
                    ariaLabel="Example workout audio"
                />
            </section>

            {/* Legacy API usage example */}
            <section className="example">
                <h3>Legacy Video Player Example</h3>
                <p>Using the legacy API for backward compatibility</p>
                <MediaPlayer
                    _variant="video"
                    sources={[
                        {
                            src: "https://example.com/legacy-video.mp4",
                            type: "video/mp4"
                        }
                    ]}
                    aspectRatio="4:3"
                    controls={true}
                    ariaLabel="Legacy video example"
                />
            </section>

            {/* Video with custom hook example */}
            <section className="example">
                <h3>Video with useMediaPlayer Hook</h3>
                <p>Example of using the useMediaPlayer hook for advanced control</p>
                <CustomVideoPlayerWithHook />
            </section>
        </div>
    );
};

/**
 * Example component demonstrating how to use the useMediaPlayer hook
 * with the VideoPlayer component for advanced control.
 */
const CustomVideoPlayerWithHook: React.FC = () => {
    // Use the MediaPlayer hook for advanced control
    const { state, controls } = useMediaPlayer({
        initialPlaybackRate: 1,
        initialVolume: 0.8,
        autoPlay: false,
        playWhenVisible: true,
        onEnded: () => console.log('Video ended'),
        onPlay: () => console.log('Video playing'),
        onPause: () => console.log('Video paused'),
        onError: (error) => console.error('Video error:', error)
    });

    // Create a ref for the video element
    const videoRef = useRef<HTMLVideoElement>(null);

    // Initialize the media element when the component mounts
    useEffect(() => {
        if (videoRef.current) {
            controls.initMediaElement(videoRef.current);
        }
    }, [controls]);

    return (
        <div className="custom-player">
            <MediaPlayer
                _variant="video"
                sources={[
                    {
                        src: "https://example.com/custom-video.mp4",
                        type: "video/mp4"
                    }
                ]}
                aspectRatio="16:9"
                controls={false} // We'll handle controls ourselves
                ariaLabel="Custom controlled video"
                ref={videoRef} // Pass the ref to the video element
            />

            {/* Custom controls example */}
            <div className="custom-controls">
                <div className="playback-info">
                    <span>Current time: {Math.floor(state.currentTime)}s</span>
                    <span>Duration: {Math.floor(state.duration)}s</span>
                    <span>Playback rate: {state.playbackRate}x</span>
                </div>

                <div className="control-buttons">
                    <button onClick={() => controls.togglePlay()}>
                        {state.isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button onClick={() => controls.skipBackward(5)}>-5s</button>
                    <button onClick={() => controls.skipForward(5)}>+5s</button>
                    <button onClick={() => controls.toggleMute()}>
                        {state.isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>

                <div className="playback-controls">
                    <label>
                        Speed:
                        <select
                            value={state.playbackRate}
                            onChange={(e) => controls.setPlaybackRate(Number(e.target.value))}
                        >
                            <option value="0.5">0.5x</option>
                            <option value="1">1x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                        </select>
                    </label>

                    <label>
                        Volume:
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={state.volume}
                            onChange={(e) => controls.setVolume(Number(e.target.value))}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default MediaExample; 