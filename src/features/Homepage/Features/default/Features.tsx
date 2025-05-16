import { Activity, Apple, BarChart3, Bike, Coffee, Dumbbell, Flame, Footprints, Heart, HeartHandshake, Medal, Timer } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Section } from '../../../../components/shared';
import { FloatingIconData, renderFloatingIcon } from '../components';
import FeatureCard from '../components/FeatureCard';
import { ProgressChart, SampleWorkout, VideoPlayer } from '../components/FeatureCardDemos';
import '../Features.scss';
import { FeaturesProps } from '../types';

/**
 * Default Features component with flip cards
 */
const Features: React.FC<FeaturesProps> = ({ variant = 'default' }) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const features = [
    {
      icon: <span className="text-lime-300 group-hover:scale-110 transition-transform duration-300"><BarChart3 size={48} /></span>,
      title: "Customized Workouts",
      description: "Dynamic plans personalized to your fitness goals and equipment.",
      gradient: "from-lime-300/20 to-emerald-500/20",
      demoComponent: <SampleWorkout />
    },
    {
      icon: <span className="text-lime-300 group-hover:scale-110 transition-transform duration-300"><Activity size={48} /></span>,
      title: "Real-Time Tracking",
      description: "Instantly monitor and visualize your progress and achievements.",
      gradient: "from-lime-300/20 to-cyan-500/20",
      demoComponent: <ProgressChart />
    },
    {
      icon: <span className="text-lime-300 group-hover:scale-110 transition-transform duration-300"><HeartHandshake size={48} /></span>,
      title: "Expert Advice",
      description: "Receive guidance and tips from professional fitness experts.",
      gradient: "from-lime-300/20 to-purple-500/20",
      demoComponent: <VideoPlayer ref={videoRef} />
    }
  ];

  const floatingIcons: FloatingIconData[] = [
    { Icon: Dumbbell, size: 24, left: 5, top: 15, delay: 0, speed: 8, className: "text-primary-500 opacity-20" },
    { Icon: Timer, size: 32, left: 15, top: 60, delay: 1.5, speed: 10, className: "text-primary-500 opacity-20" },
    { Icon: Medal, size: 28, left: 25, top: 25, delay: 0.8, speed: 12, className: "text-primary-500 opacity-20" },
    { Icon: Flame, size: 36, left: 80, top: 20, delay: 2, speed: 9, className: "text-primary-500 opacity-20" },
    { Icon: Heart, size: 28, left: 85, top: 65, delay: 1, speed: 11, className: "text-primary-500 opacity-20" },
    { Icon: Apple, size: 24, left: 10, top: 80, delay: 2.5, speed: 10, className: "text-primary-500 opacity-20" },
    { Icon: Coffee, size: 20, left: 70, top: 10, delay: 0.5, speed: 7, className: "text-primary-500 opacity-20" },
    { Icon: Footprints, size: 32, left: 90, top: 40, delay: 1.2, speed: 9, className: "text-primary-500 opacity-20" },
    { Icon: Bike, size: 36, left: 30, top: 70, delay: 1.8, speed: 13, className: "text-primary-500 opacity-20" }
  ];

  // Handle hover over features
  const handleFeatureHover = (index: number) => {
    setActiveFeatureIndex(index);

    // Auto-play video when hovering Expert Advice
    if (index === 2 && videoRef.current) {
      videoRef.current.play().catch(e => {
        logger.error("Video autoplay failed:", e);
      });
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setActiveFeatureIndex(null);

    // Pause video when no longer hovering
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <Section
      id="features"
      variant={variant}
      backgroundVariant="grid"
      spacing="lg"
      className="features-section"
      aria-labelledby="features-heading"
      containerClassName="max-w-6xl text-center"
    >
      {/* Create a visual connector from Hero to Features */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent z-0"></div>

      {/* Floating fitness icons - decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {floatingIcons.map((icon, index) => renderFloatingIcon(icon, index))}
      </div>

      <div className="text-center mb-16">
        <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">Fitness Evolution</span>
        <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white">
          Innovative Features <br />
          <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient" data-text="Tailored for You">Tailored for You</span>
        </h2>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Map through features */}
        {features.map((feature, index) => (
          <div key={`feature-wrapper-${index}`}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              demoComponent={index === 2 ? <VideoPlayer ref={videoRef} /> : feature.demoComponent}
              isActive={activeFeatureIndex === index}
              onMouseEnter={() => handleFeatureHover(index)}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-16 text-center">
        <a
          href="https://aigymengine.com/workout-generator-registration"
          className="inline-flex items-center justify-center bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg shadow-lime-300/30 transition-all duration-300 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-gray-900 button primary"
          aria-label="Start your fitness journey"
        >
          Start Your Fitness Journey
        </a>
      </div>
    </Section>
  );
};

export default Features; 