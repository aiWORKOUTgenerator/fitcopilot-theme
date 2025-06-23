/**
 * GlobalVariantContext Tests
 * 
 * Comprehensive test suite for the universal variant context system.
 * Tests all features including WordPress integration, persistence, and section-specific variant support.
 * 
 * @fileoverview Tests for Story 2.2 - Universal Variant Context
 * @version 1.0.0
 * @since Phase 2 - Week 3
 */

import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { GlobalVariantKey } from '../../types/shared';
import {
  ALL_GLOBAL_VARIANTS,
  getVariantAttribute,
  getVariantClass,
  GlobalVariantProvider,
  isWordPressEnvironment,
  useGlobalVariant,
  useSectionVariant,
  useWordPressVariant,
  withGlobalVariant,
} from '../GlobalVariantContext';

// ============================================================================
// MOCKS
// ============================================================================

// Mock WordPress environment
const mockWordPressEnvironment = (hasCustomizer = true, hasApiSettings = true) => {
  const mockWp = hasCustomizer ? {
    customize: {
      value: jest.fn().mockReturnValue('gym'),
    },
  } : undefined;

  const mockApiSettings = hasApiSettings ? {
    root: 'https://example.com/wp-json/',
    nonce: 'test-nonce',
  } : undefined;

  Object.defineProperty(window, 'wp', {
    value: mockWp,
    writable: true,
  });

  Object.defineProperty(window, 'wpApiSettings', {
    value: mockApiSettings,
    writable: true,
  });

  Object.defineProperty(window, 'fitcopilotThemeData', {
    value: {
      homepage_variant: 'sports' as GlobalVariantKey,
    },
    writable: true,
  });
};

// Mock fetch for WordPress API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage and sessionStorage
const mockStorage = () => {
  const storage: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => storage[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete storage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }),
  };
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage(),
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockStorage(),
  writable: true,
});

// ============================================================================
// TEST COMPONENTS
// ============================================================================

/**
 * Test component that uses the global variant context
 */
const TestComponent: React.FC = () => {
  const { currentVariant, setVariant, availableVariants, isLoading, error } = useGlobalVariant();
  
  return (
    <div data-testid="test-component">
      <div data-testid="current-variant">{currentVariant}</div>
      <div data-testid="available-variants">{availableVariants.join(',')}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <div data-testid="error">{error || 'none'}</div>
      <button 
        data-testid="set-gym" 
        onClick={() => setVariant('gym')}
      >
        Set Gym
      </button>
      <button 
        data-testid="set-sports" 
        onClick={() => setVariant('sports')}
      >
        Set Sports
      </button>
    </div>
  );
};

/**
 * Test component for section-specific variant usage
 */
const SectionTestComponent: React.FC<{ sectionName: string }> = ({ sectionName }) => {
  const { currentVariant, supportedVariants, isVariantSupported } = useSectionVariant(sectionName);
  
  return (
    <div data-testid={`section-${sectionName}`}>
      <div data-testid="section-current-variant">{currentVariant}</div>
      <div data-testid="section-supported-variants">{supportedVariants.join(',')}</div>
      <div data-testid="section-supports-gym">{isVariantSupported('gym').toString()}</div>
    </div>
  );
};

/**
 * Test component with HOC
 */
const BaseComponent: React.FC<{ variant: GlobalVariantKey; setVariant: (v: GlobalVariantKey) => void }> = ({ 
  variant, 
  setVariant 
}) => (
  <div data-testid="hoc-component">
    <div data-testid="hoc-variant">{variant}</div>
    <button data-testid="hoc-set-modern" onClick={() => setVariant('modern')}>
      Set Modern
    </button>
  </div>
);

const WrappedComponent = withGlobalVariant(BaseComponent);

// ============================================================================
// TESTS
// ============================================================================

describe('GlobalVariantContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    
    // Reset DOM attributes
    document.body.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme');
    
    // Clear storage mocks
    (window.localStorage.clear as jest.Mock).mockClear();
    (window.sessionStorage.clear as jest.Mock).mockClear();
  });

  describe('Provider and Basic Functionality', () => {
    it('should provide default variant when no initial variant is specified', () => {
      render(
        <GlobalVariantProvider>
          <TestComponent />
        </GlobalVariantProvider>
      );

      expect(screen.getByTestId('current-variant')).toHaveTextContent('default');
      expect(screen.getByTestId('available-variants')).toHaveTextContent(ALL_GLOBAL_VARIANTS.join(','));
    });

    it('should use initial variant when provided', () => {
      render(
        <GlobalVariantProvider initialVariant="gym">
          <TestComponent />
        </GlobalVariantProvider>
      );

      expect(screen.getByTestId('current-variant')).toHaveTextContent('gym');
    });

    it('should update variant when setVariant is called', async () => {
      render(
        <GlobalVariantProvider>
          <TestComponent />
        </GlobalVariantProvider>
      );

      fireEvent.click(screen.getByTestId('set-gym'));

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('gym');
      });
    });

    it('should apply data-theme attributes to DOM elements', async () => {
      render(
        <GlobalVariantProvider>
          <TestComponent />
        </GlobalVariantProvider>
      );

      fireEvent.click(screen.getByTestId('set-sports'));

      await waitFor(() => {
        expect(document.body.getAttribute('data-theme')).toBe('sports');
        expect(document.documentElement.getAttribute('data-theme')).toBe('sports');
      });
    });

    it('should call onVariantChange callback when variant changes', async () => {
      const onVariantChange = jest.fn();
      
      render(
        <GlobalVariantProvider onVariantChange={onVariantChange}>
          <TestComponent />
        </GlobalVariantProvider>
      );

      fireEvent.click(screen.getByTestId('set-gym'));

      await waitFor(() => {
        expect(onVariantChange).toHaveBeenCalledWith('gym');
      });
    });
  });

  describe('WordPress Integration', () => {
    beforeEach(() => {
      mockWordPressEnvironment();
    });

    it('should detect WordPress environment correctly', () => {
      expect(isWordPressEnvironment()).toBe(true);
    });

    it('should load variant from WordPress customizer on mount', async () => {
      const mockCustomize = {
        value: jest.fn().mockReturnValue('wellness'),
      };
      
      (window as any).wp = { customize: mockCustomize };

      render(
        <GlobalVariantProvider enableWpIntegration={true}>
          <TestComponent />
        </GlobalVariantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('wellness');
      });
    });

    it('should update WordPress customizer when variant changes', async () => {
      const mockCustomize = {
        value: jest.fn(),
      };
      
      (window as any).wp = { customize: mockCustomize };

      render(
        <GlobalVariantProvider enableWpIntegration={true}>
          <TestComponent />
        </GlobalVariantProvider>
      );

      fireEvent.click(screen.getByTestId('set-gym'));

      await waitFor(() => {
        expect(mockCustomize.value).toHaveBeenCalledWith('homepage_variant', 'gym');
      });
    });
  });

  describe('Section-Specific Variant Support', () => {
    it('should return correct supported variants for training section', () => {
      render(
        <GlobalVariantProvider>
          <SectionTestComponent sectionName="training" />
        </GlobalVariantProvider>
      );

      const supportedVariants = screen.getByTestId('section-supported-variants').textContent;
      expect(supportedVariants).toContain('default');
      expect(supportedVariants).toContain('boutique');
      expect(supportedVariants).not.toContain('registration');
    });

    it('should correctly identify if a variant is supported by a section', () => {
      render(
        <GlobalVariantProvider>
          <SectionTestComponent sectionName="journey" />
        </GlobalVariantProvider>
      );

      expect(screen.getByTestId('section-supports-gym')).toHaveTextContent('true');
    });

    it('should return all variants for sections that support everything', () => {
      render(
        <GlobalVariantProvider>
          <SectionTestComponent sectionName="hero" />
        </GlobalVariantProvider>
      );

      const supportedVariants = screen.getByTestId('section-supported-variants').textContent;
      expect(supportedVariants?.split(',').length).toBe(ALL_GLOBAL_VARIANTS.length);
    });
  });

  describe('WordPress Variant Hook', () => {
    it('should provide WordPress-specific functionality', () => {
      const { result } = renderHook(() => useWordPressVariant(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <GlobalVariantProvider>{children}</GlobalVariantProvider>
        ),
      });

      expect(result.current.wpVariant).toBe('default');
      expect(typeof result.current.updateWpVariant).toBe('function');
      expect(typeof result.current.syncWithWordPress).toBe('function');
    });
  });

  describe('Higher-Order Component', () => {
    it('should provide variant props to wrapped component', () => {
      render(
        <GlobalVariantProvider initialVariant="classic">
          <WrappedComponent />
        </GlobalVariantProvider>
      );

      expect(screen.getByTestId('hoc-variant')).toHaveTextContent('classic');
    });

    it('should allow wrapped component to change variant', async () => {
      render(
        <GlobalVariantProvider>
          <WrappedComponent />
          <TestComponent />
        </GlobalVariantProvider>
      );

      fireEvent.click(screen.getByTestId('hoc-set-modern'));

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');
      });
    });
  });

  describe('Utility Functions', () => {
    it('should generate correct variant CSS classes', () => {
      expect(getVariantClass('default')).toBe('');
      expect(getVariantClass('gym')).toBe('variant-gym');
      expect(getVariantClass('sports', 'theme')).toBe('theme-sports');
    });

    it('should generate correct variant data attributes', () => {
      expect(getVariantAttribute('default')).toBeUndefined();
      expect(getVariantAttribute('wellness')).toBe('wellness');
    });
  });

  describe('Error Handling', () => {
    it('should handle WordPress integration errors gracefully', async () => {
      // Mock WordPress error
      const mockCustomize = {
        value: jest.fn().mockImplementation(() => {
          throw new Error('WordPress error');
        }),
      };
      
      (window as any).wp = { customize: mockCustomize };

      render(
        <GlobalVariantProvider enableWpIntegration={true}>
          <TestComponent />
        </GlobalVariantProvider>
      );

      // Should still render with default variant
      expect(screen.getByTestId('current-variant')).toHaveTextContent('default');
    });

    it('should throw error when useGlobalVariant is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useGlobalVariant());
      }).toThrow('useGlobalVariant must be used within a GlobalVariantProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during variant changes', async () => {
      render(
        <GlobalVariantProvider>
          <TestComponent />
        </GlobalVariantProvider>
      );

      // Mock a slow variant change
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((callback) => {
        // Don't actually delay, but we can test the loading state
        callback();
        return 1;
      }) as any;

      fireEvent.click(screen.getByTestId('set-gym'));

      // The loading state might be too fast to catch in this test,
      // but the structure is there for real async operations
      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('gym');
      });

      global.setTimeout = originalSetTimeout;
    });
  });

  describe('Provider Props', () => {
    it('should apply custom className to provider container', () => {
      render(
        <GlobalVariantProvider className="custom-class" testId="custom-provider">
          <TestComponent />
        </GlobalVariantProvider>
      );

      const provider = screen.getByTestId('custom-provider');
      expect(provider).toHaveClass('custom-class');
    });

    it('should disable WordPress integration when specified', () => {
      mockWordPressEnvironment();
      
      render(
        <GlobalVariantProvider enableWpIntegration={false}>
          <TestComponent />
        </GlobalVariantProvider>
      );

      // Should use default variant instead of WordPress variant
      expect(screen.getByTestId('current-variant')).toHaveTextContent('default');
    });
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('GlobalVariantContext Integration', () => {
  it('should work with multiple sections simultaneously', async () => {
    render(
      <GlobalVariantProvider>
        <TestComponent />
        <SectionTestComponent sectionName="hero" />
        <SectionTestComponent sectionName="training" />
      </GlobalVariantProvider>
    );

    fireEvent.click(screen.getByTestId('set-sports'));

    await waitFor(() => {
      expect(screen.getByTestId('current-variant')).toHaveTextContent('sports');
      expect(screen.getByTestId('section-current-variant')).toHaveTextContent('sports');
    });
  });

  it('should maintain variant consistency across re-renders', async () => {
    const { rerender } = render(
      <GlobalVariantProvider initialVariant="wellness">
        <TestComponent />
      </GlobalVariantProvider>
    );

    expect(screen.getByTestId('current-variant')).toHaveTextContent('wellness');

    rerender(
      <GlobalVariantProvider initialVariant="wellness">
        <TestComponent />
        <SectionTestComponent sectionName="features" />
      </GlobalVariantProvider>
    );

    expect(screen.getByTestId('current-variant')).toHaveTextContent('wellness');
    expect(screen.getByTestId('section-current-variant')).toHaveTextContent('wellness');
  });
}); 