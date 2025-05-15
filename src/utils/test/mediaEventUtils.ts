/**
 * Utility functions for simulating HTML5 media events in tests
 */

/**
 * Creates a mock HTML5 media element (video/audio) with all necessary properties and methods
 * that can be used in tests to simulate media behavior
 */
export const createMockMediaElement = () => {
    const eventListeners = {};

    const mockElement = {
        // Methods
        play: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn(),
        load: jest.fn(),
        canPlayType: jest.fn().mockReturnValue('probably'),

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

        // DOM properties that React requires
        setAttribute: jest.fn(),
        getAttribute: jest.fn(),
        removeAttribute: jest.fn(),

        // Properties
        currentTime: 0,
        duration: 100,
        volume: 1,
        muted: false,
        playbackRate: 1,
        readyState: 0,
        networkState: 0,
        paused: true,
        ended: false,
        seeking: false,
        loop: false,
        controls: true,
        autoplay: false,
        defaultMuted: false,
        error: null,

        // Dimensions
        videoWidth: 1280,
        videoHeight: 720,

        // DOM node properties
        style: {},
        className: '',
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn().mockReturnValue(false),
            toggle: jest.fn()
        },

        nodeName: 'VIDEO',

        // Required for some React operations
        ownerDocument: document,
        nodeType: 1,
    };

    return mockElement;
};

/**
 * Simulates a media event on a given element
 * @param element - The HTML media element to dispatch the event on
 * @param eventType - The type of event to simulate (e.g. 'play', 'pause', 'timeupdate')
 * @param eventData - Additional data to include with the event
 * @returns The created event
 */
export const simulateMediaEvent = (
    element: HTMLMediaElement,
    eventType: string,
    eventData = {}
) => {
    const event = new Event(eventType);
    Object.assign(event, eventData);
    element.dispatchEvent(event);
    return event;
};

/**
 * Simulates a media element going through the loading process
 * @param element - The HTML media element to update
 */
export const simulateMediaLoading = (element: HTMLMediaElement) => {
    element.readyState = 2; // HAVE_CURRENT_DATA
    simulateMediaEvent(element, 'loadstart');
    simulateMediaEvent(element, 'loadedmetadata');
    element.readyState = 4; // HAVE_ENOUGH_DATA
    simulateMediaEvent(element, 'canplay');
    simulateMediaEvent(element, 'canplaythrough');
    simulateMediaEvent(element, 'loadeddata');
};

/**
 * Simulates a media error event
 * @param element - The HTML media element to update
 * @param errorCode - The error code to set (1: MEDIA_ERR_ABORTED, 2: MEDIA_ERR_NETWORK, 
 *                    3: MEDIA_ERR_DECODE, 4: MEDIA_ERR_SRC_NOT_SUPPORTED)
 */
export const simulateMediaError = (element: HTMLMediaElement, errorCode = 2) => {
    // Create a MediaError
    const error = new MediaError();
    Object.defineProperty(error, 'code', { value: errorCode });
    element.error = error;
    simulateMediaEvent(element, 'error');
};

/**
 * Creates a mock YouTube Player API
 */
export const createMockYouTubePlayer = () => {
    return {
        playVideo: jest.fn(),
        pauseVideo: jest.fn(),
        mute: jest.fn(),
        unMute: jest.fn(),
        seekTo: jest.fn(),
        setVolume: jest.fn(),
        getPlayerState: jest.fn().mockReturnValue(2), // Default: paused
        getCurrentTime: jest.fn().mockReturnValue(0),
        getDuration: jest.fn().mockReturnValue(100),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        destroy: jest.fn(),
    };
}; 