import React, { useState } from 'react';
import { ImageGalleryProps } from './types';

const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    initialIndex = 0,
    onImageChange,
    className = '',
    ...rest
}) => {
    const [current, setCurrent] = useState(initialIndex);

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

    return (
        <div className={`media-image-gallery ${className}`} {...rest}>
            <button onClick={handlePrev} aria-label="Previous image">&#8592;</button>
            <img src={images[current].src} alt={images[current].alt || ''} />
            <button onClick={handleNext} aria-label="Next image">&#8594;</button>
            <div className="media-image-gallery-indicator">
                {current + 1} / {images.length}
            </div>
        </div>
    );
};

export default ImageGallery; 