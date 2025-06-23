/**
 * Theme Utility Functions
 * 
 * Provides helper functions for applying theme tokens to components
 */

import { ThemeOption } from '../../../../utils/theming';
import { VariantKey } from '../types';
import { ThemeTokens, getThemeTokens, getToken } from './themeTokens';

/**
 * Configuration for a component that uses theming
 */
export interface ThemeableComponent {
    /**
     * Base CSS class name for the component
     */
    baseClass: string;

    /**
     * Token mappings for different component states/elements
     */
    tokenMappings: {
        [selector: string]: {
            category: keyof ThemeTokens;
            subcategory: string;
        };
    };
}

/**
 * Training component variant types
 */
export type TrainingVariant = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist' | 'athletic';

/**
 * Maps Training component variants to theme options
 * 
 * @param variant - The Training component variant
 * @returns The appropriate ThemeOption
 */
export const mapVariantToTheme = (variant: TrainingVariant | undefined): ThemeOption => {
  // Direct mappings for variants that match themes
  if (variant === 'default' || variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant;
  }
  
  // Map other variants to appropriate themes
  switch (variant) {
  case 'modern': return 'sports';
  case 'classic': return 'default';
  case 'minimalist': return 'default';
  case 'athletic': return 'sports';
  default: return 'default';
  }
};

/**
 * Generate CSS class string with applied theme tokens
 * 
 * @param component Component configuration
 * @param variant Theme variant to apply
 * @param additionalClasses Additional classes to append
 * @returns Complete class string with theme tokens applied
 */
export function applyTheme(
  component: ThemeableComponent,
  variant: VariantKey = 'default',
  additionalClasses: string = ''
): string {
  const tokens = getThemeTokens(variant);
  let classList = component.baseClass;

  // Apply variant class
  classList += ` ${component.baseClass}--${variant}`;

  // Special case for SectionHeader title
  if (component.baseClass === 'section-header') {
    // This doesn't modify classes, but documents the override we're doing in CSS
    // The title color is forced via direct CSS rules in Training.scss
  }

  // Apply token-based classes
  Object.entries(component.tokenMappings).forEach(([selector, { category, subcategory }]) => {
    const tokenValue = tokens[category]?.[subcategory];
    if (tokenValue) {
      if (selector === 'base') {
        classList += ` ${tokenValue}`;
      } else {
        // This will be applied via CSS selectors in the component's styles
        // We're just including the token mapping for documentation
      }
    }
  });

  // Add any additional classes
  if (additionalClasses) {
    classList += ` ${additionalClasses}`;
  }

  return classList.trim();
}

/**
 * Get a specific token for a component element
 * 
 * @param variant Theme variant
 * @param component Component configuration
 * @param selector Element selector (e.g., 'title', 'description')
 * @returns Token value or empty string if not found
 */
export function getComponentToken(
  variant: VariantKey,
  component: ThemeableComponent,
  selector: string
): string {
  const mapping = component.tokenMappings[selector];
  if (!mapping) return '';

  return getToken(variant, mapping.category, mapping.subcategory);
}

/**
 * Generate program-specific token class based on program type
 * 
 * @param programType Type of program (strength, fatLoss, etc.)
 * @param tokenType Type of token to generate (gradient, text, etc.)
 * @returns CSS class for the program-specific token
 */
export function getProgramToken(
  programType: string,
  tokenType: 'gradient' | 'text' | 'border' | 'background' = 'gradient'
): string {
  return `program-${tokenType}-${programType}`;
}

/**
 * Apply accessibility attributes to a component
 * 
 * @param props Base props for the component
 * @param ariaRoles ARIA role mappings
 * @returns Props with ARIA attributes added
 */
export function withAccessibility<T>(
  props: T,
  ariaRoles: Partial<Record<string, string>>
): T & Record<string, string> {
  const enhancedProps = { ...props } as T & Record<string, string>;

  Object.entries(ariaRoles).forEach(([key, value]) => {
    enhancedProps[key] = value;
  });

  return enhancedProps;
}

/**
 * Determine if an element should have reduced motion based on user preference
 * 
 * @param prefersReducedMotion User preference for reduced motion
 * @param elementHasMotion Whether the element typically has motion
 * @returns Boolean indicating if the element should use reduced motion
 */
export function shouldUseReducedMotion(
  prefersReducedMotion: boolean,
  elementHasMotion: boolean = true
): boolean {
  return prefersReducedMotion && elementHasMotion;
}

/**
 * Generates CSS variables for a specific theme variant
 * 
 * @param variant Theme variant
 * @returns CSS variable declaration object
 */
export function generateThemeVariables(variant: VariantKey): Record<string, string> {
  const tokens = getThemeTokens(variant);
  const variables: Record<string, string> = {};

  // Process tokens into CSS variables
  function processTokenCategory(category: keyof ThemeTokens, prefix: string) {
    Object.entries(tokens[category] || {}).forEach(([key, value]) => {
      // Extract actual color value from TailwindCSS class
      const colorValue = extractColorFromTailwind(value);
      if (colorValue) {
        variables[`--${prefix}-${key}`] = colorValue;
      }
    });
  }

  // Process each category with appropriate prefix
  processTokenCategory('background', 'bg');
  processTokenCategory('text', 'text');
  processTokenCategory('border', 'border');
  processTokenCategory('highlight', 'highlight');
  processTokenCategory('shadow', 'shadow');

  return variables;
}

/**
 * Extract color value from TailwindCSS class name
 * This is a simplified version and would need to be expanded based on your actual color system
 * 
 * @param className TailwindCSS class name
 * @returns CSS color value or null if not a color class
 */
function extractColorFromTailwind(className: string): string | null {
  // This is a simplified example - you would need to expand this
  // to match your actual Tailwind configuration

  // Match pattern like bg-gray-500, text-blue-700, etc.
  const match = className.match(/(?:bg|text|border|from|to)-([a-z]+-[0-9]+)/);

  if (match) {
    const [, colorCode] = match;
    // In a real implementation, you would convert this to an actual CSS color value
    // This is just a placeholder that would need to be replaced with your color system logic
    return `var(--color-${colorCode})`;
  }

  return null;
} 