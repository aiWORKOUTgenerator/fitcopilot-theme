export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsProps {
  testimonials?: Testimonial[];
} 