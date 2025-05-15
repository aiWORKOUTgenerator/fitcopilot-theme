import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { createMockYouTubePlayer } from '../../../../utils/test/mediaEventUtils';
import YouTubePlayer from '../YouTubePlayer';

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

    it('properly handles player state changes', async () => {
        const onStateChange = jest.fn();
        renderYouTubePlayer({ onStateChange });

        triggerYouTubeApiLoad();

        // Simulate player ready event
        if (mockYTEvents.onReady) {
            mockYTEvents.onReady({ target: mockYTPlayer });
        }

        // Simulate player state change to PLAYING
        if (mockYTEvents.onStateChange) {
            mockYTEvents.onStateChange({ data: global.YT.PlayerState.PLAYING });
        }

        // Verify state change callback was called
        expect(onStateChange).toHaveBeenCalledWith(global.YT.PlayerState.PLAYING);
    });

    it('cleans up player on unmount', async () => {
        // Create component with a real mock player
        const { unmount } = renderYouTubePlayer();

        // Complete initialization
        triggerYouTubeApiLoad();
        if (mockYTEvents.onReady) {
            mockYTEvents.onReady({ target: mockYTPlayer });
        }

        // Monitor the destroy method
        mockYTPlayer.destroy = jest.fn();

        // Unmount component which should clean up player
        unmount();

        // Player should be destroyed
        await waitFor(() => {
            expect(mockYTPlayer.destroy).toHaveBeenCalled();
        });
    });

    it('toggles playback based on isPlaying prop', async () => {
        const { rerender } = renderYouTubePlayer({ isPlaying: false });

        // Initialize player
        triggerYouTubeApiLoad();
        if (mockYTEvents.onReady) {
            mockYTEvents.onReady({ target: mockYTPlayer });
        }

        // Pause should be called with initial isPlaying=false
        expect(mockYTPlayer.pauseVideo).toHaveBeenCalled();

        // Clear mocks before changing props
        jest.clearAllMocks();

        // Update to playing state
        rerender(<YouTubePlayer variant="youtube" videoId="dQw4w9WgXcQ" width={640} height={360} isPlaying={true} />);

        // Play should be called
        expect(mockYTPlayer.playVideo).toHaveBeenCalled();
    });

    it('loads YouTube API script when not already loaded', () => {
        // Save original document methods
        const originalCreateElement = document.createElement;
        const originalGetElementsByTagName = document.getElementsByTagName;

        // Mock document methods
        document.createElement = jest.fn().mockImplementation((tagName) => {
            if (tagName === 'script') {
                return {
                    setAttribute: jest.fn(),
                    src: ''
                };
            }
            return originalCreateElement.call(document, tagName);
        });

        document.getElementsByTagName = jest.fn().mockReturnValue([{
            parentNode: {
                insertBefore: jest.fn()
            }
        }]);

        // Temporarily remove YT to simulate API not loaded
        const savedYT = window.YT;
        delete window.YT;

        // Render the component which should load the API
        renderYouTubePlayer();

        // Check that script was created
        expect(document.createElement).toHaveBeenCalledWith('script');

        // Restore mocks
        document.createElement = originalCreateElement;
        document.getElementsByTagName = originalGetElementsByTagName;
        window.YT = savedYT;
    });
}); 