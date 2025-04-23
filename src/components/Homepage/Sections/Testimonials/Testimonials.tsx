import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  image: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, title, image, rating }) => {
  return (
    <div className="testimonial-card bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700 flex flex-col h-full">
      {/* Rating */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={`${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} mr-1`}
          />
        ))}
      </div>
      
      {/* Quote */}
      <div className="relative mb-6 flex-1">
        <Quote size={24} className="testimonial-quote absolute -top-2 -left-1 transform -scale-x-100" />
        <p className="text-gray-300 text-sm md:text-base relative z-10 pl-6">
          {quote}
        </p>
      </div>
      
      {/* Profile */}
      <div className="flex items-center mt-auto">
        <img 
          src={image} 
          alt={`${name}'s profile`} 
          className="testimonial-image mr-4"
        />
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-gray-400 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "This AI workout generator has completely transformed my fitness routine. The personalized plans perfectly match my goals and available equipment.",
      name: "Sarah Johnson",
      title: "Marathon Runner",
      image: "/wp-content/themes/fitcopilot/assets/images/testimonials/testimonial-1.jpg",
      rating: 5
    },
    {
      quote: "I was skeptical at first, but after trying the AI-generated workouts for a month, I've seen more progress than in the past year of training on my own.",
      name: "Michael Chen",
      title: "Software Engineer",
      image: "/wp-content/themes/fitcopilot/assets/images/testimonials/testimonial-2.jpg",
      rating: 5
    },
    {
      quote: "As a busy parent, I never have time to plan workouts. The AI creates perfect 20-minute routines I can do at home with minimal equipment.",
      name: "Emma Rodriguez",
      title: "Working Parent",
      image: "/wp-content/themes/fitcopilot/assets/images/testimonials/testimonial-3.jpg", 
      rating: 4
    },
    {
      quote: "The workout variety keeps me engaged and challenged. No more workout plateaus or boredom - each session feels fresh and effective.",
      name: "James Wilson",
      title: "Fitness Enthusiast",
      image: "/wp-content/themes/fitcopilot/assets/images/testimonials/testimonial-4.jpg",
      rating: 5
    },
    {
      quote: "I love how the AI adjusts as I progress. When exercises get too easy, it automatically increases the difficulty to keep challenging me.",
      name: "Aisha Patel",
      title: "Yoga Instructor",
      image: "/wp-content/themes/fitcopilot/assets/images/testimonials/testimonial-5.jpg",
      rating: 4
    },
    {
      quote: "After my injury, I needed safe workouts to rebuild strength. This platform created the perfect rehabilitation program for my specific needs.",
      name: "David Thompson",
      title: "Recovery Athlete",
      image: "/wp-content/themes/fitcopilot/assets/images/testimonials/testimonial-6.jpg",
      rating: 5
    }
  ];

  return (
    <section className="w-full py-20 px-4 bg-gray-900 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">Success Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            What Our <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Community Says</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Read how our AI-powered workouts are helping people transform their fitness journeys.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Testimonial {...testimonial} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="600">
          <a 
            href="https://builder.fitcopilot.ai/register" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-lg shadow-lime-300/30 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1"
          >
            Join Our Community
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;