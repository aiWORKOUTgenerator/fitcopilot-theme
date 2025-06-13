/**
 * TrainingFeatures component types
 */

import { ReactNode } from 'react';
import { GlobalVariantKey } from '../types/shared';

/**
 * Supported theme variants for the TrainingFeatures component
 * @deprecated Use GlobalVariantKey from '../types/shared' instead
 */
export type VariantKey = GlobalVariantKey;

/**
 * WordPress Training Feature Interface
 * Matches the backend data structure from Training Features Data Provider
 */
export interface WordPressTrainingFeature {
  id: number;
  title: string;
  description: string;
  featureType: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  imageUrl: string;
  videoUrl: string;
  videoPoster: string;
  icon: {
    type: 'lucide' | 'custom' | 'emoji';
    name: string;
  };
  gradientClass: string;
  flipCard: {
    frontText: string;
    backTitle: string;
    backDetails: string;
  };
  cta: {
    text: string;
    url: string;
  };
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

/**
 * WordPress Training Features Settings
 * Matches backend settings structure
 */
export interface TrainingFeaturesSettings {
  sectionTitle: string;
  sectionDescription: string;
  gridColumns: number;
  cardStyle: string;
  showDifficulty: boolean;
  showDuration: boolean;
  enableAnimations: boolean;
}

/**
 * WordPress Data Meta Information
 */
export interface TrainingFeaturesDataMeta {
  total_count: number;
  active_count: number;
  display_count: number;
  last_updated: number;
}

/**
 * Complete WordPress Training Features Data Structure
 * This is what's provided by wp_localize_script
 */
export interface WordPressTrainingFeaturesData {
  features: WordPressTrainingFeature[];
  settings: TrainingFeaturesSettings;
  meta: TrainingFeaturesDataMeta;
}

/**
 * Data Source Type for tracking data origin
 */
export type DataSource = 'wordpress' | 'default' | 'none';

/**
 * Loading State Type
 */
export type LoadingState = 'loading' | 'success' | 'error';

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
 * Individual training feature definition (React component format)
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
 * Extended Window interface for WordPress data
 * Following Personal Training pattern exactly
 */
declare global {
  interface Window {
    fitcopilotTrainingFeaturesData?: WordPressTrainingFeaturesData;
  }
} 