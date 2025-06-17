import React from 'react';
import { TrainingCalendarSkeleton } from './TrainingCalendarSkeleton';

export interface SkeletonLoaderProps {
  type?: 'calendar' | 'event' | 'controls' | 'stats';
  variant?: 'default' | 'compact' | 'widget';
  count?: number;
  showControls?: boolean;
  showFilters?: boolean;
}

/**
 * Generic skeleton loader component for Training Calendar
 * Provides different skeleton types based on what content is loading
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'calendar',
  variant = 'default',
  count = 1,
  showControls = true,
  showFilters = true
}) => {
  // For calendar type, use the full TrainingCalendarSkeleton
  if (type === 'calendar') {
    return (
      <TrainingCalendarSkeleton
        variant={variant}
        showControls={showControls}
        showFilters={showFilters}
      />
    );
  }

  // For other types, provide simpler skeleton structures
  const renderSkeletonByType = () => {
    switch (type) {
      case 'event':
        return (
          <div className="skeleton-loader skeleton-loader--event">
            <div className="skeleton-shimmer skeleton-shimmer--event-title"></div>
            <div className="skeleton-shimmer skeleton-shimmer--event-time"></div>
            <div className="skeleton-shimmer skeleton-shimmer--event-trainer"></div>
          </div>
        );

      case 'controls':
        return (
          <div className="skeleton-loader skeleton-loader--controls">
            <div className="skeleton-shimmer skeleton-shimmer--button"></div>
            <div className="skeleton-shimmer skeleton-shimmer--button"></div>
            <div className="skeleton-shimmer skeleton-shimmer--button"></div>
          </div>
        );

      case 'stats':
        return (
          <div className="skeleton-loader skeleton-loader--stats">
            <div className="skeleton-shimmer skeleton-shimmer--stat-number"></div>
            <div className="skeleton-shimmer skeleton-shimmer--stat-label"></div>
          </div>
        );

      default:
        return (
          <div className="skeleton-loader skeleton-loader--default">
            <div className="skeleton-shimmer"></div>
          </div>
        );
    }
  };

  // If count > 1, render multiple instances
  if (count > 1) {
    return (
      <div className={`skeleton-loader-group skeleton-loader-group--${type}`}>
        {Array.from({ length: count }).map((_, index) => (
          <React.Fragment key={index}>
            {renderSkeletonByType()}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return renderSkeletonByType();
};

export default SkeletonLoader; 