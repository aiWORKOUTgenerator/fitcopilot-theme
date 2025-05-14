# Test Migration Guide

This guide provides instructions for updating tests to work with the refactored component structure and enhanced type system implemented during the ESLint remediation efforts.

## Table of Contents

1. [Import Path Updates](#import-path-updates)
2. [Type Guard Usage](#type-guard-usage)
3. [Component Selector Updates](#component-selector-updates)
4. [CSS Class Assertions](#css-class-assertions)
5. [React Testing Library Best Practices](#react-testing-library-best-practices)
6. [Specific Component Guidelines](#specific-component-guidelines)

## Import Path Updates

The most common issue is incorrect import paths for type guards. Update your imports using this pattern:

```typescript
// BEFORE
import { isVideoMedia } from '../types';
import { isPrimaryButton } from './types';

// AFTER
import { isVideoMedia } from '../../../utils/typeGuards/mediaTypeGuards';
import { isPrimaryButton } from '../../../utils/typeGuards/buttonTypeGuards';
```

### Complete Import Migration Table

| Component | Old Import | New Import |
|-----------|------------|------------|
| Media | `import { isVideoMedia } from '../types'` | `import { isVideoMedia } from '../../../utils/typeGuards/mediaTypeGuards'` |
| Media | `import { isAudioMedia } from '../types'` | `import { isAudioMedia } from '../../../utils/typeGuards/mediaTypeGuards'` |
| Media | `import { isImageMedia } from '../types'` | `import { isImageMedia } from '../../../utils/typeGuards/mediaTypeGuards'` |
| Button | `import { isActionButton } from './types'` | `import { isActionButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| Button | `import { isLinkButton } from './types'` | `import { isLinkButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| Card | `import { isContentCard } from '../types'` | `import { isContentCard } from '../../../utils/typeGuards/cardTypeGuards'` |

## Type Guard Usage

When testing type guards, be aware of discriminator property changes:

```typescript
// BEFORE
const props: MediaProps = {
  variant: 'video',
  src: 'test.mp4'
};

// AFTER (in core types)
const props: MediaProps = {
  type: 'video',  // Note 'type' instead of 'variant'
  src: 'test.mp4'
};

// AFTER (in component types)
const props: MediaProps = {
  variant: 'video',  // Some components still use 'variant'
  src: 'test.mp4'
};
```

### Discriminator Properties By Component

| Component | Type File | Discriminator Property |
|-----------|-----------|------------------------|
| Media (core types) | `/types/media.ts` | `type` |
| Media (component types) | `/features/shared/Media/types.ts` | `variant` |
| Button | `/features/shared/Button/types.ts` | `variant` |
| Card | `/types/card.ts` | `variant` |

## Component Selector Updates

Many components have changed their DOM structure. Update your selectors accordingly:

```typescript
// BEFORE - Simple audio element
const { getByRole } = render(
  <AudioPlayer variant="audio" src="audio.mp3" />
);
expect(getByRole('audio')).toBeInTheDocument();

// AFTER - Audio element inside a container
const { container } = render(
  <AudioPlayer variant="audio" src="audio.mp3" />
);
const audio = container.querySelector('audio');
expect(audio).toBeInTheDocument();
```

### Common Selector Changes

| Component | Old Selector | New Selector |
|-----------|--------------|--------------|
| AudioPlayer | `getByRole('audio')` | `container.querySelector('audio')` |
| Button as Link | `getByRole('link')` | `getByTestId('test-link')` |
| Video Player | `getByRole('video')` | `container.querySelector('video')` |

## CSS Class Assertions

Many components now use BEM naming conventions. Update class assertions:

```typescript
// BEFORE
expect(audio).toHaveClass('media-audio test-class');

// AFTER
expect(audio).toHaveClass('audio-player__element');
```

### Common Class Changes

| Component | Old Class | New Class |
|-----------|-----------|-----------|
| Audio | `media-audio` | `audio-player__element` |
| Video | `media-video` | `video-player__element` |
| Button | `btn-lg` | `btn-large` |
| Button (primary) | `btn-primary` | `btn btn-primary` |

## React Testing Library Best Practices

### Handling State Updates

Wrap component state updates in `act()`:

```typescript
// BEFORE
audio.dispatchEvent(new Event('loadeddata'));
expect(onLoad).toHaveBeenCalled();

// AFTER
act(() => {
  audio.dispatchEvent(new Event('loadeddata'));
});
expect(onLoad).toHaveBeenCalled();
```

### Use Data Attributes

Prefer data-testid attributes over role or class selectors:

```typescript
// BEFORE
const button = getByRole('button');

// AFTER
const button = getByTestId('test-button');
```

## Specific Component Guidelines

### AudioPlayer Tests

1. **Rendering**: Use `container.querySelector('audio')` instead of `getByRole('audio')`
2. **Class assertions**: Check for `audio-player__element` not `media-audio`
3. **Events**: Wrap all event dispatches in act()
4. **Controls**: The controls are now custom UI, not the native audio controls

### Button Tests

1. **Link rendering**: Check for data-testid instead of tagName
2. **CSS Classes**: Update assertions to match the new class format
3. **Type guards**: Update imports and ensure correct props structure

### Media Type Guard Tests

1. **Import paths**: Update all imports from '../types' to the new locations
2. **Discriminator**: Be aware of variant/type discriminator differences
3. **Props shape**: Use the appropriate interface (component-specific vs core)

## Example: Fixing a Failing Test

### Before:

```typescript
// src/features/shared/Media/__tests__/Media.type-guards.test.ts
import { 
  MediaProps, 
  isAudioMedia, 
  isVideoMedia 
} from '../types';

test('isVideoMedia correctly identifies video media', () => {
  const props: MediaProps = {
    variant: 'video',
    src: 'test.mp4'
  };
  
  expect(isVideoMedia(props)).toBe(true);
  expect(isAudioMedia(props)).toBe(false);
});
```

### After:

```typescript
// src/features/shared/Media/__tests__/Media.type-guards.test.ts
import { MediaProps } from '../types';
import { 
  isAudioMedia, 
  isVideoMedia 
} from '../../../utils/typeGuards/mediaTypeGuards';

test('isVideoMedia correctly identifies video media', () => {
  const props: MediaProps = {
    variant: 'video',  // Keep variant for component tests
    src: 'test.mp4'
  };
  
  expect(isVideoMedia(props)).toBe(true);
  expect(isAudioMedia(props)).toBe(false);
});
```

### Alternative for Core Types:

```typescript
// When using core types
import { MediaProps } from '../../../types/media';
import { 
  isAudioMedia, 
  isVideoMedia 
} from '../../../utils/typeGuards/mediaTypeGuards';

test('isVideoMedia correctly identifies video media', () => {
  const props: MediaProps = {
    type: 'video',  // Use type for core types
    src: 'test.mp4'
  };
  
  expect(isVideoMedia(props)).toBe(true);
  expect(isAudioMedia(props)).toBe(false);
});
```

## Temporary Solutions

If you need to quickly get tests passing without fully migrating them:

1. **Skip problematic tests**: Add `test.skip()` with a TODO comment
2. **Mock type guards**: Create simple mock implementations for missing functions
3. **Disable strict assertions**: Use `.toHaveClass()` with fewer class names
4. **Update only the most critical tests**: Focus on core functionality tests first 