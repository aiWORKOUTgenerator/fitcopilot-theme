import { ThemeOption } from '../../../../utils/theming';

/**
 * PersonalTraining component variant types
 */
export type PersonalTrainingVariant = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'nutrition';

/**
 * Maps PersonalTraining component variants to theme options
 * 
 * @param variant - The PersonalTraining component variant
 * @returns The appropriate ThemeOption
 */
export const mapVariantToTheme = (variant: PersonalTrainingVariant | undefined): ThemeOption => {
  // Direct mappings for variants that match themes
  if (variant === 'default' || variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant;
  }
  
  // Map other variants to appropriate themes
  switch (variant) {
  case 'modern': return 'sports';
  case 'nutrition': return 'wellness';
  default: return 'gym'; // Default to gym theme for personal training
  }
};

/**
 * Maps coach type to an appropriate theme
 * 
 * @param coachType - The coach type
 * @returns The appropriate ThemeOption
 */
export const mapCoachTypeToTheme = (coachType: string | undefined): ThemeOption => {
  switch (coachType) {
  case 'strength': return 'gym';
  case 'nutrition': return 'wellness';
  case 'performance': return 'sports';
  case 'recovery': return 'wellness';
  default: return 'gym';
  }
};

/**
 * Gets CSS class for coach specialty display
 * 
 * @param specialty - Coach specialty string
 * @returns CSS class name for styling the specialty
 */
export const getCoachSpecialtyClass = (specialty: string | undefined): string => {
  if (!specialty) return 'coach-specialty--default';
  
  if (specialty.toLowerCase().includes('strength') || 
      specialty.toLowerCase().includes('muscle') || 
      specialty.toLowerCase().includes('conditioning')) {
    return 'coach-specialty--strength';
  }
  
  if (specialty.toLowerCase().includes('nutrition') || 
      specialty.toLowerCase().includes('weight loss') || 
      specialty.toLowerCase().includes('diet')) {
    return 'coach-specialty--nutrition';
  }
  
  if (specialty.toLowerCase().includes('performance') || 
      specialty.toLowerCase().includes('athletic') || 
      specialty.toLowerCase().includes('sport')) {
    return 'coach-specialty--performance';
  }
  
  if (specialty.toLowerCase().includes('recovery') || 
      specialty.toLowerCase().includes('mobility') || 
      specialty.toLowerCase().includes('yoga')) {
    return 'coach-specialty--recovery';
  }
  
  return 'coach-specialty--default';
}; 