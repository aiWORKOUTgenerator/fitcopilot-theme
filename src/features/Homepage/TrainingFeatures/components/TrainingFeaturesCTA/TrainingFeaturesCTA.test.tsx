/**
 * TrainingFeaturesCTA Component Tests - Phase 1 Foundation
 * 
 * Comprehensive test suite built on proven TrainingCTA test patterns
 * Covers functionality, accessibility, and performance requirements
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Test imports
import TrainingFeaturesCTA from './TrainingFeaturesCTA';
import { TrainingFeaturesCTAProps } from './types';
import {
  clearFeaturesUtilityCaches,
  generateFeaturesCTAText,
  generateFeaturesStyleClasses,
  mapFeaturesSizeToUniversalButton,
  mapFeaturesVariantToGlobal
} from './utils';

// Mock dependencies
jest.mock('../../../components/UniversalButton/UniversalButton', () => ({
  UniversalButton: ({ children, onClick, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      className={className}
      data-testid="universal-button"
      {...props}
    >
      {children}
    </button>
  )
}));

jest.mock('../../../context/GlobalVariantContext', () => ({
  useGlobalVariant: () => ({
    currentVariant: 'default',
    isLoading: false
  })
}));

jest.mock('../../hooks/useReducedMotion', () => ({
  default: () => false,
  useReducedMotion: () => false
}));

// Helper function to create test props
const createTestProps = (overrides: Partial<TrainingFeaturesCTAProps> = {}): TrainingFeaturesCTAProps => ({
  onNavigate: jest.fn(),
  variant: 'default',
  size: 'primary',
  featureTitle: 'Virtual Training',
  contextType: 'explore',
  className: '',
  useSplashContext: false,
  loading: false,
  disabled: false,
  ...overrides
});

describe('TrainingFeaturesCTA', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    clearFeaturesUtilityCaches();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    jest.clearAllMocks();
  });

  // ============================================================================
  // BASIC FUNCTIONALITY TESTS
  // ============================================================================

  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      const props = createTestProps();
      render(<TrainingFeaturesCTA {...props} />);
      
      expect(screen.getByTestId('universal-button')).toBeInTheDocument();
      expect(screen.getByText('Explore Virtual Training')).toBeInTheDocument();
    });

    it('handles click events with onNavigate', async () => {
      const mockOnNavigate = jest.fn();
      const props = createTestProps({ onNavigate: mockOnNavigate });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      fireEvent.click(screen.getByTestId('universal-button'));
      
      await waitFor(() => {
        expect(mockOnNavigate).toHaveBeenCalledWith('Virtual Training');
      });
    });

    it('handles href navigation', () => {
      const props = createTestProps({ 
        href: 'https://example.com/features',
        onNavigate: jest.fn()
      });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const button = screen.getByTestId('universal-button');
      expect(button).toHaveAttribute('href', 'https://example.com/features');
    });

    it('displays loading state correctly', () => {
      const props = createTestProps({ loading: true });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const button = screen.getByTestId('universal-button');
      expect(button).toHaveAttribute('loading', 'true');
    });

    it('displays disabled state correctly', () => {
      const props = createTestProps({ disabled: true });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const button = screen.getByTestId('universal-button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  // ============================================================================
  // TEXT GENERATION TESTS
  // ============================================================================

  describe('Text Generation', () => {
    it('generates default text when no featureTitle provided', () => {
      const props = createTestProps({ featureTitle: undefined });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      expect(screen.getByText('Explore All Features')).toBeInTheDocument();
    });

    it('generates context-specific text', () => {
      const props = createTestProps({ 
        featureTitle: 'Progress Tracking',
        contextType: 'learn'
      });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      expect(screen.getByText('Learn About Progress Tracking')).toBeInTheDocument();
    });

    it('handles discover context type', () => {
      const props = createTestProps({ 
        featureTitle: 'Mobile Experience',
        contextType: 'discover'
      });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      expect(screen.getByText('Discover Mobile Experience')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // SIZE VARIANT TESTS
  // ============================================================================

  describe('Size Variants', () => {
    it('renders primary size correctly', () => {
      const props = createTestProps({ size: 'primary' });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const container = screen.getByTestId('universal-button').closest('div');
      expect(container).toHaveClass('training-features-cta--primary');
    });

    it('renders secondary size correctly', () => {
      const props = createTestProps({ size: 'secondary' });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const container = screen.getByTestId('universal-button').closest('div');
      expect(container).toHaveClass('training-features-cta--secondary');
    });

    it('renders compact size correctly', () => {
      const props = createTestProps({ size: 'compact' });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const container = screen.getByTestId('universal-button').closest('div');
      expect(container).toHaveClass('training-features-cta--compact');
    });
  });

  // ============================================================================
  // FEATURE TYPE VARIANT TESTS
  // ============================================================================

  describe('Feature Type Variants', () => {
    const featureTypes = ['virtual', 'tracking', 'support', 'mobile', 'analytics'] as const;

    featureTypes.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        const props = createTestProps({ variant });
        
        render(<TrainingFeaturesCTA {...props} />);
        
        const button = screen.getByTestId('universal-button');
        expect(button).toHaveAttribute('data-features-variant', variant);
      });
    });
  });

  // ============================================================================
  // SPLASH CONTEXT TESTS
  // ============================================================================

  describe('Splash Context', () => {
    it('renders without splash context by default', () => {
      const props = createTestProps();
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const container = screen.getByTestId('universal-button').closest('div');
      expect(container?.querySelector('.training-features-cta__splash-context')).toBeNull();
    });

    it('renders with splash context when enabled', () => {
      const props = createTestProps({ useSplashContext: true });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      expect(document.querySelector('.training-features-cta__splash-context')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe('Accessibility', () => {
    it('provides proper aria-label', () => {
      const props = createTestProps();
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const button = screen.getByTestId('universal-button');
      expect(button).toHaveAttribute('aria-label', 'Explore Virtual Training - TrainingFeatures call to action');
    });

    it('accepts custom aria-label', () => {
      const customLabel = 'Custom accessibility label';
      const props = createTestProps({ 'aria-label': customLabel });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const button = screen.getByTestId('universal-button');
      expect(button).toHaveAttribute('aria-label', customLabel);
    });

    it('provides proper data attributes for testing', () => {
      const props = createTestProps({ 
        variant: 'virtual',
        size: 'secondary',
        contextType: 'learn'
      });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      const button = screen.getByTestId('universal-button');
      expect(button).toHaveAttribute('data-section', 'training-features');
      expect(button).toHaveAttribute('data-context', 'cta');
      expect(button).toHaveAttribute('data-features-variant', 'virtual');
      expect(button).toHaveAttribute('data-features-size', 'secondary');
      expect(button).toHaveAttribute('data-context-type', 'learn');
    });
  });

  // ============================================================================
  // PROP VALIDATION TESTS
  // ============================================================================

  describe('Prop Validation', () => {
    beforeEach(() => {
      // Set NODE_ENV to development for validation tests
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('warns when neither onNavigate nor href provided', () => {
      const props = createTestProps({ onNavigate: undefined, href: undefined });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'TrainingFeaturesCTA: Either onNavigate or href must be provided for navigation to work properly.'
      );
    });

    it('warns when onNavigate is not a function', () => {
      const props = createTestProps({ onNavigate: 'not-a-function' as any });
      
      render(<TrainingFeaturesCTA {...props} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'TrainingFeaturesCTA: onNavigate must be a function.'
      );
    });
  });
});

// ============================================================================
// UTILITY FUNCTION TESTS
// ============================================================================

describe('TrainingFeaturesCTA Utilities', () => {
  beforeEach(() => {
    clearFeaturesUtilityCaches();
  });

  describe('generateFeaturesCTAText', () => {
    it('generates default text for explore context', () => {
      expect(generateFeaturesCTAText()).toBe('Explore All Features');
      expect(generateFeaturesCTAText(undefined, 'explore')).toBe('Explore All Features');
    });

    it('generates default text for learn context', () => {
      expect(generateFeaturesCTAText(undefined, 'learn')).toBe('Learn About Features');
    });

    it('generates default text for discover context', () => {
      expect(generateFeaturesCTAText(undefined, 'discover')).toBe('Discover Features');
    });

    it('generates feature-specific text', () => {
      expect(generateFeaturesCTAText('Virtual Training', 'explore')).toBe('Explore Virtual Training');
      expect(generateFeaturesCTAText('Progress Tracking', 'learn')).toBe('Learn About Progress Tracking');
    });
  });

  describe('mapFeaturesVariantToGlobal', () => {
    it('maps feature types to default', () => {
      expect(mapFeaturesVariantToGlobal('virtual')).toBe('default');
      expect(mapFeaturesVariantToGlobal('tracking')).toBe('default');
      expect(mapFeaturesVariantToGlobal('support')).toBe('default');
    });

    it('passes through global variants', () => {
      expect(mapFeaturesVariantToGlobal('gym')).toBe('gym');
      expect(mapFeaturesVariantToGlobal('sports')).toBe('sports');
    });
  });

  describe('mapFeaturesSizeToUniversalButton', () => {
    it('maps sizes correctly', () => {
      expect(mapFeaturesSizeToUniversalButton('primary')).toBe('large');
      expect(mapFeaturesSizeToUniversalButton('secondary')).toBe('medium');
      expect(mapFeaturesSizeToUniversalButton('compact')).toBe('medium');
    });
  });

  describe('generateFeaturesStyleClasses', () => {
    it('generates base classes', () => {
      const classes = generateFeaturesStyleClasses('default', 'primary');
      expect(classes).toContain('training-features-cta');
      expect(classes).toContain('training-features-cta--default');
      expect(classes).toContain('training-features-cta--primary');
    });

    it('includes feature type classes', () => {
      const classes = generateFeaturesStyleClasses('virtual', 'primary');
      expect(classes).toContain('training-features-cta--virtual');
    });

    it('includes custom className', () => {
      const classes = generateFeaturesStyleClasses('default', 'primary', 'custom-class');
      expect(classes).toContain('custom-class');
    });
  });
}); 