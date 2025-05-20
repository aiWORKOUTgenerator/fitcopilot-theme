import React from 'react';

/**
 * Available theme options for FitCopilot.
 * These should match the available themes in your application.
 */
export const THEME_OPTIONS = [
  'default',
  'dark',
  'high-contrast',
  'light'
] as const;

export type ThemeOption = typeof THEME_OPTIONS[number];

/**
 * Renders a component with all theme variants for Storybook visualization.
 * 
 * This helper renders the component multiple times, once for each theme,
 * with clear labels to show how the component appears in different themes.
 * 
 * @param Component - The React component to render
 * @param args - Props to pass to the component
 * @returns A React element with the component rendered in all themes
 */
export function ComponentWithThemes<T extends object>(
  Component: React.ComponentType<T>,
  args: T
): React.ReactElement {
  return (
    <div className="theme-showcase">
      <style>
        {`
          .theme-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            width: 100%;
            max-width: 1200px;
          }
          
          .theme-variant {
            display: flex;
            flex-direction: column;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .theme-header {
            padding: 8px 16px;
            background-color: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            font-weight: bold;
            font-size: 14px;
          }
          
          .theme-content {
            padding: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 150px;
          }
          
          /* Ensure dark theme has appropriate background */
          .theme-dark .theme-content {
            background-color: #333;
          }
          
          /* Ensure high contrast theme has appropriate background */
          .theme-high-contrast .theme-content {
            background-color: #000;
          }
        `}
      </style>
      
      {THEME_OPTIONS.map((themeOption) => (
        <div key={themeOption} className={`theme-variant theme-${themeOption}`}>
          <div className="theme-header">{themeOption}</div>
          <div className="theme-content" data-theme={themeOption}>
            <Component {...(args as any)} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders a component with responsive variants for Storybook visualization.
 * 
 * @param Component - The React component to render
 * @param args - Props to pass to the component
 * @param breakpoints - Array of width values to show the component at
 * @returns A React element with the component rendered at different widths
 */
export function ComponentWithResponsiveVariants<T extends object>(
  Component: React.ComponentType<T>,
  args: T,
  breakpoints: number[] = [320, 768, 1024, 1440]
): React.ReactElement {
  return (
    <div className="responsive-showcase">
      <style>
        {`
          .responsive-showcase {
            display: flex;
            flex-direction: column;
            gap: 24px;
            width: 100%;
          }
          
          .responsive-variant {
            display: flex;
            flex-direction: column;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .responsive-header {
            padding: 8px 16px;
            background-color: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            font-weight: bold;
            font-size: 14px;
          }
          
          .responsive-content {
            padding: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
      
      {breakpoints.map((width) => (
        <div key={width} className="responsive-variant">
          <div className="responsive-header">{width}px</div>
          <div className="responsive-content" style={{ width: `${width}px` }}>
            <Component {...(args as any)} />
          </div>
        </div>
      ))}
    </div>
  );
} 