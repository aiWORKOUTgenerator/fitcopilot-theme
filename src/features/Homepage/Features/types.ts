import { LucideIcon } from 'lucide-react';
import { ThemeOption } from '../../../utils/theming';
import { GlobalVariantKey } from '../types/shared';

/**
 * Available theme variants for the Features component
 * Maps to different visual styles and color schemes
 * @deprecated Use GlobalVariantKey from '../types/shared' instead
 */
export type VariantKey = GlobalVariantKey;

/**
 * Background color options for Section component
 */
export type BackgroundColorType = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'surface' 
  | 'none';

/**
 * Animation timing and easing options
 */
export type AnimationEasing = 
  | 'ease' 
  | 'ease-in' 
  | 'ease-out' 
  | 'ease-in-out' 
  | 'linear';

/**
 * Button size variants
 */
export type ButtonSize = 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'xl';

/**
 * Button style variants
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'gradient';

// ============================================================================
// FLOATING ICONS
// ============================================================================

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
}

/**
 * Configuration data for floating icons
 */
export interface FloatingIconData {
  /** Lucide icon component */
  Icon: LucideIcon;
  /** Icon size in pixels */
  size: number;
  /** Horizontal position as percentage (0-100) */
  left: number;
  /** Vertical position as percentage (0-100) */
  top: number;
  /** Animation delay in seconds */
  delay: number;
  /** Animation speed/duration in seconds */
  speed: number;
  /** Optional unique identifier */
  id?: string;
  /** Whether this icon should be visible */
  visible?: boolean;
}

/**
 * Props for the FloatingIcons container component
 */
export interface FloatingIconsProps {
  /** Array of floating icon configurations */
  icons: FloatingIconData[];
  /** Whether floating icons should be enabled */
  enabled?: boolean;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Optional CSS class name */
  className?: string;
}

// ============================================================================
// FEATURE DATA
// ============================================================================

/**
 * Individual feature item definition
 */
export interface FeatureData {
  /** Unique identifier for the feature */
  id: string;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Icon component to display */
  icon: React.ReactNode;
  /** CSS gradient classes for styling */
  gradient: string;
  /** Demo component to show on hover/interaction */
  demoComponent: React.ReactNode;
  /** Optional category for grouping */
  category?: string;
  /** Whether this feature is highlighted */
  highlighted?: boolean;
}

/**
 * Legacy feature interface for backward compatibility
 * @deprecated Use FeatureData instead
 */
export interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  gradient?: string;
  demoComponent?: React.ReactNode;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Main Features component props
 */
export interface FeaturesProps {
  /** Array of features to display (optional, uses defaults if not provided) */
  features?: FeatureData[];
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Background color type */
  backgroundColor?: BackgroundColorType;
  /** Whether floating icons should be enabled */
  enableFloatingIcons?: boolean;
  /** Whether animations should be enabled */
  enableAnimations?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Optional section ID for navigation */
  sectionId?: string;
}

/**
 * Section header component props
 */
export interface SectionHeaderProps {
  /** Main heading text */
  title: string | React.ReactNode;
  /** Subtitle or description text */
  subtitle?: string;
  /** Small label above the title */
  label?: string;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Text alignment */
  alignment?: 'left' | 'center' | 'right';
  /** Custom CSS class name */
  className?: string;
  /** Whether to show decorative elements */
  showDecorations?: boolean;
}

/**
 * Feature grid component props
 */
export interface FeatureGridProps {
  /** Array of features to display */
  features: FeatureData[];
  /** Currently active/hovered feature index */
  activeFeatureIndex: number | null;
  /** Callback when feature is hovered */
  onFeatureHover: (index: number) => void;
  /** Callback when mouse leaves feature area */
  onFeatureLeave: () => void;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Grid layout configuration */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between grid items */
  gap?: 'small' | 'medium' | 'large';
}

/**
 * Background video component props
 */
export interface BackgroundVideoProps {
  /** Video source URL */
  videoSrc?: string;
  /** Video poster image URL */
  posterSrc?: string;
  /** Callback for scroll to splash action */
  onScrollToSplash: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /** Whether video should autoplay */
  autoplay?: boolean;
  /** Whether video should loop */
  loop?: boolean;
  /** Whether video should be muted */
  muted?: boolean;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Features CTA component props
 */
export interface FeaturesCTAProps {
  /** CTA button text */
  text?: string;
  /** CTA button href */
  href?: string;
  /** Callback for button click */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether button should be full width */
  fullWidth?: boolean;
  /** Icon to show in button */
  icon?: React.ReactNode;
  /** Theme variant for styling */
  themeVariant?: VariantKey;
  /** Custom CSS class name */
  className?: string;
}

// ============================================================================
// VIDEO PLAYER
// ============================================================================

/**
 * Video player state interface
 */
export interface VideoPlayerState {
  /** Whether video is currently playing */
  isPlaying: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total video duration in seconds */
  duration: number;
  /** Whether video is muted */
  isMuted: boolean;
  /** Current volume (0-1) */
  volume: number;
  /** Whether video is in fullscreen */
  isFullscreen: boolean;
  /** Whether video is loading */
  isLoading: boolean;
  /** Any error that occurred */
  error: string | null;
}

/**
 * Video player component props
 */
export interface VideoPlayerProps {
  /** Reference to the video element */
  videoRef: React.RefObject<HTMLVideoElement>;
  /** Video source URL */
  src?: string;
  /** Video poster image URL */
  poster?: string;
  /** Whether controls should be shown */
  showControls?: boolean;
  /** Whether video should autoplay */
  autoplay?: boolean;
  /** Whether video should loop */
  loop?: boolean;
  /** Whether video should be muted */
  muted?: boolean;
  /** Callback when video starts playing */
  onPlay?: () => void;
  /** Callback when video pauses */
  onPause?: () => void;
  /** Callback when video ends */
  onEnded?: () => void;
  /** Callback when video encounters an error */
  onError?: (error: string) => void;
  /** Custom CSS class name */
  className?: string;
}

// ============================================================================
// INTERACTION STATE
// ============================================================================

/**
 * Feature interaction state for managing hover and active states
 */
export interface FeatureInteractionState {
  /** Currently active/hovered feature index */
  activeFeatureIndex: number | null;
  /** Whether any feature is currently being interacted with */
  isInteracting: boolean;
  /** Timestamp of last interaction */
  lastInteractionTime: number;
}

/**
 * Feature interaction handlers
 */
export interface FeatureInteractionHandlers {
  /** Handle feature hover */
  handleFeatureHover: (index: number) => void;
  /** Handle mouse leave from feature area */
  handleMouseLeave: () => void;
  /** Handle scroll to splash section */
  handleScrollToSplash: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /** Reset all interactions */
  resetInteractions: () => void;
}

// ============================================================================
// THEME MAPPING
// ============================================================================

/**
 * Theme mapping configuration
 */
export interface ThemeMapping {
  /** Source variant key */
  variant: VariantKey;
  /** Target theme option */
  theme: ThemeOption;
  /** Optional color overrides */
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

/**
 * Sample workout exercise item
 */
export interface WorkoutExercise {
  /** Exercise name */
  name: string;
  /** Sets and reps description */
  sets: string;
  /** Whether exercise is completed */
  completed?: boolean;
  /** Optional exercise category */
  category?: string;
}

/**
 * Sample workout component props
 */
export interface SampleWorkoutProps {
  /** Array of exercises to display */
  exercises?: WorkoutExercise[];
  /** Custom CSS class name */
  className?: string;
  /** Whether to show completion status */
  showCompletion?: boolean;
}

/**
 * Progress chart data point
 */
export interface ProgressDataPoint {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Optional label */
  label?: string;
  /** Optional value */
  value?: number;
}

/**
 * Progress chart component props
 */
export interface ProgressChartProps {
  /** Array of data points to plot */
  data?: ProgressDataPoint[];
  /** Chart title */
  title?: string;
  /** Chart width */
  width?: number;
  /** Chart height */
  height?: number;
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Whether to show data point labels */
  showLabels?: boolean;
  /** Custom CSS class name */
  className?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic event handler type
 */
export type EventHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void;

/**
 * Generic ref type for HTML elements
 */
export type ElementRef<T = HTMLElement> = React.RefObject<T>;

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing function */
  easing?: AnimationEasing;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Whether animation should repeat */
  repeat?: boolean;
  /** Whether to respect reduced motion preferences */
  respectReducedMotion?: boolean;
}

/**
 * Responsive breakpoint configuration
 */
export interface ResponsiveConfig {
  /** Mobile breakpoint */
  mobile?: boolean;
  /** Tablet breakpoint */
  tablet?: boolean;
  /** Desktop breakpoint */
  desktop?: boolean;
  /** Large desktop breakpoint */
  large?: boolean;
} 