// src/features/Homepage/Features/Features.tsx

import { Activity, Apple, BarChart3, Bike, CheckCircle, Coffee, Dumbbell, Flame, Footprints, Heart, HeartHandshake, Medal, Timer } from 'lucide-react';
import React, { useRef, useState } from 'react';
import './Features.scss';
import FeatureCard from './components/FeatureCard';
import VideoPlayer, { VideoSource } from './components/VideoPlayer';
import { FeaturesProps } from './types';

/**
 * Interface for floating icon props
 */
interface FloatingIconProps {
  children: React.ReactNode;
  delay: number;
  speed: number;
  left: number;
  top: number;
}

/**
 * Floating icon component for decorative background elements
 */
const FloatingIcon: React.FC<FloatingIconProps> = ({ children, delay, speed, left, top }) => {
  return (
    <div
      className="floating-icon"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        animation: `float ${speed}s ease-in-out infinite ${delay}s`
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

/**
 * Sample workout component for the Customized Workouts feature
 */
export const SampleWorkout: React.FC = () => {
  return (
    <div className="text-white h-full w-full flex flex-col overflow-hidden">
      <ul className="space-y-2 text-xs flex-1 overflow-y-auto pr-2">
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Goblet Squats</span>
            <p className="text-gray-300 text-[10px]">3 × 12 reps</p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Push-ups</span>
            <p className="text-gray-300 text-[10px]">3 × 15 reps</p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Walking Lunges</span>
            <p className="text-gray-300 text-[10px]">3 × 10 reps each</p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Kettlebell Swings</span>
            <p className="text-gray-300 text-[10px]">3 × 15 reps</p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Plank</span>
            <p className="text-gray-300 text-[10px]">3 × 45 seconds</p>
          </div>
        </li>
      </ul>
      <div className="mt-2 pt-1 border-t border-white/10 text-[8px] text-gray-400/70">
        <p className="italic text-[7px]">* AI-optimized for your full fitness profile</p>
      </div>
    </div>
  );
};

/**
 * Progress chart component for the Real-Time Tracking feature
 */
export const ProgressChart: React.FC = () => {
  return (
    <div className="text-white h-full w-full flex flex-col">
      <h4 className="text-cyan-300 text-sm font-bold mb-3">Weekly Progress</h4>

      <div className="flex-1 relative">
        {/* Chart grid */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-gray-700/30"
              style={{ top: `${20 * i}%` }}
            ></div>
          ))}
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-px bg-gray-700/30"
              style={{ left: `${100 / 6 * i}%` }}
            ></div>
          ))}
        </div>

        {/* Progress line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Animated progress path */}
          <path
            d="M0,80 C40,70 60,40 80,30 S120,50 140,40 S180,10 200,20"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="chart-line animate-draw-line drop-shadow-[0_0_3px_rgba(132,204,22,0.5)]"
          />

          {/* Heart at end of line */}
          <Heart
            size={16}
            className="text-rose-500 fill-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.5)] opacity-0 animate-heartbeat animate-heart-pulse animate-fade-in"
            style={{
              transform: 'translate(196px, 16px)',
              transformOrigin: 'center',
              animationDelay: '2.4s, 2.4s, 2.4s'
            }}
          />
        </svg>

        {/* Data points */}
        {[
          { x: 0, y: 80 },
          { x: 40, y: 70 },
          { x: 80, y: 30 },
          { x: 120, y: 50 },
          { x: 160, y: 60 },
          { x: 200, y: 20 }
        ].map((point, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 bg-gradient-to-br from-lime-400 to-cyan-400 rounded-full opacity-0 scale-0 animate-point-fade"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              animationDelay: `${i * 0.4 + 0.5}s`
            }}
          ></div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="px-3 py-1 bg-lime-500/20 rounded-full text-lime-400 text-xs font-semibold">
          +12% this week
        </div>
      </div>
    </div>
  );
};

/**
 * Interface for feature data
 */
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  demoComponent: React.ReactNode;
}

/**
 * Interface for floating icon data
 */
interface FloatingIconData {
  Icon: React.ComponentType<any>;
  size: number;
  left: number;
  top: number;
  delay: number;
  speed: number;
}

/**
 * Features component displaying key application capabilities
 */
export const Features: React.FC<FeaturesProps> = ({
  features: _features = [],
  variant: _variant = 'default'
}) => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Multiple video sources for better browser compatibility
  const primaryVideoSrc = './wp-content/uploads/2023/videos/Mission-Bay-Footage.mp4';

  // Formatted fallback sources with proper types
  const fallbackSources: VideoSource[] = [
    {
      src: '/wp-content/themes/fitcopilot/src/features/Homepage/Features/media/videos/Mission-Bay-Footage.mp4',
      type: 'video/mp4'
    },
    {
      src: '/wp-content/themes/fitcopilot/public/videos/Mission-Bay-Footage.mp4',
      type: 'video/mp4'
    }
  ];

  // Predefined features if none provided
  const defaultFeatures: Feature[] = [
    {
      icon: <Dumbbell size={32} className="text-white feature-icon" />,
      title: "AI Workout Generation",
      description: "Get personalized workout routines based on your goals, equipment, and fitness level.",
      gradient: "from-lime-400 to-emerald-600",
      demoComponent: <SampleWorkout />
    },
    {
      icon: <BarChart3 size={32} className="text-white feature-icon" />,
      title: "Real-Time Progress Tracking",
      description: "Track your fitness journey with detailed analytics and visualizations of your progress.",
      gradient: "from-cyan-400 to-blue-600",
      demoComponent: <ProgressChart />
    },
    {
      icon: <HeartHandshake size={32} className="text-white feature-icon" />,
      title: "Expert Advice & Form Tips",
      description: "Access professional guidance with video demonstrations and personalized form feedback.",
      gradient: "from-violet-400 to-purple-600",
      demoComponent: (
        <VideoPlayer
          ref={videoRef}
          src={primaryVideoSrc}
          fallbackSrc={fallbackSources}
          poster="/wp-content/uploads/2023/featured-images/fitness-video-poster.jpg"
          ariaLabel="Fitness expert demonstrating proper form techniques"
        />
      )
    },
  ];

  // Choose features to display - ensure all required props are provided if from props
  const features = _features.length > 0
    ? _features.map(feature => ({
      ...feature,
      gradient: feature.gradient || "from-accent-400 to-accent-600", // Default gradient if not provided
    }))
    : defaultFeatures;

  // Floating icon data
  const floatingIcons: FloatingIconData[] = [
    { Icon: Dumbbell, size: 24, left: 10, top: 20, delay: 0, speed: 5 },
    { Icon: Flame, size: 28, left: 85, top: 15, delay: 1.5, speed: 6 },
    { Icon: Footprints, size: 24, left: 75, top: 85, delay: 0.7, speed: 7 },
    { Icon: Medal, size: 20, left: 15, top: 70, delay: 2, speed: 5.5 },
    { Icon: Heart, size: 16, left: 45, top: 10, delay: 1, speed: 4 },
    { Icon: Bike, size: 28, left: 90, top: 50, delay: 0.5, speed: 6.5 },
    { Icon: Apple, size: 20, left: 5, top: 40, delay: 1.8, speed: 5 },
    { Icon: Activity, size: 24, left: 60, top: 95, delay: 1.3, speed: 7 },
    { Icon: Coffee, size: 18, left: 25, top: 5, delay: 0.3, speed: 4.5 },
    { Icon: Timer, size: 22, left: 80, top: 80, delay: 2.5, speed: 5.8 },
  ];

  // Handle feature hover
  const handleFeatureHover = (index: number) => {
    setActiveFeature(index);

    // Auto-play video when hovering Expert Advice
    if (index === 2 && videoRef.current) {
      videoRef.current.play().catch(e => {
        console.error("Video autoplay failed:", e);
      });
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setActiveFeature(null);

    // Pause video when no longer hovering
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section className="features-section py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Fitness With <span className="text-gradient">AI-Powered</span> Tools
          </h2>
          <p className="text-gray-300 text-lg">
            Our platform combines artificial intelligence with exercise science to deliver a personalized fitness experience.
          </p>
        </div>

        {/* Floating icons (decorative) */}
        {floatingIcons.map((icon, index) => (
          <FloatingIcon
            key={index}
            delay={icon.delay}
            speed={icon.speed}
            left={icon.left}
            top={icon.top}
          >
            <icon.Icon size={icon.size} />
          </FloatingIcon>
        ))}

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              demoComponent={feature.demoComponent}
              isActive={activeFeature === index}
              onMouseEnter={() => handleFeatureHover(index)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
