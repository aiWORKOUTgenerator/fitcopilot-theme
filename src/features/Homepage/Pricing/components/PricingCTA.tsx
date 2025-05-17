import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { mapPlanTypeToButtonVariant } from '../utils/themeUtils';
import { PricingButton } from './PricingButton';

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
  
  return (
    <ThemeProvider initialTheme={theme}>
      <PricingButton
        variant={buttonVariant}
        size={buttonSize}
        planType={mappedPlanType}
        href={href}
        onClick={onClick}
        gradientColors={gradientClass}
        rightIcon={showIcon && (icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />)}
      >
        {text}
      </PricingButton>
    </ThemeProvider>
  );
};

export default PricingCTA; 