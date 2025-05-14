import React from 'react';
import './styles/ImageMedia.scss';
import { ImageMediaProps } from './types';

/**
 * ImageMedia component renders an image with optional caption and styling
 */
const ImageMedia: React.FC<ImageMediaProps> = ({
    src,
    alt = '',
    width,
    height,
    className = '',
    circle = false,
    caption,
    lazyLoad = false,
    srcSet,
    sizes,
    ...rest
}) => {
    // Build class names based on props
    const containerClassName = `image-media ${circle ? 'image-media--circle' : ''} ${className}`;

    return (
        <div className={containerClassName}>
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`image-media__element ${className}`}
                loading={lazyLoad ? 'lazy' : undefined}
                srcSet={srcSet}
                sizes={sizes}
                {...rest}
            />

            {caption && (
                <div className="image-media__caption">
                    {caption}
                </div>
            )}
        </div>
    );
};

export default ImageMedia; 