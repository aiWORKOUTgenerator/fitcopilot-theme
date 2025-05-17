import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { TestimonialsButton } from './TestimonialsButton';

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
  // Cast button variant to 'primary' if 'link' isn't supported directly
  // TestimonialsButton has special CSS to handle link styling
  const mappedVariant = buttonVariant === 'link' ? 'primary' : buttonVariant;
  
  return (
    <ThemeProvider initialTheme={variant as ThemeOption}>
      <TestimonialsButton
        variant={mappedVariant}
        size={buttonSize}
        testimonialType={testimonialType}
        href={href}
        className={buttonVariant === 'link' ? 'testimonials-button-link' : ''}
        rightIcon={showIcon && (icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />)}
      >
        {text}
      </TestimonialsButton>
    </ThemeProvider>
  );
};

export default TestimonialsCTA; 