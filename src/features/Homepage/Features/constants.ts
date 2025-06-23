import {
  Apple,
  Bike,
  Coffee,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  Medal,
  Timer
} from 'lucide-react';
import { ThemeOption } from '../../../utils/theming';
import {
  FloatingIconData,
  ProgressDataPoint,
  ThemeMapping,
  VariantKey,
  WorkoutExercise
} from './types';

// ============================================================================
// THEME MAPPING
// ============================================================================

/**
 * Maps VariantKey to ThemeOption for ThemeProvider
 * Provides fallback mappings for variants that don't have direct theme equivalents
 */
export const mapVariantToTheme = (variant: VariantKey): ThemeOption => {
  // Direct mappings
  if (variant === 'default' || variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant;
  }
  
  // Custom mappings
  switch (variant) {
  case 'boutique': return 'wellness';
  case 'modern': return 'sports';
  case 'classic': return 'default';
  case 'minimalist': return 'default';
  case 'registration': return 'default';
  default: return 'default';
  }
};

/**
 * Complete theme mapping configuration
 */
export const THEME_MAPPINGS: ThemeMapping[] = [
  { variant: 'default', theme: 'default' },
  { variant: 'gym', theme: 'gym' },
  { variant: 'boutique', theme: 'wellness' },
  { variant: 'modern', theme: 'sports' },
  { variant: 'wellness', theme: 'wellness' },
  { variant: 'classic', theme: 'default' },
  { variant: 'sports', theme: 'sports' },
  { variant: 'minimalist', theme: 'default' },
  { variant: 'registration', theme: 'default' },
];

// ============================================================================
// FLOATING ICONS CONFIGURATION
// ============================================================================

/**
 * Default floating icons configuration
 * Provides a variety of fitness-related icons with different animations
 */
export const DEFAULT_FLOATING_ICONS: FloatingIconData[] = [
  { 
    id: 'dumbbell-1',
    Icon: Dumbbell, 
    size: 24, 
    left: 5, 
    top: 15, 
    delay: 0, 
    speed: 8,
    visible: true
  },
  { 
    id: 'timer-1',
    Icon: Timer, 
    size: 32, 
    left: 15, 
    top: 60, 
    delay: 1.5, 
    speed: 10,
    visible: true
  },
  { 
    id: 'medal-1',
    Icon: Medal, 
    size: 28, 
    left: 25, 
    top: 25, 
    delay: 0.8, 
    speed: 12,
    visible: true
  },
  { 
    id: 'flame-1',
    Icon: Flame, 
    size: 36, 
    left: 80, 
    top: 20, 
    delay: 2, 
    speed: 9,
    visible: true
  },
  { 
    id: 'heart-1',
    Icon: Heart, 
    size: 28, 
    left: 85, 
    top: 65, 
    delay: 1, 
    speed: 11,
    visible: true
  },
  { 
    id: 'apple-1',
    Icon: Apple, 
    size: 24, 
    left: 10, 
    top: 80, 
    delay: 2.5, 
    speed: 10,
    visible: true
  },
  { 
    id: 'coffee-1',
    Icon: Coffee, 
    size: 20, 
    left: 70, 
    top: 10, 
    delay: 0.5, 
    speed: 7,
    visible: true
  },
  { 
    id: 'footprints-1',
    Icon: Footprints, 
    size: 32, 
    left: 90, 
    top: 40, 
    delay: 1.2, 
    speed: 9,
    visible: true
  },
  { 
    id: 'bike-1',
    Icon: Bike, 
    size: 36, 
    left: 30, 
    top: 70, 
    delay: 1.8, 
    speed: 13,
    visible: true
  }
];

/**
 * Minimal floating icons for reduced motion or minimalist themes
 */
export const MINIMAL_FLOATING_ICONS: FloatingIconData[] = [
  { 
    id: 'dumbbell-minimal',
    Icon: Dumbbell, 
    size: 20, 
    left: 10, 
    top: 20, 
    delay: 0, 
    speed: 15,
    visible: true
  },
  { 
    id: 'heart-minimal',
    Icon: Heart, 
    size: 18, 
    left: 85, 
    top: 70, 
    delay: 2, 
    speed: 12,
    visible: true
  },
  { 
    id: 'medal-minimal',
    Icon: Medal, 
    size: 22, 
    left: 75, 
    top: 25, 
    delay: 1, 
    speed: 14,
    visible: true
  }
];

// ============================================================================
// DEFAULT FEATURE DATA
// ============================================================================

/**
 * Default workout exercises for the sample workout demo
 */
export const DEFAULT_WORKOUT_EXERCISES: WorkoutExercise[] = [
  {
    name: 'Goblet Squats',
    sets: '3 × 12 reps',
    completed: true,
    category: 'legs'
  },
  {
    name: 'Push-ups',
    sets: '3 × 15 reps',
    completed: true,
    category: 'chest'
  },
  {
    name: 'Walking Lunges',
    sets: '3 × 10 reps each',
    completed: false,
    category: 'legs'
  },
  {
    name: 'Kettlebell Swings',
    sets: '3 × 15 reps',
    completed: false,
    category: 'full-body'
  },
  {
    name: 'Plank',
    sets: '3 × 45 seconds',
    completed: false,
    category: 'core'
  }
];

/**
 * Default progress chart data points
 */
export const DEFAULT_PROGRESS_DATA: ProgressDataPoint[] = [
  { x: 0, y: 80, label: 'Mon', value: 65 },
  { x: 40, y: 70, label: 'Tue', value: 72 },
  { x: 80, y: 30, label: 'Wed', value: 85 },
  { x: 120, y: 50, label: 'Thu', value: 78 },
  { x: 160, y: 60, label: 'Fri', value: 74 },
  { x: 200, y: 20, label: 'Sat', value: 92 }
];

// ============================================================================
// SECTION CONTENT
// ============================================================================

/**
 * Default section header content
 */
export const DEFAULT_SECTION_HEADER = {
  label: 'Fitness Evolution',
  title: 'Innovative Features',
  highlightedText: 'Tailored for You',
  alignment: 'center' as const,
  headingLevel: 2 as const,
  headingId: 'features-heading'
};

/**
 * Section header variant configurations
 */
export const SECTION_HEADER_VARIANTS = {
  default: {
    labelColor: 'text-lime-300',
    highlightGradient: 'from-lime-300 to-emerald-400'
  },
  gym: {
    labelColor: 'text-amber-500',
    highlightGradient: 'from-amber-500 to-red-500'
  },
  wellness: {
    labelColor: 'text-violet-500',
    highlightGradient: 'from-violet-500 to-pink-500'
  },
  sports: {
    labelColor: 'text-blue-500',
    highlightGradient: 'from-blue-500 to-cyan-500'
  },
  minimalist: {
    labelColor: 'text-gray-500',
    highlightGradient: 'from-gray-700 to-gray-500'
  }
} as const;

/**
 * Default video configuration
 */
export const DEFAULT_VIDEO_CONFIG = {
  src: '/wp-content/themes/fitcopilot/src/features/Homepage/Features/media/videos/Mission-Bay-Footage.mp4',
  poster: '/wp-content/themes/fitcopilot/src/features/Homepage/Features/media/images/video-poster.jpg',
  autoplay: false,
  loop: true,
  muted: true
};

/**
 * Default CTA configuration
 */
export const DEFAULT_CTA_CONFIG = {
  primaryText: 'Start Your Fitness Journey',
  secondaryText: 'Get Started',
  href: '#splash-section'
};

// ============================================================================
// ANIMATION CONSTANTS
// ============================================================================

/**
 * Animation timing constants
 */
export const ANIMATION_TIMINGS = {
  /** Default animation duration in milliseconds */
  DEFAULT_DURATION: 800,
  /** Stagger delay between elements in milliseconds */
  STAGGER_DELAY: 100,
  /** Hover transition duration in milliseconds */
  HOVER_DURATION: 300,
  /** Video autoplay delay in milliseconds */
  VIDEO_AUTOPLAY_DELAY: 200,
  /** Floating icon base speed in seconds */
  FLOATING_ICON_BASE_SPEED: 8,
  /** Progress chart animation duration in seconds */
  PROGRESS_CHART_DURATION: 2.5
} as const;

/**
 * Animation easing presets
 */
export const ANIMATION_EASINGS = {
  DEFAULT: 'ease-in-out',
  SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  ELASTIC: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
} as const;

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

/**
 * Responsive grid configurations
 */
export const GRID_CONFIGURATIONS = {
  mobile: {
    columns: 1,
    gap: 'medium'
  },
  tablet: {
    columns: 2,
    gap: 'medium'
  },
  desktop: {
    columns: 3,
    gap: 'large'
  }
} as const;

// ============================================================================
// ACCESSIBILITY CONSTANTS
// ============================================================================

/**
 * ARIA labels and accessibility text
 */
export const ACCESSIBILITY_LABELS = {
  SECTION: 'Features section',
  SECTION_HEADING: 'features-heading',
  FLOATING_ICONS: 'Decorative floating fitness icons',
  FEATURE_GRID: 'Feature cards grid',
  VIDEO_PLAYER: 'Background video player',
  CTA_BUTTON: 'Call to action button',
  PROGRESS_CHART: 'Weekly progress chart',
  WORKOUT_LIST: 'Sample workout exercises'
} as const;

/**
 * Reduced motion preferences
 */
export const REDUCED_MOTION_CONFIG = {
  /** Whether to respect prefers-reduced-motion */
  RESPECT_PREFERENCE: true,
  /** Fallback animation duration for reduced motion */
  REDUCED_DURATION: 200,
  /** Whether to disable floating icons for reduced motion */
  DISABLE_FLOATING_ICONS: true,
  /** Whether to disable auto-playing videos for reduced motion */
  DISABLE_AUTOPLAY: true
} as const; 