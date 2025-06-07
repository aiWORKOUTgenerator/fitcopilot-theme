/**
 * Animation Constants for Pricing Component
 * Centralized animation timing and configuration constants
 */

export const ANIMATION_TIMINGS = {
  PRO_EXPLODE: 2000,
  PRO_TRANSITION: 3000,
  PRO_BETA: 3500,
  PRO_RESET: 8500,
  BASIC_EXPLODE: 3000,
  BASIC_TRANSITION: 4000,
  BASIC_BETA: 4500,
  BASIC_RESET: 9500,
  HOVER_RESUME_DELAY: 300,
  ANIMATION_RESTART_DELAY: 200,
} as const;

export const PARTICLE_CONFIG = {
  COUNT: 10,
  MAX_DISTANCE: 80,
  MIN_SIZE: 2,
  MAX_SIZE: 6,
} as const;

export type AnimationState = 'normal' | 'exploding' | 'transitioning' | 'betaPrice'; 