/**
 * Map Testimonials variant to ThemeContext theme
 * @param variant Testimonials variant
 * @returns the corresponding theme name
 */
export const mapVariantToTheme = (variant?: string): string => {
  switch (variant) {
  case 'gym':
    return 'gym';
  case 'sports':
    return 'sports';
  case 'wellness':
    return 'wellness';
  case 'modern':
    return 'modern';
  default:
    return 'default';
  }
};

/**
 * Map testimonial type to button variant
 * @param testimonialType testimonial type 
 * @returns the corresponding button variant
 */
export const mapTestimonialTypeToVariant = (testimonialType?: string): 'athlete' | 'professional' | 'enthusiast' | 'success' => {
  switch (testimonialType) {
  case 'professional':
    return 'professional';
  case 'enthusiast':
    return 'enthusiast';
  case 'success':
    return 'success';
  default:
    return 'athlete';
  }
}; 