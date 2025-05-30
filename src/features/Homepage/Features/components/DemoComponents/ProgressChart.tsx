import { Heart } from 'lucide-react';
import React from 'react';
import { DEFAULT_PROGRESS_DATA } from '../../constants';
import { useAnimations } from '../../hooks';
import { ProgressChartProps, ProgressDataPoint } from './types';

/**
 * ProgressChart component for displaying weekly progress visualization
 * Shows animated progress line with data points and weekly improvement percentage
 * 
 * @param props - ProgressChart component props
 * @returns JSX.Element - Rendered progress chart component
 * 
 * @example
 * ```tsx
 * <ProgressChart
 *   data={progressData}
 *   title="Weekly Progress"
 *   variant="gym"
 *   animated={true}
 * />
 * ```
 */
export const ProgressChart: React.FC<ProgressChartProps> = ({
  data = DEFAULT_PROGRESS_DATA,
  title = 'Weekly Progress',
  variant = 'default',
  className = '',
  style = {},
  showProgressPercentage = true,
  progressText = '+12% this week',
  height = 'auto',
  animated = true,
  animationDuration = 2.5
}) => {
  // Use animations hook for motion configuration
  const { shouldAnimate } = useAnimations();

  // Container classes
  const containerClasses = [
    'progress-chart',
    'text-white',
    'h-full',
    'w-full',
    'flex',
    'flex-col',
    className
  ].filter(Boolean).join(' ');

  // Determine if animations should be enabled
  const enableAnimations = animated && shouldAnimate('chart');

  // Generate SVG path from data points
  const generatePath = (points: ProgressDataPoint[]): string => {
    if (points.length === 0) return '';
    
    const pathCommands = points.map((point, index) => {
      if (index === 0) {
        return `M${point.x},${point.y}`;
      }
      
      // Use smooth curves between points
      const prevPoint = points[index - 1];
      const controlX = (prevPoint.x + point.x) / 2;
      return `C${controlX},${prevPoint.y} ${controlX},${point.y} ${point.x},${point.y}`;
    });
    
    return pathCommands.join(' ');
  };

  // Generate grid lines
  const generateGridLines = () => {
    const horizontalLines = Array.from({ length: 5 }, (_, i) => (
      <div
        key={`h-${i}`}
        className="absolute w-full h-px bg-gray-700/30"
        style={{ top: `${20 * i}%` }}
      />
    ));

    const verticalLines = Array.from({ length: 7 }, (_, i) => (
      <div
        key={`v-${i}`}
        className="absolute h-full w-px bg-gray-700/30"
        style={{ left: `${(100 / 6) * i}%` }}
      />
    ));

    return [...horizontalLines, ...verticalLines];
  };

  return (
    <div 
      className={containerClasses}
      style={{ ...style, height }}
      data-variant={variant}
      role="img"
      aria-label={`${title} chart showing progress over time`}
    >
      {/* Chart title */}
      <h4 className="text-cyan-300 text-sm font-bold mb-3">
        {title}
      </h4>

      {/* Chart area */}
      <div className="flex-1 relative" style={{ minHeight: '200px' }}>
        {/* Chart grid */}
        <div className="absolute inset-0" aria-hidden="true">
          {generateGridLines()}
        </div>

        {/* Progress line SVG */}
        <svg 
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Animated progress path */}
          <path
            d={generatePath(data)}
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className={`chart-line drop-shadow-[0_0_3px_rgba(132,204,22,0.5)] ${
              enableAnimations ? 'animate-draw-line' : ''
            }`}
            style={{
              animationDuration: enableAnimations ? `${animationDuration}s` : undefined
            }}
          />

          {/* Heart icon at end of line */}
          {data.length > 0 && (
            <foreignObject
              x={data[data.length - 1].x - 8}
              y={data[data.length - 1].y - 8}
              width="16"
              height="16"
              className={`${
                enableAnimations 
                  ? 'opacity-0 animate-heartbeat animate-heart-pulse animate-fade-in' 
                  : 'opacity-100'
              }`}
              style={{
                animationDelay: enableAnimations ? `${animationDuration * 0.8}s` : undefined
              }}
            >
              <Heart
                size={16}
                className="text-rose-500 fill-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.5)]"
              />
            </foreignObject>
          )}
        </svg>

        {/* Data points */}
        {data.map((point: ProgressDataPoint, i: number) => (
          <div
            key={point.label || `point-${i}`}
            className={`absolute h-2 w-2 bg-gradient-to-br from-lime-400 to-cyan-400 rounded-full ${
              enableAnimations ? 'opacity-0 scale-0 animate-point-fade' : 'opacity-100 scale-100'
            }`}
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              animationDelay: enableAnimations ? `${i * 0.4 + 0.5}s` : undefined
            }}
            title={point.tooltip || `${point.label}: ${point.value}`}
            aria-label={`Data point for ${point.label}: ${point.value}`}
          />
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
        {data.map((point: ProgressDataPoint, index: number) => (
          <span key={point.label || `label-${index}`}>
            {point.label}
          </span>
        ))}
      </div>

      {/* Progress percentage indicator */}
      {showProgressPercentage && (
        <div className="mt-4 flex items-center justify-center">
          <div className="px-3 py-1 bg-lime-500/20 rounded-full text-lime-400 text-xs font-semibold">
            {progressText}
          </div>
        </div>
      )}
    </div>
  );
}; 