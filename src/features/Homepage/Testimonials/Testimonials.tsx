import { ArrowRight } from 'lucide-react';
import React from 'react';
import Section from '../../../components/UI/Section';
import { Button } from '../../../features/shared/Button';
import { TestimonialCard } from './components/TestimonialCard';
import './Testimonials.scss';
import { TestimonialsProps } from './types';

/**
 * Testimonials component - Displays user testimonials in a grid layout
 */
export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials = [],
  variant = 'default',
  id = 'testimonials',
  className = ''
}) => {
  // Default testimonials if none provided from props
  const defaultTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marathon Runner',
      quote: 'This AI workout generator transformed my training routine. I\'ve seen more progress in 3 months than in my previous year of self-guided workouts.',
      rating: 5
    },
    {
      id: 2,
      name: 'Mike Reynolds',
      role: 'Busy Professional',
      quote: 'With my hectic schedule, I never had time to plan effective workouts. Now I get personalized routines that fit perfectly into my day.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emma Chen',
      role: 'Fitness Enthusiast',
      quote: 'The variety keeps me engaged and motivated. I\'ve discovered exercises I never would have tried on my own, and my results speak for themselves.',
      rating: 4
    }
  ];

  // Generate variant-specific accent color
  const getAccentClass = () => {
    switch (variant) {
      case 'gym':
        return 'text-lime-300';
      case 'sports':
        return 'text-cyan-300';
      case 'wellness':
        return 'text-violet-300';
      case 'modern':
        return 'text-amber-300';
      default:
        return 'text-accent-500';
    }
  };

  // Convert our variant to the Section component's accepted VariantKey type
  const getSectionVariant = () => {
    switch (variant) {
      case 'wellness':
      case 'classic':
      case 'minimalist':
        return 'default';
      default:
        return variant;
    }
  };

  return (
      <Section
          id={id}
          className={`testimonials-section ${className}`}
          variant={getSectionVariant()}
          spacing="lg"
          backgroundVariant="default"
          backgroundClass="bg-gray-900"
    >
          <div className="text-center mb-16" data-aos="fade-up">
              <span
                  className="text-xs font-bold tracking-widest uppercase mb-2 block"
                  style={{ color: '#ddff0e' }}
        >
                  SUCCESS STORIES
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  What Our <span className={getAccentClass()}>Athletes</span> Say
              </h2>
              <p
                  className="text-gray-300 max-w-2xl mx-auto text-center mb-0"
                  style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}
        >
                  Real results from everyday athletes like you
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {defaultTestimonials.map((testimonial, index) => (
                  <div
                      key={testimonial.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
          >
                      <TestimonialCard
                          name={testimonial.name}
                          role={testimonial.role}
                          quote={testimonial.quote}
                          avatar={testimonial.avatar}
                          variant={variant}
                          index={index}
            />
                  </div>
        ))}
          </div>

          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
              <Button
                  variant="link"
                  href="#"
                  className="inline-flex items-center font-medium transition-colors text-gray-300 testimonials-readmore-btn"
        >
                  Read More Success Stories
                  <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
          </div>
      </Section>
  );
};

export default Testimonials; 