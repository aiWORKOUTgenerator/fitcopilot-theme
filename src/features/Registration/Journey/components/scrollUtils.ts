/**
 * Re-export scroll utilities from the consolidated module
 * 
 * @deprecated Use the consolidated scrollUtils from src/features/Registration/utils/scrollUtils.ts instead
 */

import {
  adjustScrollAfterExpand,
  calculateDynamicOffset,
  ensureDropdownContentVisible,
  getFixedHeaderHeight,
  isElementFullyVisible,
  isElementInViewport,
  scrollToElement,
  throttle
} from '../../utils/scrollUtils';

// Re-export all utilities
export {
  adjustScrollAfterExpand, calculateDynamicOffset, ensureDropdownContentVisible, getFixedHeaderHeight, isElementFullyVisible, isElementInViewport, scrollToElement, throttle
};

// Export Journey-specific helpers
export const scrollToJourneyStep = (stepIndex: number, offset = 20): void => {
  scrollToElement(`journey-step-${stepIndex}`, offset);
};

export const scrollToExpandedContent = (stepIndex: number, offset = 20): void => {
  scrollToElement(`step-content-${stepIndex}`, offset);
};

export const scrollToAccordionSection = (sectionId: string, offset = 20): void => {
  scrollToElement(`accordion-section-${sectionId}`, offset);
}; 