import { fireEvent, render } from '@testing-library/react';
import React, { act } from 'react';
import MediaCarousel from '../../MediaCarousel';

describe('MediaCarousel', () => {
    const items = [
        { type: 'image', src: 'img1.png', alt: 'Image 1' },
        { type: 'video', src: 'video1.mp4', alt: 'Video 1' },
        { type: 'image', src: 'img2.png', alt: 'Image 2' },
    ];

    it('renders with required props', () => {
        const { getByAltText, container } = render(
            <MediaCarousel variant="carousel" items={items} />
        );

        const carouselContainer = container.querySelector('.media-carousel__container');
        expect(carouselContainer).toBeInTheDocument();
        expect(getByAltText('Image 1')).toBeInTheDocument();
    });

    it('navigates to next and previous items', () => {
        const { getByLabelText, getByAltText, container } = render(
            <MediaCarousel variant="carousel" items={items} />
        );

        // Click next button
        act(() => {
            fireEvent.click(getByLabelText('Next item'));
        });

        // Should show video
        const video = container.querySelector('video');
        expect(video).toBeInTheDocument();

        // Click next again
        act(() => {
            fireEvent.click(getByLabelText('Next item'));
        });

        // Should show third item (Image 2)
        expect(getByAltText('Image 2')).toBeInTheDocument();

        // Click previous
        act(() => {
            fireEvent.click(getByLabelText('Previous item'));
        });

        // Should go back to video
        expect(container.querySelector('video')).toBeInTheDocument();
    });

    it('calls onItemChange when item changes', () => {
        const onItemChange = jest.fn();

        const { getByLabelText } = render(
            <MediaCarousel
                variant="carousel"
                items={items}
                onItemChange={onItemChange}
            />
        );

        // Click next button
        act(() => {
            fireEvent.click(getByLabelText('Next item'));
        });

        // Should call onItemChange with index 1
        expect(onItemChange).toHaveBeenCalledWith(1);
    });

    it('respects initialIndex prop', () => {
        const { container } = render(
            <MediaCarousel
                variant="carousel"
                items={items}
                initialIndex={1}
            />
        );

        // Should start with video (index 1)
        const video = container.querySelector('video');
        expect(video).toBeInTheDocument();
    });

    it('loops through items when reaching the end', () => {
        const { getByLabelText, getByAltText, container } = render(
            <MediaCarousel
                variant="carousel"
                items={items}
            />
        );

        // Go to last item
        act(() => {
            fireEvent.click(getByLabelText('Next item'));
            fireEvent.click(getByLabelText('Next item'));
        });

        expect(getByAltText('Image 2')).toBeInTheDocument();

        // Click next again, should loop to first image
        act(() => {
            fireEvent.click(getByLabelText('Next item'));
        });

        expect(getByAltText('Image 1')).toBeInTheDocument();
    });

    it('renders different media types correctly', () => {
        const { container, getByLabelText, getByAltText } = render(
            <MediaCarousel
                variant="carousel"
                items={[
                    { type: 'image', src: 'img1.png', alt: 'Test Image' },
                    { type: 'video', src: 'video1.mp4', alt: 'Test Video' },
                    { type: 'youtube', videoId: 'abc123', alt: 'Test YouTube' }
                ]}
            />
        );

        // First item should be an image
        expect(getByAltText('Test Image')).toBeInTheDocument();

        // Navigate to second item
        act(() => {
            fireEvent.click(getByLabelText('Next item'));
        });

        // Should be a video
        expect(container.querySelector('video')).toBeInTheDocument();

        // Navigate to third item
        act(() => {
            fireEvent.click(getByLabelText('Next item'));
        });

        // Should be a YouTube embed
        expect(container.querySelector('iframe')).toBeInTheDocument();
    });
}); 