import React, { useState } from 'react';
import { MediaCarouselProps } from './types';

const MediaCarousel: React.FC<MediaCarouselProps> = ({
    items,
    initialIndex = 0,
    onItemChange,
    className = '',
    ...rest
}) => {
    const [current, setCurrent] = useState(initialIndex);

    const handlePrev = () => {
        const newIndex = (current - 1 + items.length) % items.length;
        setCurrent(newIndex);
        onItemChange?.(newIndex);
    };

    const handleNext = () => {
        const newIndex = (current + 1) % items.length;
        setCurrent(newIndex);
        onItemChange?.(newIndex);
    };

    const currentItem = items[current];

    return (
        <div className={`media-carousel ${className}`} {...rest}>
            <button onClick={handlePrev} aria-label="Previous item">&#8592;</button>
            {currentItem.type === 'image' ? (
                <img src={currentItem.src} alt={currentItem.alt || ''} />
            ) : (
                <video src={currentItem.src} controls />
            )}
            <button onClick={handleNext} aria-label="Next item">&#8594;</button>
            <div className="media-carousel-indicator">
                {current + 1} / {items.length}
            </div>
        </div>
    );
};

export default MediaCarousel; 