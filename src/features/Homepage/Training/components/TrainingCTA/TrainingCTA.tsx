import React, { memo, useCallback, useEffect } from 'react';
import { UniversalButton } from '../../../components/UniversalButton/UniversalButton';
import { useGlobalVariant } from '../../../context/GlobalVariantContext';
import useReducedMotion from '../../hooks/useReducedMotion';
import './TrainingCTA.scss';
import { TrainingCTAProps } from './types';
import {
  generateAccessibilityLabel,
  generateCTAText,
  generateStyleClasses,
  mapSizeToUniversalButton,
  mapTrainingVariantToGlobal,
  validateTrainingCTAProps
} from './utils';

/**
 * Training CTA button for the Training section
 * 
 * Phase 3 architectural improvements implemented:
 * - Theme context integration for automatic variant detection
 * - Animation integration with reduced motion support
 * - Enhanced accessibility and performance optimizations
 * - Removed default background container for cleaner appearance
 * - Preserved all existing visual styling and behavior
 * 
 * Features:
 * - Automatic theme consistency via GlobalVariantContext
 * - Reduced motion accessibility support
 * - Enhanced performance with optimized re-renders
 * - Centralized utility functions for maintainability
 * - Development-time prop validation and warnings
 * - Complete backward compatibility
 * - Clean button rendering without splash context by default
 * 
 * @version 3.1.0 - Background Container Removal
 */
const TrainingCTA: React.FC<TrainingCTAProps> = memo(function TrainingCTA({
  onNavigate,
  variant: propVariant,
  size = 'primary',
  programTitle,
  className = '',
  href,
  useSplashContext = false,
  loading = false,
  disabled = false,
  'aria-label': ariaLabel,
  ...restProps
}) {
  // Phase 3.1: Theme Context Integration
  const { currentVariant: globalVariant, isLoading: themeLoading } = useGlobalVariant();
  const effectiveVariant = propVariant || globalVariant;
  
  // Phase 3.2: Animation Integration
  const prefersReducedMotion = useReducedMotion();
  
  // Development-time prop validation (preserved from Phase 2)
  useEffect(() => {
    validateTrainingCTAProps({ onNavigate, href, programTitle });
  }, [onNavigate, href, programTitle]);

  // Generate CTA text using centralized utility (preserved from Phase 2)
  const ctaText = generateCTAText(programTitle);
  
  // Generate CSS classes to preserve existing styling (preserved from Phase 2)
  const containerClasses = generateStyleClasses(effectiveVariant, size, className, useSplashContext);
  
  // Map variants for UniversalButton compatibility (preserved from Phase 2)
  const universalButtonVariant = mapTrainingVariantToGlobal(effectiveVariant);
  const universalButtonSize = mapSizeToUniversalButton(size);
  
  // Handle click events - preserve existing onNavigate behavior (preserved from Phase 2)
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (href) {
      // Let default navigation happen for href
      return;
    }
    
    event.preventDefault();
    onNavigate(programTitle || 'View All Programs');
  }, [onNavigate, programTitle, href]);

  // Generate accessibility label using centralized utility (preserved from Phase 2)
  const accessibilityLabel = generateAccessibilityLabel(ctaText, ariaLabel);
  
  // Phase 3: Enhanced loading state (combines theme loading with prop loading)
  const isButtonLoading = loading || themeLoading;

  // Create UniversalButton with Phase 3 enhancements
  const buttonContent = (
    <UniversalButton
      sectionContext="training"
      buttonVariant="primary"
      gradientColor="amber"
      size={universalButtonSize}
      onClick={handleClick}
      href={href}
      className="training-cta__button"
      variant={universalButtonVariant}
      disabled={disabled || isButtonLoading}
      loading={isButtonLoading}
      aria-label={accessibilityLabel}
      data-section="training"
      data-context="cta"
      data-training-variant={effectiveVariant}
      data-training-size={size}
      data-theme-source={propVariant ? 'prop' : 'context'}
      data-reduced-motion={prefersReducedMotion}
      data-global-variant={globalVariant}
      {...restProps}
    >
      {ctaText}
    </UniversalButton>
  );

  // Conditionally wrap in splash context to preserve existing styling
  if (useSplashContext) {
    return (
      <div 
        className={containerClasses}
        data-theme-variant={effectiveVariant}
        data-reduced-motion={prefersReducedMotion}
      >
        <div className="training-cta__splash-context">
          {buttonContent}
        </div>
      </div>
    );
  }

  // Direct usage without splash context wrapper
  return (
    <div 
      className={containerClasses}
      data-theme-variant={effectiveVariant}
      data-reduced-motion={prefersReducedMotion}
    >
      {buttonContent}
    </div>
  );
});

// Phase 3: Enhanced display name for debugging
TrainingCTA.displayName = 'TrainingCTA';

export default TrainingCTA; 