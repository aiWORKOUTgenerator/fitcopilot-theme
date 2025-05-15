/**
 * DOM Element Type Guards
 * 
 * Type guards for browser APIs and DOM elements with vendor-specific methods.
 * These help avoid using `any` types when working with browser-specific features.
 */

// ===== Element Type Guards =====

/**
 * Type guard for checking if an element is an input element
 */
export function isInputElement(element: unknown): element is HTMLInputElement {
    return element instanceof HTMLInputElement;
}

/**
 * Type guard for checking if an element is a textarea element
 */
export function isTextareaElement(element: unknown): element is HTMLTextAreaElement {
    return element instanceof HTMLTextAreaElement;
}

/**
 * Type guard for checking if an element is a select element
 */
export function isSelectElement(element: unknown): element is HTMLSelectElement {
    return element instanceof HTMLSelectElement;
}

/**
 * Type guard for checking if an element is a form element
 */
export function isFormElement(element: unknown): element is HTMLFormElement {
    return element instanceof HTMLFormElement;
}

/**
 * Type guard for checking if an element is a button element
 */
export function isButtonElement(element: unknown): element is HTMLButtonElement {
    return element instanceof HTMLButtonElement;
}

/**
 * Type guard for checking if an element is an anchor element
 */
export function isAnchorElement(element: unknown): element is HTMLAnchorElement {
    return element instanceof HTMLAnchorElement;
}

/**
 * Type guard for checking if an element is a media element (audio or video)
 */
export function isMediaElement(element: unknown): element is HTMLMediaElement {
    return element instanceof HTMLMediaElement;
}

/**
 * Type guard for checking if an element is a video element
 */
export function isVideoElement(element: unknown): element is HTMLVideoElement {
    return element instanceof HTMLVideoElement;
}

/**
 * Type guard for checking if an element is an audio element
 */
export function isAudioElement(element: unknown): element is HTMLAudioElement {
    return element instanceof HTMLAudioElement;
}

/**
 * Type guard for checking if an element is an image element
 */
export function isImageElement(element: unknown): element is HTMLImageElement {
    return element instanceof HTMLImageElement;
}

/**
 * Type guard for checking if an element is an iframe element
 */
export function isIframeElement(element: unknown): element is HTMLIFrameElement {
    return element instanceof HTMLIFrameElement;
}

// ===== Form Control Type Guards =====

/**
 * Type guard for checking if an element is a form control
 */
export function isFormControlElement(element: unknown): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
    return isInputElement(element) || isTextareaElement(element) || isSelectElement(element);
}

/**
 * Type guard for checking if an element accepts input
 */
export function hasValueProperty(element: unknown): element is { value: string } {
    return (
        element !== null &&
        typeof element === 'object' &&
        'value' in element &&
        typeof (element as { value: unknown }).value === 'string'
    );
}

// ===== Vendor-Specific APIs =====

/**
 * Interface for elements with webkit fullscreen method
 */
export interface ElementWithWebkitFullscreen extends Element {
    webkitRequestFullscreen: () => Promise<void>;
}

/**
 * Type guard for elements with webkit fullscreen method
 */
export function isElementWithWebkitFullscreen(element: Element): element is ElementWithWebkitFullscreen {
    return 'webkitRequestFullscreen' in element &&
        typeof (element as ElementWithWebkitFullscreen).webkitRequestFullscreen === 'function';
}

/**
 * Interface for elements with MS fullscreen method
 */
export interface ElementWithMsFullscreen extends Element {
    msRequestFullscreen: () => Promise<void>;
}

/**
 * Type guard for elements with MS fullscreen method
 */
export function isElementWithMsFullscreen(element: Element): element is ElementWithMsFullscreen {
    return 'msRequestFullscreen' in element &&
        typeof (element as ElementWithMsFullscreen).msRequestFullscreen === 'function';
}

/**
 * Interface for document with webkit exit fullscreen method
 */
export interface DocumentWithWebkitExitFullscreen extends Document {
    webkitExitFullscreen: () => Promise<void>;
}

/**
 * Type guard for document with webkit exit fullscreen method
 */
export function isDocumentWithWebkitExitFullscreen(doc: Document): doc is DocumentWithWebkitExitFullscreen {
    return 'webkitExitFullscreen' in doc &&
        typeof (doc as DocumentWithWebkitExitFullscreen).webkitExitFullscreen === 'function';
}

/**
 * Interface for document with MS exit fullscreen method
 */
export interface DocumentWithMsExitFullscreen extends Document {
    msExitFullscreen: () => Promise<void>;
}

/**
 * Type guard for document with MS exit fullscreen method
 */
export function isDocumentWithMsExitFullscreen(doc: Document): doc is DocumentWithMsExitFullscreen {
    return 'msExitFullscreen' in doc &&
        typeof (doc as DocumentWithMsExitFullscreen).msExitFullscreen === 'function';
}

// ===== Usage Examples =====

/**
 * Example of using DOM type guards for browser compatibility
 */
/* 
export function requestFullscreen(element: Element): Promise<void> {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (isElementWithWebkitFullscreen(element)) {
    return element.webkitRequestFullscreen();
  } else if (isElementWithMsFullscreen(element)) {
    return element.msRequestFullscreen();
  }
  return Promise.reject(new Error('Fullscreen API not supported'));
}

export function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (isDocumentWithWebkitExitFullscreen(document)) {
    return document.webkitExitFullscreen();
  } else if (isDocumentWithMsExitFullscreen(document)) {
    return document.msExitFullscreen();
  }
  return Promise.reject(new Error('Fullscreen API not supported'));
}
*/ 