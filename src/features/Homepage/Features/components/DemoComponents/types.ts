import React from 'react';
import { ProgressDataPoint, VariantKey, WorkoutExercise } from '../../types';

/**
 * Props for the SampleWorkout component
 */
export interface SampleWorkoutProps {
  /** Array of workout exercises */
  exercises?: WorkoutExercise[];
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Optional CSS class name */
  className?: string;
  /** Custom container styles */
  style?: React.CSSProperties;
  /** Whether to show the AI optimization note */
  showOptimizationNote?: boolean;
  /** Custom optimization note text */
  optimizationNote?: string;
  /** Maximum height for the exercise list */
  maxHeight?: string;
  /** Whether to show completion status */
  showCompletionStatus?: boolean;
}



/**
 * Props for the ProgressChart component
 */
export interface ProgressChartProps {
  /** Array of progress data points */
  data?: ProgressDataPoint[];
  /** Chart title */
  title?: string;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Optional CSS class name */
  className?: string;
  /** Custom container styles */
  style?: React.CSSProperties;
  /** Whether to show the progress percentage */
  showProgressPercentage?: boolean;
  /** Custom progress percentage text */
  progressText?: string;
  /** Chart height */
  height?: string;
  /** Whether to animate the chart */
  animated?: boolean;
  /** Animation duration in seconds */
  animationDuration?: number;
}



/**
 * Props for the VideoPlayer component
 */
export interface VideoPlayerProps {
  /** Video element reference */
  videoRef: React.RefObject<HTMLVideoElement>;
  /** Video source URL */
  src?: string;
  /** Video poster image URL */
  poster?: string;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Optional CSS class name */
  className?: string;
  /** Custom container styles */
  style?: React.CSSProperties;
  /** Whether the video should autoplay */
  _autoplay?: boolean;
  /** Whether the video should loop */
  loop?: boolean;
  /** Whether the video should be muted */
  muted?: boolean;
  /** Video controls configuration */
  controls?: VideoControlsConfig;
  /** Callback when video starts playing */
  onPlay?: () => void;
  /** Callback when video is paused */
  onPause?: () => void;
  /** Callback when video ends */
  onEnded?: () => void;
  /** Callback for video time updates */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

/**
 * Video controls configuration
 */
export interface VideoControlsConfig {
  /** Whether to show play/pause button */
  showPlayPause?: boolean;
  /** Whether to show progress bar */
  showProgress?: boolean;
  /** Whether to show time display */
  showTime?: boolean;
  /** Whether to show volume controls */
  showVolume?: boolean;
  /** Whether to show fullscreen button */
  showFullscreen?: boolean;
  /** Custom control button size */
  buttonSize?: 'sm' | 'md' | 'lg';
  /** Control overlay opacity */
  overlayOpacity?: number;
}

/**
 * Props for the BackgroundVideoPlayer component
 */
export interface BackgroundVideoPlayerProps {
  /** Video source URL */
  src?: string;
  /** Video poster image URL */
  poster?: string;
  /** Theme variant for styling */
  variant?: VariantKey;
  /** Optional CSS class name */
  className?: string;
  /** Custom container styles */
  style?: React.CSSProperties;
  /** Overlay content */
  children?: React.ReactNode;
  /** Overlay configuration */
  overlay?: VideoOverlayConfig;
  /** Video height */
  height?: string;
  /** Whether the video should autoplay */
  autoplay?: boolean;
  /** Callback for scroll to splash action */
  onScrollToSplash?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

/**
 * Video overlay configuration
 */
export interface VideoOverlayConfig {
  /** Overlay gradient configuration */
  gradient?: string;
  /** Overlay opacity */
  opacity?: number;
  /** Overlay content alignment */
  alignment?: 'center' | 'left' | 'right' | 'top' | 'bottom';
  /** Whether to show the default CTA */
  showCTA?: boolean;
  /** Custom CTA configuration */
  cta?: {
    text: string;
    icon?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  };
}

/**
 * Demo component configuration
 */
export interface DemoComponentConfig {
  /** Component type */
  type: 'workout' | 'chart' | 'video';
  /** Component props */
  props: SampleWorkoutProps | ProgressChartProps | VideoPlayerProps;
  /** Component title */
  title?: string;
  /** Component description */
  description?: string;
  /** Whether the component is active */
  active?: boolean;
} 