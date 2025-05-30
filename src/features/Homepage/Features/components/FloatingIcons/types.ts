import React from 'react';
import { FloatingIconData, VariantKey } from '../../types';

/**
 * Props for individual floating icon component
 */
export interface FloatingIconProps {
  /** React node to render as the icon */
  children: React.ReactNode;
  /** Animation delay in seconds */
  delay: number;
  /** Animation speed/duration in seconds */
  speed: number;
  /** Horizontal position as percentage */
  left: number;
  /** Vertical position as percentage */
  top: number;
  /** Optional CSS class name */
  className?: string;
  /** Whether the icon should be visible */
  visible?: boolean;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * Props for the FloatingIcons container component
 */
export interface FloatingIconsProps {
  /** Array of floating icon configurations */
  icons?: FloatingIconData[];
  /** Whether floating icons should be enabled */
  enabled?: boolean;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Optional CSS class name */
  className?: string;
  /** Whether to respect reduced motion preferences */
  respectReducedMotion?: boolean;
  /** Custom container styles */
  style?: React.CSSProperties;
  /** Whether to show debug information */
  debug?: boolean;
} 