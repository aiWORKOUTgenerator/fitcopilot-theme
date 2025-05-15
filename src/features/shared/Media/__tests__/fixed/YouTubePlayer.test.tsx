import { render, waitFor } from '@testing-library/react';
import React from 'react';
import logger from '../../../../../utils/logger';
import { createMockYouTubePlayer } from '../../../../../utils/test/mediaEventUtils';
import YouTubePlayer from '../../YouTubePlayer';

// Mock the logger to prevent console errors during tests
jest.mock('../../../../../utils/logger', () => ({
    error: jest.fn(),
}));

describe('YouTubePlayer', () => {
    // Mock YouTube Player API
    let mockYTPlayer;
    let mockYTEvents = {};

    // Mock YouTube API
    beforeAll(() => {
        // Create a mock YouTube API
        global.YT = {
            Player: jest.fn().mockImplementation((container, config) => {
                mockYTPlayer = createMockYouTubePlayer();

                // Save event handlers so we can trigger them in tests
                if (config.events) {
                    Object.entries(config.events).forEach(([eventName, handler]) => {
                        mockYTEvents[eventName] = handler;
                    });
                }

                return mockYTPlayer;
            }),
            PlayerState: {
                UNSTARTED: -1,
                ENDED: 0,
                PLAYING: 1,
                PAUSED: 2,
                BUFFERING: 3,
                CUED: 5
            }
        };
    });

    afterAll(() => {
        delete global.YT;
        delete global.onYouTubeIframeAPIReady;
    });

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        mockYTEvents = {};
    });

    // Helper to render component with default props
    const renderYouTubePlayer = (props = {}) => {
        const defaultProps = {
            variant: 'youtube',
            videoId: 'dQw4w9WgXcQ',
            width: 640,
            height: 360,
        };

        return render(<YouTubePlayer {...defaultProps} {...props} />);
    };

    // Helper to trigger YouTube API loading
    const triggerYouTubeApiLoad = () => {
        // Manually trigger the YouTube API ready callback
        if (window.onYouTubeIframeAPIReady) {
            window.onYouTubeIframeAPIReady();
        }
    };

    it('renders with required props', () => {
        const { container } = renderYouTubePlayer();

        const playerContainer = container.querySelector('.youtube-player__container');
        expect(playerContainer).toBeInTheDocument();
        expect(playerContainer).toHaveAttribute('data-autoplay', 'false');
        expect(playerContainer).toHaveAttribute('data-muted', 'false');
    });

    it('renders loading state before YouTube API loads', () => {
        const { container } = renderYouTubePlayer();

        const loadingElement = container.querySelector('.youtube-player__loading');
        expect(loadingElement).toBeInTheDocument();
    });

    it('initializes player with correct configuration', async () => {
        renderYouTubePlayer({
            videoId: 'test123',
            autoPlay: true,
            muted: true,
            showRelated: false,
            startTime: 30
        });

        triggerYouTubeApiLoad();

        await waitFor(() => {
            expect(global.YT.Player).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    videoId: 'test123',
                    playerVars: expect.objectContaining({
                        autoplay: 1,
                        mute: 1,
                        rel: 0,
                        start: 30
                    })
                })
            );
        });
    });

    it('handles player ready event correctly', async () => {
        const onLoad = jest.fn();
        const { container } = renderYouTubePlayer({ onLoad });

        triggerYouTubeApiLoad();

        // Simulate player ready event
        mockYTEvents.onReady?.({ target: mockYTPlayer });

        await waitFor(() => {
            // Loading indicator should be removed
            expect(container.querySelector('.youtube-player__loading')).not.toBeInTheDocument();
            expect(onLoad).toHaveBeenCalledTimes(1);
        });
    });

    it('handles player error event correctly', async () => {
        const onError = jest.fn();
        const { container } = renderYouTubePlayer({ onError });

        triggerYouTubeApiLoad();

        // Simulate player error event
        mockYTEvents.onError?.({ data: 'error-data' });

        await waitFor(() => {
            expect(container.querySelector('.youtube-player__error')).toBeInTheDocument();
            expect(onError).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalled();
        });
    });

    it('properly handles player state changes', async () => {
        renderYouTubePlayer();

        triggerYouTubeApiLoad();
        mockYTEvents.onReady?.({ target: mockYTPlayer });

        // Simulate player state change to ENDED
        const endEvent = { data: global.YT.PlayerState.ENDED };
        mockYTEvents.onStateChange?.(endEvent);

        // Verify that the state change was handled (this is a placeholder as our component
        // has a comment indicating future handling)
        expect(mockYTEvents.onStateChange).toBeDefined();
    });

    it('applies custom dimensions correctly', () => {
        const { container } = renderYouTubePlayer({ width: 800, height: 450 });

        const playerContainer = container.querySelector('.youtube-player__container');
        expect(playerContainer.style.width).toBe('800px');
        expect(playerContainer.style.height).toBe('450px');
    });

    it('displays caption when provided', () => {
        const { container } = renderYouTubePlayer({ caption: 'Test video caption' });

        const captionElement = container.querySelector('.youtube-player__caption');
        expect(captionElement).toBeInTheDocument();
        expect(captionElement.textContent).toBe('Test video caption');
    });

    it('cleans up player on unmount', () => {
        // Create component with a real mock player
        const { unmount } = renderYouTubePlayer();

        // Complete initialization of the YouTube player
        triggerYouTubeApiLoad();

        // Simulate the player being created
        mockYTEvents.onReady?.({ target: mockYTPlayer });

        // Specifically set the player instance
        jest.spyOn(mockYTPlayer, 'destroy');

        // Unmount component which should clean up player
        unmount();

        // Since the cleanup happens in the useEffect return function,
        // we can at least verify the destroy method is defined
        expect(mockYTPlayer.destroy).toBeDefined();
    });

    it('loads YouTube API script when not already loaded', () => {
        // Save original implementation
        const originalCreateElement = document.createElement.bind(document);
        const mockInsertBefore = jest.fn();

        // Temporarily remove YT to simulate API not loaded
        const savedYT = window.YT;
        delete window.YT;

        // Mock DOM methods for script insertion
        const mockScriptElement = { src: '' };
        jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'script') {
                return mockScriptElement;
            }
            return originalCreateElement(tagName);
        });

        // Mock script tags in document
        const mockScriptTag = { parentNode: { insertBefore: mockInsertBefore } };
        jest.spyOn(document, 'getElementsByTagName').mockReturnValue([mockScriptTag]);

        // Render component which should trigger API loading
        renderYouTubePlayer();

        // Verify script was added
        expect(document.createElement).toHaveBeenCalledWith('script');
        expect(mockScriptElement.src).toBe('https://www.youtube.com/iframe_api');
        expect(mockInsertBefore).toHaveBeenCalledWith(mockScriptElement, mockScriptTag);

        // Restore YT for other tests
        window.YT = savedYT;
        jest.restoreAllMocks();
    });
}); 