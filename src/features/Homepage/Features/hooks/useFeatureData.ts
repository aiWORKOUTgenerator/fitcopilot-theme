import { Activity, BarChart3, HeartHandshake } from 'lucide-react';
import React, { useMemo } from 'react';
import { FeatureData } from '../types';
import {
    getFeatureById,
    groupFeaturesByCategory,
    validateFeatures
} from '../utils';

// Default demo components (these would be imported from actual components in real implementation)
const SampleWorkout = () => React.createElement('div', null, 'Sample Workout Component');
const ProgressChart = () => React.createElement('div', null, 'Progress Chart Component');
const VideoPlayer = () => React.createElement('div', null, 'Video Player Component');

/**
 * Default feature data for the Features component
 */
const DEFAULT_FEATURES: FeatureData[] = [
  {
    id: 'customized-workouts',
    title: 'Customized Workouts',
    description: 'Dynamic plans personalized to your fitness goals and equipment.',
    icon: React.createElement(BarChart3),
    gradient: 'from-lime-300/20 to-emerald-500/20',
    demoComponent: React.createElement(SampleWorkout),
    category: 'planning',
    highlighted: false
  },
  {
    id: 'real-time-tracking',
    title: 'Real-Time Tracking',
    description: 'Instantly monitor and visualize your progress and achievements.',
    icon: React.createElement(Activity),
    gradient: 'from-lime-300/20 to-cyan-500/20',
    demoComponent: React.createElement(ProgressChart),
    category: 'tracking',
    highlighted: true
  },
  {
    id: 'expert-advice',
    title: 'Expert Advice',
    description: 'Receive guidance and tips from professional fitness experts.',
    icon: React.createElement(HeartHandshake),
    gradient: 'from-lime-300/20 to-purple-500/20',
    demoComponent: React.createElement(VideoPlayer),
    category: 'guidance',
    highlighted: false
  }
];

/**
 * Custom hook for managing feature data
 * Handles validation, processing, and provides utilities for feature management
 * 
 * @param customFeatures - Optional custom features array
 * @param enableValidation - Whether to validate feature data
 * @returns Object containing processed features and utility functions
 * 
 * @example
 * ```tsx
 * const { features, getFeature, categories } = useFeatureData(customFeatures);
 * 
 * {features.map((feature, index) => (
 *   <FeatureCard key={feature.id} {...feature} />
 * ))}
 * ```
 */
export const useFeatureData = (
  customFeatures?: FeatureData[],
  enableValidation: boolean = true
) => {
  // Process and validate features
  const features = useMemo(() => {
    const sourceFeatures = customFeatures || DEFAULT_FEATURES;
    
    if (enableValidation) {
      return validateFeatures(sourceFeatures);
    }
    
    return sourceFeatures;
  }, [customFeatures, enableValidation]);

  // Group features by category
  const categories = useMemo(() => {
    return groupFeaturesByCategory(features);
  }, [features]);

  // Get highlighted features
  const highlightedFeatures = useMemo(() => {
    return features.filter(feature => feature.highlighted);
  }, [features]);

  // Get feature statistics
  const stats = useMemo(() => {
    return {
      total: features.length,
      highlighted: highlightedFeatures.length,
      categories: Object.keys(categories).length,
      hasCustomFeatures: !!customFeatures,
      isValid: features.length > 0
    };
  }, [features.length, highlightedFeatures.length, categories, customFeatures]);

  /**
   * Gets a feature by its ID
   * @param id - Feature ID to find
   * @returns Feature if found, undefined otherwise
   */
  const getFeature = (id: string): FeatureData | undefined => {
    return getFeatureById(features, id);
  };

  /**
   * Gets features by category
   * @param category - Category name
   * @returns Array of features in the category
   */
  const getFeaturesByCategory = (category: string): FeatureData[] => {
    return categories[category] || [];
  };

  /**
   * Gets feature by index
   * @param index - Feature index
   * @returns Feature if found, undefined otherwise
   */
  const getFeatureByIndex = (index: number): FeatureData | undefined => {
    return features[index];
  };

  /**
   * Checks if a feature exists
   * @param id - Feature ID to check
   * @returns True if feature exists
   */
  const hasFeature = (id: string): boolean => {
    return !!getFeature(id);
  };

  /**
   * Gets the index of a feature
   * @param id - Feature ID
   * @returns Feature index or -1 if not found
   */
  const getFeatureIndex = (id: string): number => {
    return features.findIndex(feature => feature.id === id);
  };

  /**
   * Gets features with demo components
   * @returns Features that have demo components
   */
  const getFeaturesWithDemos = (): FeatureData[] => {
    return features.filter(feature => feature.demoComponent);
  };

  /**
   * Gets the next feature in the list
   * @param currentId - Current feature ID
   * @returns Next feature or first feature if at end
   */
  const getNextFeature = (currentId: string): FeatureData | undefined => {
    const currentIndex = getFeatureIndex(currentId);
    if (currentIndex === -1) return undefined;
    
    const nextIndex = (currentIndex + 1) % features.length;
    return features[nextIndex];
  };

  /**
   * Gets the previous feature in the list
   * @param currentId - Current feature ID
   * @returns Previous feature or last feature if at beginning
   */
  const getPreviousFeature = (currentId: string): FeatureData | undefined => {
    const currentIndex = getFeatureIndex(currentId);
    if (currentIndex === -1) return undefined;
    
    const prevIndex = currentIndex === 0 ? features.length - 1 : currentIndex - 1;
    return features[prevIndex];
  };

  /**
   * Validates that all features have required properties
   * @returns Validation result with details
   */
  const validateAllFeatures = () => {
    const validationResults = features.map(feature => {
      const errors: string[] = [];
      
      if (!feature.id) errors.push('Missing ID');
      if (!feature.title) errors.push('Missing title');
      if (!feature.description) errors.push('Missing description');
      if (!feature.icon) errors.push('Missing icon');
      if (!feature.gradient) errors.push('Missing gradient');
      if (!feature.demoComponent) errors.push('Missing demo component');
      
      return {
        feature: feature.id || 'unknown',
        isValid: errors.length === 0,
        errors
      };
    });

    return {
      isValid: validationResults.every(result => result.isValid),
      results: validationResults,
      totalErrors: validationResults.reduce((sum, result) => sum + result.errors.length, 0)
    };
  };

  /**
   * Gets feature data formatted for display
   * @returns Features with additional display properties
   */
  const getDisplayFeatures = () => {
    return features.map((feature, index) => ({
      ...feature,
      index,
      isFirst: index === 0,
      isLast: index === features.length - 1,
      categoryLabel: feature.category ? 
        feature.category.charAt(0).toUpperCase() + feature.category.slice(1) : 
        'General'
    }));
  };

  return {
    // Core data
    features,
    categories,
    highlightedFeatures,
    
    // Statistics
    stats,
    
    // Utility functions
    getFeature,
    getFeaturesByCategory,
    getFeatureByIndex,
    hasFeature,
    getFeatureIndex,
    getFeaturesWithDemos,
    getNextFeature,
    getPreviousFeature,
    validateAllFeatures,
    getDisplayFeatures,
    
    // Convenience properties
    hasFeatures: features.length > 0,
    featureCount: features.length,
    categoryNames: Object.keys(categories),
    isEmpty: features.length === 0,
    isUsingDefaults: !customFeatures
  };
}; 