/**
 * Hero Section - Standard Export Pattern Implementation
 * 
 * This file implements the standardized export pattern for Homepage sections.
 * It serves as the reference implementation for other sections to follow.
 * 
 * @fileoverview Hero section exports following standard pattern
 * @version 1.0.0
 * @since Phase 1 - Foundation & Standards
 */

// ============================================================================
// IMPORTS
// ============================================================================

import HeroComponent from './Hero';
import { getHeroVariant, HeroMap } from './variants';

// Import shared types for consistency

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Default export: Main Hero component
 * 
 * This is the primary way to import the Hero component.
 * Provides the most convenient import syntax.
 * 
 * @example
 * ```typescript
 * import Hero from '@features/Homepage/Hero';
 * 
 * // Usage
 * <Hero variant="gym" />
 * ```
 */
export { default } from './Hero';

/**
 * Named export: Hero component with descriptive name
 * 
 * This provides an explicit, self-documenting import option.
 * Useful when you need to be explicit about what you're importing.
 * 
 * @example
 * ```typescript
 * import { Hero } from '@features/Homepage/Hero';
 * 
 * // Usage
 * <Hero variant="sports" />
 * ```
 */
export { HeroComponent as Hero };

// ============================================================================
// VARIANT EXPORTS
// ============================================================================

/**
 * Variant selector function
 * 
 * Returns the appropriate Hero variant component based on WordPress settings,
 * context, or other dynamic factors.
 * 
 * @example
 * ```typescript
 * import { getHeroVariant } from '@features/Homepage/Hero';
 * 
 * const HeroVariant = getHeroVariant();
 * // Usage
 * <HeroVariant />
 * ```
 */
export { getHeroVariant };

/**
 * Variant component map
 * 
 * Maps variant keys to their respective Hero component implementations.
 * Useful for dynamic variant loading or debugging.
 * 
 * @example
 * ```typescript
 * import { HeroMap } from '@features/Homepage/Hero';
 * 
 * const GymVariant = HeroMap.gym;
 * // Usage
 * <GymVariant />
 * ```
 */
export { HeroMap };

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Export Hero-specific type definitions
 * 
 * This makes all Hero-specific types available for import.
 * Includes component props, variant keys, and utility types.
 * 
 * Note: Using wildcard export for now. Type conflicts will be resolved
 * in Phase 2 when we migrate to shared types.
 * 
 * @example
 * ```typescript
 * import { HeroProps, HeroVariantKey } from '@features/Homepage/Hero';
 * 
 * const props: HeroProps = {
 *   variant: 'default',
 *   className: 'custom-hero'
 * };
 * ```
 */
export * from './types';

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Export Hero sub-components
 * 
 * This makes Hero-specific sub-components available for import.
 * Includes HeroButton and other reusable Hero components.
 * 
 * @example
 * ```typescript
 * import { HeroButton } from '@features/Homepage/Hero';
 * 
 * // Usage
 * <HeroButton variant="primary">Get Started</HeroButton>
 * ```
 */
export * from './components';

// ============================================================================
// SHARED TYPE RE-EXPORTS
// ============================================================================

/**
 * Re-export shared types for convenience
 * This allows importing shared types directly from the Hero module
 */
export type {
  BaseButtonProps, BaseComponentProps,
  BaseSectionProps, GlobalVariantKey
} from '../types/shared';

