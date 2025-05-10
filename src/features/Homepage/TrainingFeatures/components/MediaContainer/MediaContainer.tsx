import React, { useEffect, useRef, useState } from 'react';
import { MediaContainerProps } from '../FeatureCard/types';
import './MediaContainer.scss';

/**
 * MediaContainer component for handling both image and video media in feature cards
 * with optimized loading and accessibility support
 */
const MediaContainer: React.FC<MediaContainerProps> = ({
    src,
    type,
    aspectRatio = '16/9',
    alt = '',
    poster,
    fallbackSrc,
    controls = false,
    muted = true,
    autoPlay = false,
    autoPlayOnScroll = false,
    variant = 'default'
}) => {
    const mediaRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Set up intersection observer for lazy loading and autoplay on scroll
    useEffect(() => {
        if (!autoPlayOnScroll || type !== 'video') return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsInView(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [autoPlayOnScroll, type]);

    // Handle video autoplay when in view
    useEffect(() => {
        if (type !== 'video' || !mediaRef.current) return;

        if (autoPlayOnScroll && isInView) {
            mediaRef.current.play().catch((error) => {
                console.error('Error playing video:', error);
            });
        } else if (autoPlayOnScroll && !isInView) {
            mediaRef.current.pause();
        }
    }, [isInView, autoPlayOnScroll, type]);

    // Handle error state
    const handleError = () => {
        setHasError(true);
    };

    return (
        <div
            className="media-container"
            ref={containerRef}
            style={{ aspectRatio }}
            data-variant={variant}
        >
            {hasError ? (
                <div className="media-error">
                    <span>Media could not be loaded</span>
                </div>
            ) : type === 'image' ? (
                <img
                    src={src}
                    alt={alt}
                    className="media-content"
                    loading="lazy"
                    onError={handleError}
                />
            ) : (
                <video
                    ref={mediaRef}
                    className="media-content"
                    poster={poster}
                    controls={controls}
                    muted={muted}
                    autoPlay={autoPlay}
                    loop
                    playsInline
                    onError={handleError}
                >
                    <source src={src} type="video/mp4" />
                    {fallbackSrc?.map((source, index) => (
                        <source key={index} src={source.src} type={source.type} />
                    ))}
                    {alt && <track kind="description" srcLang="en" label={alt} />}
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

export default MediaContainer; 