# Media Component Type System

This document outlines the complete type system for media components in the FitCopilot theme, addressing browser compatibility and type safety concerns.

## Overview

The media type system provides strongly-typed definitions for cross-browser media playback, ensuring compatibility across different browsers and preventing runtime errors due to vendor-specific API usage.

## Type Hierarchy

### Media Player Props

```typescript
export type MediaPlayerProps =
    | (VideoPlayerProps & { _variant: 'video' })
    | (AudioPlayerProps & { _variant: 'audio' });
```

This discriminated union pattern ensures type safety when rendering either a video or audio player.

### Base Media Player Props

```typescript
export interface BaseMediaPlayerProps {
    sources: MediaSource[];
    tracks?: MediaTrack[];
    autoPlay?: boolean;
    // ...other common media properties
}
```

The base interface provides common properties shared between video and audio players.

### Specialized Media Components

```typescript
export interface VideoPlayerProps extends BaseMediaPlayerProps {
    _variant: 'video';
    aspectRatio?: '16:9' | '4:3' | '1:1' | 'cover' | string;
    // ...video-specific properties
}

export interface AudioPlayerProps extends BaseMediaPlayerProps {
    _variant: 'audio';
    showWaveform?: boolean;
    // ...audio-specific properties
}
```

Each specialized component extends the base props with specific functionality.

## Vendor-Specific Browser Compatibility

### Vendor Extension Types

```typescript
export interface WebKitHTMLVideoElement extends HTMLVideoElement {
    webkitRequestFullscreen: () => Promise<void>;
    // ...other webkit-specific methods
}

export interface MSHTMLVideoElement extends HTMLVideoElement {
    msRequestFullscreen: () => Promise<void>;
    // ...other MS-specific methods
}

export type VendorExtendedVideoElement = HTMLVideoElement & WebKitHTMLVideoElement & MSHTMLVideoElement;
```

These interfaces provide type-safe access to vendor-specific methods without using `any` type casts.

### Comprehensive Browser Feature Detection

```typescript
export interface FullscreenSupport {
    standard: boolean;
    webkit: boolean;
    ms: boolean;
    moz: boolean;
    isSupported: boolean;
    requestMethod: 'requestFullscreen' | 'webkitRequestFullscreen' | 'msRequestFullscreen' | 'mozRequestFullscreen' | null;
    exitMethod: 'exitFullscreen' | 'webkitExitFullscreen' | 'msExitFullscreen' | 'mozCancelFullScreen' | null;
    elementProperty: 'fullscreenElement' | 'webkitFullscreenElement' | 'msFullscreenElement' | 'mozFullScreenElement' | null;
}
```

This interface detects and provides a unified API for handling fullscreen functionality across browsers.

## Type Guards for Runtime Validation

### Element Type Guards

```typescript
export function isVideoElement(element: HTMLElement | null): element is HTMLVideoElement {
    return element instanceof HTMLVideoElement;
}

export function isAudioElement(element: HTMLElement | null): element is HTMLAudioElement {
    return element instanceof HTMLAudioElement;
}

export function isMediaElement(element: HTMLElement | null): element is HTMLMediaElement {
    return isVideoElement(element) || isAudioElement(element);
}
```

These type guards validate element types at runtime for safe property access.

### Browser Feature Type Guards

```typescript
export function hasWebkitFullscreenMethods(element: HTMLVideoElement): element is VendorExtendedVideoElement & WebkitRequestFullscreen {
    return 'webkitRequestFullscreen' in element &&
        typeof (element as HTMLVideoElement & WebkitRequestFullscreen).webkitRequestFullscreen === 'function';
}

export function supportsWebAudio(): boolean {
    return typeof AudioContext !== 'undefined' || 
        typeof (window as VendorExtendedWindow).webkitAudioContext !== 'undefined';
}
```

These guards check for specific browser features before attempting to use them.

## Media State Tracking

```typescript
export interface MediaPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    // ...other state properties
}

export interface MediaPlayerControls {
    play: () => Promise<void>;
    pause: () => void;
    // ...other control methods
}
```

These interfaces provide type-safe state and control interactions.

## Usage Pattern

```typescript
// Using the discriminated union for type safety
const MediaPlayer: React.FC<MediaPlayerProps> = (props) => {
    if (props._variant === 'video') {
        return <VideoPlayer {...props} />;
    }

    if (props._variant === 'audio') {
        return <AudioPlayer {...props} />;
    }

    // TypeScript ensures this is unreachable with a properly typed union
    throw new Error(`Unknown media variant: ${props._variant}`);
};

// Safe browser API usage with type guards
const enterFullscreen = async (): Promise<void> => {
    const element = videoRef.current;
    if (!element) return;

    try {
        if (element.requestFullscreen) {
            await element.requestFullscreen();
        } else if (hasWebkitFullscreenMethods(element)) {
            await element.webkitRequestFullscreen();
        } else if (hasMsFullscreenMethods(element)) {
            await element.msRequestFullscreen();
        }
    } catch (error) {
        logger.error('Failed to enter fullscreen:', error);
    }
};
```

## Benefits

1. **Type Safety**: Eliminates runtime errors from accessing non-existent browser API methods
2. **Developer Experience**: Provides autocompletion and documentation for media APIs
3. **Cross-Browser Compatibility**: Safely handles vendor-specific implementations
4. **Maintainability**: Centralizes browser compatibility concerns
5. **Performance**: Allows for feature detection without unnecessary polyfills

## Media Types Organization

Media-related types are organized in:

- `src/types/media.ts`: Core media types for UI components
- `src/features/shared/Media/types.ts`: Feature-specific media types
- `src/utils/mediaTypeGuards.ts`: Element type guards for DOM operations 