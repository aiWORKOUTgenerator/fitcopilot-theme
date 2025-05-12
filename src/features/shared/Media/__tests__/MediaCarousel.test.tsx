import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import MediaCarousel from '../MediaCarousel';

describe('MediaCarousel', () => {
    const items = [
        { type: 'image', src: 'img1.png', alt: 'Image 1' },
        { type: 'video', src: 'video1.mp4', alt: 'Video 1' },
        { type: 'image', src: 'img2.png', alt: 'Image 2' },
    ];

    it('renders with required props', () => {
        const { getByAltText } = render(
            <MediaCarousel variant="carousel" items={items} />
        );
        expect(getByAltText('Image 1')).toBeInTheDocument();
    });

    it('navigates to next and previous items', () => {
        const { getByLabelText, getByAltText, container } = render(
            <MediaCarousel variant="carousel" items={items} />
        );
        fireEvent.click(getByLabelText('Next item'));
        expect(container.querySelector('video')).toBeInTheDocument();
        fireEvent.click(getByLabelText('Next item'));
        expect(getByAltText('Image 2')).toBeInTheDocument();
        fireEvent.click(getByLabelText('Previous item'));
        expect(container.querySelector('video')).toBeInTheDocument();
    });

    it('calls onItemChange when item changes', () => {
        const onItemChange = jest.fn();
        const { getByLabelText } = render(
            <MediaCarousel variant="carousel" items={items} onItemChange={onItemChange} />
        );
        fireEvent.click(getByLabelText('Next item'));
        expect(onItemChange).toHaveBeenCalledWith(1);
    });
}); 