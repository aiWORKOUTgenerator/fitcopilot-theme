/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import './OptimizedImage.scss';

/**
 * Image format options
 */
export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png' | 'original';

/**
 * Responsive image sizes
 */
export interface ResponsiveImage {
    /** Original source URL */
    src: string;

    /** Low-quality image placeholder (data URI or URL) */
    lqip?: string;

    /** Width descriptor for the image */
    width?: number;

    /** Height descriptor for the image */
    height?: number;

    /** Responsive srcset string or source URLs */
    srcset?: string | Array<{ src: string; width: number }>;

    /** Sizes attribute for responsive images */
    sizes?: string;

    /** Alternative formats (webp, avif) */
    formats?: Array<{ format: ImageFormat; srcset: string }>;

    /** Media query for specific viewport sizes */
    media?: string;
}

/**
 * OptimizedImage props
 */
export interface OptimizedImageProps {
    /** Primary image source URL */
    src: string;

    /** Alternative text for the image */
    alt: string;

    /** Optional responsive image configuration */
    responsive?: ResponsiveImage;

    /** Optional CSS class name */
    className?: string;

    /** Whether to use a fade-in effect */
    fadeIn?: boolean;

    /** Whether to lazy load the image */
    lazy?: boolean;

    /** Function to call when image loads successfully */
    onLoad?: () => void;

    /** Function to call when image fails to load */
    onError?: () => void;

    /** When true, will add priority loading hints */
    priority?: boolean;

    /** Optional inline style overrides */
    style?: React.CSSProperties;

    /** Additional image attributes */
    [key: string]: any;
}

/**
 * Optimized image component with responsive loading, LQIP, and modern formats
 * 
 * @example
 * // Basic usage
 * <OptimizedImage src="/images/hero.jpg" alt="Hero image" />
 * 
 * @example
 * // Advanced responsive usage
 * <OptimizedImage 
 *   src="/images/hero.jpg" 
 *   alt="Hero image"
 *   responsive={{
 *     lqip: "data:image/jpeg;base64,/9j...",
 *     srcset: "/images/hero-400.jpg 400w, /images/hero-800.jpg 800w",
 *     sizes: "(max-width: 768px) 100vw, 50vw",
 *     formats: [
 *       { format: 'webp', srcset: "/images/hero-400.webp 400w, /images/hero-800.webp 800w" }
 *     ]
 *   }}
 *   fadeIn
 * />
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  responsive,
  className = '',
  fadeIn = true,
  lazy = true,
  onLoad,
  onError,
  priority = false,
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Extract responsive properties with fallbacks
  const {
    lqip,
    srcset,
    sizes,
    formats = [],
    width,
    height
  } = responsive || {};

  // Generate srcset string from array if needed
  const getSrcsetString = (srcsetData: string | Array<{ src: string; width: number }> | undefined): string => {
    if (!srcsetData) return '';
    if (typeof srcsetData === 'string') return srcsetData;

    return srcsetData.map(item => `${item.src} ${item.width}w`).join(', ');
  };

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    onError?.();
  };

  // Check if image is in viewport on mount for eager loading prioritized images
  useEffect(() => {
    if (priority && imgRef.current) {
      // For priority images, preload them immediately
      const img = new Image();
      img.src = src;
    }
  }, [src, priority]);

  // Calculate aspect ratio for proper sizing
  const aspectRatio = width && height ? { aspectRatio: `${width}/${height}` } : {};

  // Combine styles
  const combinedStyles: React.CSSProperties = {
    ...aspectRatio,
    ...style,
  };

  // Combine classes
  const imageClasses = [
    'optimized-image',
    fadeIn ? 'optimized-image--fade' : '',
    isLoaded ? 'optimized-image--loaded' : '',
    error ? 'optimized-image--error' : '',
    className,
  ].filter(Boolean).join(' ');

  // If we have responsive image data with multiple formats, use picture
  if (formats.length > 0) {
    return (
      <picture>
        {/* Modern format sources */}
        {formats.map((format, index) => (
          <source
            key={`${format.format}-${index}`}
            type={`image/${format.format}`}
            srcSet={format.srcset}
            sizes={sizes}
          />
        ))}

        {/* Base format (fallback for all browsers) */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          srcSet={getSrcsetString(srcset)}
          sizes={sizes}
          loading={priority ? 'eager' : lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          className={imageClasses}
          style={{
            ...combinedStyles,
            backgroundColor: (lqip && !isLoaded) ? 'transparent' : undefined,
          }}
          width={width}
          height={height}
          {...props}
        />

        {/* LQIP overlay that fades out when main image loads */}
        {lqip && !isLoaded && !error && (
          <img
            src={lqip}
            alt=""
            aria-hidden="true"
            className="optimized-image__lqip"
            style={combinedStyles}
          />
        )}
      </picture>
    );
  }

  // Simple image without formats
  return (
    <div className="optimized-image-container" style={aspectRatio}>
      {lqip && !isLoaded && !error && (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          className="optimized-image__lqip"
          style={combinedStyles}
        />
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        srcSet={getSrcsetString(srcset)}
        sizes={sizes}
        loading={priority ? 'eager' : lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={imageClasses}
        style={combinedStyles}
        width={width}
        height={height}
        {...props}
      />

      {error && (
        <div className="optimized-image__error">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 