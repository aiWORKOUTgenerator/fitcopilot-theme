/**
 * Features component custom hooks
 * Provides reusable state management and logic for the Features section
 */

export { useAnimations } from './useAnimations';
export { useFeatureData } from './useFeatureData';
export { useFeatureInteraction } from './useFeatureInteraction';
export { useFloatingIcons } from './useFloatingIcons';
export { useVideoPlayer } from './useVideoPlayer';

// Re-export types for convenience
export type {
    FeatureData, FeatureInteractionHandlers, FeatureInteractionState, FloatingIconData, VideoPlayerState
} from '../types';
