import { Zap } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import logger from '../../../../../utils/logger';
import { DEFAULT_VIDEO_CONFIG } from '../../constants';
import FeatureCTA from '../FeatureCTA';
import { BackgroundVideoPlayerProps } from './types';

/**
 * BackgroundVideoPlayer component for displaying full-width background video with overlay content
 * Provides autoplay video background with customizable overlay and CTA
 */
export const BackgroundVideoPlayer: React.FC<BackgroundVideoPlayerProps> = ({
  src = DEFAULT_VIDEO_CONFIG.src,
  poster = DEFAULT_VIDEO_CONFIG.poster,
  variant = 'default',
  className = '',
  style = {},
  children,
  overlay,
  height = 'h-80 md:h-[500px]',
  autoplay = true,
  onScrollToSplash
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default overlay configuration
  const defaultOverlay = {
    gradient: 'from-gray-900 via-gray-900/60 to-gray-900/30',
    opacity: 1,
    alignment: 'center' as const,
    showCTA: true,
    cta: {
      text: 'Get Started',
      icon: <Zap className="features-icon" />,
      onClick: onScrollToSplash
    }
  };

  const finalOverlay = { ...defaultOverlay, ...overlay };

  // Container classes
  const containerClasses = [
    'background-video-player',
    'video-background',
    'relative',
    'w-full',
    height,
    'mt-20',
    'mb-20',
    'overflow-hidden',
    'rounded-xl',
    className
  ].filter(Boolean).join(' ');

  // Overlay alignment classes
  const overlayAlignmentClasses = {
    center: 'items-center justify-center',
    left: 'items-center justify-start pl-8',
    right: 'items-center justify-end pr-8',
    top: 'items-start justify-center pt-8',
    bottom: 'items-end justify-center pb-8'
  };

  // Auto-play video on mount
  useEffect(() => {
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch(e => {
        logger.error("Background video autoplay failed:", e);
      });
    }
  }, [autoplay]);

  return (
    <div 
      className={containerClasses}
      style={style}
      data-variant={variant}
      role="region"
      aria-label="Background video with content overlay"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Overlay with content */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t ${finalOverlay.gradient} flex ${overlayAlignmentClasses[finalOverlay.alignment]}`}
        style={{ opacity: finalOverlay.opacity }}
      >
        <div className="text-center max-w-xl px-4">
          {/* Custom children content */}
          {children ? (
            children
          ) : (
            <>
              {/* Default content */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Experience Fitness Evolution
              </h3>
              <p className="text-gray-300 mb-6">
                Our technology adapts to your unique fitness journey, helping you achieve optimal results safely and efficiently.
              </p>

              {/* CTA Button - Now using FeatureCTA as primary */}
              {finalOverlay.showCTA && finalOverlay.cta && (
                <div 
                  className="features-cta cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    finalOverlay.cta.onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      finalOverlay.cta.onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
                    }
                  }}
                >
                  <FeatureCTA
                    text={finalOverlay.cta.text}
                    buttonSize="large"
                    gradientColor="cyan"
                    variant={variant}
                    icon={finalOverlay.cta.icon}
                    href="#" // Placeholder href, actual navigation handled by wrapper onClick
                    showIcon={true}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 