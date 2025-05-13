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
 * Comprehensive video element type that includes all vendor prefixes
 */
export type VendorExtendedVideoElement = HTMLVideoElement & WebKitHTMLVideoElement & MSHTMLVideoElement;

/**
 * Comprehensive document type that includes all vendor prefixes
 */
export type VendorExtendedDocument = Document & WebKitDocument & MSDocument; 