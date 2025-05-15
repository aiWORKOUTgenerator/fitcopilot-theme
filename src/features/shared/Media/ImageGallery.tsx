import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ImageGalleryProps } from './types';

/**
 * ImageGallery component displays a collection of images with navigation controls
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    initialIndex = 0,
    onImageChange,
    className = '',
    ...rest
}) => {
    const [current, setCurrent] = useState(initialIndex);
    const galleryRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        const newIndex = (current - 1 + images.length) % images.length;
        setCurrent(newIndex);
        onImageChange?.(newIndex);
    };

    const handleNext = () => {
        const newIndex = (current + 1) % images.length;
        setCurrent(newIndex);
        onImageChange?.(newIndex);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
            handlePrev();
        } else if (event.key === 'ArrowRight') {
            handleNext();
        }
    };

    // Add keyboard listeners when gallery is focused
    useEffect(() => {
        const gallery = galleryRef.current;
        if (!gallery) return;

        gallery.focus();
    }, []);

    return (
        <div
            className={`media-image-gallery ${className}`}
            ref={galleryRef}
            role="region"
            aria-label="Image gallery"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            {...rest}
        >
            <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="media-image-gallery-prev"
            >
                &#8592;
            </button>

            <img
                src={images[current].src}
                alt={images[current].alt || ''}
                className="media-image-gallery-image"
            />

            <button
                onClick={handleNext}
                aria-label="Next image"
                className="media-image-gallery-next"
            >
                &#8594;
            </button>

            <div
                className="media-image-gallery-indicator"
                aria-live="polite"
                aria-atomic="true"
            >
                {current + 1} / {images.length}
            </div>
        </div>
    );
};

export default ImageGallery; 