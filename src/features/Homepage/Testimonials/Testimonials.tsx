import React from 'react';
import { TestimonialCard } from './components/TestimonialCard';
import './Testimonials.scss';
import { TestimonialsProps } from './types';

/**
 * Testimonials component - Displays user testimonials in a grid layout
 */
export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = [] }) => {
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

  return (
    <section className="testimonials-section py-24 bg-[#151F38]" id="testimonials">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-xs font-bold tracking-widest uppercase text-[#CCFF00] mb-2 block">Success Stories</span>
          <h2 className="text-4xl font-bold mb-4 text-white">
            What Our <span className="text-[#CCFF00]">Athletes</span> Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
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
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
          <a href="#" className="inline-flex items-center text-[#CCFF00] hover:text-[#d9ff66] font-medium transition-colors">
            Read More Success Stories
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 