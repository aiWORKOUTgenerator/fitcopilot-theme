// Type declarations for the YouTube Player API
interface YT {
    Player: new (
        elementId: string | HTMLElement,
        options: {
            width?: number;
            height?: number;
            videoId?: string;
            playerVars?: {
                autoplay?: number;
                mute?: number;
                rel?: number;
                modestbranding?: number;
                playsinline?: number;
                controls?: number;
                enablejsapi?: number;
                origin?: string;
                [key: string]: any;
            };
            events?: {
                onReady?: () => void;
                onStateChange?: (event: { data: number }) => void;
                onError?: (event: any) => void;
                onPlaybackQualityChange?: (event: any) => void;
                onPlaybackRateChange?: (event: any) => void;
                onApiChange?: (event: any) => void;
            };
        }
    ) => {
        destroy: () => void;
        loadVideoById: (videoId: string, startSeconds?: number) => void;
        cueVideoById: (videoId: string, startSeconds?: number) => void;
        playVideo: () => void;
        pauseVideo: () => void;
        stopVideo: () => void;
        getPlayerState: () => number;
        getDuration: () => number;
        getCurrentTime: () => number;
        setVolume: (volume: number) => void;
        getVolume: () => number;
        mute: () => void;
        unMute: () => void;
        isMuted: () => boolean;
        setSize: (width: number, height: number) => void;
        getIframe: () => HTMLIFrameElement;
        addEventListener: (event: string, listener: Function) => void;
        removeEventListener: (event: string, listener: Function) => void;
    };
    PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
    };
}

// Extend the global Window interface to include the YouTube API
interface Window {
    YT?: YT;
    onYouTubeIframeAPIReady?: () => void;
} 