/**
 * Map plan type to appropriate button variant
 * @param planType Pricing plan type
 * @returns the corresponding button variant
 */
export const mapPlanTypeToButtonVariant = (planType?: string): 'basic' | 'pro' | 'elite' | 'custom' => {
  switch (planType) {
  case 'Pro':
  case 'pro':
    return 'pro';
  case 'Elite':
  case 'elite':
    return 'elite';
  case 'Custom':
  case 'custom':
    return 'custom';
  default:
    return 'basic';
  }
};

/**
 * Map pricing plan to appropriate gradient class
 * @param planType Pricing plan type
 * @returns the corresponding gradient class
 */
export const mapPlanToGradient = (planType?: string): string => {
  switch (planType) {
  case 'Pro':
  case 'pro':
    return 'bg-gradient-to-r from-lime-300 to-emerald-400';
  case 'Elite':
  case 'elite':
    return 'bg-gradient-to-r from-purple-300 to-indigo-400';
  case 'Custom':
  case 'custom':
    return 'bg-gradient-to-r from-gray-500 to-gray-700';
  default:
    return 'bg-gradient-to-r from-blue-300 to-cyan-400';
  }
}; 