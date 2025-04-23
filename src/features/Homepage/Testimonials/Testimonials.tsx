import React, { useState } from 'react';
import './Testimonials.scss';
import { TestimonialsProps } from './types';
import { TestimonialCard } from './components/TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Testimonials component - Displays user testimonials
 */
export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
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
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === defaultTestimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? defaultTestimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="testimonials-section py-24 bg-[#151F38]" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            What Our <span className="text-[#CCFF00]">Users</span> Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real results from people just like you
          </p>
        </div>
        
        <div className="testimonials-slider relative max-w-4xl mx-auto">
          <div className="testimonials-track">
            {defaultTestimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`testimonial-slide transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}`}
              >
                <TestimonialCard
                  name={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                  avatar={testimonial.avatar}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-[#0B1121] border border-gray-700 hover:border-[#CCFF00] transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} className="text-gray-400" />
            </button>
            
            <div className="flex gap-2">
              {defaultTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === activeIndex ? 'bg-[#CCFF00]' : 'bg-gray-700'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-[#0B1121] border border-gray-700 hover:border-[#CCFF00] transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 