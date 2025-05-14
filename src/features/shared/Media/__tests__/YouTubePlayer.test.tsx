import { render } from '@testing-library/react';
import React from 'react';
import YouTubePlayer from '../YouTubePlayer';

// Mock the logger to prevent console errors during tests
jest.mock('../../../../utils/logger', () => ({
    error: jest.fn(),
}));

// Mock the internal component state
jest.mock('react', () => {
    const originalReact = jest.requireActual('react');
    return {
        ...originalReact,
        useState: jest.fn()
            .mockImplementationOnce((initial) => [initial, jest.fn()]) // useRef 1
            .mockImplementationOnce((initial) => [initial, jest.fn()]) // useRef 2
            .mockImplementationOnce((initial) => [true, jest.fn()]) // isLoading
            .mockImplementationOnce((initial) => [false, jest.fn()]) // hasError
            .mockImplementationOnce((initial) => [true, jest.fn()]) // ytApiReady
            .mockImplementation((initial) => [initial, jest.fn()]), // for any other useState calls
    };
});

// Create global mock for YouTube API
beforeAll(() => {
    // Create a mock YouTube API
    global.YT = {
        Player: jest.fn().mockImplementation((container, config) => {
            return {
                destroy: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                // Invoke the callbacks that were passed to the constructor
                invokeReadyEvent: () => {
                    if (config.events?.onReady) {
                        config.events.onReady();
                    }
                },
                invokeErrorEvent: () => {
                    if (config.events?.onError) {
                        config.events.onError();
                    }
                }
            };
        }),
        PlayerState: {
            PLAYING: 1,
            PAUSED: 2,
            ENDED: 0
        }
    };

    // Mock the YouTube API ready callback
    global.onYouTubeIframeAPIReady = jest.fn();
});

// Clean up mocks
afterAll(() => {
    delete global.YT;
    delete global.onYouTubeIframeAPIReady;
});

describe('YouTubePlayer', () => {
    // Helper setup function
    const setup = (props = {}) => {
        const defaultProps = {
            variant: 'youtube',
            videoId: 'test123',
        };

        return render(<YouTubePlayer {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('renders with required props', () => {
        const { container } = setup();

        const playerContainer = container.querySelector('.youtube-player__container');
        expect(playerContainer).toBeInTheDocument();
    });

    it('applies className and custom dimensions', () => {
        const { container } = setup({
            className: 'custom-class',
            width: 800,
            height: 450
        });

        const playerContainer = container.querySelector('.youtube-player__container');
        expect(playerContainer).toHaveClass('custom-class');
        expect(playerContainer).toHaveStyle({
            width: '800px',
            height: '450px'
        });
    });

    it('passes autoPlay and muted props to YouTube API', () => {
        const { container } = setup({
            autoPlay: true,
            muted: true
        });

        const playerContainer = container.querySelector('.youtube-player__container');
        expect(playerContainer).toHaveAttribute('data-autoplay', 'true');
        expect(playerContainer).toHaveAttribute('data-muted', 'true');
    });

    it('shows loading state initially', () => {
        // Reset useState mock to make isLoading true
        jest.spyOn(React, 'useState')
            .mockImplementationOnce((initial) => [initial, jest.fn()]) // containerRef
            .mockImplementationOnce((initial) => [initial, jest.fn()]) // playerRef
            .mockImplementationOnce((initial) => [true, jest.fn()]) // isLoading
            .mockImplementationOnce((initial) => [false, jest.fn()]) // hasError
            .mockImplementationOnce((initial) => [true, jest.fn()]); // ytApiReady

        const { container } = setup();

        const loadingElement = container.querySelector('.youtube-player__loading');
        expect(loadingElement).toBeInTheDocument();
    });

    it('displays caption when provided', () => {
        const { container } = setup({
            caption: 'Test video caption'
        });

        const captionElement = container.querySelector('.youtube-player__caption');
        expect(captionElement).toBeInTheDocument();
        expect(captionElement.textContent).toBe('Test video caption');
    });
}); 