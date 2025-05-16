import React from 'react';
import './Loading.scss';

export interface LoadingProps {
    /**
     * Size of the loading spinner
     * @default 'medium'
     */
    size?: 'small' | 'medium' | 'large';

    /**
     * Color theme of the spinner
     * @default 'light'
     */
    variant?: 'light' | 'dark' | 'accent';

    /**
     * Optional label for accessibility
     * @default 'Loading content'
     */
    label?: string;

    /**
     * Whether to show the label visibly
     * @default false
     */
    showLabel?: boolean;

    /**
     * Additional custom CSS classes
     */
    className?: string;
}

/**
 * Loading spinner component for indicating loading states
 * throughout the application.
 * 
 * @example
 * // Basic usage
 * <Loading />
 * 
 * @example
 * // Custom size and variant
 * <Loading size="large" variant="accent" />
 * 
 * @example
 * // With visible label
 * <Loading showLabel label="Loading your workout" />
 */
const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  variant = 'light',
  label = 'Loading content',
  showLabel = false,
  className = '',
}) => {
  return (
    <div className={`loading-container ${className} ${showLabel ? 'with-label' : ''}`}>
      <svg
        className={`loading-spinner ${size} ${variant}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className="loading-track"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="3"
        />
        <circle
          className="loading-indicator"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="40 60"
        />
      </svg>

      {showLabel ? (
        <p className="loading-label">{label}</p>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
};

export default Loading; 