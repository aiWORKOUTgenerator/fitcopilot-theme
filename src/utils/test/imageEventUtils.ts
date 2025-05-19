/**
 * Utility functions for simulating image events and testing image components
 */

import { Event, HTMLImageElement, TEventListener } from 'happy-dom';

type EventListeners = Record<string, TEventListener[]>;

/**
 * Creates a mock Image element with properties needed for testing
 */
export const createMockImageElement = (): HTMLImageElement => {
  const eventListeners: EventListeners = {};
  
  const element = document.createElement('img');

  // Add event handling methods
  element.addEventListener = jest.fn((event: string, callback: TEventListener) => {
    if (!eventListeners[event]) {
      eventListeners[event] = [];
    }
    eventListeners[event].push(callback);
  });

  element.removeEventListener = jest.fn((event: string, callback: TEventListener) => {
    if (eventListeners[event]) {
      eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
    }
  });

  element.dispatchEvent = jest.fn((event: Event) => {
    const listeners = eventListeners[event.type] || [];
    listeners.forEach(callback => callback(event));
    return true;
  });

  // Define read-only properties
  Object.defineProperties(element, {
    naturalWidth: {
      get: () => element.naturalWidth,
      set: (value: number) => {
        Object.defineProperty(element, 'naturalWidth', {
          value,
          writable: true
        });
      }
    },
    naturalHeight: {
      get: () => element.naturalHeight,
      set: (value: number) => {
        Object.defineProperty(element, 'naturalHeight', {
          value,
          writable: true
        });
      }
    },
    complete: {
      get: () => element.complete,
      set: (value: boolean) => {
        Object.defineProperty(element, 'complete', {
          value,
          writable: true
        });
      }
    },
    currentSrc: {
      get: () => element.currentSrc,
      set: (value: string) => {
        Object.defineProperty(element, 'currentSrc', {
          value,
          writable: true
        });
      }
    }
  });

  return element;
};

/**
 * Simulates an image event on an HTMLImageElement
 */
export const simulateImageEvent = (element: HTMLImageElement, eventType: string) => {
  const event = new Event(eventType);
  element.dispatchEvent(event);
};

/**
 * Simulates a successful image load
 */
export const simulateImageLoaded = (
  element: HTMLImageElement,
  width = 100,
  height = 100
) => {
  // Set properties that would be set after successful load
  Object.defineProperty(element, 'naturalWidth', { value: width });
  Object.defineProperty(element, 'naturalHeight', { value: height });
  Object.defineProperty(element, 'complete', { value: true });

  // Dispatch load event
  simulateImageEvent(element, 'load');
};

/**
 * Simulates an image load error
 */
export const simulateImageError = (element: HTMLImageElement) => {
  Object.defineProperty(element, 'complete', { value: true });
  Object.defineProperty(element, 'naturalWidth', { value: 0 });
  Object.defineProperty(element, 'naturalHeight', { value: 0 });

  // Dispatch error event
  simulateImageEvent(element, 'error');
};

/**
 * Simulates changing the image source
 */
export const simulateImageSrcChange = (
  element: HTMLImageElement,
  selectedSrc: string
) => {
  Object.defineProperty(element, 'currentSrc', { value: selectedSrc });
  simulateImageLoaded(element);
};

/**
 * Simulates responsive image selection based on viewport
 * @param element - The HTML image element to update
 * @param selectedSrc - The source that would be selected based on current viewport
 */
export const simulateResponsiveImageSelection = (
  element: HTMLImageElement,
  selectedSrc: string
) => {
  Object.defineProperty(element, 'currentSrc', { value: selectedSrc });
  simulateImageLoaded(element);
};

/**
 * Creates a mock IntersectionObserver for testing lazy loading
 */
export const createMockIntersectionObserver = () => {
  const mockObserver = {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [0],
  };

  return mockObserver;
};

/**
 * Simulates an image coming into view for lazy loading
 * @param element - The HTML image element to simulate intersection with
 * @param isIntersecting - Whether the element is intersecting the viewport
 */
export const simulateImageIntersection = (
  element: HTMLImageElement,
  isIntersecting = true
) => {
  const mockEntry = {
    target: element,
    isIntersecting,
    boundingClientRect: {},
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {},
    rootBounds: {},
    time: Date.now(),
  };

  // This would be called by the IntersectionObserver callback
  if (isIntersecting) {
    // When an image comes into view, the browser would start loading it
    // We can simulate this by triggering load after a small delay
    setTimeout(() => {
      simulateImageLoaded(element);
    }, 10);
  }

  return mockEntry;
}; 