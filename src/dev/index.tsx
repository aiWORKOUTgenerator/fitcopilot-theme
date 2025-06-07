/**
 * Development Tools Index
 * 
 * This file exports development tools for the FitCopilot application.
 * These tools are only intended for development and should not be used in production.
 */

import React from 'react';

export { default as ThemeInspector } from './ThemeInspector';
export { default as ThemeSwitcher } from './ThemeSwitcher';
export { default as ThemeDemoPage } from './ThemeDemoPage';

/**
 * Development environment check
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Development tools wrapper component
 * Will only show children in development mode
 */
export const DevOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isDevelopment) {
    return <>{children}</>;
  }
  return null;
}; 