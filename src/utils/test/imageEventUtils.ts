/**
 * Utility functions for simulating image events and testing image components
 */

/**
 * Creates a mock Image element with properties needed for testing
 */
export const createMockImageElement = () => {
  const eventListeners = {};

  const mockImage = {
    // DOM properties
    src: '',
    alt: '',
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    complete: false,
    loading: 'eager',
    decoding: 'auto',
    srcset: '',
    sizes: '',
    currentSrc: '',

    // Event handling
    addEventListener: jest.fn((event, callback) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(callback);
    }),

    removeEventListener: jest.fn((event, callback) => {
      if (eventListeners[event]) {
        eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
      }
    }),

    dispatchEvent: jest.fn(event => {
      const listeners = eventListeners[event.type] || [];
      listeners.forEach(callback => callback(event));
      return true;
    }),

    // DOM methods
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    removeAttribute: jest.fn(),

    // DOM node properties
    style: {},
    className: '',
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn().mockReturnValue(false),
      toggle: jest.fn()
    },

    // Required for React operations
    nodeName: 'IMG',
    nodeType: 1,
    ownerDocument: document,
  };

  return mockImage;
};

/**
 * Simulates an image event on a given element
 * @param element - The HTML image element to dispatch the event on
 * @param eventType - The type of event to simulate (e.g. 'load', 'error')
 * @param eventData - Additional data to include with the event
 */
export const simulateImageEvent = (
  element: HTMLImageElement,
  eventType: string,
  eventData = {}
) => {
  const event = new Event(eventType);
  Object.assign(event, eventData);
  element.dispatchEvent(event);
  return event;
};

/**
 * Simulates an image loading successfully
 * @param element - The HTML image element to update
 * @param width - Natural width to set for the loaded image
 * @param height - Natural height to set for the loaded image
 */
export const simulateImageLoaded = (
  element: HTMLImageElement,
  width = 800,
  height = 600
) => {
  // Set properties that would be set after successful load
  element.naturalWidth = width;
  element.naturalHeight = height;
  element.complete = true;

  // Dispatch load event
  simulateImageEvent(element, 'load');
};

/**
 * Simulates an image loading error
 * @param element - The HTML image element to update
 */
export const simulateImageError = (element: HTMLImageElement) => {
  element.complete = true;
  element.naturalWidth = 0;
  element.naturalHeight = 0;

  // Dispatch error event
  simulateImageEvent(element, 'error');
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
  element.currentSrc = selectedSrc;
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