/**
 * Journey Component Spacing Constants
 * Standardized Tailwind utility classes for consistent spacing
 */

export const SPACING = {
  // Vertical spacing between elements
  VERTICAL: {
    XS: 'space-y-2', // 0.5rem, 8px
    SM: 'space-y-4', // 1rem, 16px
    MD: 'space-y-6 md:space-y-8', // 1.5rem→2rem
    LG: 'space-y-8 md:space-y-12', // 2rem→3rem
    XL: 'space-y-12 md:space-y-16', // 3rem→4rem
    JOURNEY_STEPS: 'space-y-6' // Standard spacing for connected steps
  },

  // Padding values
  PADDING: {
    SECTION: 'py-16 md:py-24', // Section vertical padding
    CONTAINER: 'px-4 md:px-6 lg:px-8', // Container horizontal padding
    CARD: 'p-4 md:p-6 lg:p-8', // Card all-sides padding
    STEP: 'py-4 md:py-6 px-4 md:px-6', // Step content padding without background
    FEATURE: 'p-3 md:p-4', // Feature card padding
    BUTTON: 'px-6 py-2', // Standard button padding
    CTA_BUTTON: 'px-8 py-4' // Call-to-action button padding
  },

  // Margin values
  MARGIN: {
    SECTION_HEADER: 'mb-12 md:mb-16', // Section header bottom margin
    COMPONENT_HEADER: 'mb-6 md:mb-8', // Component header bottom margin
    ELEMENT_HEADER: 'mb-2 md:mb-3', // Element header bottom margin
    CTA_SECTION: 'mt-12 md:mt-16' // Call-to-action section top margin
  },

  // Gap values for flex and grid layouts
  GAP: {
    XS: 'gap-2 md:gap-3', // Extra small gap
    SM: 'gap-3 md:gap-4', // Small gap
    MD: 'gap-4 md:gap-6', // Medium gap
    LG: 'gap-6 md:gap-8' // Large gap
  },

  // Compound layout classes
  LAYOUT: {
    SECTION_CONTAINER: 'container mx-auto px-4 md:px-6 lg:px-8', // Standard section container
    FEATURE_GRID: 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6', // Feature grid layout
    STEP_CONTENT: 'flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6', // Step content layout
    JOURNEY_CONTAINER: 'journey-timeline space-y-6' // Journey container with standard spacing
  }
};

export default SPACING; 