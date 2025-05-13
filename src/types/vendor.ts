/**
 * Vendor-specific type definitions for browser compatibility
 * These types define the non-standard APIs provided by different browsers
 */

/**
 * WebKit-specific extensions to HTMLVideoElement
 */
export interface WebKitHTMLVideoElement extends HTMLVideoElement {
    webkitRequestFullscreen: () => Promise<void>;
    webkitEnterFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    webkitSupportsFullscreen?: boolean;
    webkitDisplayingFullscreen?: boolean;
}

/**
 * MS-specific extensions to HTMLVideoElement
 */
export interface MSHTMLVideoElement extends HTMLVideoElement {
    msRequestFullscreen: () => Promise<void>;
    msEnterFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
}

/**
 * WebKit-specific extensions to Document
 */
export interface WebKitDocument extends Document {
    webkitExitFullscreen: () => Promise<void>;
    webkitFullscreenElement: Element | null;
    webkitIsFullScreen: boolean;
}

/**
 * MS-specific extensions to Document
 */
export interface MSDocument extends Document {
    msExitFullscreen: () => Promise<void>;
    msFullscreenElement: Element | null;
}

/**
 * WebKit-specific AudioContext
 * Note: This interface extends AudioContext but exists to type-check WebKit implementations.
 * It may appear empty, but it serves to properly type webkitAudioContext when encountered.
 * 
 * We need to include at least one property to avoid the no-empty-object-type error.
 */
export interface WebkitAudioContext extends AudioContext {
    // WebkitAudioContext has the same methods/properties as standard AudioContext
    // but with a different constructor name/implementation
    readonly webkitAudioContextImplementation: true;
}

/**
 * Comprehensive video element type that includes all vendor prefixes
 */
export type VendorExtendedVideoElement = HTMLVideoElement & WebKitHTMLVideoElement & MSHTMLVideoElement;

/**
 * Comprehensive document type that includes all vendor prefixes
 */
export type VendorExtendedDocument = Document & WebKitDocument & MSDocument;

/**
 * Extend Window interface with webkit-prefixed classes
 */
export interface VendorExtendedWindow extends Window {
    webkitAudioContext?: typeof AudioContext;
} 