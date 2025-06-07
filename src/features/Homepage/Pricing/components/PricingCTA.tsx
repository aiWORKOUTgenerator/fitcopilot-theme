import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { GlobalVariantKey } from '../../types/shared';
import { PricingButton } from './PricingButton';

/**
 * Props for PricingCTA component
 * Follows the established pattern from other Homepage section CTAs
 */
export interface PricingCTAProps {
  /** Text to display on button */
  text?: string;
  /** URL to navigate to */
  href?: string;
  /** Size of the button */
  buttonSize?: 'small' | 'medium' | 'large';
  /** Button variant style */
  buttonVariant?: 'primary' | 'secondary';
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Custom icon element */
  icon?: React.ReactNode;
  /** Plan type for styling */
  planType?: string;
  /** Optional gradient class for additional styling */
  gradientClass?: string;
  /** Optional click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Optional theme variant */
  theme?: ThemeOption;
  /** Theme variant for consistent styling */
  themeVariant?: GlobalVariantKey;
}

/**
 * Map variant to GlobalVariantKey
 */
const mapVariantToGlobal = (variant?: string): GlobalVariantKey => {
  const validVariants: GlobalVariantKey[] = [
    'default', 'gym', 'sports', 'wellness', 'modern', 'classic', 
    'minimalist', 'boutique', 'registration', 'mobile'
  ];
  
  if (validVariants.includes(variant as GlobalVariantKey)) {
    return variant as GlobalVariantKey;
  }
  
  // Map Pricing-specific variants to GlobalVariantKey
  switch (variant) {
    default: return 'default';
  }
};

/**
 * Map plan type to pricing button plan type
 */
const mapPlanTypeToContextType = (planType?: string): 'basic' | 'pro' | 'elite' | 'custom' => {
  switch (planType?.toLowerCase()) {
    case 'pro':
    case 'professional':
      return 'pro';
    case 'elite':
    case 'premium':
      return 'elite';
    case 'custom':
    case 'enterprise':
      return 'custom';
    case 'basic':
    case 'free':
    default:
      return 'basic';
  }
};

/**
 * PricingCTA - Call to action button for the pricing section
 * Follows the established ThemeProvider + specialized button pattern
 */
const PricingCTA: React.FC<PricingCTAProps> = ({
  text = 'Upgrade Now',
  href,
  buttonSize = 'large',
  buttonVariant = 'primary',
  showIcon = true,
  icon,
  planType = 'basic',
  gradientClass,
  onClick,
  theme = 'default',
  themeVariant = 'default'
}) => {
  // Map the plan type to the appropriate button variant
  const mappedPlanType = mapPlanTypeToContextType(planType);
  const globalVariant = mapVariantToGlobal(theme);
  
  // Use theme or themeVariant, prioritizing themeVariant
  const activeTheme = themeVariant !== 'default' ? themeVariant : globalVariant;
  
  return (
    <ThemeProvider initialTheme={theme}>
      <PricingButton
        buttonVariant={buttonVariant}
        themeVariant={activeTheme}
        size={buttonSize}
        planType={mappedPlanType}
        href={href}
        onClick={onClick}
        gradientColors={gradientClass}
        rightIcon={showIcon && (icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />)}
        data-section="pricing"
        data-context={`plan-${planType?.toLowerCase()}`}
      >
        {text}
      </PricingButton>
    </ThemeProvider>
  );
};

export default PricingCTA; 