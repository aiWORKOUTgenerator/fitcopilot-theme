/**
 * Type guards for media elements and events
 * These utilities help properly validate types at runtime
 */
import { VendorExtendedVideoElement } from '../types/vendor';

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