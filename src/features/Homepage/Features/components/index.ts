// Demo Components (new extracted components)
export {
  BackgroundVideoPlayer, ProgressChart, SampleWorkout, VideoPlayer
} from './DemoComponents';

export type {
  BackgroundVideoPlayerProps, DemoComponentConfig, ProgressChartProps, SampleWorkoutProps, VideoControlsConfig, VideoOverlayConfig, VideoPlayerProps
} from './DemoComponents';

// Other components
export { default as FeatureCard } from './FeatureCard';
export { FloatingIcon, renderFloatingIcon } from './FloatingIcon';
export { FloatingIcons } from './FloatingIcons';
export { SectionHeader } from './SectionHeader';

// Button components - FeatureCTA is the primary CTA, FeatureButton is available as alternative
export { default as FeatureCTA } from './FeatureCTA';
export type { FeatureCTAProps } from './FeatureCTA';

// Alternative button option (maintained for specific use cases)
export { default as FeatureButton } from './FeatureButton';
export type { FeatureButtonProps } from './FeatureButton';

