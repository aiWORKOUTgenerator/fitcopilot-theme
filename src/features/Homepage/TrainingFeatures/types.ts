/**
 * TrainingFeatures component types
 */

import React, { ReactNode } from 'react';

/**
 * Supported theme variants for the TrainingFeatures component
 */
export type VariantKey =
    | 'default'
    | 'boutique'
    | 'classic'
    | 'minimalist'
    | 'modern'
    | 'sports'
    | 'wellness';

/**
 * Media type definitions for feature cards
 */
export type VideoSource = {
    src: string;
    type: string;
};

export type VideoMedia = {
    type: 'video';
    src: string;
    alt?: string;
    poster?: string;
    fallbackSrc?: VideoSource[];
};

export type ImageMedia = {
    type: 'image';
    src: string;
    alt?: string;
};

export type FeatureMedia = VideoMedia | ImageMedia;

/**
 * Feature card back side data
 */
export interface FlipBackContent {
    title: string;
    details: string[];
}

/**
 * Individual training feature definition
 */
export interface TrainingFeature {
    icon: ReactNode;
    title: string;
    description: string;
    gradient: string;
    flipFront: string;
    media?: FeatureMedia;
    flipBack: FlipBackContent;
}

/**
 * Base properties for all variants
 */
export interface BaseVariantProps {
    /**
     * Optional custom training features
     */
    features?: TrainingFeature[];

    /**
     * Section title
     */
    sectionTitle?: string;

    /**
     * Section description
     */
    sectionDescription?: string;

    /**
     * Section tag text (displayed above title)
     */
    sectionTagText?: string;

    /**
     * Custom CSS class name
     */
    className?: string;
}

/**
 * Type guard for narrowing variant types
 */
export function isVariant<T extends VariantProps['variant']>(
  variant: VariantKey,
  specificVariant: T
): variant is T {
  return variant === specificVariant;
}

/**
 * Discriminated union props for the variants
 */
export interface DefaultVariantProps extends BaseVariantProps {
    variant: 'default';
}

export interface BoutiqueVariantProps extends BaseVariantProps {
    variant: 'boutique';
}

export interface ClassicVariantProps extends BaseVariantProps {
    variant: 'classic';
}

export interface MinimalistVariantProps extends BaseVariantProps {
    variant: 'minimalist';
}

export interface ModernVariantProps extends BaseVariantProps {
    variant: 'modern';
}

export interface SportsVariantProps extends BaseVariantProps {
    variant: 'sports';
}

export interface WellnessVariantProps extends BaseVariantProps {
    variant: 'wellness';
}

/**
 * Union of all variant props
 */
export type VariantProps =
    | DefaultVariantProps
    | BoutiqueVariantProps
    | ClassicVariantProps
    | MinimalistVariantProps
    | ModernVariantProps
    | SportsVariantProps
    | WellnessVariantProps;

/**
 * Main component props
 */
export type TrainingFeaturesProps = VariantProps;

/**
 * Training Feature item interface
 */
export interface TrainingFeature {
    title: string;
    description: string;
    icon?: React.ReactNode;
    link?: string;
    linkText?: string;
}

/**
 * Training Features component props
 */
export interface TrainingFeaturesProps {
    title?: string;
    subtitle?: string;
    features?: TrainingFeature[];
    className?: string;
} 