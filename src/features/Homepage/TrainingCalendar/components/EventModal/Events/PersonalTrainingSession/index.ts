/**
 * Personal Training Session Event Module
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Export configuration
export { PersonalTrainingSessionConfig } from './PersonalTrainingSessionConfig';

// Export validator functions
export {
  getPersonalTrainingSpecificErrors, isPersonalTrainingSession, validatePersonalTrainingSession
} from './PersonalTrainingSessionValidator';

// Export complete module and helpers
export {
  PersonalTrainingSessionModule, getPersonalTrainingSessionFormConfig,
  getSuggestedPricing, isPersonalTrainingSessionEvent, isValidDuration
} from './PersonalTrainingSessionModule';
