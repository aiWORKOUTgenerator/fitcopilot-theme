/**
 * Variant Switcher Example
 * 
 * Demonstrates how to use the GlobalVariantContext for theme switching.
 * This component can be used for testing, development, and as a reference implementation.
 * 
 * @fileoverview Example usage of GlobalVariantContext for Story 2.2
 * @version 1.0.0
 * @since Phase 2 - Week 3
 */

import React from 'react';
import {
  getVariantClass,
  isWordPressEnvironment,
  useGlobalVariant,
  useSectionVariant,
  useWordPressVariant
} from '../context/GlobalVariantContext';
import { GlobalVariantKey } from '../types/shared';

// ============================================================================
// VARIANT SWITCHER COMPONENT
// ============================================================================

/**
 * Props for the VariantSwitcher component
 */
export interface VariantSwitcherProps {
  /** Whether to show WordPress integration status */
  showWordPressStatus?: boolean;
  /** Whether to show section-specific variant support */
  showSectionSupport?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Position of the switcher */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

/**
 * Variant Switcher Component
 * 
 * Provides a UI for switching between different theme variants
 */
export const VariantSwitcher: React.FC<VariantSwitcherProps> = ({
  showWordPressStatus = true,
  showSectionSupport = false,
  className = '',
  position = 'bottom-right',
}) => {
  const { 
    currentVariant, 
    setVariant, 
    availableVariants, 
    isLoading, 
    error,
    wpIntegration 
  } = useGlobalVariant();

  const { 
    wpVariant, 
    updateWpVariant, 
    syncWithWordPress 
  } = useWordPressVariant();

  const positionClasses = {
    'top-left': 'fixed top-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  };

  const handleVariantChange = async (variant: GlobalVariantKey) => {
    try {
      await setVariant(variant);
    } catch (err) {
      logger.error('Failed to change variant:', err);
    }
  };

  const handleSyncWithWordPress = async () => {
    try {
      await syncWithWordPress();
    } catch (err) {
      logger.error('Failed to sync with WordPress:', err);
    }
  };

  return (
    <div 
      className={`
        variant-switcher 
        ${positionClasses[position]} 
        ${getVariantClass(currentVariant, 'theme')}
        ${className}
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-lg shadow-lg p-4 
        max-w-sm z-50
      `}
      data-testid="variant-switcher"
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Theme Variant
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Current: <span className="font-medium">{currentVariant}</span>
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mb-3 text-xs text-blue-600 dark:text-blue-400">
          Switching variant...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-3 text-xs text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      )}

      {/* Variant Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {availableVariants.map((variant) => (
          <button
            key={variant}
            onClick={() => handleVariantChange(variant)}
            disabled={isLoading}
            className={`
              px-3 py-2 text-xs rounded-md border transition-colors
              ${currentVariant === variant
            ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200'
            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
          }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            data-testid={`variant-${variant}`}
          >
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </button>
        ))}
      </div>

      {/* WordPress Integration Status */}
      {showWordPressStatus && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              WordPress
            </span>
            <span 
              className={`
                text-xs px-2 py-1 rounded-full
                ${wpIntegration.isConnected 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }
              `}
            >
              {wpIntegration.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {wpIntegration.isConnected && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Last sync: {wpIntegration.lastSync?.toLocaleTimeString() || 'Never'}
            </div>
          )}

          {wpIntegration.canUpdate && (
            <button
              onClick={handleSyncWithWordPress}
              disabled={isLoading}
              className="w-full text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 transition-colors disabled:opacity-50"
            >
              Sync with WordPress
            </button>
          )}

          {isWordPressEnvironment() && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              WordPress environment detected
            </div>
          )}
        </div>
      )}

      {/* Section Support Info */}
      {showSectionSupport && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Section Support
          </div>
          <SectionSupportInfo />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SECTION SUPPORT COMPONENT
// ============================================================================

/**
 * Component that shows which sections support the current variant
 */
const SectionSupportInfo: React.FC = () => {
  const { currentVariant } = useGlobalVariant();
  
  const sections = [
    'hero',
    'features', 
    'training',
    'personalTraining',
    'journey',
    'trainingFeatures',
    'testimonials',
    'pricing',
    'footer'
  ];

  return (
    <div className="space-y-1">
      {sections.map((section) => (
        <SectionSupportItem 
          key={section} 
          sectionName={section} 
          variant={currentVariant} 
        />
      ))}
    </div>
  );
};

/**
 * Individual section support item
 */
const SectionSupportItem: React.FC<{ 
  sectionName: string; 
  variant: GlobalVariantKey; 
}> = ({ sectionName, variant }) => {
  const { isVariantSupported } = useSectionVariant(sectionName);
  const supported = isVariantSupported(variant);

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600 dark:text-gray-400 capitalize">
        {sectionName}
      </span>
      <span 
        className={`
          px-1 py-0.5 rounded text-xs
          ${supported 
      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
    }
        `}
      >
        {supported ? '✓' : '✗'}
      </span>
    </div>
  );
};

// ============================================================================
// VARIANT PREVIEW COMPONENT
// ============================================================================

/**
 * Props for VariantPreview component
 */
export interface VariantPreviewProps {
  /** Variant to preview */
  variant: GlobalVariantKey;
  /** Whether this variant is currently active */
  isActive?: boolean;
  /** Callback when variant is selected */
  onSelect?: (variant: GlobalVariantKey) => void;
  /** Show variant name */
  showName?: boolean;
  /** Custom size */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Variant Preview Component
 * 
 * Shows a visual preview of what a variant looks like
 */
export const VariantPreview: React.FC<VariantPreviewProps> = ({
  variant,
  isActive = false,
  onSelect,
  showName = true,
  size = 'medium',
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const handleClick = () => {
    onSelect?.(variant);
  };

  return (
    <div 
      className={`
        variant-preview cursor-pointer transition-all duration-200
        ${sizeClasses[size]}
        ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        hover:scale-105 hover:shadow-lg
      `}
      onClick={handleClick}
      data-testid={`variant-preview-${variant}`}
    >
      <div 
        className={`
          w-full h-full rounded-lg border-2 border-gray-200
          ${getVariantClass(variant, 'preview')}
          flex items-center justify-center
          bg-gradient-to-br from-gray-50 to-gray-100
        `}
        data-theme={variant}
      >
        <div className="text-center">
          <div className="w-4 h-4 mx-auto mb-1 rounded-full bg-current opacity-60" />
          {showName && (
            <div className="text-xs font-medium text-gray-700 capitalize">
              {variant}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VARIANT GRID COMPONENT
// ============================================================================

/**
 * Props for VariantGrid component
 */
export interface VariantGridProps {
  /** Callback when variant is selected */
  onVariantSelect?: (variant: GlobalVariantKey) => void;
  /** Number of columns */
  columns?: number;
  /** Size of preview items */
  previewSize?: 'small' | 'medium' | 'large';
  /** Custom CSS class */
  className?: string;
}

/**
 * Variant Grid Component
 * 
 * Shows all available variants in a grid layout
 */
export const VariantGrid: React.FC<VariantGridProps> = ({
  onVariantSelect,
  columns = 4,
  previewSize = 'medium',
  className = '',
}) => {
  const { currentVariant, setVariant, availableVariants } = useGlobalVariant();

  const handleVariantSelect = async (variant: GlobalVariantKey) => {
    await setVariant(variant);
    onVariantSelect?.(variant);
  };

  return (
    <div 
      className={`
        variant-grid 
        grid gap-4
        ${className}
      `}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      data-testid="variant-grid"
    >
      {availableVariants.map((variant) => (
        <VariantPreview
          key={variant}
          variant={variant}
          isActive={currentVariant === variant}
          onSelect={handleVariantSelect}
          size={previewSize}
        />
      ))}
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default VariantSwitcher; 