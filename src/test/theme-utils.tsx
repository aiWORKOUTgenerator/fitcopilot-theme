import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeOption } from '../utils/theming';

/**
 * Custom render function that wraps the component in a ThemeProvider
 * for theme-aware testing.
 *
 * @param ui - The React component to render
 * @param theme - The theme to apply to the component
 * @param options - Additional render options
 * @returns The render result
 */
export function renderWithTheme(
  ui: ReactElement,
  theme: ThemeOption = 'default',
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Gets computed styles for a given element in a specific theme context
 *
 * @param element - The HTML element to get styles for
 * @param theme - The theme to apply
 * @param property - The CSS property to get
 * @returns The computed style value
 */
export function getThemeStyle(
  element: HTMLElement,
  theme: ThemeOption,
  property: string
): string {
  // Create a temporary element to apply the theme
  const tempDiv = document.createElement('div');
  tempDiv.setAttribute('data-theme', theme);
  document.body.appendChild(tempDiv);
  
  // Clone the element inside our themed div
  const clone = element.cloneNode(true) as HTMLElement;
  tempDiv.appendChild(clone);
  
  // Get the computed style
  const computedStyle = window.getComputedStyle(clone);
  const value = computedStyle.getPropertyValue(property);
  
  // Clean up
  document.body.removeChild(tempDiv);
  
  return value;
}

/**
 * Example usage in tests:
 * 
 * ```tsx
 * import { renderWithTheme, getThemeStyle } from '../test/theme-utils';
 * 
 * describe('Button', () => {
 *   test('changes color based on theme', () => {
 *     const { getByRole } = renderWithTheme(<Button>Click me</Button>, 'gym');
 *     const button = getByRole('button');
 *     
 *     expect(button).toHaveStyle({
 *       backgroundColor: 'var(--color-primary)'
 *     });
 *     
 *     // Or test with computed styles across themes
 *     const defaultColor = getThemeStyle(button, 'default', 'background-color');
 *     const gymColor = getThemeStyle(button, 'gym', 'background-color');
 *     
 *     expect(defaultColor).not.toBe(gymColor);
 *   });
 * });
 * ```
 */

/**
 * Test all themes against a component
 * 
 * @param ui - The React component to test
 * @param assertion - The assertion function to run against each theme
 */
export function testAllThemes(
  ui: ReactElement,
  assertion: (result: RenderResult, theme: ThemeOption) => void
): void {
  const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness', 'nutrition'];
  
  describe('theme variants', () => {
    themes.forEach(theme => {
      test(`with ${theme} theme`, () => {
        const result = renderWithTheme(ui, theme);
        assertion(result, theme);
      });
    });
  });
}

export default {
  renderWithTheme,
  getThemeStyle,
  testAllThemes,
}; 