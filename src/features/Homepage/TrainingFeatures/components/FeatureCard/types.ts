import React from 'react';
import { TrainingFeature } from '../../types';

/**
 * Props for the FeatureCard component
 */
export interface FeatureCardProps {
    /**
     * Feature data to be displayed in the card
     */
    feature: TrainingFeature;

    /**
     * Optional CSS class name for additional styling
     */
    className?: string;

    /**
     * Variant of the card for theming
     * @default 'default'
     */
    variant?: 'default' | 'gym' | 'sports' | 'wellness';

    /**
     * Optional click handler for the entire card
     */
    onClick?: (e: React.MouseEvent) => void;
}

/**
 * Media container props for feature card
 */
export interface MediaContainerProps {
    /**
     * Source URL for the media
     */
    src: string;

    /**
     * Type of media (image or video)
     */
    type: 'image' | 'video';

    /**
     * Aspect ratio for the media container
     * @default '16/9'
     */
    aspectRatio?: string;

    /**
     * Alt text for images or videos
     */
    alt?: string;

    /**
     * Poster image for video
     */
    poster?: string;

    /**
     * Fallback sources for video
     */
    fallbackSrc?: Array<{
        src: string;
        type: string;
    }>;

    /**
     * Whether video controls should be shown
     * @default false
     */
    controls?: boolean;

    /**
     * Whether video should be muted
     * @default true
     */
    muted?: boolean;

    /**
     * Whether video should autoplay
     * @default false
     */
    autoPlay?: boolean;

    /**
     * Whether video should autoplay when scrolled into view
     * @default false
     */
    autoPlayOnScroll?: boolean;

    /**
     * Variant of the container for theming
     * @default 'default'
     */
    variant?: 'default' | 'gym' | 'sports' | 'wellness';
} 