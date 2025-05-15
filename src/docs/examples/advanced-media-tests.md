# Advanced Media Component Testing Examples

This document provides advanced testing examples that demonstrate how to use the media testing utilities for complex scenarios.

## Testing Responsive Image Behavior

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { simulateImageLoaded, simulateResponsiveImageSelection } from '../../../utils/test/imageEventUtils';
import ResponsiveImage from '../ResponsiveImage';

describe('ResponsiveImage component', () => {
  // Test responsive behavior with different viewport sizes
  it('selects appropriate image source based on viewport size', async () => {
    // Define media queries to test
    const srcSet = 'image-small.jpg 480w, image-medium.jpg 800w, image-large.jpg 1200w';
    const sizes = '(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px';
    
    const { container } = render(
      <ResponsiveImage 
        src="image-fallback.jpg" 
        alt="Responsive test image" 
        srcSet={srcSet}
        sizes={sizes}
      />
    );
    
    const img = screen.getByAltText('Responsive test image');
    
    // Test small viewport selection
    simulateResponsiveImageSelection(img, 'image-small.jpg');
    expect(img.currentSrc).toBe('image-small.jpg');
    expect(container.querySelector('.responsive-image--loaded')).toBeInTheDocument();
    
    // Test medium viewport selection
    simulateResponsiveImageSelection(img, 'image-medium.jpg');
    expect(img.currentSrc).toBe('image-medium.jpg');
  });
});
```

## Testing Lazy Loading Images

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { 
  createMockIntersectionObserver, 
  simulateImageIntersection, 
  simulateImageLoaded 
} from '../../../utils/test/imageEventUtils';
import LazyImage from '../LazyImage';

describe('LazyImage component', () => {
  // Mock IntersectionObserver before tests
  let originalIntersectionObserver;
  let mockIntersectionObserver;
  
  beforeEach(() => {
    originalIntersectionObserver = window.IntersectionObserver;
    mockIntersectionObserver = createMockIntersectionObserver();
    window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      // Store the callback to call it in tests
      mockIntersectionObserver.callback = callback;
      return mockIntersectionObserver;
    });
  });
  
  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
  });

  it('loads image when it enters the viewport', async () => {
    const { container } = render(
      <LazyImage 
        src="lazy-test-image.jpg" 
        alt="Lazy loaded image" 
        width={640}
        height={480}
      />
    );
    
    const img = screen.getByAltText('Lazy loaded image');
    
    // Verify image has not loaded yet
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img.src).not.toContain('lazy-test-image.jpg');
    expect(img).toHaveAttribute('data-src', 'lazy-test-image.jpg');
    
    // Simulate image entering viewport
    const entry = simulateImageIntersection(img, true);
    mockIntersectionObserver.callback([entry]);
    
    // Verify image is now loading
    await waitFor(() => {
      expect(img.src).toContain('lazy-test-image.jpg');
    });
    
    // Simulate load completion
    simulateImageLoaded(img);
    
    // Verify loaded state is applied
    expect(container.querySelector('.lazy-image--loaded')).toBeInTheDocument();
  });
});
```

## Testing Advanced Image Gallery with Keyboard, Mouse, and Touch Interactions

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { 
  createTestImageCollection, 
  simulateKeyboardNavigation, 
  simulateSwipeGesture 
} from '../../../utils/test/galleryTestUtils';
import AdvancedGallery from '../AdvancedGallery';

describe('AdvancedGallery component', () => {
  const testImages = createTestImageCollection(5);
  
  // Helper setup function
  const setup = (props = {}) => {
    const defaultProps = {
      images: testImages,
    };
    
    const mergedProps = { ...defaultProps, ...props };
    const user = userEvent.setup();
    
    return {
      user,
      ...render(<AdvancedGallery {...mergedProps} />)
    };
  };

  // Test different navigation methods
  it('supports all navigation methods: buttons, keyboard, and touch', async () => {
    const onImageChange = jest.fn();
    const { user, container } = setup({ onImageChange });
    
    // Get gallery element and navigation buttons
    const gallery = screen.getByRole('region', { name: /gallery/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });
    
    // Initial state
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    expect(onImageChange).not.toHaveBeenCalled();
    
    // 1. Test button navigation
    await user.click(nextButton);
    expect(screen.getByAltText('Test image 2')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenCalledWith(1);
    
    await user.click(prevButton);
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    expect(onImageChange).toHaveBeenCalledWith(0);
    
    // 2. Test keyboard navigation
    gallery.focus();
    simulateKeyboardNavigation(gallery, 'ArrowRight');
    await waitFor(() => {
      expect(screen.getByAltText('Test image 2')).toBeInTheDocument();
    });
    expect(onImageChange).toHaveBeenCalledWith(1);
    
    simulateKeyboardNavigation(gallery, 'ArrowLeft');
    await waitFor(() => {
      expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    });
    expect(onImageChange).toHaveBeenCalledWith(0);
    
    // 3. Test touch swipe navigation
    simulateSwipeGesture(gallery, 'left');
    await waitFor(() => {
      expect(screen.getByAltText('Test image 2')).toBeInTheDocument();
    });
    expect(onImageChange).toHaveBeenCalledWith(1);
    
    simulateSwipeGesture(gallery, 'right');
    await waitFor(() => {
      expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    });
    expect(onImageChange).toHaveBeenCalledWith(0);
    
    // 4. Test circular navigation (to last image)
    for (let i = 0; i < 4; i++) {
      await user.click(nextButton);
    }
    expect(screen.getByAltText('Test image 5')).toBeInTheDocument();
    
    // Go forward from last image to wrap around
    await user.click(nextButton);
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
  });
});
```

## Testing Mixed Media Carousel with Videos and Images

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { createTestMediaCollection } from '../../../utils/test/galleryTestUtils';
import { simulateMediaLoading } from '../../../utils/test/mediaEventUtils';
import MediaCarousel from '../MediaCarousel';

describe('MediaCarousel with mixed media', () => {
  // Create a collection with 2 images and 2 videos
  const mediaItems = createTestMediaCollection(2, 2);
  
  const setup = (props = {}) => {
    const defaultProps = {
      items: mediaItems,
    };
    
    const mergedProps = { ...defaultProps, ...props };
    const user = userEvent.setup();
    
    return {
      user,
      ...render(<MediaCarousel {...mergedProps} />)
    };
  };

  it('handles different media types correctly', async () => {
    const { user, container } = setup();
    
    // First item is an image
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    
    // Navigate to first video
    const nextButton = screen.getByLabelText('Next item');
    await user.click(nextButton);
    
    // Check if video is visible
    const video = screen.getByRole('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'test-video-1.mp4');
    
    // Simulate video loading
    simulateMediaLoading(video);
    
    // Test video controls visibility
    expect(video).toHaveAttribute('controls');
    
    // Continue through carousel to second image
    await user.click(nextButton);
    expect(screen.getByAltText('Test image 2')).toBeInTheDocument();
    
    // And to second video
    await user.click(nextButton);
    const secondVideo = screen.getByRole('video');
    expect(secondVideo).toHaveAttribute('src', 'test-video-2.mp4');
    
    // Test looping back to first item
    await user.click(nextButton);
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
  });
});
```

## Testing Image Lightbox with Focus Trapping

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { simulateImageLoaded } from '../../../utils/test/imageEventUtils';
import { createTestImageCollection } from '../../../utils/test/galleryTestUtils';
import ImageLightbox from '../ImageLightbox';

describe('ImageLightbox component', () => {
  const testImages = createTestImageCollection(3);
  
  // Setup function
  const setup = (props = {}) => {
    const defaultProps = {
      isOpen: false,
      images: testImages,
      initialIndex: 0,
      onClose: jest.fn(),
    };
    
    const mergedProps = { ...defaultProps, ...props };
    const user = userEvent.setup();
    
    return {
      user,
      ...render(<ImageLightbox {...mergedProps} />)
    };
  };

  it('manages focus correctly when opened and closed', async () => {
    // First render closed
    const onClose = jest.fn();
    const { user, rerender } = setup({ onClose });
    
    // Lightbox is not in the document
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Open the lightbox
    rerender(<ImageLightbox isOpen={true} images={testImages} initialIndex={0} onClose={onClose} />);
    
    // Now the lightbox should be visible
    const lightbox = screen.getByRole('dialog');
    expect(lightbox).toBeInTheDocument();
    
    // The close button should be focused
    const closeButton = screen.getByLabelText('Close lightbox');
    expect(document.activeElement).toBe(closeButton);
    
    // Test that the first image is displayed
    const firstImage = screen.getByAltText('Test image 1');
    expect(firstImage).toBeInTheDocument();
    simulateImageLoaded(firstImage);
    
    // Test that Escape key closes the lightbox
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    
    // Test click on close button
    onClose.mockClear();
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus within the lightbox', async () => {
    const { user } = setup({ isOpen: true });
    
    // Get all focusable elements in the lightbox
    const closeButton = screen.getByLabelText('Close lightbox');
    const prevButton = screen.getByLabelText('Previous image');
    const nextButton = screen.getByLabelText('Next image');
    
    // Initial focus should be on close button
    expect(document.activeElement).toBe(closeButton);
    
    // Tab to next button
    await user.tab();
    expect(document.activeElement).toBe(prevButton);
    
    // Tab to previous button
    await user.tab();
    expect(document.activeElement).toBe(nextButton);
    
    // Tab again should loop back to close button
    await user.tab();
    expect(document.activeElement).toBe(closeButton);
    
    // Shift+Tab should go to next button
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toBe(nextButton);
  });
});
```

## Best Practices Summary

1. **Isolate tests properly**: Each test should be independent and not affect others. Use proper cleanup in `beforeEach` and `afterEach`.

2. **Mock browser APIs consistently**: When testing components that use browser APIs like IntersectionObserver or ResizeObserver, ensure consistent mocking patterns.

3. **Test real user interactions**: Use `userEvent` instead of `fireEvent` for realistic interaction testing.

4. **Test accessibility features**: Always verify that media components are accessible using keyboard navigation, ARIA attributes, and proper focus management.

5. **Simulate complex sequences**: For media components, test complete interaction sequences rather than just isolated events.

6. **Use utility functions**: Leverage utility functions to reduce boilerplate and maintain consistency across tests.

7. **Test edge cases**: Include tests for error states, empty states, and boundary conditions.

8. **Test responsiveness**: Verify that responsive behaviors work correctly with proper simulation. 