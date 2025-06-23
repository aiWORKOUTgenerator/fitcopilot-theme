/**
 * Demo Components exports
 * Provides reusable demo components for the Features section
 */

export { BackgroundVideoPlayer } from './BackgroundVideoPlayer';
export { ProgressChart } from './ProgressChart';
export { SampleWorkout } from './SampleWorkout';
export { VideoPlayer } from './VideoPlayer';

export type {
  BackgroundVideoPlayerProps, DemoComponentConfig, ProgressChartProps, SampleWorkoutProps, VideoControlsConfig, VideoOverlayConfig, VideoPlayerProps
} from './types';

// Re-export types from parent for convenience
export type { ProgressDataPoint, VariantKey, WorkoutExercise } from '../../types';
