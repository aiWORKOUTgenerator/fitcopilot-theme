import { ThemeOption } from '../../../../utils/theming';

/**
 * TrainingFeatures component variant types
 */
export type TrainingFeaturesVariant = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

/**
 * Maps TrainingFeatures component variants to theme options
 * 
 * @param variant - The TrainingFeatures component variant
 * @returns The appropriate ThemeOption
 */
export const mapVariantToTheme = (variant: TrainingFeaturesVariant | undefined): ThemeOption => {
  // Direct mappings for variants that match themes
  if (variant === 'default' || variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant;
  }
  
  // Map other variants to appropriate themes
  switch (variant) {
    case 'modern': return 'sports';
    case 'classic': return 'default';
    case 'minimalist': return 'default';
    default: return 'default';
  }
};

/**
 * Maps feature type to an appropriate theme
 * 
 * @param featureType - The feature type
 * @returns The appropriate ThemeOption
 */
export const mapFeatureTypeToTheme = (featureType: string | undefined): ThemeOption => {
  switch (featureType) {
    case 'virtual': return 'default'; // Green gradient theme
    case 'tracking': return 'gym'; // Purple gradient theme
    case 'scheduling': return 'sports'; // Blue gradient theme
    case 'support': return 'wellness'; // Orange gradient theme
    case 'mobile': return 'sports'; // Pink-blue gradient theme
    default: return 'default';
  }
};

/**
 * Maps gradient class name to feature type
 * 
 * @param gradientClass - CSS gradient class name
 * @returns The matching feature type
 */
export const mapGradientToFeatureType = (gradientClass: string | undefined): 'virtual' | 'tracking' | 'scheduling' | 'support' | 'mobile' => {
  if (!gradientClass) return 'virtual';
  
  if (gradientClass.includes('lime') || gradientClass.includes('emerald') || gradientClass.includes('green')) {
    return 'virtual';
  }
  
  if (gradientClass.includes('violet') || gradientClass.includes('purple')) {
    return 'tracking';
  }
  
  if (gradientClass.includes('cyan') || gradientClass.includes('blue')) {
    return 'scheduling';
  }
  
  if (gradientClass.includes('amber') || gradientClass.includes('orange')) {
    return 'support';
  }
  
  if (gradientClass.includes('rose') || gradientClass.includes('pink')) {
    return 'mobile';
  }
  
  return 'virtual'; // Default
}; 