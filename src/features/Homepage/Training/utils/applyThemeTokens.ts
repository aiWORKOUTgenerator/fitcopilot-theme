/**
 * Theme Token Application Utilities
 *
 * This file provides utilities for applying theme tokens programmatically in JavaScript
 */
import { VariantKey } from '../types';
import { getThemeVariables } from './themeTokens';

/**
 * Applies theme tokens to a DOM element or the document root
 * 
 * @param variant The theme variant to apply
 * @param element Optional target element (defaults to document.documentElement)
 */
export const applyThemeTokens = (
  variant: VariantKey,
  element: HTMLElement = document.documentElement
): void => {
  const tokenVariables = getThemeVariables(variant);

  // Apply each token variable to the element's style
  Object.entries(tokenVariables).forEach(([name, value]) => {
    element.style.setProperty(name, value);
  });
};

/**
 * Applies program-specific tokens to a DOM element
 * 
 * @param programType The program type ('strength', 'fatLoss', etc)
 * @param variant The theme variant to use for token values
 * @param element Target element to apply styles to
 */
export const applyProgramTokens = (
  programType: string,
  variant: VariantKey = 'default',
  element: HTMLElement
): void => {
  const tokenVariables = getThemeVariables(variant);

  // Apply gradient token
  const gradientVar = `--training-gradient-${programType}`;
  if (tokenVariables[gradientVar]) {
    element.style.backgroundImage = tokenVariables[gradientVar];
  }

  // Apply text color token
  const textVar = `--training-text-${programType}`;
  if (tokenVariables[textVar]) {
    element.style.color = tokenVariables[textVar];
  }
};

/**
 * Creates an inline style object from theme tokens for a specific variant
 * 
 * @param variant The theme variant to use
 * @param tokenNames Array of token names to include
 * @returns React inline style object with camelCase properties
 */
export const createTokenStyles = (
  variant: VariantKey,
  tokenNames: string[]
): React.CSSProperties => {
  const tokenVariables = getThemeVariables(variant);
  const styles: Record<string, string> = {};

  tokenNames.forEach(name => {
    if (tokenVariables[name]) {
      // Convert CSS var name to camelCase property name
      // e.g. --training-bg → backgroundColor
      const propName = cssVarToStyleProp(name);
      styles[propName] = tokenVariables[name];
    }
  });

  return styles;
};

/**
 * Helper to convert CSS variable names to camelCase style properties
 * 
 * @param cssVar CSS variable name (e.g. --training-bg)
 * @returns Camel case style property name (e.g. backgroundColor)
 */
const cssVarToStyleProp = (cssVar: string): string => {
  // Remove leading --
  const withoutPrefix = cssVar.replace(/^--/, '');

  // Map common CSS var patterns to style properties
  const mapping: Record<string, string> = {
    'training-bg': 'backgroundColor',
    'training-text': 'color',
    'training-card-bg': 'backgroundColor',
    'training-card-border': 'borderColor',
    'training-gradient-strength': 'backgroundImage',
    'training-gradient-fatLoss': 'backgroundImage',
    'training-gradient-fitness': 'backgroundImage',
    'training-gradient-athletic': 'backgroundImage',
    'training-text-strength': 'color',
    'training-text-fatLoss': 'color',
    'training-text-fitness': 'color',
    'training-text-athletic': 'color',
  };

  return mapping[withoutPrefix] || withoutPrefix;
}; 