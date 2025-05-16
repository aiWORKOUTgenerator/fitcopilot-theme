/**
 * Training component and related exports
 */
import DefaultTraining from './Training';
import { VariantKey } from './types';
import * as variants from './variants';

// Re-export main component as default
export default DefaultTraining;

// Export type definitions
export * from './types';

// Export token utilities
export * from './utils';

// Export example components
export { default as ProgramTokenExample } from './examples/ProgramTokenExample';
export { default as TokenExample } from './examples/TokenExample';
export { default as VisualEnhancementsExample } from './examples/VisualEnhancementsExample';

// Export all variants
export { variants };

/**
 * Get appropriate variant based on WordPress settings
 * 
 * @returns Variant key from WordPress settings or default
 */
export const getTrainingVariant = (): VariantKey => {
  // This would typically read from WordPress settings or context
  // For now, just return default
  return 'default';
};

// Export the main component and its props
export { DefaultTraining as Training };
