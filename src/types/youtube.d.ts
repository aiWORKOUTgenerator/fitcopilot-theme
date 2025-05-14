/**
 * Type definitions for YouTube IFrame Player API
 * Based on https://developers.google.com/youtube/iframe_api_reference
 */

declare namespace YT {
    interface PlayerOptions {
        width?: number | string;
        height?: number | string;
        videoId?: string;
        playerVars?: PlayerVars;
        events?: Events;
    }

    interface PlayerVars {
        autoplay?: 0 | 1;
        cc_load_policy?: 0 | 1;
        color?: 'red' | 'white';
        controls?: 0 | 1 | 2;
        disablekb?: 0 | 1;
        enablejsapi?: 0 | 1;
        end?: number;
        fs?: 0 | 1;
        hl?: string;
        iv_load_policy?: 1 | 3;
        list?: string;
        listType?: 'playlist' | 'search' | 'user_uploads';
        loop?: 0 | 1;
        modestbranding?: 0 | 1;
        mute?: 0 | 1;
        origin?: string;
        playlist?: string;
        playsinline?: 0 | 1;
        rel?: 0 | 1;
        showinfo?: 0 | 1;
        start?: number;
        widget_referrer?: string;
    }

    interface Events {
        onReady?: (event: OnReadyEvent) => void;
        onStateChange?: (event: OnStateChangeEvent) => void;
        onPlaybackQualityChange?: (event: OnPlaybackQualityChangeEvent) => void;
        onPlaybackRateChange?: (event: OnPlaybackRateChangeEvent) => void;
        onError?: (event: OnErrorEvent) => void;
        onApiChange?: (event: OnApiChangeEvent) => void;
    }

    interface BaseEvent {
        target: Player;
    }

    // OnReadyEvent doesn't add additional properties beyond BaseEvent
    type OnReadyEvent = BaseEvent;

    interface OnStateChangeEvent extends BaseEvent {
        data: PlayerState;
    }

    interface OnPlaybackQualityChangeEvent extends BaseEvent {
        data: string;
    }

    interface OnPlaybackRateChangeEvent extends BaseEvent {
        data: number;
    }

    interface OnErrorEvent extends BaseEvent {
        data: number;
    }

    // OnApiChangeEvent doesn't add additional properties beyond BaseEvent
    type OnApiChangeEvent = BaseEvent;

    enum PlayerState {
        UNSTARTED = -1,
        ENDED = 0,
        PLAYING = 1,
        PAUSED = 2,
        BUFFERING = 3,
        CUED = 5
    }

    interface Player {
        // Video Controls
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        seekTo(seconds: number, allowSeekAhead?: boolean): void;
        clearVideo(): void;

        // Playlist Controls
        nextVideo(): void;
        previousVideo(): void;
        playVideoAt(index: number): void;

        // Volume Controls
        mute(): void;
        unMute(): void;
        isMuted(): boolean;
        setVolume(volume: number): void;
        getVolume(): number;

        // Playback Status
        getVideoLoadedFraction(): number;
        getPlayerState(): PlayerState;
        getCurrentTime(): number;
        getPlaybackRate(): number;
        setPlaybackRate(rate: number): void;
        getAvailablePlaybackRates(): number[];

        // Playback Quality
        getPlaybackQuality(): string;
        setPlaybackQuality(quality: string): void;
        getAvailableQualityLevels(): string[];

        // Video Information
        getDuration(): number;
        getVideoUrl(): string;
        getVideoEmbedCode(): string;

        // Player Size/Dimensions
        setSize(width: number, height: number): void;

        // Playlist Information
        getPlaylist(): string[];
        getPlaylistIndex(): number;

        // Other Functions
        destroy(): void;
        addEventListener(event: string, listener: (event: BaseEvent) => void): void;
        removeEventListener(event: string, listener: (event: BaseEvent) => void): void;
    }

    // YouTube API Global Object
    interface YTApi {
        Player: new (element: HTMLElement | string, options: PlayerOptions) => Player;
        PlayerState: typeof PlayerState;
    }
}

// Global Augmentation
interface Window {
    YT?: YT.YTApi;
    onYouTubeIframeAPIReady?: () => void;
} 