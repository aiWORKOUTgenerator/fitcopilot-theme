import React from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './PersonalTrainingSkeletonLoader.scss';

/**
 * Props for PersonalTrainingSkeletonLoader
 */
export interface PersonalTrainingSkeletonLoaderProps {
  /** Theme variant */
  variant?: 'default' | 'modern' | 'classic' | 'minimalist' | 'sports' | 'wellness' | 'boutique';
  /** Number of trainer cards to show in skeleton */
  trainerCount?: number;
  /** Whether to show featured trainer skeleton */
  showFeatured?: boolean;
  /** Whether to use staggered animation delays */
  useStaggeredAnimation?: boolean;
}

/**
 * Props for individual trainer card skeleton
 */
export interface TrainerCardSkeletonProps {
  /** Whether this is a featured trainer card */
  featured?: boolean;
  /** Animation delay for staggered effect */
  animationDelay?: number;
  /** Unique key for the skeleton */
  index?: number;
}

/**
 * Individual trainer card skeleton component
 */
export const TrainerCardSkeleton: React.FC<TrainerCardSkeletonProps> = ({
  featured = false,
  animationDelay = 0,
  index = 0
}) => {
  const skeletonStyle = {
    '--animation-delay': `${animationDelay}ms`
  } as React.CSSProperties;

  return (
    <div 
      className={`trainer-card-skeleton ${featured ? 'featured' : 'regular'}`}
      style={skeletonStyle}
      aria-label={`Loading ${featured ? 'featured ' : ''}trainer information`}
      role="status"
    >
      {/* Trainer Image Skeleton */}
      <div className="skeleton-image-container">
        <div className="skeleton-image" />
      </div>

      {/* Specialty Tag Skeleton */}
      <div className="skeleton-specialty-tag" />

      {/* Trainer Name Skeleton */}
      <div className="skeleton-name" />

      {/* Bio Lines Skeleton */}
      <div className="skeleton-bio">
        <div className="skeleton-bio-line" />
        <div className="skeleton-bio-line short" />
        <div className="skeleton-bio-line medium" />
      </div>

      {/* Stats Skeleton */}
      <div className="skeleton-stats">
        <div className="skeleton-stat-item">
          <div className="skeleton-stat-value" />
          <div className="skeleton-stat-label" />
        </div>
        <div className="skeleton-stat-item">
          <div className="skeleton-stat-value" />
          <div className="skeleton-stat-label" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="skeleton-button" />

      {/* Featured trainer video skeleton */}
      {featured && (
        <div className="skeleton-video-section">
          <div className="skeleton-video-title" />
          <div className="skeleton-video-player" />
        </div>
      )}
    </div>
  );
};

/**
 * Section header skeleton component
 */
const SectionHeaderSkeleton: React.FC = () => {
  return (
    <div className="section-header-skeleton">
      {/* Section tag skeleton */}
      <div className="skeleton-section-tag" />
      
      {/* Main title skeleton */}
      <div className="skeleton-main-title">
        <div className="skeleton-title-line" />
        <div className="skeleton-title-line gradient" />
      </div>
      
      {/* Subtitle skeleton */}
      <div className="skeleton-subtitle">
        <div className="skeleton-subtitle-line" />
        <div className="skeleton-subtitle-line short" />
      </div>
    </div>
  );
};

/**
 * Team CTA section skeleton component
 */
const TeamCTASkeleton: React.FC = () => {
  return (
    <div className="team-cta-skeleton">
      {/* Icon skeleton */}
      <div className="skeleton-team-icon" />
      
      {/* CTA title skeleton */}
      <div className="skeleton-cta-title">
        <div className="skeleton-cta-title-line" />
        <div className="skeleton-cta-title-line gradient" />
      </div>
      
      {/* CTA description skeleton */}
      <div className="skeleton-cta-description">
        <div className="skeleton-cta-desc-line" />
        <div className="skeleton-cta-desc-line medium" />
        <div className="skeleton-cta-desc-line short" />
      </div>
      
      {/* CTA button skeleton */}
      <div className="skeleton-cta-button" />
    </div>
  );
};

/**
 * Enhanced PersonalTraining Skeleton Loader
 * 
 * Provides sophisticated content-aware loading states that match
 * the actual trainer card structure with smooth animations
 */
export const PersonalTrainingSkeletonLoader: React.FC<PersonalTrainingSkeletonLoaderProps> = ({
  variant = 'default',
  trainerCount = 4,
  showFeatured = true,
  useStaggeredAnimation = true
}) => {
  // Generate trainer skeletons with staggered animation delays
  const trainerSkeletons = Array.from({ length: trainerCount }, (_, index) => {
    const featured = showFeatured && index === 0;
    const animationDelay = useStaggeredAnimation ? index * 150 : 0;
    
    return (
      <TrainerCardSkeleton
        key={`skeleton-${index}`}
        featured={featured}
        animationDelay={animationDelay}
        index={index}
      />
    );
  });

  return (
    <section 
      className={`personal-training-section personal-training-skeleton ${variant}`} 
      data-trainer-count={trainerCount}
      aria-label="Loading personal training content"
      role="status"
    >
      <div className="container mx-auto px-4">
        {/* Section header skeleton */}
        <SectionHeaderSkeleton />

        {/* Trainers grid skeleton */}
        <div className="trainers-container-skeleton" data-trainer-count={trainerCount}>
          {trainerSkeletons}
        </div>

        {/* Team CTA skeleton */}
        <TeamCTASkeleton />
      </div>
      
      {/* Screen reader loading announcement */}
      <div className="sr-only" aria-live="polite">
        Loading personal trainer information...
      </div>
    </section>
  );
};

/**
 * Enhanced version with debounced loading for smooth UX
 */
export const DebouncedPersonalTrainingSkeletonLoader: React.FC<PersonalTrainingSkeletonLoaderProps & {
  isLoading: boolean;
  debounceMs?: number;
}> = ({ isLoading, debounceMs = 300, ...props }) => {
  const debouncedLoading = useDebounce(isLoading, debounceMs);
  
  if (!debouncedLoading) {
    return null;
  }
  
  return <PersonalTrainingSkeletonLoader {...props} />;
};

export default PersonalTrainingSkeletonLoader;
