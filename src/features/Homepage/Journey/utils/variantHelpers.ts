import { VariantKey, isVariant } from '../types';

/**
 * Returns the accent color class appropriate for the given variant
 */
export const getAccentColorClass = (_variant: VariantKey): string => {
  // All variants use the same semantic CSS class which gets overridden in CSS
  return 'text-journey-accent';
};

/**
 * Returns the appropriate text color based on variant and color family
 */
export const getIconColorClass = (variant: VariantKey, colorFamily: 'lime' | 'cyan' | 'violet' | 'amber'): string => {
  if (isVariant(variant, 'gym')) {
    return 'text-violet-200';
  } else if (isVariant(variant, 'sports')) {
    return 'text-cyan-200';
  } else if (isVariant(variant, 'wellness')) {
    return 'text-teal-200';
  } else if (isVariant(variant, 'modern')) {
    return 'text-amber-200';
  }

  // Default variant with color family
  switch (colorFamily) {
  case 'lime': return 'text-lime-200';
  case 'cyan': return 'text-cyan-200';
  case 'violet': return 'text-violet-200';
  case 'amber': return 'text-amber-200';
  default: return 'text-lime-200';
  }
};

/**
 * Returns the appropriate gradient class based on variant
 */
export const getGradientClass = (variant: VariantKey): string => {
  if (isVariant(variant, 'gym')) {
    return 'journey-gradient-violet';
  } else if (isVariant(variant, 'sports')) {
    return 'journey-gradient-cyan';
  } else if (isVariant(variant, 'wellness')) {
    return 'journey-gradient-teal';
  } else if (isVariant(variant, 'modern')) {
    return 'journey-gradient-amber';
  }

  return 'journey-gradient-lime';
};

/**
 * Returns the appropriate hover text color class based on variant
 */
export const getHoverTextColor = (_variant: VariantKey): string => {
  // All variants use the same hover class for consistency
  return 'hover-text-journey-accent';
};

/**
 * Gets variant-specific button gradient style
 */
export const getButtonGradient = (variant: VariantKey): string => {
  if (isVariant(variant, 'gym')) {
    return 'from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600';
  } else if (isVariant(variant, 'sports')) {
    return 'from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600';
  } else if (isVariant(variant, 'wellness')) {
    return 'from-violet-400 to-purple-500 hover:from-violet-500 hover:to-purple-600';
  } else if (isVariant(variant, 'modern')) {
    return 'from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600';
  }

  // Default
  return 'from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500';
};

/**
 * Gets variant-specific shadow color
 */
export const getShadowColor = (variant: VariantKey): string => {
  if (isVariant(variant, 'gym')) {
    return 'shadow-lime-400/30 hover:shadow-lime-400/40';
  } else if (isVariant(variant, 'sports')) {
    return 'shadow-cyan-400/30 hover:shadow-cyan-400/40';
  } else if (isVariant(variant, 'wellness')) {
    return 'shadow-violet-400/30 hover:shadow-violet-400/40';
  } else if (isVariant(variant, 'modern')) {
    return 'shadow-amber-400/30 hover:shadow-amber-400/40';
  }

  // Default
  return 'shadow-lime-300/30 hover:shadow-lime-300/40';
};

/**
 * Returns the correct accent color for step gradient based on number and variant
 */
export const getAccentColorForStep = (stepNumber: number, variant: VariantKey): string => {
  // Apply variant-specific styling with type narrowing
  if (isVariant(variant, 'gym')) {
    // Gym variant has more vibrant colors
    switch (stepNumber) {
    case 1: return "from-lime-400 to-emerald-500";
    case 2: return "from-cyan-400 to-blue-500";
    case 3: return "from-violet-400 to-purple-500";
    case 4: return "from-amber-400 to-orange-500";
    default: return "from-lime-400 to-emerald-500";
    }
  } else if (isVariant(variant, 'sports')) {
    // Sports variant has more blue/cyan tones
    switch (stepNumber) {
    case 1: return "from-cyan-300 to-blue-400";
    case 2: return "from-blue-300 to-indigo-400";
    case 3: return "from-indigo-300 to-violet-400";
    case 4: return "from-lime-300 to-emerald-400";
    default: return "from-cyan-300 to-blue-400";
    }
  } else if (isVariant(variant, 'wellness')) {
    // Wellness variant has more purple/violet tones
    switch (stepNumber) {
    case 1: return "from-violet-300 to-purple-400";
    case 2: return "from-pink-300 to-rose-400";
    case 3: return "from-amber-300 to-orange-400";
    case 4: return "from-emerald-300 to-teal-400";
    default: return "from-violet-300 to-purple-400";
    }
  } else if (isVariant(variant, 'modern')) {
    // Modern variant has amber/orange tones
    switch (stepNumber) {
    case 1: return "from-amber-300 to-orange-400";
    case 2: return "from-rose-300 to-pink-400";
    case 3: return "from-violet-300 to-purple-400";
    case 4: return "from-blue-300 to-indigo-400";
    default: return "from-amber-300 to-orange-400";
    }
  } else {
    // Default variant
    switch (stepNumber) {
    case 1: return "from-lime-300 to-emerald-400";
    case 2: return "from-cyan-300 to-blue-400";
    case 3: return "from-violet-300 to-purple-400";
    case 4: return "from-amber-300 to-orange-400";
    default: return "from-lime-300 to-emerald-400";
    }
  }
}; 