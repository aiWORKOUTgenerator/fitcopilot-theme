/**
 * Type guards for media elements and events
 * These utilities help properly validate types at runtime
 */
import {
    FullscreenSupport,
    MediaAPIMethod,
    PictureInPictureSupport
} from '../types/mediaTypes';
import { VendorExtendedVideoElement, VendorExtendedWindow } from '../types/vendor';

/**
 * Type guards for vendor-specific APIs that haven't been standardized
 */
interface WebkitRequestFullscreen {
    webkitRequestFullscreen: () => Promise<void>;
}

interface MsRequestFullscreen {
    msRequestFullscreen: () => Promise<void>;
}

/**
 * Type guard to check if an element is a video element
 * @param element Element to check
 * @returns Whether the element is a video element
 */
export function isVideoElement(element: HTMLElement | null): element is HTMLVideoElement {
    return element instanceof HTMLVideoElement;
}

/**
 * Type guard to check if an element is an audio element
 * @param element Element to check
 * @returns Whether the element is an audio element
 */
export function isAudioElement(element: HTMLElement | null): element is HTMLAudioElement {
    return element instanceof HTMLAudioElement;
}

/**
 * Type guard to check if an element is a media element (audio or video)
 * @param element Element to check
 * @returns Whether the element is a media element
 */
export function isMediaElement(element: HTMLElement | null): element is HTMLMediaElement {
    return isVideoElement(element) || isAudioElement(element);
}

/**
 * Type guard to check if the browser supports standard Fullscreen API
 * @returns Whether the browser supports the standard Fullscreen API
 */
export function supportsStandardFullscreen(): boolean {
    return document.documentElement !== null &&
        typeof document.documentElement.requestFullscreen === 'function';
}

/**
 * Type guard to check if the browser supports WebKit Fullscreen API
 * @returns Whether the browser supports the WebKit Fullscreen API
 */
export function supportsWebkitFullscreen(): boolean {
    const element = document.documentElement;
    if (!element) return false;

    // Check for WebKit fullscreen support using Element prototype
    return 'webkitRequestFullscreen' in element &&
        typeof (element as HTMLElement & WebkitRequestFullscreen).webkitRequestFullscreen === 'function';
}

/**
 * Type guard to check if the browser supports MS Fullscreen API
 * @returns Whether the browser supports the MS Fullscreen API
 */
export function supportsMsFullscreen(): boolean {
    const element = document.documentElement;
    if (!element) return false;

    // Check for MS fullscreen support using Element prototype
    return 'msRequestFullscreen' in element &&
        typeof (element as HTMLElement & MsRequestFullscreen).msRequestFullscreen === 'function';
}

/**
 * Checks if a video element has WebKit fullscreen methods
 * @param element Element to check
 * @returns Whether the element has WebKit fullscreen methods
 */
export function hasWebkitFullscreenMethods(element: HTMLVideoElement): element is VendorExtendedVideoElement & WebkitRequestFullscreen {
    return 'webkitRequestFullscreen' in element &&
        typeof (element as HTMLVideoElement & WebkitRequestFullscreen).webkitRequestFullscreen === 'function';
}

/**
 * Checks if a video element has MS fullscreen methods
 * @param element Element to check
 * @returns Whether the element has MS fullscreen methods
 */
export function hasMsFullscreenMethods(element: HTMLVideoElement): element is VendorExtendedVideoElement & MsRequestFullscreen {
    return 'msRequestFullscreen' in element &&
        typeof (element as HTMLVideoElement & MsRequestFullscreen).msRequestFullscreen === 'function';
}

/**
 * Checks if the document has WebKit fullscreen methods
 * @returns Whether the document has WebKit fullscreen methods
 */
export function documentHasWebkitFullscreen(): boolean {
    return document &&
        'webkitExitFullscreen' in document &&
        typeof document['webkitExitFullscreen'] === 'function';
}

/**
 * Checks if the document has MS fullscreen methods
 * @returns Whether the document has MS fullscreen methods
 */
export function documentHasMsFullscreen(): boolean {
    return document &&
        'msExitFullscreen' in document &&
        typeof document['msExitFullscreen'] === 'function';
}

/**
 * Checks if a video element supports Picture-in-Picture
 * @param element Element to check
 * @returns Whether the element supports Picture-in-Picture
 */
export function supportsPictureInPicture(element: HTMLVideoElement): boolean {
    return 'requestPictureInPicture' in element &&
        typeof element.requestPictureInPicture === 'function';
}

/**
 * Checks if the browser supports Picture-in-Picture API
 * @returns Whether the browser supports the Picture-in-Picture API
 */
export function browserSupportsPictureInPicture(): boolean {
    return document &&
        'pictureInPictureElement' in document &&
        'exitPictureInPicture' in document &&
        typeof document['exitPictureInPicture'] === 'function';
}

/**
 * Determines the fullscreen capabilities of the current browser environment
 * @returns Fullscreen support information
 */
export function getFullscreenSupport(): FullscreenSupport {
    const standard = supportsStandardFullscreen();
    const webkit = supportsWebkitFullscreen();
    const ms = supportsMsFullscreen();
    const moz = document.documentElement !== null &&
        'mozRequestFullScreen' in document.documentElement;

    const isSupported = standard || webkit || ms || moz;

    let requestMethod: FullscreenSupport['requestMethod'] = null;
    let exitMethod: FullscreenSupport['exitMethod'] = null;
    let elementProperty: FullscreenSupport['elementProperty'] = null;

    if (standard) {
        requestMethod = 'requestFullscreen';
        exitMethod = 'exitFullscreen';
        elementProperty = 'fullscreenElement';
    } else if (webkit) {
        requestMethod = 'webkitRequestFullscreen';
        exitMethod = 'webkitExitFullscreen';
        elementProperty = 'webkitFullscreenElement';
    } else if (ms) {
        requestMethod = 'msRequestFullscreen';
        exitMethod = 'msExitFullscreen';
        elementProperty = 'msFullscreenElement';
    } else if (moz) {
        requestMethod = 'mozRequestFullscreen';
        exitMethod = 'mozCancelFullScreen';
        elementProperty = 'mozFullScreenElement';
    }

    return {
        standard,
        webkit,
        ms,
        moz,
        isSupported,
        requestMethod,
        exitMethod,
        elementProperty
    };
}

/**
 * Determines the picture-in-picture capabilities of the current browser
 * @returns Picture-in-picture support information
 */
export function getPictureInPictureSupport(): PictureInPictureSupport {
    const standard = 'pictureInPictureElement' in document &&
        'exitPictureInPicture' in document;

    const webkit = 'webkitPictureInPictureElement' in document ||
        (document.documentElement !== null &&
            'webkitRequestPictureInPicture' in document.documentElement);

    const isSupported = standard || webkit;

    let requestMethod: PictureInPictureSupport['requestMethod'] = null;
    let exitMethod: PictureInPictureSupport['exitMethod'] = null;
    let elementProperty: PictureInPictureSupport['elementProperty'] = null;

    if (standard) {
        requestMethod = 'requestPictureInPicture';
        exitMethod = 'exitPictureInPicture';
        elementProperty = 'pictureInPictureElement';
    } else if (webkit) {
        requestMethod = 'webkitRequestPictureInPicture';
        exitMethod = 'webkitExitPictureInPicture';
        elementProperty = 'webkitPictureInPictureElement';
    }

    return {
        standard,
        webkit,
        isSupported,
        requestMethod,
        exitMethod,
        elementProperty
    };
}

/**
 * Checks if the browser supports a specific media API method
 * @param method Method name to check
 * @returns Whether the method is supported
 */
export function supportsMediaMethod(method: MediaAPIMethod): boolean {
    if (method === 'requestFullscreen' ||
        method === 'webkitRequestFullscreen' ||
        method === 'msRequestFullscreen' ||
        method === 'mozRequestFullscreen') {
        return document.documentElement !== null &&
            method in document.documentElement;
    }

    if (method === 'exitFullscreen' ||
        method === 'webkitExitFullscreen' ||
        method === 'msExitFullscreen' ||
        method === 'mozCancelFullScreen') {
        return method in document;
    }

    if (method === 'requestPictureInPicture' ||
        method === 'exitPictureInPicture') {
        return method in document;
    }

    if (method === 'webkitEnterFullscreen' ||
        method === 'webkitExitFullscreen') {
        const testVideo = document.createElement('video');
        return method in testVideo;
    }

    if (method === 'play' ||
        method === 'pause' ||
        method === 'load' ||
        method === 'canPlayType') {
        const testVideo = document.createElement('video');
        return method in testVideo;
    }

    return false;
}

/**
 * Checks if the browser supports WebAudio API
 * @returns Whether WebAudio is supported
 */
export function supportsWebAudio(): boolean {
    return typeof AudioContext !== 'undefined' ||
        typeof (window as VendorExtendedWindow).webkitAudioContext !== 'undefined';
}

/**
 * Gets the compatible AudioContext constructor
 * @returns The AudioContext constructor or null if not supported
 */
export function getAudioContextConstructor(): typeof AudioContext | null {
    if (typeof AudioContext !== 'undefined') {
        return AudioContext;
    }

    if (typeof (window as VendorExtendedWindow).webkitAudioContext !== 'undefined') {
        return (window as VendorExtendedWindow).webkitAudioContext as unknown as typeof AudioContext;
    }

    return null;
} 