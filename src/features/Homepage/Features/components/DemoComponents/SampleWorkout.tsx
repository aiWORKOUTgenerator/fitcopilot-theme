import { CheckCircle } from 'lucide-react';
import React from 'react';
import { DEFAULT_WORKOUT_EXERCISES } from '../../constants';
import { WorkoutExercise } from '../../types';
import { SampleWorkoutProps } from './types';

/**
 * SampleWorkout component for displaying a list of workout exercises
 * Shows exercise names, sets/reps, and completion status with AI optimization note
 * 
 * @param props - SampleWorkout component props
 * @returns JSX.Element - Rendered sample workout component
 * 
 * @example
 * ```tsx
 * <SampleWorkout
 *   exercises={workoutData}
 *   variant="gym"
 *   showOptimizationNote={true}
 * />
 * ```
 */
export const SampleWorkout: React.FC<SampleWorkoutProps> = ({
  exercises = DEFAULT_WORKOUT_EXERCISES,
  variant = 'default',
  className = '',
  style = {},
  showOptimizationNote = true,
  optimizationNote = '* AI-optimized for your full fitness profile',
  maxHeight = 'auto',
  showCompletionStatus = true
}) => {
  // Container classes
  const containerClasses = [
    'sample-workout',
    'text-white',
    'h-full',
    'w-full',
    'flex',
    'flex-col',
    'overflow-hidden',
    className
  ].filter(Boolean).join(' ');

  // Get completion statistics
  const completedCount = exercises.filter(exercise => exercise.completed).length;
  const totalCount = exercises.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div 
      className={containerClasses}
      style={{ ...style, maxHeight }}
      data-variant={variant}
      role="region"
      aria-label="Sample workout exercises"
    >
      {/* Exercise list */}
      <ul 
        className="space-y-2 text-xs flex-1 overflow-y-auto pr-2"
        role="list"
        aria-label={`Workout exercises, ${completedCount} of ${totalCount} completed`}
      >
        {exercises.map((exercise: WorkoutExercise, index: number) => (
          <li 
            key={`exercise-${index}`}
            className="flex items-start"
            role="listitem"
          >
            {/* Completion status icon */}
            {showCompletionStatus && (
              <CheckCircle 
                size={12} 
                className={`mr-2 mt-0.5 flex-shrink-0 transition-colors ${
                  exercise.completed 
                    ? 'text-lime-300' 
                    : 'text-gray-500'
                }`}
                aria-hidden="true"
              />
            )}
            
            {/* Exercise details */}
            <div className="flex-1">
              <span 
                className={`font-medium transition-colors ${
                  exercise.completed 
                    ? 'text-white' 
                    : 'text-gray-300'
                }`}
              >
                {exercise.name}
              </span>
              <p className="text-gray-300 text-[10px] mt-0.5">
                {exercise.sets}
              </p>
              
              {/* Exercise category */}
              {exercise.category && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px] text-gray-500 uppercase tracking-wide">
                    {exercise.category}
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* AI optimization note */}
      {showOptimizationNote && (
        <div className="mt-2 pt-1 border-t border-white/10 text-[8px] text-gray-400/70">
          <p className="italic text-[7px]">
            {optimizationNote}
          </p>
          
          {/* Completion progress */}
          {showCompletionStatus && totalCount > 0 && (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[7px] text-gray-500">
                Progress: {completedCount}/{totalCount}
              </span>
              <span className="text-[7px] text-lime-400 font-medium">
                {completionPercentage}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 