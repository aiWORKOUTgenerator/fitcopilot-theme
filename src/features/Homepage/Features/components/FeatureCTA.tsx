import { ArrowRight } from 'lucide-react';
import React from 'react';
import { UniversalButton } from '../../components/UniversalButton';
import { GlobalVariantKey } from '../../types/shared';
import './FeatureCTA.scss';

/**
 * Props interface for FeatureCTA component
 */
export interface FeatureCTAProps {
  /** Button text content */
  text?: string;
  /** Link destination */
  href?: string;
  /** Additional CSS class */
  className?: string;
  /** Button size variant */
  buttonSize?: 'small' | 'medium' | 'large';
  /** Button visual variant */
  buttonVariant?: 'primary' | 'secondary' | 'gradient';
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Custom icon to use instead of default */
  icon?: React.ReactNode;
  /** Gradient color option - defaults to cyan for blue gradient */
  gradientColor?: 'lime' | 'cyan' | 'violet' | 'amber';
  /** Theme variant */
  variant?: string;
  /** Whether to use oval shape (rounded-full) */
  ovalShape?: boolean;
  }

/**
 * Map gradientColor to CSS class for Features section
 */
const mapGradientColor = (gradientColor?: string): string | undefined => {
  const gradientColorMap: Record<string, string> = {
    lime: 'feature-gradient-lime',
    cyan: 'feature-gradient-cyan',
    violet: 'feature-gradient-violet',
    amber: 'feature-gradient-amber'
  };
  
  return gradientColor ? gradientColorMap[gradientColor] : undefined;
};

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
  
  return 'default';
};

/**
 * FeatureCTA - Call to action button with gradient styling and oval shape
 * Refactored to use UniversalButton with Features section context
 */
const FeatureCTA: React.FC<FeatureCTAProps> = ({
  text = 'Explore Features',
  href = 'https://aigymengine.com/workout-generator-registration',
  className = '',
  buttonSize = 'medium',
  buttonVariant = 'gradient',
  showIcon = true,
  icon,
  gradientColor = 'cyan',
  variant,
  ovalShape = true // Default to oval shape for modern look
}) => {
  // Map gradient color to CSS class for Features section
  const gradientClass = mapGradientColor(gradientColor);
  
  // Map variant to GlobalVariantKey
  const globalVariant = mapVariantToGlobal(variant);
  
  // Map buttonVariant to UniversalButton variant - gradient maps to primary
  const universalButtonVariant = buttonVariant === 'gradient' ? 'primary' : (buttonVariant as 'primary' | 'secondary');
  
  // Create oval shape class
  const ovalClass = ovalShape ? 'feature-cta-oval' : '';
  
  // Combine all CSS classes
  const combinedClassName = [
    className,
    ovalClass,
    gradientClass
  ].filter(Boolean).join(' ');
  
  // Determine the icon to display - standardized sizing
  const iconElement = showIcon ? (
    icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />
  ) : undefined;

  return (
    <UniversalButton
      sectionContext="features"
      buttonVariant={universalButtonVariant}
      size={buttonSize}
      href={href}
      rightIcon={iconElement}
      className={combinedClassName}
      variant={globalVariant}
      data-section="features"
      data-context="cta"
      aria-label={`${text} - Features call to action`}
      style={ovalShape ? { borderRadius: '9999px' } : undefined}
    >
      {text}
    </UniversalButton>
  );
};

export default FeatureCTA; 