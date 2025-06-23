/**
 * Standard Export Pattern Template for Homepage Sections
 * 
 * This template demonstrates the unified export pattern that all Homepage sections
 * should follow for consistency and maintainability.
 * 
 * @fileoverview Standard export pattern template
 * @version 1.0.0
 * @since Phase 1 - Foundation & Standards
 * 
 * @example
 * Copy this template to create a new section's index.ts:
 * ```bash
 * cp src/features/Homepage/types/standard-export-template.ts src/features/Homepage/NewSection/index.ts
 * # Then replace [Section] with your section name
 * ```
 */

// ============================================================================
// IMPORTS
// ============================================================================

import SectionComponent from './SectionComponent';
import { getSectionVariant, SectionMap } from './variants';

// Import shared types for consistency

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Default export: Main section component
 * 
 * This is the primary way to import the section component.
 * Provides the most convenient import syntax.
 * 
 * @example
 * ```typescript
 * import Section from '@features/Homepage/Section';
 * 
 * // Usage
 * <Section variant="gym" />
 * ```
 */
export { default } from './SectionComponent';

/**
 * Named export: Main section component with descriptive name
 * 
 * This provides an explicit, self-documenting import option.
 * Useful when you need to be explicit about what you're importing.
 * 
 * @example
 * ```typescript
 * import { Section } from '@features/Homepage/Section';
 * 
 * // Usage
 * <Section variant="sports" />
 * ```
 */
export { SectionComponent as Section };

// ============================================================================
// VARIANT EXPORTS
// ============================================================================

/**
 * Variant selector function
 * 
 * Returns the appropriate variant component based on WordPress settings,
 * context, or other dynamic factors.
 * 
 * @example
 * ```typescript
 * import { getSectionVariant } from '@features/Homepage/Section';
 * 
 * const SectionVariant = getSectionVariant();
 * // Usage
 * <SectionVariant />
 * ```
 */
export { getSectionVariant };

/**
 * Variant component map
 * 
 * Maps variant keys to their respective component implementations.
 * Useful for dynamic variant loading or debugging.
 * 
 * @example
 * ```typescript
 * import { SectionMap } from '@features/Homepage/Section';
 * 
 * const GymVariant = SectionMap.gym;
 * // Usage
 * <GymVariant />
 * ```
 */
export { SectionMap };

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Export all type definitions
 * 
 * This makes all section-specific types available for import.
 * Includes component props, variant keys, and utility types.
 * 
 * @example
 * ```typescript
 * import { SectionProps, SectionVariantKey } from '@features/Homepage/Section';
 * 
 * const props: SectionProps = {
 *   variant: 'default',
 *   className: 'custom-section'
 * };
 * ```
 */
export * from './types';

// ============================================================================
// UTILITY EXPORTS (if applicable)
// ============================================================================

/**
 * Export utility functions (only if section has utilities)
 * 
 * This makes section-specific utility functions available for import.
 * Only include this if the section has a utils.ts file.
 * 
 * @example
 * ```typescript
 * import { sectionUtils, formatSectionData } from '@features/Homepage/Section';
 * 
 * const formattedData = formatSectionData(rawData);
 * ```
 */
// export * from './utils';

// ============================================================================
// COMPONENT EXPORTS (if applicable)
// ============================================================================

/**
 * Export sub-components (only if section exposes sub-components)
 * 
 * This makes section-specific sub-components available for import.
 * Only include this if the section exposes reusable sub-components.
 * 
 * @example
 * ```typescript
 * import { SectionButton, SectionCard } from '@features/Homepage/Section';
 * 
 * // Usage
 * <SectionButton variant="primary">Click me</SectionButton>
 * <SectionCard title="Card Title">Card content</SectionCard>
 * ```
 */
// export * from './components';

// ============================================================================
// CONSTANTS EXPORTS (if applicable)
// ============================================================================

/**
 * Export constants (only if section has constants)
 * 
 * This makes section-specific constants available for import.
 * Only include this if the section has a constants.ts file.
 * 
 * @example
 * ```typescript
 * import { SECTION_DEFAULTS, SECTION_CONFIG } from '@features/Homepage/Section';
 * 
 * const config = { ...SECTION_DEFAULTS, ...customConfig };
 * ```
 */
// export * from './constants';

// ============================================================================
// HOOKS EXPORTS (if applicable)
// ============================================================================

/**
 * Export custom hooks (only if section has hooks)
 * 
 * This makes section-specific custom hooks available for import.
 * Only include this if the section has a hooks directory.
 * 
 * @example
 * ```typescript
 * import { useSectionData, useSectionAnimation } from '@features/Homepage/Section';
 * 
 * const { data, loading } = useSectionData();
 * const { animate } = useSectionAnimation();
 * ```
 */
// export * from './hooks';

// ============================================================================
// TEMPLATE USAGE INSTRUCTIONS
// ============================================================================

/**
 * HOW TO USE THIS TEMPLATE:
 * 
 * 1. Copy this file to your section's directory as index.ts
 * 2. Replace all instances of "Section" with your section name (e.g., "Hero", "Features")
 * 3. Replace "SectionComponent" with your actual component name
 * 4. Uncomment and customize the optional export sections as needed:
 *    - utils: If your section has utility functions
 *    - components: If your section exposes reusable sub-components
 *    - constants: If your section has configuration constants
 *    - hooks: If your section has custom hooks
 * 5. Update the import paths to match your actual file structure
 * 6. Add any section-specific exports that don't fit the standard pattern
 * 
 * VALIDATION CHECKLIST:
 * - [ ] TypeScript compiles without errors
 * - [ ] All imports resolve correctly
 * - [ ] Default export works: import Section from './Section'
 * - [ ] Named export works: import { Section } from './Section'
 * - [ ] Variant exports work: import { getSectionVariant, SectionMap } from './Section'
 * - [ ] Type exports work: import { SectionProps } from './Section'
 * - [ ] No circular dependencies
 * - [ ] JSDoc documentation is complete
 * 
 * NAMING CONVENTIONS:
 * - Component: PascalCase (e.g., HeroComponent, FeaturesComponent)
 * - Function: camelCase (e.g., getHeroVariant, getFeaturesVariant)
 * - Map: PascalCase + "Map" (e.g., HeroMap, FeaturesMap)
 * - Types: PascalCase (e.g., HeroProps, FeaturesProps)
 * - Constants: UPPER_SNAKE_CASE (e.g., HERO_DEFAULTS, FEATURES_CONFIG)
 */

// ============================================================================
// EXPORT VALIDATION
// ============================================================================

/**
 * Type-only exports for validation
 * These help ensure the template is correctly implemented
 */
export type {
  // Component type validation
  ComponentType,
  FC,
  ReactNode
} from 'react';

// Re-export shared types for convenience
export type { GlobalVariantKey } from '../types/shared';

/**
 * Template metadata for tracking and validation
 */
export const TEMPLATE_METADATA = {
  version: '1.0.0',
  lastUpdated: '2024-01-01',
  purpose: 'Standard export pattern template for Homepage sections',
  usage: 'Copy and customize for each Homepage section',
  validation: {
    requiredExports: [
      'default',           // Main component as default export
      'Section',           // Named component export
      'getSectionVariant', // Variant selector function
      'SectionMap'         // Variant component map
    ],
    optionalExports: [
      'utils',       // Utility functions
      'components',  // Sub-components
      'constants',   // Configuration constants
      'hooks'        // Custom hooks
    ]
  }
} as const;

// ============================================================================
// DEVELOPMENT NOTES
// ============================================================================

/**
 * DEVELOPMENT NOTES:
 * 
 * This template is designed to be:
 * 1. Consistent across all Homepage sections
 * 2. Self-documenting with comprehensive JSDoc
 * 3. Flexible enough to accommodate section-specific needs
 * 4. Validated with TypeScript for correctness
 * 5. Easy to understand and maintain
 * 
 * When implementing this pattern:
 * - Always include the required exports (default, named, variant, types)
 * - Only include optional exports if they exist in your section
 * - Maintain the JSDoc documentation for clarity
 * - Follow the naming conventions consistently
 * - Validate with TypeScript compilation
 * 
 * This template supports the Homepage Architecture Consistency project
 * by ensuring all sections follow the same export patterns.
 */ 