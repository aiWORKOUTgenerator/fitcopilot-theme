# Media Component Testing Guide

This guide documents testing patterns and best practices for testing media components in our React/TypeScript application.

## General Testing Principles

1. **Focus on behavior, not implementation** - Test what users will experience, not internal implementation details.
2. **Use modern testing tools** - Prefer `screen` queries over the render result, `userEvent` over `fireEvent`, and async/await patterns.
3. **Test accessibility** - Ensure components are tested using accessibility queries where possible.
4. **Test edge cases** - Include tests for loading states, errors, and boundary conditions.

## Setting Up Tests

For all media components, follow this pattern:

```typescript
// Import from testing library
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import YourComponent from '../YourComponent';
import { YourComponentProps } from '../types';

describe('YourComponent component', () => {
    // Setup helper to reduce boilerplate
    const setup = (props = {}) => {
        const defaultProps: YourComponentProps = {
            // Default props here
        };

        const mergedProps = { ...defaultProps, ...props };
        const user = userEvent.setup();
        return {
            user,
            ...render(<YourComponent {...mergedProps} />)
        };
    };

    // Test cases
});
```

## Testing Image Components

For image components, include tests for:

1. **Basic rendering** - Verify the component renders with correct attributes (src, alt, etc.).
2. **Responsive features** - Test srcSet and sizes attributes.
3. **Loading states** - Test lazy loading and image loading events.
4. **Accessibility** - Test alt text and ARIA attributes.
5. **Styling variations** - Test different visual modes (circle, etc.).

```typescript
// Example test for image loading
import { simulateImageLoaded, simulateImageError } from '../../../utils/test/imageEventUtils';

it('handles loading and error states appropriately', async () => {
    const { container } = setup();
    
    const img = screen.getByAltText('Image description');
    
    // Test successful load
    await waitFor(() => {
        simulateImageLoaded(img);
    });
    
    expect(img).toBeInTheDocument();
    
    // In a separate test, test error state
    setup();
    const imgForError = screen.getByAltText('Image description');
    
    await waitFor(() => {
        simulateImageError(imgForError);
    });
    
    // Assert error state indicators
});
```

## Testing Gallery Components

For image galleries and carousels, include tests for:

1. **Navigation** - Test next/previous navigation functionality.
2. **Loop behavior** - Test looping at the beginning and end of the collection.
3. **State tracking** - Test that indicators and counters update correctly.
4. **Callbacks** - Test that callback functions get called with the right arguments.
5. **Keyboard navigation** - Test keyboard accessibility.

```typescript
// Example keyboard navigation test
import { simulateKeyboardNavigation } from '../../../utils/test/galleryTestUtils';

it('supports keyboard navigation', async () => {
    const { container } = setup();

    // Focus the gallery
    const gallery = screen.getByRole('region');
    gallery.focus();

    // Navigate with keyboard
    simulateKeyboardNavigation(gallery, 'ArrowRight');
    await waitFor(() => expect(screen.getByAltText('Next image')).toBeInTheDocument());
});
```

## Testing Video Components

For video components, use the `mediaEventUtils.ts` utilities to simulate media events:

1. **Playback controls** - Test play, pause, and seek functionality.
2. **Loading states** - Test the loading lifecycle.
3. **Error handling** - Test error scenarios.
4. **Event callbacks** - Test that callbacks respond to media events.

```typescript
// Example for simulating media loading
import { simulateMediaLoading } from '../../../utils/test/mediaEventUtils';

it('handles video loading state', async () => {
    const { container } = setup();
    
    const video = container.querySelector('video');
    simulateMediaLoading(video);
    
    // Assert loading UI state changes
});
```

## Testing YouTube Components

For YouTube embeds, use the mock YouTube player API:

```typescript
import { createMockYouTubePlayer } from '../../../utils/test/mediaEventUtils';

it('controls YouTube playback', () => {
    // Setup with mock player
    const mockPlayer = createMockYouTubePlayer();
    // Test playback controls
});
```

## Image Testing Utilities

The `imageEventUtils.ts` file provides utilities for testing image components:

- `createMockImageElement()` - Creates a mock image element with all necessary properties
- `simulateImageEvent()` - Simulates generic image events
- `simulateImageLoaded()` - Simulates a successful image load
- `simulateImageError()` - Simulates an image loading error
- `simulateResponsiveImageSelection()` - Simulates browser selecting a specific source from srcset
- `createMockIntersectionObserver()` - Creates a mock IntersectionObserver for testing lazy loading
- `simulateImageIntersection()` - Simulates an image entering or leaving the viewport

Example usage:

```typescript
import { simulateResponsiveImageSelection } from '../../../utils/test/imageEventUtils';

it('selects the correct image source based on viewport size', async () => {
    const { container } = setup({
        srcSet: 'small.jpg 480w, medium.jpg 800w, large.jpg 1200w',
        sizes: '(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px'
    });
    
    const img = screen.getByAltText('Responsive image');
    
    // Simulate browser selecting medium size image
    simulateResponsiveImageSelection(img, 'medium.jpg');
    
    expect(img.currentSrc).toBe('medium.jpg');
});
```

## Gallery Testing Utilities

The `galleryTestUtils.ts` file provides utilities for testing gallery and carousel components:

- `createTestImageCollection()` - Creates a test collection of images for gallery testing
- `createTestMediaCollection()` - Creates a mixed media collection for carousel testing
- `createMockCarouselRef()` - Creates a mock ref for carousel component testing
- `simulateKeyboardNavigation()` - Simulates keyboard navigation events
- `simulateSwipeGesture()` - Simulates touch swipe gestures for testing mobile interactions

Example usage:

```typescript
import { createTestImageCollection, simulateSwipeGesture } from '../../../utils/test/galleryTestUtils';

describe('ImageGallery mobile interactions', () => {
    it('responds to swipe gestures', async () => {
        const images = createTestImageCollection(3);
        const { container } = setup({ images });
        
        const gallery = screen.getByRole('region');
        
        // Initial image
        expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
        
        // Swipe left to go to next image
        simulateSwipeGesture(gallery, 'left');
        
        await waitFor(() => {
            expect(screen.getByAltText('Test image 2')).toBeInTheDocument();
        });
    });
});
```

## Accessibility Testing Patterns

Always include these accessibility tests for media components:

1. **Screen reader content** - Test that non-visible content is available to screen readers.
2. **Keyboard navigation** - Test keyboard accessibility.
3. **ARIA attributes** - Test that appropriate ARIA roles and attributes are set.
4. **Focus management** - Test focus behavior for interactive elements.

## Common Patterns and Best Practices

1. Use `screen.getByRole()` where possible for better accessibility testing.
2. Use `await user.click()` instead of `fireEvent.click()` for more realistic interaction testing.
3. Use `waitFor()` when testing asynchronous behavior.
4. Test component variants and props independently.
5. Keep tests focused on one behavior per test case.
6. Use descriptive test names that explain the expected behavior.

## Media Event Simulation

Use the utility functions from `mediaEventUtils.ts` to simulate complex media events:

- `createMockMediaElement()` - Creates a mock HTML5 media element
- `simulateMediaEvent()` - Simulates media events like 'play', 'pause', etc.
- `simulateMediaLoading()` - Simulates the full media loading lifecycle
- `simulateMediaError()` - Simulates media error scenarios
- `createMockYouTubePlayer()` - Creates a mock YouTube player API

These utilities help test complex media behavior without actual media loading. 