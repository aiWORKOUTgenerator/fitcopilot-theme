/**
 * Theme Test Data
 * 
 * This file provides standardized test data for component stories,
 * ensuring consistency when testing theme support.
 */

import { ThemeOption } from '../../utils/theming';

/**
 * Sample text content for testing text-based components
 */
export const sampleText = {
  shortText: 'Sample text for testing',
  paragraph: 'This is a sample paragraph for testing components with longer text content. It includes multiple sentences to properly test how text wrapping and line height are affected by different themes.',
  heading: 'Component Heading',
  subheading: 'Component Subheading Text',
  label: 'Input Label',
  placeholder: 'Enter text here...',
  buttonText: 'Click Me',
  linkText: 'Learn More',
  errorText: 'This field is required',
  successText: 'Successfully submitted!',
};

/**
 * Sample image URLs for testing media components
 */
export const sampleImages = {
  square: 'https://via.placeholder.com/300',
  rectangle: 'https://via.placeholder.com/600x400',
  portrait: 'https://via.placeholder.com/300x500',
  landscape: 'https://via.placeholder.com/500x300',
  avatar: 'https://via.placeholder.com/150',
  icon: 'https://via.placeholder.com/24',
};

/**
 * Sample form data for testing form components
 */
export const sampleFormData = {
  text: 'Sample text input',
  email: 'user@example.com',
  password: 'password123',
  number: 42,
  date: '2023-07-15',
  options: ['Option 1', 'Option 2', 'Option 3'],
  selected: 'Option 2',
  checked: true,
};

/**
 * Sample user data for testing user-related components
 */
export const sampleUserData = {
  id: 'user-123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatar: sampleImages.avatar,
  role: 'Member',
  joined: '2023-01-15',
  status: 'active',
};

/**
 * Content examples for each theme to test theme-specific content
 */
export const themeSpecificContent: Record<ThemeOption, {
  headline: string;
  subheading: string;
  callToAction: string;
  icon: string;
}> = {
  default: {
    headline: 'Achieve Your Fitness Goals',
    subheading: 'Personalized workouts for everyone',
    callToAction: 'Get Started',
    icon: '💪',
  },
  gym: {
    headline: 'Power Through Your Limits',
    subheading: 'Expert-designed gym workouts',
    callToAction: 'Join Now',
    icon: '🏋️',
  },
  sports: {
    headline: 'Train Like an Athlete',
    subheading: 'Sport-specific training programs',
    callToAction: 'Start Training',
    icon: '🏅',
  },
  wellness: {
    headline: 'Balance Mind and Body',
    subheading: 'Holistic wellness practices',
    callToAction: 'Find Balance',
    icon: '🧘',
  },
  nutrition: {
    headline: 'Fuel Your Performance',
    subheading: 'Nutrition plans for your goals',
    callToAction: 'Eat Better',
    icon: '🥗',
  },
};

/**
 * Standard test states for interactive components
 */
export const componentStates = {
  default: { label: 'Default State' },
  hover: { label: 'Hover State', pseudoClass: ':hover' },
  active: { label: 'Active State', pseudoClass: ':active' },
  focus: { label: 'Focus State', pseudoClass: ':focus' },
  disabled: { label: 'Disabled State', disabled: true },
  loading: { label: 'Loading State', loading: true },
  error: { label: 'Error State', error: true },
  success: { label: 'Success State', success: true },
};

/**
 * Sample workout data for fitness-specific components
 */
export const sampleWorkoutData = {
  id: 'workout-123',
  name: 'Full Body Strength',
  duration: '45 min',
  difficulty: 'Intermediate',
  type: 'Strength',
  calories: 320,
  exercises: [
    { name: 'Push-ups', sets: 3, reps: 12 },
    { name: 'Squats', sets: 3, reps: 15 },
    { name: 'Plank', sets: 3, duration: '30 sec' },
  ],
};

/**
 * Full set of test data to use in stories that need comprehensive testing
 */
export const themeTestKit = {
  text: sampleText,
  images: sampleImages,
  formData: sampleFormData,
  userData: sampleUserData,
  themeContent: themeSpecificContent,
  states: componentStates,
  workoutData: sampleWorkoutData,
}; 