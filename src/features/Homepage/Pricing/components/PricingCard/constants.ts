/**
 * PricingCard Constants
 * Animation timings and particle configuration extracted from Pricing.tsx
 */

import { AnimationTimings, ParticleConfig } from './types';

/**
 * Animation timing constants for pricing card animations
 * Extracted from ANIMATION_TIMINGS in Pricing.tsx
 */
export const ANIMATION_TIMINGS: AnimationTimings = {
  PRO_EXPLODE: 2000,
  PRO_TRANSITION: 3000,
  PRO_BETA: 3500,
  PRO_RESET: 8500,
} as const;

/**
 * Animation timing constants for Basic plan (different timing)
 */
export const BASIC_ANIMATION_TIMINGS: AnimationTimings = {
  PRO_EXPLODE: 3000,  // BASIC_EXPLODE
  PRO_TRANSITION: 4000,  // BASIC_TRANSITION  
  PRO_BETA: 4500,  // BASIC_BETA
  PRO_RESET: 9500,  // BASIC_RESET
} as const;

/**
 * Additional timing constants
 */
export const INTERACTION_TIMINGS = {
  HOVER_RESUME_DELAY: 300,
  ANIMATION_RESTART_DELAY: 200,
} as const;

/**
 * Particle configuration for explosion effects
 * Extracted from PARTICLE_CONFIG in Pricing.tsx
 */
export const PARTICLE_CONFIG: ParticleConfig = {
  COUNT: 10,
  MAX_DISTANCE: 80,
  MIN_SIZE: 2,
  MAX_SIZE: 6,
} as const;

/**
 * Background particles configuration
 */
export const BACKGROUND_PARTICLE_CONFIG = {
  COUNT: 12,
  MIN_SIZE: 2,
  MAX_SIZE: 6,
  ANIMATION_DELAY_MAX: 4,
  ANIMATION_DURATION_BASE: 10,
  ANIMATION_DURATION_RANGE: 8,
} as const; 