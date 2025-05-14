import { render } from '@testing-library/react';
import React from 'react';
import YouTubePlayer from '../../YouTubePlayer';

// Mock the YouTube iframe API
beforeAll(() => {
    // Create global YouTube mock
    global.YT = {
        PlayerState: {
            PLAYING: 1,
            PAUSED: 2,
            ENDED: 0
        },
        Player: jest.fn().mockImplementation(() => ({
            loadVideoById: jest.fn(),
            cueVideoById: jest.fn(),
            playVideo: jest.fn(),
            pauseVideo: jest.fn(),
            stopVideo: jest.fn(),
            destroy: jest.fn(),
            getPlayerState: jest.fn(),
            getDuration: jest.fn().mockReturnValue(100),
            getCurrentTime: jest.fn().mockReturnValue(30),
            setVolume: jest.fn(),
            getVolume: jest.fn().mockReturnValue(80),
            mute: jest.fn(),
            unMute: jest.fn(),
            isMuted: jest.fn().mockReturnValue(false),
            setSize: jest.fn(),
            getIframe: jest.fn().mockReturnValue(document.createElement('iframe')),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        }))
    };
});

// Clean up the mock after tests
afterAll(() => {
    delete global.YT;
});

describe('YouTubePlayer', () => {
    it('renders with required props', () => {
        const { container } = render(
            <YouTubePlayer
                variant="youtube"
                videoId="abc123"
            />
        );

        const playerContainer = container.querySelector('.youtube-player__container');
        expect(playerContainer).toBeInTheDocument();
    });

    it('applies className and custom dimensions', () => {
        const { container } = render(
            <YouTubePlayer
                variant="youtube"
                videoId="abc123"
                className="test-class"
                width={640}
                height={360}
            />
        );

        const playerContainer = container.querySelector('.youtube-player__container');
        expect(playerContainer).toHaveClass('test-class');
        expect(playerContainer).toHaveStyle({
            width: '640px',
            height: '360px'
        });
    });

    it('creates placeholder until YouTube API loads', () => {
        const { container } = render(
            <YouTubePlayer
                variant="youtube"
                videoId="abc123"
            />
        );

        // Should have a placeholder element
        const placeholder = container.querySelector('.youtube-player__placeholder');
        expect(placeholder).toBeInTheDocument();
    });

    it('handles autoplay and muted props', () => {
        const { container } = render(
            <YouTubePlayer
                variant="youtube"
                videoId="abc123"
                autoPlay={true}
                muted={true}
            />
        );

        // Should have appropriate data attributes
        const playerContainer = container.querySelector('.youtube-player__container');
        expect(playerContainer).toHaveAttribute('data-autoplay', 'true');
        expect(playerContainer).toHaveAttribute('data-muted', 'true');
    });

    it('shows loading state', () => {
        const { container } = render(
            <YouTubePlayer
                variant="youtube"
                videoId="abc123"
                _loading={true}
            />
        );

        const loadingIndicator = container.querySelector('.youtube-player__loading');
        expect(loadingIndicator).toBeInTheDocument();
    });

    it('shows error state', () => {
        const { container, getByText } = render(
            <YouTubePlayer
                variant="youtube"
                videoId="abc123"
                _error={true}
            />
        );

        const errorMessage = getByText(/error loading YouTube video/i);
        expect(errorMessage).toBeInTheDocument();
    });
}); 