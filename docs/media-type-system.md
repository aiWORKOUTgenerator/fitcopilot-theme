# Media Component Type System

This document outlines the type system for media components in the FitCopilot theme, providing a consistent pattern for type-safe media implementations.

## Core Type Pattern

Media components use a discriminated union pattern with the following structure:

1. **Base Props Interface**: Common properties for all media variants
2. **Variant Interfaces**: Extended interfaces for specific media types
3. **Union Type**: Combined type representing all possible variants
4. **Type Guards**: Functions to safely check component variants

## Type Hierarchy

```
BaseMediaProps
  ├── ImageMediaProps (variant: 'image')
  ├── VideoMediaProps (variant: 'video')
  ├── AudioMediaProps (variant: 'audio')
  ├── YouTubeMediaProps (variant: 'youtube')
  ├── ImageGalleryProps (variant: 'imageGallery')
  └── MediaCarouselProps (variant: 'carousel')
```

These types are combined into the `MediaProps` discriminated union:

```typescript
export type MediaProps =
  | ImageMediaProps
  | VideoMediaProps
  | AudioMediaProps
  | YouTubeMediaProps
  | ImageGalleryProps
  | MediaCarouselProps;
```

## Type Guards

Type guards are implemented in two locations:

1. **Element Type Guards** in `src/utils/mediaTypeGuards.ts` for checking DOM element types:
```typescript
export function isVideoElement(element: HTMLElement | null): element is HTMLVideoElement {
  return element instanceof HTMLVideoElement;
}
```

2. **Component Type Guards** in the shared Media component types for checking component variants:
```typescript
export const isVideoMedia = (props: MediaProps): props is VideoMediaProps =>
  props.variant === 'video';
```

## Media Component Implementation

The `Media` component acts as a discriminated union switcher, using type guards to render the appropriate component:

```typescript
export const Media: React.FC<MediaProps> = (props) => {
  if (isVideoMedia(props)) return <VideoPlayer {...props} />;
  if (isAudioMedia(props)) return <AudioPlayer {...props} />;
  if (isImageMedia(props)) return <img {...props} />;
  // Additional media types...
  return null;
};
```

## Usage Examples

### Basic Media

```tsx
import { Media } from 'features/shared/Media';
import { VideoMediaProps } from 'features/shared/Media/types';

const MyComponent: React.FC = () => {
  const videoProps: VideoMediaProps = {
    variant: 'video',
    src: '/videos/workout.mp4',
    poster: '/images/workout-thumbnail.jpg',
    controls: true,
    autoPlay: false,
    loop: false,
    muted: true,
    alt: 'Workout demonstration'
  };

  return <Media {...videoProps} />;
};
```

### Conditional Media Rendering

```tsx
import { MediaProps } from 'features/shared/Media/types';
import { isVideoMedia, isImageMedia } from 'features/shared/Media/types';

const MediaDetails: React.FC<{ media: MediaProps }> = ({ media }) => {
  // Type-safe handling based on media variant
  if (isVideoMedia(media)) {
    return (
      <div>
        Video: {media.src}
        <span>Duration: {media.duration || 'unknown'}</span>
      </div>
    );
  }
  
  if (isImageMedia(media)) {
    return (
      <div>
        Image: {media.src}
        <span>Size: {media.width}x{media.height}</span>
      </div>
    );
  }
  
  // Handle other media types...
};
```

### Media Events with Type Safety

```tsx
import { VideoMediaProps } from 'features/shared/Media/types';
import { Media } from 'features/shared/Media';

const VideoWithEvents: React.FC = () => {
  const handlePlay = (): void => {
    console.log('Video started playing');
  };

  const handlePause = (): void => {
    console.log('Video paused');
  };

  const handleEnded = (): void => {
    console.log('Video playback completed');
  };

  const mediaProps: VideoMediaProps = {
    variant: 'video',
    src: '/videos/exercise.mp4',
    controls: true,
    onPlay: handlePlay,
    onPause: handlePause,
    onEnded: handleEnded
  };

  return <Media {...mediaProps} />;
};
```

## Media Element Type Guards

For DOM-level operations, use the element type guards in `mediaTypeGuards.ts`:

```typescript
import { isVideoElement, isAudioElement } from 'utils/mediaTypeGuards';

function handleMediaElement(element: HTMLElement): void {
  if (isVideoElement(element)) {
    // TypeScript knows this is HTMLVideoElement
    element.play();
  } else if (isAudioElement(element)) {
    // TypeScript knows this is HTMLAudioElement
    element.volume = 0.5;
  } else {
    console.warn('Not a media element');
  }
}
```

## Media Variant Descriptions

### Image Media
For displaying static images with responsive options.

### Video Media
For playing video content with playback controls and event handlers.

### Audio Media
For playing audio content with visualization options.

### YouTube Media
For embedding YouTube videos with configuration options.

### Image Gallery
For displaying multiple images in a gallery format with navigation.

### Media Carousel
For displaying mixed media types in a carousel format.

## Browser Compatibility

The media type system includes support for vendor-specific browser APIs:

```typescript
function enterFullscreen(videoElement: HTMLVideoElement): void {
  if (videoElement.requestFullscreen) {
    videoElement.requestFullscreen();
  } else if (hasWebkitFullscreenMethods(videoElement)) {
    videoElement.webkitRequestFullscreen();
  } else if (hasMsFullscreenMethods(videoElement)) {
    videoElement.msRequestFullscreen();
  }
}
```

## Benefits

This type system provides several advantages:

1. **Type Safety**: Ensures that component props are properly typed and validated
2. **Intellisense Support**: Provides code completion based on the specific media type
3. **Runtime Type Checking**: Guards work at runtime to ensure correct component rendering
4. **Consistency**: Establishes a uniform pattern for all media components
5. **Browser Compatibility**: Safely handles vendor-specific APIs

## Media Types Organization

Media-related types are organized in:

- `src/types/media.ts`: Core media types for UI components
- `src/features/shared/Media/types.ts`: Feature-specific media types
- `src/utils/mediaTypeGuards.ts`: Element type guards for DOM operations 