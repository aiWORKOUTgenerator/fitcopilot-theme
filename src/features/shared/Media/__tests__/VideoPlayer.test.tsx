import { render } from '@testing-library/react';
import React from 'react';
import VideoPlayer from '../VideoPlayer';

describe('VideoPlayer', () => {
    it('renders with required props', () => {
        const { container } = render(
            <VideoPlayer variant="video" src="video.mp4" />
        );
        expect(container.querySelector('video')).toBeInTheDocument();
    });

    it('applies className and poster', () => {
        const { container } = render(
            <VideoPlayer variant="video" src="video.mp4" className="test-class" poster="poster.png" />
        );
        const video = container.querySelector('video');
        expect(video).toHaveClass('media-video test-class');
        expect(video).toHaveAttribute('poster', 'poster.png');
    });

    it('calls onLoad when loaded', () => {
        const onLoad = jest.fn();
        const { container } = render(
            <VideoPlayer variant="video" src="video.mp4" onLoad={onLoad} />
        );
        const video = container.querySelector('video');
        if (video) {
            video.dispatchEvent(new Event('loadeddata'));
            expect(onLoad).toHaveBeenCalled();
        }
    });
}); 