import React from 'react';
import { ExtendedCSSProperties } from './components';

/**
 * Media source options
 */
export interface MediaSource {
    /** Source URL */
    src: string;
    /** Media type (e.g., 'video/mp4') */
    type?: string;
    /** Quality label (e.g., '720p', 'HD') */
    quality?: string;
    /** File size in bytes for bandwidth consideration */
    size?: number;
    /** Whether this is preferred for mobile devices */
    mobileOptimized?: boolean;
    /** Whether this is the default source */
    isDefault?: boolean;
}

/**
 * Media track options (captions, subtitles)
 */
export interface MediaTrack {
    /** Track URL */
    src: string;
    /** Track kind (subtitles, captions, etc.) */
    kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
    /** Track label */
    label: string;
    /** Track language */
    srcLang: string;
    /** Whether this is the default track */
    default?: boolean;
}

/**
 * Media error information
 */
export interface MediaErrorInfo {
    /** Error code */
    code?: number;
    /** Error message */
    message: string;
    /** Original error object */
    error?: Error;
    /** Additional error details */
    details?: Record<string, unknown>;
}

/**
 * Connection speed types
 */
export type ConnectionSpeed = 'low' | 'medium' | 'high' | 'auto';

/**
 * Theme variants
 */
export type MediaThemeVariant = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

/**
 * Media event handlers with proper typing
 */
export interface MediaEventHandlers {
    /** Called when media can start playing */
    onCanPlay?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when media playback ends */
    onEnded?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when media encounters an error */
    onError?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement, Event>) => void;
    /** Called when metadata is loaded */
    onLoadedMetadata?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when media is paused */
    onPause?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when media starts playing */
    onPlay?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called continuously during playback */
    onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when volume changes */
    onVolumeChange?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when media is seeking */
    onSeeking?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when media has seeked */
    onSeeked?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when media is waiting to buffer */
    onWaiting?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
    /** Called when rate of playback changes */
    onRateChange?: (event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => void;
}

/**
 * Error action props for error state
 */
export interface ErrorActionProps {
    /** Action button label */
    label: string;
    /** Callback when action is clicked */
    onClick: () => void;
}

/**
 * Base MediaPlayer component props
 */
export interface BaseMediaPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Media sources */
    sources: MediaSource[];
    /** Media tracks (subtitles, captions) */
    tracks?: MediaTrack[];
    /** Whether to autoplay the media */
    autoPlay?: boolean;
    /** Whether to loop the media */
    loop?: boolean;
    /** Whether to mute the media initially */
    muted?: boolean;
    /** Whether to show controls */
    controls?: boolean;
    /** Placeholder image to show before video plays */
    poster?: string;
    /** Whether to preload media */
    preload?: 'auto' | 'metadata' | 'none';
    /** Media event handlers */
    mediaEventHandlers?: MediaEventHandlers;
    /** Whether media is playing (controlled component) */
    isPlaying?: boolean;
    /** Callback when play state changes */
    onPlayingChange?: (isPlaying: boolean) => void;
    /** Current time in seconds (controlled component) */
    currentTime?: number;
    /** Callback when current time changes */
    onTimeChange?: (time: number) => void;
    /** Theme variant */
    theme?: MediaThemeVariant;
    /** Whether to autoplay when visible in viewport */
    autoPlayOnScroll?: boolean;
    /** Callback for when an error occurs */
    onError?: (error: MediaErrorInfo) => void;
    /** Action to take when media errors */
    errorAction?: ErrorActionProps;
    /** Connection speed preference */
    connectionPreference?: ConnectionSpeed;
    /** Custom CSS properties for token overrides */
    style?: ExtendedCSSProperties;
    /** Accessibility label */
    ariaLabel?: string;
}

/**
 * VideoPlayer component props
 */
export interface VideoPlayerProps extends BaseMediaPlayerProps {
    /** Variant discriminator */
    _variant: 'video';
    /** Video aspect ratio */
    aspectRatio?: '16:9' | '4:3' | '1:1' | 'cover' | string;
    /** Video playback speed */
    playbackRate?: number;
    /** Callback when playback rate changes */
    onPlaybackRateChange?: (rate: number) => void;
    /** Whether to show picture-in-picture button */
    allowPictureInPicture?: boolean;
    /** Video width */
    width?: number | string;
    /** Video height */
    height?: number | string;
    /** Whether this video is from an external streaming service */
    isExternalVideo?: boolean;
    /** Whether to show fullscreen button */
    allowFullscreen?: boolean;
}

/**
 * AudioPlayer component props
 */
export interface AudioPlayerProps extends BaseMediaPlayerProps {
    /** Variant discriminator */
    _variant: 'audio';
    /** Whether to show waveform visualization */
    showWaveform?: boolean;
    /** Audio visualization color */
    visualizationColor?: string;
    /** Whether to show track artwork */
    showArtwork?: boolean;
    /** Track artwork image */
    artworkSrc?: string;
    /** Track title */
    title?: string;
    /** Track artist */
    artist?: string;
    /** Whether to show download button */
    allowDownload?: boolean;
    /** Download filename */
    downloadFilename?: string;
}

/**
 * MediaPlayer state
 */
export interface MediaPlayerState {
    /** Whether media is playing */
    isPlaying: boolean;
    /** Current time in seconds */
    currentTime: number;
    /** Media duration in seconds */
    duration: number;
    /** Current playback rate */
    playbackRate: number;
    /** Whether media is muted */
    isMuted: boolean;
    /** Current volume (0-1) */
    volume: number;
    /** Whether media is seeking */
    isSeeking: boolean;
    /** Whether media has ended */
    hasEnded: boolean;
    /** Whether media is buffering */
    isBuffering: boolean;
    /** Whether media metadata has loaded */
    isMetadataLoaded: boolean;
    /** Buffered ranges */
    buffered: TimeRanges | null;
    /** Whether media is in error state */
    hasError: boolean;
    /** Error information */
    error: MediaErrorInfo | null;
}

/**
 * MediaPlayer controls
 */
export interface MediaPlayerControls {
    /** Play media */
    play: () => Promise<void>;
    /** Pause media */
    pause: () => void;
    /** Toggle play/pause */
    togglePlay: () => Promise<void>;
    /** Seek to specific time */
    seek: (time: number) => void;
    /** Skip forward by seconds */
    skipForward: (seconds?: number) => void;
    /** Skip backward by seconds */
    skipBackward: (seconds?: number) => void;
    /** Set playback rate */
    setPlaybackRate: (rate: number) => void;
    /** Mute media */
    mute: () => void;
    /** Unmute media */
    unmute: () => void;
    /** Toggle mute/unmute */
    toggleMute: () => void;
    /** Set volume (0-1) */
    setVolume: (volume: number) => void;
    /** Enter fullscreen (video only) */
    enterFullscreen?: () => Promise<void>;
    /** Exit fullscreen */
    exitFullscreen?: () => Promise<void>;
    /** Toggle fullscreen */
    toggleFullscreen?: () => Promise<void>;
    /** Enter picture-in-picture (video only) */
    enterPictureInPicture?: () => Promise<void>;
    /** Exit picture-in-picture */
    exitPictureInPicture?: () => Promise<void>;
    /** Toggle picture-in-picture */
    togglePictureInPicture?: () => Promise<void>;
    /** Initialize media element */
    initMediaElement: (element: HTMLVideoElement | HTMLAudioElement | null) => void;
    /** Get media element */
    getMediaElement: () => HTMLVideoElement | HTMLAudioElement | null;
}

/**
 * Options for the useMediaPlayer hook
 */
export interface UseMediaPlayerOptions {
    /** Initial playback rate */
    initialPlaybackRate?: number;
    /** Initial volume */
    initialVolume?: number;
    /** Whether to auto-advance to next media when current ends */
    autoAdvance?: boolean;
    /** Whether to auto-play when loaded */
    autoPlay?: boolean;
    /** Whether to play when visible in viewport */
    playWhenVisible?: boolean;
    /** Callback when media ends */
    onEnded?: () => void;
    /** Callback when media is played */
    onPlay?: () => void;
    /** Callback when media is paused */
    onPause?: () => void;
    /** Callback when an error occurs */
    onError?: (error: MediaErrorInfo) => void;
}

/**
 * Union type for MediaPlayer props with discriminated unions
 */
export type MediaPlayerProps =
    | (VideoPlayerProps & { _variant: 'video' })
    | (AudioPlayerProps & { _variant: 'audio' });

/**
 * Legacy VideoSource type for backward compatibility
 * @deprecated Use MediaSource instead
 */
export interface VideoSource {
    src: string;
    type: string;
}

/**
 * Legacy VideoPlayerProps for backward compatibility
 * @deprecated Use MediaPlayerProps with _variant: 'video' instead
 */
export interface LegacyVideoPlayerProps {
    src: string;
    fallbackSrc?: string | VideoSource[];
    poster?: string;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    autoPlay?: boolean;
    className?: string;
    ariaLabel?: string;
}

/**
 * Helper to convert legacy sources to MediaSource format
 */
export function convertToMediaSources(
    src: string,
    fallbackSrc?: string | VideoSource[]
): MediaSource[] {
    const sources: MediaSource[] = [{ src, isDefault: true }];

    if (fallbackSrc) {
        if (typeof fallbackSrc === 'string') {
            sources.push({ src: fallbackSrc });
        } else if (Array.isArray(fallbackSrc)) {
            sources.push(...fallbackSrc.map(source => ({
                src: source.src,
                type: source.type
            })));
        }
    }

    return sources;
} 