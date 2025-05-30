import React from 'react';
import logger from '../../../../../utils/logger';
import { useAnimations, useFloatingIcons } from '../../hooks';
import type { FloatingIconData } from '../../types';
import { FloatingIcon } from './FloatingIcon';
import { FloatingIconsProps } from './types';

/**
 * FloatingIcons container component for the Features section
 * Manages a collection of floating icons with motion preferences and accessibility support
 * 
 * @param props - FloatingIcons component props
 * @returns JSX.Element - Rendered floating icons container
 * 
 * @example
 * ```tsx
 * <FloatingIcons
 *   variant="gym"
 *   enabled={true}
 *   respectReducedMotion={true}
 * />
 * ```
 */
export const FloatingIcons: React.FC<FloatingIconsProps> = ({
  icons: customIcons,
  enabled = true,
  variant = 'default',
  className = '',
  respectReducedMotion = true,
  style = {},
  debug = false
}) => {
  // Use floating icons hook for configuration and motion preferences
  const {
    icons,
    isEnabled,
    motionReduced,
    iconStats,
    hasIcons
  } = useFloatingIcons(variant, enabled, respectReducedMotion);

  // Use animations hook for motion configuration
  const { shouldAnimate } = useAnimations(respectReducedMotion);

  // Use custom icons if provided, otherwise use hook-generated icons
  const finalIcons = customIcons || icons;

  // Log debug information if enabled
  if (debug) {
    logger.debug('FloatingIcons Debug Info:', {
      variant,
      enabled,
      isEnabled,
      motionReduced,
      iconCount: finalIcons.length,
      iconStats,
      shouldAnimate: shouldAnimate('floating')
    });
  }

  // Don't render if disabled or no icons
  if (!isEnabled || !hasIcons || finalIcons.length === 0) {
    if (debug) {
      logger.debug('FloatingIcons not rendering:', {
        isEnabled,
        hasIcons,
        iconCount: finalIcons.length
      });
    }
    return null;
  }

  // Don't render if animations are disabled and motion is reduced
  if (motionReduced && !shouldAnimate('floating')) {
    if (debug) {
      logger.debug('FloatingIcons disabled due to reduced motion');
    }
    return null;
  }

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
    ...style
  };

  return (
    <div
      className={`floating-icons-container ${className}`.trim()}
      style={containerStyle}
      aria-hidden="true"
      role="presentation"
      data-variant={variant}
      data-motion-reduced={motionReduced}
      data-icon-count={finalIcons.length}
    >
      {finalIcons.map((iconData: FloatingIconData, index: number) => {
        const { Icon, size, left, top, delay, speed, visible = true, id } = iconData;
        
        // Skip if icon is marked as not visible
        if (!visible) {
          return null;
        }

        return (
          <FloatingIcon
            key={id || `floating-icon-${index}`}
            left={left}
            top={top}
            delay={delay}
            speed={speed}
            visible={visible}
            className={`floating-icon-${index}`}
          >
            <Icon 
              size={size} 
              className="text-white/20 hover:text-white/30 transition-colors duration-300"
              aria-hidden="true"
            />
          </FloatingIcon>
        );
      })}
      
      {/* Debug overlay */}
      {debug && (
        <div
          className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded z-50 pointer-events-auto"
          style={{ fontFamily: 'monospace' }}
        >
          <div>Variant: {variant}</div>
          <div>Icons: {finalIcons.length}</div>
          <div>Motion Reduced: {motionReduced ? 'Yes' : 'No'}</div>
          <div>Enabled: {isEnabled ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}; 