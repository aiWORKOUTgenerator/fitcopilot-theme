/**
 * Theme Token System for Training Component
 * 
 * This file provides a centralized token system for all theme variants
 * to ensure consistent styling across components and variants.
 */

import { VariantKey } from '../types';

/**
 * Token categories for components
 */
export type TokenCategory =
    | 'background'
    | 'text'
    | 'border'
    | 'card'
    | 'highlight'
    | 'accent'
    | 'shadow';

/**
 * Token subcategories for more granular control
 */
export type TokenSubcategory =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'hover'
    | 'active'
    | 'disabled';

/**
 * The token structure for a theme
 */
export interface ThemeTokens {
    background: {
        primary: string;
        secondary: string;
        card: string;
        accent: string;
    };
    text: {
        primary: string;
        secondary: string;
        accent: string;
        active: string;
        hover: string;
    };
    border: {
        primary: string;
        secondary: string;
        active: string;
        radius: string;
    };
    card: {
        background: string;
        hover: string;
        active: string;
        shadow: string;
        border: string;
    };
    highlight: {
        primary: string;
        secondary: string;
        gradient: string;
    };
    shadow: {
        small: string;
        medium: string;
        large: string;
    };
    transitions: {
        duration: string;
        timing: string;
    };
}

/**
 * Default theme tokens (used as fallback)
 */
const defaultTokens: ThemeTokens = {
    background: {
        primary: 'bg-gray-50',
        secondary: 'bg-white',
        card: 'bg-white',
        accent: 'bg-blue-500',
    },
    text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        accent: 'text-blue-600',
        active: 'text-blue-700',
        hover: 'text-blue-500',
    },
    border: {
        primary: 'border-gray-200',
        secondary: 'border-gray-100',
        active: 'border-blue-600',
        radius: 'rounded-lg',
    },
    card: {
        background: 'bg-white',
        hover: 'hover:bg-gray-50',
        active: 'bg-blue-50',
        shadow: 'shadow-md',
        border: 'border border-gray-200',
    },
    highlight: {
        primary: 'text-blue-600',
        secondary: 'text-blue-700',
        gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    },
    shadow: {
        small: 'shadow-sm',
        medium: 'shadow-md',
        large: 'shadow-lg',
    },
    transitions: {
        duration: 'duration-300',
        timing: 'ease-in-out',
    },
};

/**
 * Sports theme tokens
 */
const sportsTokens: ThemeTokens = {
    background: {
        primary: 'bg-gray-900',
        secondary: 'bg-gray-800',
        card: 'bg-gray-700',
        accent: 'bg-violet-600',
    },
    text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        accent: 'text-violet-400',
        active: 'text-violet-300',
        hover: 'text-violet-200',
    },
    border: {
        primary: 'border-gray-600',
        secondary: 'border-gray-700',
        active: 'border-violet-500',
        radius: 'rounded',
    },
    card: {
        background: 'bg-gray-800',
        hover: 'hover:bg-gray-700',
        active: 'bg-gray-700',
        shadow: 'shadow-xl shadow-violet-900/20',
        border: 'border-0',
    },
    highlight: {
        primary: 'text-violet-400',
        secondary: 'text-violet-300',
        gradient: 'bg-gradient-to-r from-violet-500 to-purple-700',
    },
    shadow: {
        small: 'shadow-sm shadow-violet-900/20',
        medium: 'shadow-md shadow-violet-900/20',
        large: 'shadow-xl shadow-violet-900/30',
    },
    transitions: {
        duration: 'duration-300',
        timing: 'ease-out',
    },
};

/**
 * Wellness theme tokens
 */
const wellnessTokens: ThemeTokens = {
    background: {
        primary: 'bg-teal-50',
        secondary: 'bg-white',
        card: 'bg-white',
        accent: 'bg-teal-500',
    },
    text: {
        primary: 'text-gray-800',
        secondary: 'text-gray-600',
        accent: 'text-teal-600',
        active: 'text-teal-700',
        hover: 'text-teal-500',
    },
    border: {
        primary: 'border-teal-100',
        secondary: 'border-gray-100',
        active: 'border-teal-500',
        radius: 'rounded-2xl',
    },
    card: {
        background: 'bg-white',
        hover: 'hover:bg-teal-50',
        active: 'bg-teal-50',
        shadow: 'shadow-lg shadow-teal-100/50',
        border: 'border border-teal-100',
    },
    highlight: {
        primary: 'text-teal-600',
        secondary: 'text-teal-700',
        gradient: 'bg-gradient-to-r from-teal-400 to-green-500',
    },
    shadow: {
        small: 'shadow-sm shadow-teal-100/50',
        medium: 'shadow-md shadow-teal-100/50',
        large: 'shadow-xl shadow-teal-200/60',
    },
    transitions: {
        duration: 'duration-500',
        timing: 'ease-in-out',
    },
};

/**
 * Boutique theme tokens
 */
const boutiqueTokens: ThemeTokens = {
    background: {
        primary: 'bg-rose-50',
        secondary: 'bg-white',
        card: 'bg-white',
        accent: 'bg-rose-500',
    },
    text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        accent: 'text-rose-600',
        active: 'text-rose-700',
        hover: 'text-rose-500',
    },
    border: {
        primary: 'border-rose-100',
        secondary: 'border-gray-100',
        active: 'border-rose-500',
        radius: 'rounded-full',
    },
    card: {
        background: 'bg-white',
        hover: 'hover:bg-rose-50',
        active: 'bg-rose-50',
        shadow: 'shadow-md shadow-rose-100/50',
        border: 'border border-rose-200',
    },
    highlight: {
        primary: 'text-rose-600',
        secondary: 'text-rose-700',
        gradient: 'bg-gradient-to-r from-rose-400 to-pink-600',
    },
    shadow: {
        small: 'shadow-sm shadow-rose-100/30',
        medium: 'shadow-md shadow-rose-100/40',
        large: 'shadow-lg shadow-rose-200/50',
    },
    transitions: {
        duration: 'duration-300',
        timing: 'ease-in-out',
    },
};

/**
 * Classic theme tokens
 */
const classicTokens: ThemeTokens = {
    background: {
        primary: 'bg-amber-50',
        secondary: 'bg-white',
        card: 'bg-white',
        accent: 'bg-amber-600',
    },
    text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        accent: 'text-amber-700',
        active: 'text-amber-800',
        hover: 'text-amber-600',
    },
    border: {
        primary: 'border-amber-200',
        secondary: 'border-gray-200',
        active: 'border-amber-600',
        radius: 'rounded-md',
    },
    card: {
        background: 'bg-white',
        hover: 'hover:bg-amber-50',
        active: 'bg-amber-50',
        shadow: 'shadow-md shadow-amber-100/20',
        border: 'border border-amber-200',
    },
    highlight: {
        primary: 'text-amber-700',
        secondary: 'text-amber-800',
        gradient: 'bg-gradient-to-r from-amber-500 to-yellow-600',
    },
    shadow: {
        small: 'shadow-sm shadow-amber-100/20',
        medium: 'shadow-md shadow-amber-100/30',
        large: 'shadow-lg shadow-amber-200/30',
    },
    transitions: {
        duration: 'duration-200',
        timing: 'ease',
    },
};

/**
 * Minimalist theme tokens
 */
const minimalistTokens: ThemeTokens = {
    background: {
        primary: 'bg-white',
        secondary: 'bg-gray-50',
        card: 'bg-white',
        accent: 'bg-gray-900',
    },
    text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        accent: 'text-gray-800',
        active: 'text-black',
        hover: 'text-gray-700',
    },
    border: {
        primary: 'border-gray-200',
        secondary: 'border-gray-100',
        active: 'border-gray-900',
        radius: 'rounded-none',
    },
    card: {
        background: 'bg-white',
        hover: 'hover:bg-gray-50',
        active: 'bg-gray-50',
        shadow: 'shadow-none',
        border: 'border-b border-gray-200',
    },
    highlight: {
        primary: 'text-gray-900',
        secondary: 'text-black',
        gradient: 'bg-gradient-to-r from-gray-700 to-gray-900',
    },
    shadow: {
        small: 'shadow-none',
        medium: 'shadow-sm',
        large: 'shadow-md',
    },
    transitions: {
        duration: 'duration-200',
        timing: 'ease',
    },
};

/**
 * Modern theme tokens
 */
const modernTokens: ThemeTokens = {
    background: {
        primary: 'bg-indigo-50',
        secondary: 'bg-white',
        card: 'bg-white',
        accent: 'bg-indigo-600',
    },
    text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        accent: 'text-indigo-600',
        active: 'text-indigo-700',
        hover: 'text-indigo-500',
    },
    border: {
        primary: 'border-indigo-100',
        secondary: 'border-gray-100',
        active: 'border-indigo-500',
        radius: 'rounded-xl',
    },
    card: {
        background: 'bg-white',
        hover: 'hover:bg-indigo-50',
        active: 'bg-indigo-50',
        shadow: 'shadow-xl shadow-indigo-200/40',
        border: 'border border-indigo-100',
    },
    highlight: {
        primary: 'text-indigo-600',
        secondary: 'text-indigo-700',
        gradient: 'bg-gradient-to-r from-indigo-500 to-blue-600',
    },
    shadow: {
        small: 'shadow-md shadow-indigo-100/30',
        medium: 'shadow-lg shadow-indigo-200/30',
        large: 'shadow-xl shadow-indigo-300/30',
    },
    transitions: {
        duration: 'duration-300',
        timing: 'ease-in-out',
    },
};

/**
 * Map of theme variants to their token sets
 */
export const themeTokensMap: Record<VariantKey, ThemeTokens> = {
    default: defaultTokens,
    sports: sportsTokens,
    wellness: wellnessTokens,
    boutique: boutiqueTokens,
    classic: classicTokens,
    minimalist: minimalistTokens,
    modern: modernTokens,
};

/**
 * Get tokens for a specific theme variant
 * 
 * @param variant The theme variant
 * @returns Theme tokens object
 */
export const getThemeTokens = (variant: VariantKey = 'default'): ThemeTokens => {
    return themeTokensMap[variant] || defaultTokens;
};

/**
 * Get theme variables as CSS custom properties
 * Maps to the getThemeTokens function for consistent API
 */
export const getThemeVariables = getThemeTokens;

/**
 * Get a specific token from a theme variant
 * 
 * @param variant The theme variant
 * @param category Token category
 * @param subcategory Token subcategory
 * @returns The CSS class string for the token
 */
export const getToken = (
    variant: VariantKey = 'default',
    category: keyof ThemeTokens,
    subcategory: string
): string => {
    const tokens = themeTokensMap[variant] || defaultTokens;
    return tokens[category]?.[subcategory] || '';
};

/**
 * Generate class names with token-based styling
 * 
 * @param variant Theme variant
 * @param baseClass Base class name
 * @param tokenSelectors Object mapping class modifiers to token selectors
 * @returns Complete className string with all tokens applied
 */
export const withTokens = (
    variant: VariantKey = 'default',
    baseClass: string,
    tokenSelectors: Record<string, { category: keyof ThemeTokens; subcategory: string }>
): string => {
    const tokens = themeTokensMap[variant] || defaultTokens;
    let className = baseClass;

    Object.entries(tokenSelectors).forEach(([modifier, { category, subcategory }]) => {
        const tokenValue = tokens[category]?.[subcategory];
        if (tokenValue) {
            className += ` ${modifier !== 'base' ? `${baseClass}--${modifier} ` : ''}${tokenValue}`;
        }
    });

    return className;
}; 