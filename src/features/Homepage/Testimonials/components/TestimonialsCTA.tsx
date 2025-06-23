import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { UniversalButton } from '../../components/UniversalButton';
import { GlobalVariantKey } from '../../types/shared';

/**
 * Props for TestimonialsCTA component
 */
export interface TestimonialsCTAProps {
  /** Text to display on button */
  text?: string;
  /** URL to navigate to */
  href?: string;
  /** Size of the button */
  buttonSize?: 'small' | 'medium' | 'large';
  /** Button variant style */
  buttonVariant?: 'primary' | 'secondary' | 'link';
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Custom icon element */
  icon?: React.ReactNode;
  /** Type of testimonial */
  testimonialType?: 'athlete' | 'professional' | 'enthusiast' | 'success';
  /** Section variant for theming */
  variant?: 'default' | 'gym' | 'sports' | 'wellness' | 'nutrition';
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
  
  // Map testimonials-specific variants to GlobalVariantKey
  switch (variant) {
  case 'nutrition': return 'wellness'; // Map nutrition to wellness
  default: return 'default';
  }
};

/**
 * TestimonialsCTA - Call to action button for the testimonials section
 */
const TestimonialsCTA: React.FC<TestimonialsCTAProps> = ({
  text = 'Read More Success Stories',
  href = '#testimonials',
  buttonSize = 'medium',
  buttonVariant = 'link',
  showIcon = true,
  icon,
  testimonialType = 'athlete',
  variant = 'default'
}) => {
  const globalVariant = mapVariantToGlobal(variant);
  
  // Map button variant - UniversalButton supports link variant directly
  const mappedVariant = buttonVariant === 'link' ? 'link' : buttonVariant;
  
  return (
    <ThemeProvider initialTheme={variant as ThemeOption}>
      <UniversalButton
        sectionContext="testimonials"
        buttonVariant={mappedVariant}
        variant={globalVariant}
        size={buttonSize}
        contextType={testimonialType}
        href={href}
        className={buttonVariant === 'link' ? 'testimonials-button-link' : ''}
        rightIcon={showIcon && (icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />)}
        data-section="testimonials"
        data-context="cta"
      >
        {text}
      </UniversalButton>
    </ThemeProvider>
  );
};

export default TestimonialsCTA; 