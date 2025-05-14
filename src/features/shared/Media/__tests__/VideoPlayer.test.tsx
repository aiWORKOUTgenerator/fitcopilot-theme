import { render } from '@testing-library/react';
import React, { act } from 'react';
import VideoPlayer from '../VideoPlayer';

// Mock the logger to prevent console errors during tests
jest.mock('../../../../utils/logger', () => ({
    error: jest.fn(),
}));

// Create a setup function to handle the common setup for tests
const setup = (props = {}) => {
    // Disable autoPlay by default in tests to prevent errors
    const defaultProps = {
        variant: 'video',
        src: 'video.mp4',
        autoPlay: false,
    };

    return render(<VideoPlayer {...defaultProps} {...props} />);
};

describe('VideoPlayer', () => {
    // Setup mocks before running tests
    let originalPlay;

    beforeEach(() => {
        // Save original implementation
        originalPlay = window.HTMLVideoElement.prototype.play;

        // Replace with mock that returns a promise (fixes 'catch' issue)
        window.HTMLVideoElement.prototype.play = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        // Restore original implementation
        window.HTMLVideoElement.prototype.play = originalPlay;
    });

    it('renders with required props', () => {
        const { container } = setup();
        const video = container.querySelector('video');
        expect(video).toBeInTheDocument();
    });

    it('applies className and poster', () => {
        const { container } = setup({
            className: 'test-class',
            poster: 'poster.png'
        });

        const video = container.querySelector('video');
        expect(video).toHaveClass('video-player__element');

        // Check if className was passed through to the parent
        const wrapper = container.querySelector('.video-player');
        expect(wrapper.className).toContain('test-class');

        expect(video).toHaveAttribute('poster', 'poster.png');
    });

    it('calls onLoad when loaded', () => {
        const onLoad = jest.fn();
        const { container } = setup({ onLoad });

        const video = container.querySelector('video');

        act(() => {
            video.dispatchEvent(new Event('loadeddata'));
        });

        expect(onLoad).toHaveBeenCalled();
    });

    it('applies aspect ratio styling', () => {
        const { container } = setup({ aspectRatio: '16:9' });

        const wrapper = container.querySelector('.video-player');

        // Assert on the style attribute which is how aspect ratio is applied
        expect(wrapper.style.paddingBottom).toBe('56.25%');
    });
}); 