import { Zap } from 'lucide-react';
import React from 'react';
import { UniversalButton } from '../../../components/UniversalButton';
import { GlobalVariantKey } from '../../../types/shared';
import './PersonalTrainingCTA.scss';

/**
 * Props interface for PersonalTrainingCTA component
 */
export interface PersonalTrainingCTAProps {
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
  /** Gradient color option - defaults to violet for PersonalTraining theme */
  gradientColor?: 'lime' | 'violet' | 'emerald' | 'amber';
  /** Theme variant */
  variant?: string;
  /** Whether to use oval shape (rounded-full) */
  ovalShape?: boolean;
  /** Coach/trainer type for specialized styling */
  coachType?: 'strength' | 'nutrition' | 'performance' | 'recovery';
}

/**
 * Map gradientColor to CSS class for PersonalTraining section
 */
const mapGradientColor = (gradientColor?: string): string | undefined => {
  const gradientColorMap: Record<string, string> = {
    lime: 'pt-cta-gradient-lime',
    violet: 'pt-cta-gradient-violet',
    emerald: 'pt-cta-gradient-emerald',
    amber: 'pt-cta-gradient-amber'
  };
  
  return gradientColor ? gradientColorMap[gradientColor] : undefined;
};

/**
 * Map coachType to gradient color for specialized styling
 */
const mapCoachTypeToGradient = (coachType?: string): string => {
  const coachGradientMap: Record<string, string> = {
    strength: 'violet',
    nutrition: 'emerald',
    performance: 'amber',
    recovery: 'lime'
  };
  
  return coachType ? coachGradientMap[coachType] || 'violet' : 'violet';
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
 * PersonalTrainingCTA - Call to action button with gradient styling and coach-specific themes
 * Built following the FeatureCTA pattern with PersonalTraining-specific enhancements
 */
const PersonalTrainingCTA: React.FC<PersonalTrainingCTAProps> = ({
  text = 'Schedule Session',
  href = 'https://aigymengine.com/workout-generator-registration',
  className = '',
  buttonSize = 'medium',
  buttonVariant = 'gradient',
  showIcon = true,
  icon,
  gradientColor,
  variant,
  ovalShape = true, // Default to oval shape for modern look
  coachType = 'strength'
}) => {
  // Determine effective gradient color - coachType takes precedence over gradientColor
  const effectiveGradientColor = gradientColor || mapCoachTypeToGradient(coachType);
  
  // Map gradient color to CSS class for PersonalTraining section
  const gradientClass = mapGradientColor(effectiveGradientColor);
  
  // Map variant to GlobalVariantKey
  const globalVariant = mapVariantToGlobal(variant);
  
  // Map buttonVariant to UniversalButton variant - gradient maps to primary
  const universalButtonVariant = buttonVariant === 'gradient' ? 'primary' : (buttonVariant as 'primary' | 'secondary');
  
  // Create oval shape class
  const ovalClass = ovalShape ? 'pt-cta-oval' : '';
  
  // Create coach type class for specialized styling
  const coachTypeClass = coachType ? `pt-cta-coach-${coachType}` : '';
  
  // Combine all CSS classes
  const combinedClassName = [
    className,
    ovalClass,
    gradientClass,
    coachTypeClass
  ].filter(Boolean).join(' ');
  
  // Determine the icon to display - standardized sizing with inline alignment
  const iconElement = showIcon ? (
    icon || <Zap size={buttonSize === 'small' ? 16 : 18} className="inline-block align-text-bottom" aria-hidden="true" />
  ) : undefined;

  return (
    <UniversalButton
      sectionContext="personal-training"
      buttonVariant={universalButtonVariant}
      size={buttonSize}
      href={href}
      rightIcon={iconElement}
      className={combinedClassName}
      variant={globalVariant}
      data-section="personalTraining"
      data-context="cta"
      data-coach-type={coachType}
      aria-label={`${text} - Personal training call to action`}
      style={ovalShape ? { borderRadius: '9999px' } : undefined}
    >
      {text}
    </UniversalButton>
  );
};

export default PersonalTrainingCTA; 