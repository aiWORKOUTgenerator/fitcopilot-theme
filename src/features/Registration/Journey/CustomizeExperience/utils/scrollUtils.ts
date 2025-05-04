/**
 * Re-export scroll utilities from the consolidated module
 * 
 * @deprecated Use the consolidated scrollUtils from src/features/Registration/utils/scrollUtils.ts instead
 */

import {
    calculateDynamicOffset,
    getFixedHeaderHeight,
    isElementFullyVisible,
    scrollToAccordionSection,
    scrollToElement,
    throttle
} from '../../../utils/scrollUtils';

// Re-export all utilities
export {
    calculateDynamicOffset, getFixedHeaderHeight, isElementFullyVisible, scrollToAccordionSection, scrollToElement, throttle
};

