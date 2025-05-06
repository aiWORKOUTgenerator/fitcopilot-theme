export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  rating?: number;
}

/**
 * Props for the Testimonials component
 */
export interface TestimonialsProps {
  /**
   * Array of testimonials to display
   */
  testimonials?: Testimonial[];

  /**
   * Theme variant to use for styling
   */
  variant?: 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

  /**
   * Optional custom ID for the section
   */
  id?: string;

  /**
   * Optional custom class name for additional styling
   */
  className?: string;
} 