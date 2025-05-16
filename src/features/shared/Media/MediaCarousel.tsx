import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { MediaCarouselProps } from './types';

/**
 * MediaCarousel component displays a collection of different media types (images and videos)
 * with navigation controls
 */
const MediaCarousel: React.FC<MediaCarouselProps> = ({
  items,
  initialIndex = 0,
  onItemChange,
  className = '',
  ...rest
}) => {
  const [current, setCurrent] = useState(initialIndex);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrev();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Add keyboard listeners when gallery is focused
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.focus();
  }, []);

  const currentItem = items[current];

  return (
    <div
      className={`media-carousel ${className}`}
      ref={carouselRef}
      role="region"
      aria-label="Media carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <button
        onClick={handlePrev}
        aria-label="Previous item"
        className="media-carousel-prev"
      >
        &#8592;
      </button>

      {currentItem.type === 'image' ? (
        <img
          src={currentItem.src}
          alt={currentItem.alt || ''}
          className="media-carousel-image"
        />
      ) : (
        <video
          src={currentItem.src}
          controls
          className="media-carousel-video"
          role="video"
          aria-label={currentItem.alt || 'Video'}
        />
      )}

      <button
        onClick={handleNext}
        aria-label="Next item"
        className="media-carousel-next"
      >
        &#8594;
      </button>

      <div
        className="media-carousel-indicator"
        aria-live="polite"
        aria-atomic="true"
      >
        {current + 1} / {items.length}
      </div>
    </div>
  );
};

export default MediaCarousel; 