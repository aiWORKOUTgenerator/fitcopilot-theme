/**
 * Theme Type Definitions
 * 
 * This file contains all the core type definitions for the theming system used throughout
 * the FitCopilot application. These types ensure type safety when working with themes,
 * variants, and component styling.
 */

/**
 * Available theme variant keys for the application
 */
export type ThemeVariant =
    | 'default'
    | 'modern'
    | 'wellness'
    | 'sports'
    | 'gym'
    | 'boutique'
    | 'classic'
    | 'minimalist'
    | 'registration';

/**
 * Theme color palette interface
 */
export interface ThemeColors {
    /** Primary brand color */
    primary: string;
    /** Secondary color for accents */
    secondary: string;
    /** Accent color for highlights */
    accent: string;
    /** Main background color */
    background: string;
    /** Alternative background color */
    backgroundAlt: string;
    /** Primary text color */
    text: string;
    /** Secondary text color */
    textAlt: string;
    /** Success state color */
    success: string;
    /** Warning state color */
    warning: string;
    /** Error state color */
    error: string;
    /** Info state color */
    info: string;
    /** Divider/border color */
    divider: string;
}

/**
 * Theme typography configuration
 */
export interface ThemeTypography {
    /** Main body font family */
    bodyFont: string;
    /** Heading font family */
    headingFont: string;
    /** Base font size in px */
    baseFontSize: number;
    /** Font scale ratio */
    scaleRatio: number;
}

/**
 * Theme spacing configuration
 */
export interface ThemeSpacing {
    /** Extra small spacing unit */
    xs: string;
    /** Small spacing unit */
    sm: string;
    /** Medium spacing unit */
    md: string;
    /** Large spacing unit */
    lg: string;
    /** Extra large spacing unit */
    xl: string;
    /** XXL spacing unit */
    xxl: string;
}

/**
 * Theme border radius configuration
 */
export interface ThemeBorderRadius {
    /** Small border radius */
    sm: string;
    /** Medium border radius */
    md: string;
    /** Large border radius */
    lg: string;
    /** Pill-shaped border radius */
    pill: string;
    /** Circle border radius */
    circle: string;
}

/**
 * Theme shadow configuration
 */
export interface ThemeShadows {
    /** Small shadow */
    sm: string;
    /** Medium shadow */
    md: string;
    /** Large shadow */
    lg: string;
    /** Focus state shadow */
    focus: string;
}

/**
 * Animation settings
 */
export interface ThemeAnimations {
    /** Default transition duration */
    duration: string;
    /** Default transition timing function */
    easing: string;
    /** Default entrance animation */
    entrance: string;
    /** Default exit animation */
    exit: string;
}

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
    /** Unique theme variant key */
    variant: ThemeVariant;
    /** Human-readable theme name */
    name: string;
    /** Theme description */
    description?: string;
    /** Color palette */
    colors: ThemeColors;
    /** Typography settings */
    typography: ThemeTypography;
    /** Spacing scale */
    spacing: ThemeSpacing;
    /** Border radius settings */
    borderRadius: ThemeBorderRadius;
    /** Shadow settings */
    shadows: ThemeShadows;
    /** Animation settings */
    animations: ThemeAnimations;
    /** Theme-specific overrides */
    componentOverrides?: Record<string, unknown>;
}

/**
 * Theme context state and methods
 */
export interface ThemeContextState {
    /** Current active theme variant */
    currentTheme: ThemeVariant;
    /** Method to change the current theme */
    setTheme: (theme: ThemeVariant) => void;
    /** Available theme configurations */
    themes: Record<ThemeVariant, ThemeConfig>;
    /** Whether dark mode is active */
    isDarkMode: boolean;
    /** Method to toggle dark mode */
    toggleDarkMode: () => void;
}

/**
 * Component-specific theme variant mapping
 */
export interface ComponentVariants<T extends Record<string, unknown>> {
    /** Default variant fallback */
    default: T;
    /** Variant-specific implementations */
    [key: string]: T;
}

/**
 * CSS custom properties for theme variables
 */
export interface ThemeCSSProperties extends React.CSSProperties {
    /** Primary color custom property */
    '--color-primary'?: string;
    /** Secondary color custom property */
    '--color-secondary'?: string;
    /** Accent color custom property */
    '--color-accent'?: string;
    /** Background color custom property */
    '--color-background'?: string;
    /** Text color custom property */
    '--color-text'?: string;
    /** Custom properties for component-specific values */
    [key: `--${string}`]: string | number | undefined;
}

/**
 * Theme variant preferences from user settings
 */
export interface ThemePreferences {
    /** Preferred theme variant */
    preferredTheme: ThemeVariant;
    /** Dark mode preference */
    prefersDarkMode: boolean;
    /** Reduced motion preference */
    prefersReducedMotion: boolean;
    /** High contrast preference */
    prefersHighContrast: boolean;
}

/**
 * Mapping between theme variants and class names
 */
export type ThemeClassMapping = Record<ThemeVariant, string>;

/**
 * Function to get theme-specific styles
 */
export type ThemeStyleFn = (theme: ThemeConfig) => ThemeCSSProperties; 