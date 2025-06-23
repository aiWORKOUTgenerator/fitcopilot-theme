import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Section from '../../../components/UI/Section';
import type { GlobalVariantKey } from '../types/shared';
import { TestimonialCard } from './components/TestimonialCard';
import TestimonialsCTA from './components/TestimonialsCTA';
import { defaultTestimonials } from './data/testimonials';
import './Testimonials.scss';

interface TestimonialsProps {
  variant?: GlobalVariantKey;
  className?: string;
}

/**
 * Testimonials component - Displays user testimonials in a grid layout
 */
export function Testimonials({ variant = 'default', className = '' }: TestimonialsProps) {
  // State for testimonials data from WordPress
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carousel state management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Fetch testimonials data from WordPress
  useEffect(() => {
    const fetchTestimonials = () => {
      try {
        // Try to get data from WordPress localized script
        if (typeof window !== 'undefined' && (window as any).fitcopilotTestimonialsData) {
          const wpData = (window as any).fitcopilotTestimonialsData;
          logger.info('Testimonials data from WordPress:', wpData);
          
          if (wpData.testimonials && wpData.testimonials.length > 0) {
            // Filter only active testimonials
            const activeTestimonials = wpData.testimonials.filter((t: any) => t.active !== false);
            setTestimonials(activeTestimonials);
            logger.info(`Loaded ${activeTestimonials.length} active testimonials from WordPress`);
          } else {
            logger.warn('No testimonials found in WordPress data, using defaults');
            setTestimonials(defaultTestimonials);
          }
        } else if (typeof window !== 'undefined' && (window as any).athleteDashboardData?.wpData?.testimonialsData) {
          // Try alternative data source
          const wpData = (window as any).athleteDashboardData.wpData.testimonialsData;
          if (wpData.testimonials && wpData.testimonials.length > 0) {
            const activeTestimonials = wpData.testimonials.filter((t: any) => t.active !== false);
            setTestimonials(activeTestimonials);
            logger.info(`Loaded ${activeTestimonials.length} active testimonials from athlete dashboard data`);
          } else {
            setTestimonials(defaultTestimonials);
          }
        } else {
          logger.warn('WordPress testimonials data not found, using static defaults');
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        logger.error('Error loading testimonials:', error);
        setTestimonials(defaultTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    // Try immediate fetch
    fetchTestimonials();

    // Also listen for WordPress data to be available
    const checkForData = setInterval(() => {
      if (typeof window !== 'undefined' && 
          ((window as any).fitcopilotTestimonialsData || (window as any).athleteDashboardData?.wpData?.testimonialsData)) {
        clearInterval(checkForData);
        fetchTestimonials();
      }
    }, 100);

    // Clean up interval after 5 seconds max
    setTimeout(() => clearInterval(checkForData), 5000);

    return () => clearInterval(checkForData);
  }, []);

  // Responsive configuration
  const getCarouselConfig = () => {
    if (windowWidth < 768) {
      return { itemsVisible: 1, itemsToScroll: 1 };
    }
    return { itemsVisible: 3, itemsToScroll: 1 };
  };

  const config = getCarouselConfig();
  const maxIndex = Math.max(0, testimonials.length - config.itemsVisible);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Auto-reset index if it exceeds bounds after resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  // Navigation functions
  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.max(0, prev - config.itemsToScroll));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.min(maxIndex, prev + config.itemsToScroll));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(Math.min(maxIndex, Math.max(0, index)));
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Navigation visibility
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  // Generate variant-specific accent color
  const _getAccentClass = (variantKey: GlobalVariantKey): string => {
    switch (variantKey) {
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
  const getSectionVariant = (): 'default' | 'gym' | 'sports' | 'modern' | 'registration' => {
    switch (variant) {
    case 'wellness':
    case 'classic':
    case 'minimalist':
    case 'boutique':
    case 'mobile':
      return 'default';
    case 'gym':
      return 'gym';
    case 'sports':
      return 'sports';
    case 'modern':
      return 'modern';
    case 'registration':
      return 'registration';
    default:
      return 'default';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Section
        variant={getSectionVariant()}
        containerSize="xl"
        spacing="lg"
        className={`testimonials-section ${className}`}
        data-variant={variant}
      >
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section
      variant={getSectionVariant()}
      containerSize="xl"
      spacing="lg"
      className={`testimonials-section ${className}`}
      data-variant={variant}
    >
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm font-bold tracking-wider text-accent-500 uppercase">
            Success Stories
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Real Results from Real People
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Join thousands who've transformed their fitness journey with our personalized workout programs.
        </p>
        
        {/* Debug info for admin */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-800 rounded text-sm text-gray-300">
            <p>Debug: {testimonials.length} testimonials loaded</p>
            <p>Data source: {typeof window !== 'undefined' && (window as any).fitcopilotTestimonialsData ? 'WordPress Database' : 'Static Fallback'}</p>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="testimonials-carousel-container">
        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          disabled={!canGoPrevious || isAnimating}
          className={`testimonials-nav testimonials-nav--prev ${!canGoPrevious ? 'testimonials-nav--disabled' : ''}`}
          aria-label="Previous testimonials"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          disabled={!canGoNext || isAnimating}
          className={`testimonials-nav testimonials-nav--next ${!canGoNext ? 'testimonials-nav--disabled' : ''}`}
          aria-label="Next testimonials"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel Track */}
        <div className="testimonials-carousel">
          <div 
            className="testimonials-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / config.itemsVisible)}%)`,
              transition: isAnimating ? 'transform 0.3s ease-in-out' : 'none'
            }}
          >
            {testimonials.map((testimonial: any, index: number) => (
              <div
                key={testimonial.id}
                className="testimonial-slide"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <TestimonialCard
                  name={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                  avatar={testimonial.avatar}
                  variant={variant === 'gym' || variant === 'sports' || variant === 'wellness' || variant === 'modern' || variant === 'classic' || variant === 'minimalist' ? variant : 'default'}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="testimonials-indicators">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`testimonials-indicator ${index === currentIndex ? 'testimonials-indicator--active' : ''}`}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16">
        <TestimonialsCTA
          text="Start Your Journey"
          href="#journey"
          showIcon={true}
          testimonialType="success"
          variant={variant === 'gym' || variant === 'sports' || variant === 'wellness' ? variant : 'default'}
        />
      </div>
    </Section>
  );
}

export default Testimonials; 