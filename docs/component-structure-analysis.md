# Component Structure Analysis

This document analyzes changes in component structures as part of the ESLint remediation and type system enhancement efforts.

## Button Component

### Component Hierarchy

**Before:**
```jsx
<button 
  className={`btn btn-${variant} ${className}`} 
  onClick={onClick}
  {...otherProps}
>
  {children}
</button>
```

**After:**
```jsx
<button
  type={type}
  onClick={handleClick}
  disabled={disabled}
  className={classes}
  aria-label={ariaLabel}
  data-testid={testId}
>
  {children}
</button>
```

### Prop Interface Changes

**Before:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  // Other optional props
}
```

**After:** Discriminated Union Pattern
```typescript
// Base interface
interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  // Common props for all buttons
}

// Variant-specific interfaces
interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

interface SecondaryButtonProps extends BaseButtonProps {
  variant: 'secondary';
  outline?: boolean;
  // Secondary-specific props
}

// Union type
type ButtonProps =
  | PrimaryButtonProps
  | SecondaryButtonProps
  | TextButtonProps
  | IconButtonProps 
  | LinkButtonProps
  | /* Other variants */;
```

### CSS Class Changes

| Before | After | Notes |
|--------|-------|-------|
| `btn btn-primary` | `btn btn-primary` | Base structure maintained |
| `btn-lg` | `btn-large` | More descriptive naming |
| Class concatenation with string | Filtered array join | More robust handling of empty classes |

### Type Guard Usage

**Before:**
```typescript
// Inline checks
if (props.href) {
  // Render as link
} else {
  // Render as button
}
```

**After:**
```typescript
// Type guard functions
if (isLinkButton(props)) {
  // Render as link with type safety
} else {
  // Render as button with type safety
}
```

## Media Components

### Component Hierarchy

#### Audio Player

**Before:**
```jsx
<audio
  className={`media-audio ${className}`}
  src={src}
  controls={controls}
  autoPlay={autoPlay}
  loop={loop}
  onLoadedData={handleLoad}
  {...otherProps}
/>
```

**After:**
```jsx
<div
  className={`audio-player ${className}`}
  data-testid="audio-player"
  {...divProps}
>
  <audio
    ref={audioRef}
    src={src}
    loop={loop}
    preload="metadata"
    aria-label={ariaLabel}
    controls={false} // Custom controls
    className="audio-player__element"
  >
    Your browser does not support HTML5 audio.
  </audio>
  
  {/* Custom controls */}
  {controls && !hasError && (
    <div className="audio-player__controls">
      {/* Play/pause, progress, volume controls */}
    </div>
  )}
</div>
```

### Prop Interface Changes

**Before:**
```typescript
interface MediaProps {
  variant: 'image' | 'video' | 'audio';
  src: string;
  className?: string;
  // Common media props
  
  // Mixed props for all types
  controls?: boolean; // For video/audio
  poster?: string;    // For video
  alt?: string;       // For image
}
```

**After:** Discriminated Union Pattern
```typescript
// Base interface
interface BaseMediaProps {
  className?: string;
  id?: string;
  caption?: string;
  alt?: string;
  // Common props
}

// Specific media types
interface AudioMediaProps extends BaseMediaProps {
  variant: 'audio';
  src: string;
  controls?: boolean;
  // Audio-specific props
  onLoad?: () => void;
  showWaveform?: boolean;
}

interface VideoMediaProps extends BaseMediaProps {
  variant: 'video';
  src: string;
  poster?: string;
  // Video-specific props
}

// Union type
type MediaProps =
  | ImageMediaProps
  | VideoMediaProps
  | AudioMediaProps
  | /* Other media types */;
```

### CSS Class Changes

| Before | After | Notes |
|--------|-------|-------|
| `media-audio` | `audio-player__element` | BEM naming convention |
| `media-controls` | `audio-player__controls` | Component-specific prefixes |
| Simple class structure | Nested BEM components | More organized hierarchy |

### Discriminator Change

The biggest change in the Media components is the discriminator property:

**Before:** Using `variant` for all media types
```typescript
// Types
interface MediaProps {
  variant: 'audio' | 'video' | 'image';
  // other props
}

// Type guards
function isAudioMedia(props: MediaProps): props is AudioMediaProps {
  return props.variant === 'audio';
}
```

**After:** Using `type` in the core types, but still `variant` in component-specific types
```typescript
// Core types (/types/media.ts)
interface BaseMediaProps {
  // common props
}

interface VideoMediaProps extends BaseMediaProps {
  type: 'video';  // Using type discriminator
  // video props
}

// Component types (/features/shared/Media/types.ts)
interface VideoMediaProps extends BaseMediaProps {
  variant: 'video';  // Still using variant here
  // video props
}
```

This discrepancy between core types and component types is causing test failures.

## Key Issues Affecting Tests

1. **Discriminator Property Inconsistency**: `type` vs `variant` across different files
2. **Component Structure Changes**: Particularly for AudioPlayer (audio element wrapped in div)
3. **CSS Class Name Changes**: Following BEM convention instead of flat class names
4. **Type Guard Location**: Moved from component types to centralized utils
5. **Enhanced Prop Types**: More specific prop types with strict discriminated unions

## Required Test Updates

1. **Update Imports**: Point to new type guard locations
2. **Fix Selectors**: Update element selectors (e.g., `getByRole('audio')` → `container.querySelector('audio')`)
3. **Update Class Assertions**: Match new BEM class naming
4. **Fix Type Assertions**: Update type assertions to match new interfaces
5. **Wrap State Updates**: Use React Testing Library's `act()` for state changes 