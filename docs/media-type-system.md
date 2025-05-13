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
  ├── ImageMediaProps (type: 'image')
  ├── VideoMediaProps (type: 'video')
  ├── IconMediaProps (type: 'icon')
  └── AvatarMediaProps (type: 'avatar')
```

These types are combined into the `MediaProps` discriminated union:

```typescript
export type MediaProps = 
  | ImageMediaProps 
  | VideoMediaProps 
  | IconMediaProps 
  | AvatarMediaProps;
```

## Type Guards

Type guards are provided for each media variant:

```typescript
export const isImageMedia = (props: MediaProps): props is ImageMediaProps => {
  return props.type === 'image';
};

export const isVideoMedia = (props: MediaProps): props is VideoMediaProps => {
  return props.type === 'video';
};

// Additional guards for each media variant...
```

## Media Component Implementation

The `Media` component acts as a discriminated union switcher, using type guards to render the appropriate component:

```typescript
export const Media: React.FC<MediaProps> = (props) => {
  if (isImageMedia(props)) return <img {...props} />;
  if (isVideoMedia(props)) return <VideoPlayer {...props} />;
  if (isIconMedia(props)) return <Icon {...props} />;
  if (isAvatarMedia(props)) return <Avatar {...props} />;
  return null;
};
```

## Usage Examples

### Image Media

```tsx
import { Media } from 'features/shared/Media';

<Media 
  type="image"
  src="/images/workout.jpg"
  alt="Person doing a workout"
  width={640}
  height={480}
  loading="lazy"
/>
```

### Video Media

```tsx
import { Media } from 'features/shared/Media';

<Media 
  type="video"
  src="/videos/exercise-demo.mp4"
  alt="Exercise demonstration"
  poster="/images/video-poster.jpg"
  controls
  muted
  autoPlay={false}
  width={640}
  height={360}
/>
```

### Icon Media

```tsx
import { Media } from 'features/shared/Media';

<Media 
  type="icon"
  icon="dumbbell"
  alt="Weightlifting"
  size="medium"
  color="var(--color-accent)"
/>
```

### Avatar Media

```tsx
import { Media } from 'features/shared/Media';

<Media 
  type="avatar"
  src="/images/user-profile.jpg"
  alt="User Profile"
  size="medium"
  shape="circle"
  fallback={<span>JD</span>}
/>
```

## Event Handling

Media components come with type-safe event handlers:

```typescript
export type MediaLoadHandler = (event: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => void;
export type MediaErrorHandler = (event: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => void;
```

Example usage:

```tsx
const handleMediaLoad: MediaLoadHandler = (event) => {
  console.log('Media loaded successfully');
};

const handleMediaError: MediaErrorHandler = (event) => {
  console.error('Failed to load media');
};

<Media 
  type="image"
  src="/images/workout.jpg"
  alt="Workout"
  onLoad={handleMediaLoad}
  onError={handleMediaError}
/>
```

## Best Practices

1. **Always use the type discriminator** to ensure proper type checking
2. **Provide meaningful alt text** for accessibility
3. **Use appropriate loading strategies** (lazy loading for non-critical media)
4. **Handle errors gracefully** with fallback content
5. **Optimize media sources** for different viewport sizes when applicable 