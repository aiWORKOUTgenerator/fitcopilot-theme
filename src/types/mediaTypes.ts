/**
 * Browser media feature detection type definitions
 * 
 * This file provides utility types for detecting browser capabilities
 * related to media playback, focusing on cross-browser compatibility.
 */

/**
 * Media element capabilities interface
 */
export interface MediaElementCapabilities {
    /** Whether fullscreen is supported */
    supportsFullscreen: boolean;
    /** Whether picture-in-picture is supported */
    supportsPictureInPicture: boolean;
    /** Whether MediaSource Extensions are supported */
    supportsMSE: boolean;
    /** Whether Encrypted Media Extensions are supported */
    supportsEME: boolean;
    /** Whether media can be played inline on mobile */
    supportsInlinePlayback: boolean;
    /** Whether background playback is supported */
    supportsBackgroundPlayback: boolean;
    /** Whether AirPlay is supported */
    supportsAirPlay: boolean;
    /** Whether remote playback is supported */
    supportsRemotePlayback: boolean;
    /** Maximum supported video resolution */
    maxVideoResolution?: string;
    /** Supported codecs */
    supportedCodecs: string[];
    /** Whether WebAudio is supported */
    supportsWebAudio: boolean;
    /** Whether media sessions API is supported */
    supportsMediaSession: boolean;
}

/**
 * Browser fullscreen support information
 */
export interface FullscreenSupport {
    /** Whether standard fullscreen API is supported */
    standard: boolean;
    /** Whether webkit prefixed fullscreen API is supported */
    webkit: boolean;
    /** Whether MS prefixed fullscreen API is supported */
    ms: boolean;
    /** Whether Mozilla prefixed fullscreen API is supported */
    moz: boolean;
    /** Whether fullscreen is supported at all */
    isSupported: boolean;
    /** Which method to use for requesting fullscreen */
    requestMethod: 'requestFullscreen' | 'webkitRequestFullscreen' | 'msRequestFullscreen' | 'mozRequestFullscreen' | null;
    /** Which method to use for exiting fullscreen */
    exitMethod: 'exitFullscreen' | 'webkitExitFullscreen' | 'msExitFullscreen' | 'mozCancelFullScreen' | null;
    /** Which property to check for fullscreen element */
    elementProperty: 'fullscreenElement' | 'webkitFullscreenElement' | 'msFullscreenElement' | 'mozFullScreenElement' | null;
}

/**
 * Browser picture-in-picture support information
 */
export interface PictureInPictureSupport {
    /** Whether picture-in-picture API is supported */
    standard: boolean;
    /** Whether webkit prefixed picture-in-picture API is supported */
    webkit: boolean;
    /** Whether picture-in-picture is supported at all */
    isSupported: boolean;
    /** Which method to use for entering picture-in-picture */
    requestMethod: 'requestPictureInPicture' | 'webkitRequestPictureInPicture' | null;
    /** Which method to use for exiting picture-in-picture */
    exitMethod: 'exitPictureInPicture' | 'webkitExitPictureInPicture' | null;
    /** Which property to check for picture-in-picture element */
    elementProperty: 'pictureInPictureElement' | 'webkitPictureInPictureElement' | null;
}

/**
 * Media playout capability info
 */
export interface MediaPlayoutCapabilities {
    /** Whether media can be played */
    canPlay: boolean;
    /** Whether media can be played through */
    canPlayThrough: boolean;
    /** Whether media can be played inline */
    canPlayInline: boolean;
    /** Whether autoplay is supported */
    canAutoplay: boolean;
    /** Whether muted autoplay is supported */
    canAutoplayMuted: boolean;
    /** Whether the device has a GPU for hardware acceleration */
    hasGPU: boolean;
    /** Maximum supported video height */
    maxHeight?: number;
    /** Maximum supported video width */
    maxWidth?: number;
    /** Whether HDR is supported */
    supportsHDR: boolean;
    /** Whether AV1 codec is supported */
    supportsAV1: boolean;
    /** Whether HEVC codec is supported */
    supportsHEVC: boolean;
    /** Whether VP9 codec is supported */
    supportsVP9: boolean;
}

/**
 * Media API methods to check for browser compatibility
 */
export type MediaAPIMethod =
    | 'requestFullscreen'
    | 'webkitRequestFullscreen'
    | 'msRequestFullscreen'
    | 'mozRequestFullscreen'
    | 'exitFullscreen'
    | 'webkitExitFullscreen'
    | 'msExitFullscreen'
    | 'mozCancelFullScreen'
    | 'requestPictureInPicture'
    | 'exitPictureInPicture'
    | 'webkitRequestPictureInPicture'
    | 'webkitExitPictureInPicture'
    | 'play'
    | 'pause'
    | 'load'
    | 'canPlayType';

/**
 * Media API properties to check for browser compatibility
 */
export type MediaAPIProperty =
    | 'fullscreenElement'
    | 'webkitFullscreenElement'
    | 'msFullscreenElement'
    | 'mozFullScreenElement'
    | 'pictureInPictureElement'
    | 'webkitPictureInPictureElement'
    | 'playsInline'
    | 'disablePictureInPicture'
    | 'disableRemotePlayback'
    | 'mediaSession';

/**
 * Media codecs to check for compatibility
 */
export interface CodecSupport {
    /** HTML5 video codec support results */
    video: {
        h264: boolean;
        h265: boolean;
        vp8: boolean;
        vp9: boolean;
        av1: boolean;
        theora: boolean;
    };
    /** HTML5 audio codec support results */
    audio: {
        aac: boolean;
        mp3: boolean;
        opus: boolean;
        vorbis: boolean;
        flac: boolean;
        wav: boolean;
    };
    /** Media container support results */
    container: {
        mp4: boolean;
        webm: boolean;
        ogg: boolean;
        mov: boolean;
        mkv: boolean;
    };
} 