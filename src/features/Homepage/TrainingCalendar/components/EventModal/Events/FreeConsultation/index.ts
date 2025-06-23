/**
 * Free Consultation Event Module
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Export configuration
export { FreeConsultationConfig } from './FreeConsultationConfig';

// Export validator functions
export {
  getConsultationSpecificErrors, isFreeConsultation, validateFreeConsultation
} from './FreeConsultationValidator';

// Export complete module and helpers
export {
  FreeConsultationModule, getFreeConsultationFormConfig, isFreeConsultationEvent
} from './FreeConsultationModule';
