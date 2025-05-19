/**
 * Utility functions for testing gallery and carousel components
 */

type EventListener = (event: Event) => void;
type EventListeners = Record<string, EventListener[]>;

/**
 * Creates a test image collection for use in gallery components
 * @param count Number of test images to generate
 * @returns Array of image objects with src and alt properties
 */
export const createTestImageCollection = (count = 3) => {
  return Array.from({ length: count }, (_, index) => ({
    src: `test-image-${index + 1}.jpg`,
    alt: `Test image ${index + 1}`
  }));
};

/**
 * Creates a test mixed media collection for use in carousel components
 * @param imageCount Number of images to include
 * @param videoCount Number of videos to include
 * @returns Array of media items with type, src and alt properties
 */
export const createTestMediaCollection = (imageCount = 2, videoCount = 1) => {
  const items = [];

  // Add images
  for (let i = 0; i < imageCount; i++) {
    items.push({
      type: 'image' as const,
      src: `test-image-${i + 1}.jpg`,
      alt: `Test image ${i + 1}`
    });
  }

  // Add videos
  for (let i = 0; i < videoCount; i++) {
    items.push({
      type: 'video' as const,
      src: `test-video-${i + 1}.mp4`,
      alt: `Test video ${i + 1}`
    });
  }

  return items;
};

/**
 * Creates a mock carousel component reference
 * This helps with testing keyboard navigation and focus management
 */
export const createMockCarouselRef = () => {
  const eventListeners: EventListeners = {};

  const mockCarousel = {
    // DOM methods
    focus: jest.fn(),
    blur: jest.fn(),
    click: jest.fn(),

    // Event handling
    addEventListener: jest.fn((event: string, callback: EventListener) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(callback);
    }),

    removeEventListener: jest.fn((event: string, callback: EventListener) => {
      if (eventListeners[event]) {
        eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
      }
    }),

    dispatchEvent: jest.fn((event: Event) => {
      const listeners = eventListeners[event.type] || [];
      listeners.forEach(callback => callback(event));
      return true;
    }),

    // DOM properties
    tabIndex: 0,
    ariaLabel: '',
    role: 'region',

    // Navigation methods
    querySelector: jest.fn().mockImplementation(selector => {
      if (selector.includes('prev')) {
        return { click: jest.fn() };
      }
      if (selector.includes('next')) {
        return { click: jest.fn() };
      }
      return null;
    }),

    // For checking focus trapping
    contains: jest.fn().mockReturnValue(true),
  };

  return mockCarousel;
};

/**
 * Simulates keyboard navigation in a gallery or carousel component
 * @param element The gallery/carousel DOM element
 * @param key The key to simulate ('ArrowLeft', 'ArrowRight', etc.)
 */
export const simulateKeyboardNavigation = (element: HTMLElement, key: string) => {
  const keyboardEvent = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(keyboardEvent);
  return keyboardEvent;
};

/**
 * Simulates a swipe gesture on a gallery or carousel component
 * @param element The gallery/carousel DOM element
 * @param direction 'left' or 'right'
 * @param distance Distance of the swipe in pixels
 */
export const simulateSwipeGesture = (element: HTMLElement, direction: 'left' | 'right', distance = 100) => {
  // Calculate start and end points based on direction
  const rect = element.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;

  let startX, endX;
  if (direction === 'left') {
    // Swipe left (next)
    startX = rect.left + rect.width * 0.8;
    endX = startX - distance;
  } else {
    // Swipe right (previous)
    startX = rect.left + rect.width * 0.2;
    endX = startX + distance;
  }

  // Touch start
  const touchStartEvent = new TouchEvent('touchstart', {
    bubbles: true,
    cancelable: true,
    touches: [
      new Touch({
        identifier: 0,
        target: element,
        clientX: startX,
        clientY: centerY
      })
    ]
  });
  element.dispatchEvent(touchStartEvent);

  // Touch move
  const touchMoveEvent = new TouchEvent('touchmove', {
    bubbles: true,
    cancelable: true,
    touches: [
      new Touch({
        identifier: 0,
        target: element,
        clientX: endX,
        clientY: centerY
      })
    ]
  });
  element.dispatchEvent(touchMoveEvent);

  // Touch end
  const touchEndEvent = new TouchEvent('touchend', {
    bubbles: true,
    cancelable: true,
    touches: []
  });
  element.dispatchEvent(touchEndEvent);

  return { touchStartEvent, touchMoveEvent, touchEndEvent };
}; 