import { Activity, Lightbulb, PieChart, Trophy } from 'lucide-react';
import React from 'react';
import { AnalyticsFeature, AnalyticsOption } from './types';

// Storage key for analytics selector data
export const STORAGE_KEY = 'fitcopilot_analytics_selector';

// Min allowed analytics features to select
export const MIN_FEATURES = 1;

// Create an icon component with default styling
const createIcon = (IconComponent: typeof PieChart | typeof Trophy | typeof Activity | typeof Lightbulb) => {
  return React.createElement(IconComponent, {
    size: 24,
    className: "text-amber-200"
  });
};

/**
 * Available analytics options
 */
export const ANALYTICS_OPTIONS: AnalyticsOption[] = [
  {
    id: 'visual-analytics',
    value: AnalyticsFeature.VISUAL_ANALYTICS,
    title: 'Visual Analytics',
    description: 'Interactive charts showing your strength progression and volume over time.',
    icon: createIcon(PieChart)
  },
  {
    id: 'achievements',
    value: AnalyticsFeature.ACHIEVEMENTS,
    title: 'Achievement System',
    description: 'Unlock badges and achievements as you hit milestones in your fitness journey.',
    icon: createIcon(Trophy)
  },
  {
    id: 'body-composition',
    value: AnalyticsFeature.BODY_COMPOSITION,
    title: 'Body Composition',
    description: 'Track weight, measurements, and body composition changes visually.',
    icon: createIcon(Activity)
  },
  {
    id: 'smart-insights',
    value: AnalyticsFeature.SMART_INSIGHTS,
    title: 'Smart Insights',
    description: 'AI-powered observations about your performance patterns and suggestions.',
    icon: createIcon(Lightbulb)
  }
]; 