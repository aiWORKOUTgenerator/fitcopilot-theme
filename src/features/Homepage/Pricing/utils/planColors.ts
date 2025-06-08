/**
 * Plan Color Mapping Utilities
 * 
 * Provides consistent color mapping for pricing plan elements including
 * check mark icons, gradients, and primary colors.
 * 
 * @fileoverview Color utilities for pricing plan theming
 * @version 1.0.0
 * @since Pricing Card Check Marks Integration Sprint
 */

/**
 * Plan color configuration object
 * Maps plan names to their respective color schemes
 */
export const PLAN_COLORS = {
  Basic: {
    gradient: 'from-blue-500 to-blue-600',
    checkIcon: 'text-blue-500',
    primaryColor: '#3B82F6',
    hoverColor: 'text-blue-400'
  },
  Pro: {
    gradient: 'from-lime-300 to-emerald-400',
    checkIcon: 'text-lime-400',
    primaryColor: '#84CC16',
    hoverColor: 'text-lime-300'
  },
  Elite: {
    gradient: 'from-purple-500 to-purple-600',
    checkIcon: 'text-purple-500',
    primaryColor: '#8B5CF6',
    hoverColor: 'text-purple-400'
  }
} as const;

/**
 * Get the check mark icon color class for a specific plan
 * 
 * @param planName - The plan name ('Basic', 'Pro', 'Elite')
 * @returns CSS class string for icon coloring
 * 
 * @example
 * ```typescript
 * const iconColor = getPlanCheckIconColor('Pro');
 * // Returns: 'text-lime-400'
 * ```
 */
export const getPlanCheckIconColor = (planName: string): string => {
  const plan = PLAN_COLORS[planName as keyof typeof PLAN_COLORS];
  return plan?.checkIcon || 'text-gray-400';
};

/**
 * Get the primary color hex value for a specific plan
 * 
 * @param planName - The plan name ('Basic', 'Pro', 'Elite')
 * @returns Hex color string
 * 
 * @example
 * ```typescript
 * const primaryColor = getPlanPrimaryColor('Basic');
 * // Returns: '#3B82F6'
 * ```
 */
export const getPlanPrimaryColor = (planName: string): string => {
  const plan = PLAN_COLORS[planName as keyof typeof PLAN_COLORS];
  return plan?.primaryColor || '#6B7280';
};

/**
 * Get the gradient class string for a specific plan
 * 
 * @param planName - The plan name ('Basic', 'Pro', 'Elite')
 * @returns CSS gradient class string
 * 
 * @example
 * ```typescript
 * const gradient = getPlanGradient('Elite');
 * // Returns: 'from-purple-500 to-purple-600'
 * ```
 */
export const getPlanGradient = (planName: string): string => {
  const plan = PLAN_COLORS[planName as keyof typeof PLAN_COLORS];
  return plan?.gradient || 'from-gray-400 to-gray-500';
};

/**
 * Get hover color class for plan elements
 * 
 * @param planName - The plan name ('Basic', 'Pro', 'Elite')
 * @returns CSS class string for hover coloring
 */
export const getPlanHoverColor = (planName: string): string => {
  const plan = PLAN_COLORS[planName as keyof typeof PLAN_COLORS];
  return plan?.hoverColor || 'text-gray-300';
};

/**
 * Check if a plan name is valid
 * 
 * @param planName - The plan name to validate
 * @returns Boolean indicating if plan name is valid
 */
export const isValidPlanName = (planName: string): boolean => {
  return planName in PLAN_COLORS;
};

/**
 * Get all available plan names
 * 
 * @returns Array of valid plan names
 */
export const getAllPlanNames = (): string[] => {
  return Object.keys(PLAN_COLORS);
}; 