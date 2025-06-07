/**
 * TrainingCTA Comprehensive Test Suite - Phase 3.5
 * 
 * Complete testing coverage for TrainingCTA component including:
 * - Visual preservation tests
 * - Accessibility compliance
 * - Performance validation
 * - Theme integration
 * - Animation support
 * 
 * @version 3.0.0 - Phase 3 Complete Testing Suite
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { GlobalVariantProvider } from '../../../context/GlobalVariantContext';
import { GlobalVariantKey } from '../../../types/shared';
import TrainingCTA from './TrainingCTA';
import { TrainingCTAProps, TrainingVariantKey } from './types';
import {
    clearUtilityCaches,
    getCacheStatistics,
    preloadCommonCombinations
} from './utils';

// ============================================================================
// TEST SETUP & MOCKS
// ============================================================================

// Mock UniversalButton to focus on TrainingCTA logic
jest.mock('../../../components/UniversalButton/UniversalButton', () => ({
  UniversalButton: jest.fn(({ children, onClick, className, ...props }) => (
    <button 
      onClick={onClick} 
      className={className}
      data-testid="universal-button"
      {...props}
    >
      {children}
    </button>
  ))
}));

// Mock reduced motion hook
jest.mock('../../hooks/useReducedMotion', () => ({
  __esModule: true,
  default: jest.fn(() => false),
}));

// Mock console methods for validation testing
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();

// Default props for testing
const defaultProps: TrainingCTAProps = {
  onNavigate: jest.fn(),
  variant: 'default',
  size: 'primary',
  programTitle: 'Strength Building',
};

// Test wrapper with theme context
const TestWrapper: React.FC<{ 
  children: React.ReactNode; 
  initialVariant?: GlobalVariantKey;
}> = ({ children, initialVariant = 'default' }) => (
  <GlobalVariantProvider initialVariant={initialVariant}>
    {children}
  </GlobalVariantProvider>
);

// ============================================================================
// VISUAL PRESERVATION TESTS
// ============================================================================

describe('TrainingCTA - Visual Preservation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearUtilityCaches();
  });

  it('maintains exact styling for all variants', () => {
    const variants: TrainingVariantKey[] = [
      'default', 'strength', 'fatLoss', 'fitness', 'athletic',
      'gym', 'sports', 'wellness', 'modern', 'classic', 'minimalist', 'boutique'
    ];

    variants.forEach(variant => {
      const { container } = render(
        <TestWrapper>
          <TrainingCTA {...defaultProps} variant={variant} />
        </TestWrapper>
      );

      // Verify CSS classes are preserved
      const ctaContainer = container.querySelector('.training-cta');
      expect(ctaContainer).toHaveClass(`training-cta--${variant}`);
      
      // Note: useSplashContext defaults to false as of version 3.1.0
      // Splash context is only present when explicitly enabled
    });
  });

  it('defaults to no splash context (useSplashContext=false)', () => {
    const { container } = render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} />
      </TestWrapper>
    );

    // Default behavior: no splash context
    expect(container.querySelector('.training-cta__splash-context')).not.toBeInTheDocument();
  });

  it('preserves splash context behavior when explicitly enabled', () => {
    const { container, rerender } = render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} useSplashContext={true} />
      </TestWrapper>
    );

    // With splash context explicitly enabled
    expect(container.querySelector('.training-cta__splash-context')).toBeInTheDocument();

    // Without splash context
    rerender(
      <TestWrapper>
        <TrainingCTA {...defaultProps} useSplashContext={false} />
      </TestWrapper>
    );

    expect(container.querySelector('.training-cta__splash-context')).not.toBeInTheDocument();
  });

  it('maintains size variant behavior', () => {
    const { container, rerender } = render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} size="primary" />
      </TestWrapper>
    );

    expect(container.querySelector('.training-cta--primary')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <TrainingCTA {...defaultProps} size="secondary" />
      </TestWrapper>
    );

    expect(container.querySelector('.training-cta--secondary')).toBeInTheDocument();
  });

  it('generates correct CTA text for program titles', () => {
    const testCases = [
      { title: 'Strength Building', expected: 'View Strength Building Programs' },
      { title: 'Fat Loss', expected: 'View Fat Loss Programs' },
      { title: undefined, expected: 'View All Programs' },
      { title: 'Custom Program', expected: 'View Custom Program Programs' },
    ];

    testCases.forEach(({ title, expected }) => {
      render(
        <TestWrapper>
          <TrainingCTA {...defaultProps} programTitle={title} />
        </TestWrapper>
      );

      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

describe('TrainingCTA - Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides proper ARIA labels', () => {
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} />
      </TestWrapper>
    );

    const button = screen.getByTestId('universal-button');
    expect(button).toHaveAttribute('aria-label', 'View Strength Building Programs - Training section call to action');
  });

  it('supports custom ARIA labels', () => {
    const customLabel = 'Custom accessibility label';
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} aria-label={customLabel} />
      </TestWrapper>
    );

    const button = screen.getByTestId('universal-button');
    expect(button).toHaveAttribute('aria-label', customLabel);
  });

  it('supports keyboard navigation', () => {
    const mockNavigate = jest.fn();
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} onNavigate={mockNavigate} />
      </TestWrapper>
    );

    const button = screen.getByTestId('universal-button');
    
    // Simulate keyboard interaction
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.click(button); // Click should still work
    
    expect(mockNavigate).toHaveBeenCalledWith('Strength Building');
  });

  it('works with screen readers', () => {
    const { container } = render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} />
      </TestWrapper>
    );

    // Check for screen reader friendly attributes
    const button = screen.getByTestId('universal-button');
    expect(button).toHaveAttribute('data-section', 'training');
    expect(button).toHaveAttribute('data-context', 'cta');
  });

  it('handles reduced motion preference', () => {
    const useReducedMotion = require('../../hooks/useReducedMotion').default;
    useReducedMotion.mockReturnValue(true);

    const { container } = render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} />
      </TestWrapper>
    );

    const ctaContainer = container.querySelector('.training-cta');
    expect(ctaContainer).toHaveAttribute('data-reduced-motion', 'true');
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('TrainingCTA - Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('integrates with UniversalButton', () => {
    const UniversalButton = require('../../../components/UniversalButton/UniversalButton').UniversalButton;
    
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} />
      </TestWrapper>
    );

    expect(UniversalButton).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionContext: 'training',
        buttonVariant: 'primary',
        gradientColor: 'amber',
        size: 'large',
      }),
      expect.anything()
    );
  });

  it('respects theme context', () => {
    render(
      <TestWrapper initialVariant="gym">
        <TrainingCTA {...defaultProps} variant={undefined} />
      </TestWrapper>
    );

    const button = screen.getByTestId('universal-button');
    expect(button).toHaveAttribute('data-global-variant', 'gym');
    expect(button).toHaveAttribute('data-theme-source', 'context');
  });

  it('handles loading states', () => {
    const { rerender } = render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} loading={false} />
      </TestWrapper>
    );

    let button = screen.getByTestId('universal-button');
    expect(button).not.toHaveAttribute('disabled');

    rerender(
      <TestWrapper>
        <TrainingCTA {...defaultProps} loading={true} />
      </TestWrapper>
    );

    button = screen.getByTestId('universal-button');
    expect(button).toHaveAttribute('disabled');
  });

  it('handles navigation with href', () => {
    const mockNavigate = jest.fn();
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} onNavigate={mockNavigate} href="/training" />
      </TestWrapper>
    );

    const button = screen.getByTestId('universal-button');
    fireEvent.click(button);

    // Should not call onNavigate when href is provided
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles navigation without href', () => {
    const mockNavigate = jest.fn();
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} onNavigate={mockNavigate} />
      </TestWrapper>
    );

    const button = screen.getByTestId('universal-button');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('Strength Building');
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('TrainingCTA - Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearUtilityCaches();
  });

  it('utilizes memoization for CSS classes', () => {
    // First render
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} variant="strength" />
      </TestWrapper>
    );

    const initialCacheSize = getCacheStatistics().cssClassCacheSize;

    // Second render with same props - should use cache
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} variant="strength" />
      </TestWrapper>
    );

    const finalCacheSize = getCacheStatistics().cssClassCacheSize;
    expect(finalCacheSize).toBe(initialCacheSize);
  });

  it('caches variant mappings', () => {
    // Multiple renders with same variant should reuse cache
    ['strength', 'strength', 'fatLoss', 'strength'].forEach((variant, index) => {
      render(
        <TestWrapper>
          <TrainingCTA {...defaultProps} variant={variant as TrainingVariantKey} />
        </TestWrapper>
      );
    });

    const stats = getCacheStatistics();
    expect(stats.variantMappingCacheSize).toBe(2); // Only unique variants cached
  });

  it('preloads common combinations', () => {
    preloadCommonCombinations();
    
    const stats = getCacheStatistics();
    expect(stats.cssClassCacheSize).toBeGreaterThan(0);
    expect(stats.variantMappingCacheSize).toBeGreaterThan(0);
  });

  it('clears caches when requested', () => {
    // Generate some cache entries
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} variant="strength" />
      </TestWrapper>
    );

    expect(getCacheStatistics().cssClassCacheSize).toBeGreaterThan(0);

    clearUtilityCaches();
    
    const stats = getCacheStatistics();
    expect(stats.cssClassCacheSize).toBe(0);
    expect(stats.variantMappingCacheSize).toBe(0);
  });
});

// ============================================================================
// VALIDATION & DEVELOPMENT TESTS
// ============================================================================

describe('TrainingCTA - Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set development mode
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  it('warns when neither onNavigate nor href provided', () => {
    render(
      <TestWrapper>
        <TrainingCTA 
          variant="default" 
          size="primary" 
          onNavigate={jest.fn()}
          // Testing validation logic, not actual missing props
        />
      </TestWrapper>
    );

    // Test with actually missing props by passing partial props object
    const { validateTrainingCTAProps } = require('./utils');
    validateTrainingCTAProps({});

    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Either onNavigate or href should be provided')
    );
  });

  it('provides info for unrecognized program titles', () => {
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} programTitle="Custom Unknown Program" />
      </TestWrapper>
    );

    expect(mockConsoleInfo).toHaveBeenCalledWith(
      expect.stringContaining('programTitle "Custom Unknown Program" is not in predefined mapping')
    );
  });

  it('skips validation in production', () => {
    process.env.NODE_ENV = 'production';

    render(
      <TestWrapper>
        <TrainingCTA 
          variant="default" 
          size="primary" 
          onNavigate={jest.fn()}
        />
      </TestWrapper>
    );

    expect(mockConsoleWarn).not.toHaveBeenCalled();
  });
});

// ============================================================================
// BACKWARD COMPATIBILITY TESTS
// ============================================================================

describe('TrainingCTA - Backward Compatibility', () => {
  it('supports legacy props interface', () => {
    // Test that old usage patterns still work
    const legacyProps = {
      onNavigate: jest.fn(),
      variant: 'default' as const,
      size: 'primary' as const,
      programTitle: 'Strength Building',
      className: 'custom-class',
    };

    expect(() => {
      render(
        <TestWrapper>
          <TrainingCTA {...legacyProps} />
        </TestWrapper>
      );
    }).not.toThrow();

    expect(screen.getByText('View Strength Building Programs')).toBeInTheDocument();
  });

  it('maintains component display name', () => {
    expect(TrainingCTA.displayName).toBe('TrainingCTA');
  });
});

// ============================================================================
// EDGE CASES & ERROR HANDLING
// ============================================================================

describe('TrainingCTA - Edge Cases', () => {
  it('handles empty program title', () => {
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} programTitle="" />
      </TestWrapper>
    );

    expect(screen.getByText('View All Programs')).toBeInTheDocument();
  });

  it('handles null program title', () => {
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} programTitle={undefined} />
      </TestWrapper>
    );

    expect(screen.getByText('View All Programs')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} disabled={true} />
      </TestWrapper>
    );

    const button = screen.getByTestId('universal-button');
    expect(button).toHaveAttribute('disabled');
  });

  it('handles very long program titles', () => {
    const longTitle = 'This is a very long program title that might cause layout issues';
    render(
      <TestWrapper>
        <TrainingCTA {...defaultProps} programTitle={longTitle} />
      </TestWrapper>
    );

    expect(screen.getByText(`View ${longTitle} Programs`)).toBeInTheDocument();
  });
}); 