import React from 'react';
import { VariantKey } from '../../types';

/**
 * Props for the SectionHeader component
 */
export interface SectionHeaderProps {
  /** Main heading text */
  title: string;
  /** Highlighted portion of the title (optional) */
  highlightedText?: string;
  /** Small label text above the title */
  label?: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Optional CSS class name */
  className?: string;
  /** Custom container styles */
  style?: React.CSSProperties;
  /** Heading level for accessibility (h1, h2, h3, etc.) */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** ID for the heading element (for aria-labelledby) */
  headingId?: string;
  /** Whether to center align the text */
  centered?: boolean;
  /** Custom gradient classes for highlighted text */
  highlightGradient?: string;
  /** Whether to animate the text on scroll */
  animated?: boolean;
  /** Custom spacing below the header */
  bottomSpacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

/**
 * Configuration for section header content
 */
export interface SectionHeaderConfig {
  /** Label text configuration */
  label?: {
    text: string;
    className?: string;
    style?: React.CSSProperties;
  };
  /** Title configuration */
  title: {
    text: string;
    className?: string;
    style?: React.CSSProperties;
  };
  /** Highlighted text configuration */
  highlight?: {
    text: string;
    className?: string;
    gradient?: string;
    style?: React.CSSProperties;
  };
  /** Subtitle configuration */
  subtitle?: {
    text: string;
    className?: string;
    style?: React.CSSProperties;
  };
}

/**
 * Animation configuration for section header
 */
export interface SectionHeaderAnimation {
  /** Whether animations are enabled */
  enabled: boolean;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation easing function */
  easing?: string;
  /** Stagger delay between elements */
  stagger?: number;
}

/**
 * Accessibility configuration for section header
 */
export interface SectionHeaderA11y {
  /** ARIA label for the section */
  ariaLabel?: string;
  /** ARIA described by reference */
  ariaDescribedBy?: string;
  /** Whether to announce changes to screen readers */
  announceChanges?: boolean;
  /** Custom screen reader text */
  screenReaderText?: string;
} 