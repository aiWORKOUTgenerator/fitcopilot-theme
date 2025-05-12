import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import ImageGallery from '../ImageGallery';

describe('ImageGallery', () => {
    const images = [
        { src: 'img1.png', alt: 'Image 1' },
        { src: 'img2.png', alt: 'Image 2' },
        { src: 'img3.png', alt: 'Image 3' },
    ];

    it('renders with required props', () => {
        const { getByAltText } = render(
            <ImageGallery variant="imageGallery" images={images} />
        );
        expect(getByAltText('Image 1')).toBeInTheDocument();
    });

    it('navigates to next and previous images', () => {
        const { getByLabelText, getByAltText } = render(
            <ImageGallery variant="imageGallery" images={images} />
        );
        fireEvent.click(getByLabelText('Next image'));
        expect(getByAltText('Image 2')).toBeInTheDocument();
        fireEvent.click(getByLabelText('Previous image'));
        expect(getByAltText('Image 1')).toBeInTheDocument();
    });

    it('calls onImageChange when image changes', () => {
        const onImageChange = jest.fn();
        const { getByLabelText } = render(
            <ImageGallery variant="imageGallery" images={images} onImageChange={onImageChange} />
        );
        fireEvent.click(getByLabelText('Next image'));
        expect(onImageChange).toHaveBeenCalledWith(1);
    });
}); 