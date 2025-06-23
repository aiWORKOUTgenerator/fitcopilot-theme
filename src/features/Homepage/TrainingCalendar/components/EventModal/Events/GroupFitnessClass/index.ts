/**
 * Group Fitness Class Event Module
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Export configuration
export { GroupFitnessClassConfig } from './GroupFitnessClassConfig';

// Export validator functions
export {
  getGroupClassSpecificErrors, isGroupFitnessClass, validateGroupFitnessClass
} from './GroupFitnessClassValidator';

// Export complete module and helpers
export {
  GroupFitnessClassModule, getGroupFitnessClassFormConfig, isGroupFitnessClassEvent
} from './GroupFitnessClassModule';
