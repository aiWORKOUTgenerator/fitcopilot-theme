import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { UniversalButton } from '../../components/UniversalButton';
import { GlobalVariantKey } from '../../types/shared';
import { mapPlanTypeToButtonVariant } from '../utils/themeUtils';

/**
 * Props for PricingCTA component
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
 * Map plan type to context type
 */
const mapPlanTypeToContextType = (planType?: string): 'basic' | 'pro' | 'elite' | 'custom' => {
  switch (planType?.toLowerCase()) {
    case 'basic': return 'basic';
    case 'pro': return 'pro';
    case 'elite': return 'elite';
    case 'custom': return 'custom';
    default: return 'basic';
  }
};

/**
 * PricingCTA - Call to action button for the pricing section
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
  theme = 'default'
}) => {
  // Map the plan type to the appropriate button variant
  const mappedPlanType = mapPlanTypeToButtonVariant(planType);
  const globalVariant = mapVariantToGlobal(theme);
  const contextType = mapPlanTypeToContextType(planType);
  
  return (
    <ThemeProvider initialTheme={theme}>
      <UniversalButton
        sectionContext="pricing"
        buttonVariant={buttonVariant}
        variant={globalVariant}
        size={buttonSize}
        contextType={contextType}
        href={href}
        onClick={onClick}
        gradientClass={gradientClass}
        rightIcon={showIcon && (icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />)}
        data-section="pricing"
        data-context={`plan-${planType?.toLowerCase()}`}
      >
        {text}
      </UniversalButton>
    </ThemeProvider>
  );
};

export default PricingCTA; 