/**
 * Integration Tests for Features Section
 * Tests the integration between Features, FeatureCTA, and ThemeProvider
 * 
 * @fileoverview Tests for the integration of Features components
 */

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import Features from '../Features';
import FeatureCTA from '../components/FeatureCTA';

describe('Features Section Integration', () => {
  test('Features section contains FeatureCTA components with proper theming', () => {
    const { container } = render(<Features />);
    
    // Check if Features section is rendered
    expect(container.querySelector('.features-section')).toBeInTheDocument();
    
    // Check for feature cards
    expect(container.querySelectorAll('.feature-card')).toHaveLength(3);
    
    // Check for CTA buttons (UniversalButton or FeatureCTA)
    const buttons = container.querySelectorAll('button, a[role="button"]');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('FeatureCTA inherits theme from ThemeProvider', () => {
    render(
      <ThemeProvider initialTheme="gym">
        <FeatureCTA text="Test Button" variant="gym" />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    
    // Verify the button has proper theme context
    expect(button.closest('[data-theme]')).toBeInTheDocument();
  });
}); 