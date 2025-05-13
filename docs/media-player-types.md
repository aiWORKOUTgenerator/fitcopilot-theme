# Media Player Type System

This document outlines the comprehensive type system implemented for the useMediaPlayer hook and related components.

## Overview

The media player type system provides:

1. Complete type safety for media elements (audio and video)
2. Browser compatibility via vendor-specific interfaces
3. Runtime type validation through type guards
4. Comprehensive event typing for media interactions

## Core Types

### Media Element Types

The system uses a combination of standard HTML element types and vendor-extended types:

```typescript
// Standard media elements
HTMLVideoElement
HTMLAudioElement
HTMLMediaElement

// Vendor-extended elements for cross-browser compatibility
VendorExtendedVideoElement
VendorExtendedDocument
```

### Media State

The `MediaPlayerState` interface tracks the complete state of media playback:

```typescript
interface MediaPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    playbackRate: number;
    isMuted: boolean;
    volume: number;
    isSeeking: boolean;
    hasEnded: boolean;
    isBuffering: boolean;
    isMetadataLoaded: boolean;
    buffered: TimeRanges | null;
    hasError: boolean;
    error: MediaErrorInfo | null;
}
```

### Media Controls

The `MediaPlayerControls` interface provides type-safe methods for controlling media:

```typescript
interface MediaPlayerControls {
    play: () => Promise<void>;
    pause: () => void;
    togglePlay: () => Promise<void>;
    seek: (time: number) => void;
    skipForward: (seconds?: number) => void;
    skipBackward: (seconds?: number) => void;
    setPlaybackRate: (rate: number) => void;
    mute: () => void;
    unmute: () => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    enterFullscreen?: () => Promise<void>;
    exitFullscreen?: () => Promise<void>;
    toggleFullscreen?: () => Promise<void>;
    enterPictureInPicture?: () => Promise<void>;
    exitPictureInPicture?: () => Promise<void>;
    togglePictureInPicture?: () => Promise<void>;
    initMediaElement: (element: HTMLVideoElement | HTMLAudioElement | null) => void;
    getMediaElement: () => HTMLVideoElement | HTMLAudioElement | null;
}
```

### Configuration Options

Configuration options are fully typed:

```typescript
interface UseMediaPlayerOptions {
    initialPlaybackRate?: number;
    initialVolume?: number;
    autoAdvance?: boolean;
    autoPlay?: boolean;
    playWhenVisible?: boolean;
    onEnded?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onError?: (error: MediaErrorInfo) => void;
}
```

## Type Guards

The system includes runtime type validation through type guards:

```typescript
// Element type guards
isVideoElement(element): element is HTMLVideoElement
isAudioElement(element): element is HTMLAudioElement
isMediaElement(element): element is HTMLMediaElement

// Feature detection guards
hasWebkitFullscreenMethods(element): element is VendorExtendedVideoElement
hasMsFullscreenMethods(element): element is VendorExtendedVideoElement
documentHasWebkitFullscreen(): boolean
documentHasMsFullscreen(): boolean
supportsPictureInPicture(element): boolean
browserSupportsPictureInPicture(): boolean
```

## Usage Examples

### Basic Media Player Hook Usage

```typescript
const { state, controls } = useMediaPlayer({
  initialVolume: 0.8,
  autoPlay: true,
  onError: (error) => {
    console.error("Media error:", error.message);
  }
});

// Type-safe state access
const { isPlaying, currentTime, duration } = state;

// Type-safe control methods
const { play, pause, seek, setVolume } = controls;
```

### Using with Video Element

```typescript
const VideoPlayer: React.FC<VideoProps> = (props) => {
  const { state, controls } = useMediaPlayer();
  
  return (
    <div>
      <video 
        ref={(el) => controls.initMediaElement(el)}
        src={props.src}
      />
      <button onClick={() => controls.togglePlay()}>
        {state.isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};
```

## Browser Compatibility

The type system handles vendor-specific methods for cross-browser compatibility:

- Standard Fullscreen API
- WebKit-specific methods (Safari)
- MS-specific methods (IE11)
- Picture-in-Picture API

Type guards ensure that methods are only called when they are available in the current browser.

## Error Handling

Errors are fully typed with the `MediaErrorInfo` interface:

```typescript
interface MediaErrorInfo {
    code?: number;
    message: string;
    error?: Error;
    details?: Record<string, unknown>;
}
```

## Testing

The system includes comprehensive tests for:

- Type guard validation
- Feature detection
- Browser compatibility handling

## Usage Guidelines

1. Always use the type guards when accessing browser-specific features
2. Utilize the proper event types for event handlers
3. Take advantage of the strongly-typed state and controls
4. Handle potential errors with the provided error types 