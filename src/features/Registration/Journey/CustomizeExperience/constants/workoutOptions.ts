/**
 * Exercise type options
 */
export interface ExerciseType {
    name: string;
    category: string;
    description?: string;
}

export const EXERCISE_TYPES: ExerciseType[] = [
  {
    name: 'Barbell Compound Exercises',
    category: 'strength',
    description: 'Squats, deadlifts, bench press, etc.'
  },
  {
    name: 'Dumbbell Exercises',
    category: 'strength',
    description: 'Versatile strength training with dumbbells'
  },
  {
    name: 'Kettlebell Movements',
    category: 'functional',
    description: 'Swings, cleans, snatches, etc.'
  },
  {
    name: 'Bodyweight Exercises',
    category: 'calisthenics',
    description: 'Push-ups, pull-ups, dips, etc.'
  },
  {
    name: 'Machine Exercises',
    category: 'strength',
    description: 'Guided movements on gym machines'
  },
  {
    name: 'Cardio Sessions',
    category: 'cardio',
    description: 'Running, cycling, rowing, etc.'
  },
  {
    name: 'HIIT Workouts',
    category: 'conditioning',
    description: 'High-intensity interval training'
  },
  {
    name: 'Mobility & Flexibility Work',
    category: 'recovery',
    description: 'Stretching, yoga, mobility drills'
  },
  {
    name: 'Olympic Lifts',
    category: 'strength',
    description: 'Clean and jerk, snatch'
  },
  {
    name: 'Pilates-Based Movements',
    category: 'core',
    description: 'Core-focused controlled movements'
  },
  {
    name: 'Plyometrics',
    category: 'power',
    description: 'Explosive movements like box jumps'
  },
  {
    name: 'Core-Focused Exercises',
    category: 'core',
    description: 'Planks, crunches, rotational movements'
  }
];

/**
 * Workout types
 */
export const WORKOUT_TYPES = [
  'HIIT',
  'Strength Training',
  'Circuit Training',
  'Endurance',
  'Flexibility',
  'Balanced'
];

/**
 * Body focus areas
 */
export const FOCUS_AREAS = [
  'Upper Body',
  'Lower Body',
  'Core',
  'Back',
  'Chest',
  'Arms',
  'Shoulders',
  'Legs',
  'Glutes',
  'Full Body',
  'Cardio Endurance',
  'Flexibility & Mobility'
]; 