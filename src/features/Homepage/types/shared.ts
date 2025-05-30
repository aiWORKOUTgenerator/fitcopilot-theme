/**
 * Shared Type System for Homepage Architecture Consistency
 * 
 * This file defines the unified type system used across all Homepage sections.
 * It eliminates duplicate type definitions and provides a consistent foundation
 * for component development.
 * 
 * @fileoverview Core type definitions for Homepage components
 * @version 1.0.0
 * @since Phase 1 - Foundation & Standards
 */

// ============================================================================
// GLOBAL VARIANT SYSTEM
// ============================================================================

/**
 * Global variant keys used across all Homepage sections.
 * This replaces the individual VariantKey types defined in each section.
 * 
 * @description Unified variant system supporting all theme variations
 * @example
 * ```typescript
 * const heroVariant: GlobalVariantKey = 'gym';
 * const featuresVariant: GlobalVariantKey = 'sports';
 * ```
 */
export type GlobalVariantKey = 
  | 'default'     // Standard theme (lime/emerald gradients)
  | 'gym'         // Gym theme (purple/violet gradients)
  | 'sports'      // Sports theme (cyan/blue gradients)
  | 'wellness'    // Wellness theme (teal/green gradients)
  | 'modern'      // Modern theme (amber/orange gradients)
  | 'classic'     // Classic theme (red/orange gradients)
  | 'minimalist'  // Minimalist theme (gray/neutral gradients)
  | 'boutique'    // Boutique theme (wellness variant)
  | 'registration' // Registration-specific variant
  | 'mobile';     // Mobile-optimized variant

/**
 * Theme option mapping for ThemeProvider integration.
 * Maps GlobalVariantKey to ThemeContext theme options.
 */
export type ThemeOption = 'default' | 'gym' | 'sports' | 'wellness';

/**
 * Background color types for section styling
 */
export type BackgroundColorType = 
  | 'primary'
  | 'secondary' 
  | 'tertiary'
  | 'transparent'
  | 'gradient';

// ============================================================================
// BASE COMPONENT INTERFACES
// ============================================================================

/**
 * Base props interface that all Homepage components should extend.
 * Provides consistent foundation for component development.
 * 
 * @interface BaseComponentProps
 * @example
 * ```typescript
 * interface MyComponentProps extends BaseComponentProps {
 *   title: string;
 *   description?: string;
 * }
 * ```
 */
export interface BaseComponentProps {
  /**
   * Visual theme variant for the component
   * @default 'default'
   */
  variant?: GlobalVariantKey;
  
  /**
   * Additional CSS class names to apply
   */
  className?: string;
  
  /**
   * Child components or content
   */
  children?: React.ReactNode;
  
  /**
   * Unique identifier for the component
   */
  id?: string;
  
  /**
   * Data attributes for testing and analytics
   */
  'data-testid'?: string;
}

/**
 * Base props for Homepage section components.
 * Extends BaseComponentProps with section-specific properties.
 * 
 * @interface BaseSectionProps
 * @example
 * ```typescript
 * interface HeroProps extends BaseSectionProps {
 *   headline?: string;
 *   subheadline?: string;
 * }
 * ```
 */
export interface BaseSectionProps extends BaseComponentProps {
  /**
   * Unique section identifier for navigation and analytics
   */
  sectionId?: string;
  
  /**
   * Background styling for the section
   * @default 'primary'
   */
  backgroundColor?: BackgroundColorType;
  
  /**
   * Whether the section should be full width
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Padding configuration for the section
   */
  padding?: {
    top?: 'none' | 'small' | 'medium' | 'large';
    bottom?: 'none' | 'small' | 'medium' | 'large';
  };
}

/**
 * Base props for Homepage button components.
 * Provides consistent interface for all button implementations.
 * 
 * @interface BaseButtonProps
 * @example
 * ```typescript
 * interface HeroButtonProps extends BaseButtonProps {
 *   // Hero-specific button props
 * }
 * ```
 */
export interface BaseButtonProps extends Omit<BaseComponentProps, 'variant'> {
  /**
   * Button size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Button style variant
   * @default 'primary'
   */
  buttonVariant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'link';
  
  /**
   * Theme variant for the button
   * @default 'default'
   */
  variant?: GlobalVariantKey;
  
  /**
   * Icon to display on the left side of the button
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display on the right side of the button
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Whether the button should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * URL to navigate to (renders as anchor tag)
   */
  href?: string;
  
  /**
   * Target for link navigation
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
  
  /**
   * Button type for form submission
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  
  /**
   * Click event handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
  
  /**
   * ARIA controls attribute
   */
  'aria-controls'?: string;
  
  /**
   * ARIA expanded state
   */
  'aria-expanded'?: boolean;
  
  /**
   * ARIA pressed state
   */
  'aria-pressed'?: boolean;
}

// ============================================================================
// COMPONENT-SPECIFIC SHARED TYPES
// ============================================================================

/**
 * Standard animation configuration for Homepage components
 */
export interface AnimationConfig {
  /**
   * Whether animations are enabled
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Animation duration in milliseconds
   * @default 300
   */
  duration?: number;
  
  /**
   * Animation delay in milliseconds
   * @default 0
   */
  delay?: number;
  
  /**
   * Animation easing function
   * @default 'ease-in-out'
   */
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Media configuration for video and image components
 */
export interface MediaConfig {
  /**
   * Media source URL
   */
  src: string;
  
  /**
   * Alternative text or description
   */
  alt?: string;
  
  /**
   * Poster image for videos
   */
  poster?: string;
  
  /**
   * Whether media should autoplay
   * @default false
   */
  autoPlay?: boolean;
  
  /**
   * Whether media should loop
   * @default false
   */
  loop?: boolean;
  
  /**
   * Whether media should be muted
   * @default true
   */
  muted?: boolean;
  
  /**
   * Whether to show controls
   * @default true
   */
  controls?: boolean;
}

/**
 * Icon configuration for components with icon support
 */
export interface IconConfig {
  /**
   * Icon component or element
   */
  icon: React.ReactNode;
  
  /**
   * Icon size in pixels
   * @default 24
   */
  size?: number;
  
  /**
   * Icon color (CSS color value)
   */
  color?: string;
  
  /**
   * Icon position relative to text
   * @default 'left'
   */
  position?: 'left' | 'right' | 'top' | 'bottom';
}

// ============================================================================
// VARIANT SYSTEM UTILITIES
// ============================================================================

/**
 * Variant component map type for dynamic variant loading
 */
export type VariantComponentMap<TProps = any> = Record<
  GlobalVariantKey, 
  React.ComponentType<Omit<TProps, 'variant'>>
>;

/**
 * Variant selector function type
 */
export type VariantSelector<TVariant extends GlobalVariantKey = GlobalVariantKey> = () => TVariant;

/**
 * Theme mapping configuration
 */
export interface ThemeMapping {
  variant: GlobalVariantKey;
  theme: ThemeOption;
}

// ============================================================================
// WORDPRESS INTEGRATION TYPES
// ============================================================================

/**
 * WordPress data structure for Homepage sections
 */
export interface WordPressData {
  /**
   * Site-wide links and URLs
   */
  siteLinks: {
    registration: string;
    login: string;
    dashboard: string;
    builder: string;
  };
  
  /**
   * Asset URLs
   */
  assets: {
    logo: string;
    heroVideo?: string;
    backgroundImages: Record<string, string>;
  };
  
  /**
   * Theme configuration
   */
  theme: {
    activeVariant: GlobalVariantKey;
    customColors?: Record<string, string>;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract variant-specific props from a component props interface
 */
export type VariantProps<T> = Omit<T, 'variant'>;

/**
 * Make specific properties required in an interface
 */
export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional in an interface
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract the component type from a variant map
 */
export type ComponentFromVariantMap<T extends VariantComponentMap> = T[keyof T];

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Re-export React types for convenience
 */
export type {
    CSSProperties, ComponentType,
    FC,
    MouseEvent, ReactNode
} from 'react';

// Note: Types cannot be exported as default values in TypeScript
// Import individual types as needed:
// import { GlobalVariantKey, BaseComponentProps } from './shared'; 