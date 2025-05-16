import { fireEvent, render } from '@testing-library/react';
import React, { act } from 'react';
import ImageGallery from '../../ImageGallery';

describe('ImageGallery', () => {
  const images = [
    { src: 'img1.png', alt: 'Image 1' },
    { src: 'img2.png', alt: 'Image 2' },
    { src: 'img3.png', alt: 'Image 3' },
  ];

  it('renders with required props', () => {
    const { getByAltText, container } = render(
      <ImageGallery variant="imageGallery" images={images} />
    );

    const galleryContainer = container.querySelector('.image-gallery__container');
    expect(galleryContainer).toBeInTheDocument();
    expect(getByAltText('Image 1')).toBeInTheDocument();
  });

  it('navigates to next and previous images', () => {
    const { getByLabelText, getByAltText } = render(
      <ImageGallery variant="imageGallery" images={images} />
    );

    // Click next button
    act(() => {
      fireEvent.click(getByLabelText('Next image'));
    });

    // Should show second image
    expect(getByAltText('Image 2')).toBeInTheDocument();

    // Click previous button
    act(() => {
      fireEvent.click(getByLabelText('Previous image'));
    });

    // Should show first image again
    expect(getByAltText('Image 1')).toBeInTheDocument();
  });

  it('calls onImageChange when image changes', () => {
    const onImageChange = jest.fn();

    const { getByLabelText } = render(
      <ImageGallery
        variant="imageGallery"
        images={images}
        onImageChange={onImageChange}
      />
    );

    // Click next button
    act(() => {
      fireEvent.click(getByLabelText('Next image'));
    });

    // Should call onImageChange with index 1
    expect(onImageChange).toHaveBeenCalledWith(1);
  });

  it('respects initialIndex prop', () => {
    const { getByAltText } = render(
      <ImageGallery
        variant="imageGallery"
        images={images}
        initialIndex={1}
      />
    );

    // Should start at second image
    expect(getByAltText('Image 2')).toBeInTheDocument();
  });

  it('loops through images when reaching the end', () => {
    const { getByLabelText, getByAltText } = render(
      <ImageGallery
        variant="imageGallery"
        images={images}
      />
    );

    // Go to last image
    act(() => {
      fireEvent.click(getByLabelText('Next image'));
      fireEvent.click(getByLabelText('Next image'));
    });

    expect(getByAltText('Image 3')).toBeInTheDocument();

    // Click next again, should loop to first image
    act(() => {
      fireEvent.click(getByLabelText('Next image'));
    });

    expect(getByAltText('Image 1')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    const { container, getByAltText } = render(
      <ImageGallery
        variant="imageGallery"
        images={images}
      />
    );

    // Focus the gallery
    const gallery = container.querySelector('.image-gallery__container');
    if (gallery) {
      act(() => {
        gallery.focus();
      });

      // Press right arrow key
      act(() => {
        fireEvent.keyDown(gallery, { key: 'ArrowRight' });
      });

      expect(getByAltText('Image 2')).toBeInTheDocument();

      // Press left arrow key
      act(() => {
        fireEvent.keyDown(gallery, { key: 'ArrowLeft' });
      });

      expect(getByAltText('Image 1')).toBeInTheDocument();
    }
  });
}); 