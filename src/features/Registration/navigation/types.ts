/**
 * Navigation schema for the registration flow
 */

/**
 * Main registration steps
 */
export enum RegistrationStepId {
  SPLASH = 'splash',
  EXPERIENCE_LEVEL = 'experienceLevel',
  JOURNEY = 'journey',
  PRICING = 'pricing',
  PAYMENT = 'payment',
  CONFIRMATION = 'confirmation',
}

/**
 * Journey substeps
 */
export enum JourneySubstepId {
  GOALS = 'goals',
  EQUIPMENT = 'equipment',
  TIME_COMMITMENT = 'timeCommitment',
  MEDICAL = 'medical',
  ANALYTICS = 'analytics',
}

/**
 * Accordion sections within substeps
 */
export enum SectionId {
  // Equipment sections
  HOME_EQUIPMENT = 'homeEquipment',
  GYM_EQUIPMENT = 'gymEquipment',
  TRAVEL_EQUIPMENT = 'travelEquipment',
  
  // Time commitment sections
  DAYS = 'days',
  DURATION = 'duration',
  
  // Medical sections
  MEDICAL_CONDITIONS = 'medicalConditions',
  INJURIES = 'injuries',
  LIMITATIONS = 'limitations',
}

/**
 * Navigation hierarchy defines the relationship between steps, substeps, and sections
 */
export const NAVIGATION_HIERARCHY = {
  [RegistrationStepId.JOURNEY]: {
    substeps: [
      JourneySubstepId.GOALS,
      JourneySubstepId.EQUIPMENT,
      JourneySubstepId.TIME_COMMITMENT,
      JourneySubstepId.MEDICAL,
      JourneySubstepId.ANALYTICS,
    ],
    sections: {
      [JourneySubstepId.EQUIPMENT]: [
        SectionId.HOME_EQUIPMENT,
        SectionId.GYM_EQUIPMENT,
        SectionId.TRAVEL_EQUIPMENT,
      ],
      [JourneySubstepId.TIME_COMMITMENT]: [
        SectionId.DAYS,
        SectionId.DURATION,
      ],
      [JourneySubstepId.MEDICAL]: [
        SectionId.MEDICAL_CONDITIONS,
        SectionId.INJURIES,
        SectionId.LIMITATIONS,
      ],
    },
  },
};

/**
 * Map for special transition flows between steps
 */
export const STEP_TRANSITION_MAP = {
  [RegistrationStepId.SPLASH]: {
    next: RegistrationStepId.EXPERIENCE_LEVEL,
  },
  [RegistrationStepId.EXPERIENCE_LEVEL]: {
    next: RegistrationStepId.JOURNEY,
    prev: RegistrationStepId.SPLASH,
  },
  [RegistrationStepId.JOURNEY]: {
    next: RegistrationStepId.PRICING,
    prev: RegistrationStepId.EXPERIENCE_LEVEL,
  },
  [RegistrationStepId.PRICING]: {
    next: RegistrationStepId.PAYMENT,
    prev: RegistrationStepId.JOURNEY,
  },
  [RegistrationStepId.PAYMENT]: {
    next: RegistrationStepId.CONFIRMATION,
    prev: RegistrationStepId.PRICING,
  },
  [RegistrationStepId.CONFIRMATION]: {
    prev: null, // End of flow, no previous step
  },
};

/**
 * Progress tracking interfaces
 */
export interface StepProgress {
  completed: boolean;
  valid: boolean;
}

export interface NavigationState {
  currentStep: RegistrationStepId;
  currentSubstep?: JourneySubstepId;
  currentSection?: SectionId;
  stepProgress: Record<RegistrationStepId, StepProgress>;
  substepProgress: Record<JourneySubstepId, StepProgress>;
  sectionProgress: Record<SectionId, StepProgress>;
} 