import { render } from '@testing-library/react';
import React, { act } from 'react';
import VideoPlayer from '../../VideoPlayer';

describe('VideoPlayer', () => {
    it('renders with required props', () => {
        const { container } = render(
            <VideoPlayer variant="video" src="video.mp4" />
        );

        const video = container.querySelector('video');
        expect(video).toBeInTheDocument();
    });

    it('applies className and poster', () => {
        const { container } = render(
            <VideoPlayer variant="video" src="video.mp4" className="test-class" poster="poster.png" />
        );

        const video = container.querySelector('video');
        expect(video).toHaveClass('video-player__element', 'test-class');
        expect(video).toHaveAttribute('poster', 'poster.png');
    });

    it('calls onLoad when loaded', () => {
        const onLoad = jest.fn();

        const { container } = render(
            <VideoPlayer variant="video" src="video.mp4" onLoad={onLoad} />
        );

        const video = container.querySelector('video');
        if (video) {
            act(() => {
                video.dispatchEvent(new Event('loadeddata'));
            });
            expect(onLoad).toHaveBeenCalled();
        }
    });

    it('applies aspect ratio styling', () => {
        const { container } = render(
            <VideoPlayer variant="video" src="video.mp4" aspectRatio="16:9" />
        );

        const wrapper = container.querySelector('.video-player');
        expect(wrapper).toHaveClass('video-player--ratio-16-9');
    });

    it('sets autoplay and muted attributes', () => {
        const { container } = render(
            <VideoPlayer
                variant="video"
                src="video.mp4"
                autoPlay={true}
                muted={true}
            />
        );

        const video = container.querySelector('video');
        expect(video).toHaveAttribute('autoplay');
        expect(video).toHaveAttribute('muted');
    });

    it('renders custom controls when controls prop is true', () => {
        const { container } = render(
            <VideoPlayer variant="video" src="video.mp4" controls={true} />
        );

        const controlsContainer = container.querySelector('.video-player__controls');
        expect(controlsContainer).toBeInTheDocument();
    });

    it('handles error state', () => {
        const { container, getByText } = render(
            <VideoPlayer variant="video" src="invalid-video.mp4" />
        );

        // Simulate error event
        act(() => {
            const video = container.querySelector('video');
            if (video) {
                video.dispatchEvent(new Event('error'));
            }
        });

        // Check if error message is displayed
        const errorMessage = getByText(/error playing this video/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('handles play/pause state change', () => {
        // Mock implementation for HTMLVideoElement play/pause methods
        const playMock = jest.fn().mockResolvedValue(undefined);
        const pauseMock = jest.fn();

        // Mock the video element methods
        Object.defineProperty(HTMLVideoElement.prototype, 'play', {
            writable: true,
            value: playMock
        });

        Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
            writable: true,
            value: pauseMock
        });

        const { container, getByLabelText } = render(
            <VideoPlayer variant="video" src="video.mp4" controls={true} />
        );

        // Find play button
        const playButton = getByLabelText('Play');

        // Click play button
        act(() => {
            playButton.click();
        });

        expect(playMock).toHaveBeenCalled();

        // Simulate play event to update UI state
        act(() => {
            const video = container.querySelector('video');
            if (video) {
                video.dispatchEvent(new Event('play'));
            }
        });

        // Should now show pause button
        const pauseButton = getByLabelText('Pause');

        // Click pause button
        act(() => {
            pauseButton.click();
        });

        expect(pauseMock).toHaveBeenCalled();
    });
}); 