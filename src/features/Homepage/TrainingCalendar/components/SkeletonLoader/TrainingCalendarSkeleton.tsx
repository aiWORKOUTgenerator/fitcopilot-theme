import React from 'react';
import './TrainingCalendarSkeleton.scss';

export interface TrainingCalendarSkeletonProps {
  variant?: 'default' | 'compact' | 'widget';
  showControls?: boolean;
  showFilters?: boolean;
}

/**
 * Skeleton loader for TrainingCalendar component
 * Provides content-aware loading state that matches the calendar structure
 */
export const TrainingCalendarSkeleton: React.FC<TrainingCalendarSkeletonProps> = ({
  variant = 'default',
  showControls = true,
  showFilters = true
}) => {
  return (
    <div className={`training-calendar-skeleton training-calendar-skeleton--${variant}`}>
      {/* Header Section */}
      <div className="training-calendar-skeleton__header">
        <div className="training-calendar-skeleton__title">
          <div className="skeleton-shimmer skeleton-shimmer--title"></div>
          <div className="skeleton-shimmer skeleton-shimmer--subtitle"></div>
        </div>
        
        {showControls && (
          <div className="training-calendar-skeleton__controls">
            <div className="skeleton-shimmer skeleton-shimmer--button"></div>
            <div className="skeleton-shimmer skeleton-shimmer--button"></div>
            <div className="skeleton-shimmer skeleton-shimmer--button"></div>
          </div>
        )}
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="training-calendar-skeleton__filters">
          <div className="skeleton-shimmer skeleton-shimmer--filter"></div>
          <div className="skeleton-shimmer skeleton-shimmer--filter"></div>
          <div className="skeleton-shimmer skeleton-shimmer--filter"></div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="training-calendar-skeleton__calendar">
        {/* Calendar Header */}
        <div className="training-calendar-skeleton__calendar-header">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="skeleton-shimmer skeleton-shimmer--day-header"></div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="training-calendar-skeleton__calendar-body">
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <div key={weekIndex} className="training-calendar-skeleton__week">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="training-calendar-skeleton__day">
                  <div className="skeleton-shimmer skeleton-shimmer--day-number"></div>
                  {/* Random events for realistic skeleton */}
                  {Math.random() > 0.7 && (
                    <div className="skeleton-shimmer skeleton-shimmer--event"></div>
                  )}
                  {Math.random() > 0.8 && (
                    <div className="skeleton-shimmer skeleton-shimmer--event skeleton-shimmer--event-small"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="training-calendar-skeleton__stats">
        <div className="training-calendar-skeleton__stat">
          <div className="skeleton-shimmer skeleton-shimmer--stat-number"></div>
          <div className="skeleton-shimmer skeleton-shimmer--stat-label"></div>
        </div>
        <div className="training-calendar-skeleton__stat">
          <div className="skeleton-shimmer skeleton-shimmer--stat-number"></div>
          <div className="skeleton-shimmer skeleton-shimmer--stat-label"></div>
        </div>
        <div className="training-calendar-skeleton__stat">
          <div className="skeleton-shimmer skeleton-shimmer--stat-number"></div>
          <div className="skeleton-shimmer skeleton-shimmer--stat-label"></div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCalendarSkeleton; 