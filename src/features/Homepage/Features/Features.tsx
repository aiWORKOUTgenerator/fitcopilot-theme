// src/features/Homepage/Features/Features.tsx

import { Activity, Brain, CheckCircle, Dumbbell, Heart, LineChart, Pause, Play, Shield, Zap } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import './Features.scss';
import FeatureCard from './components/FeatureCard';

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
 * Video player component for the Expert Advice feature
 */
export const VideoPlayer = forwardRef<HTMLVideoElement>((_, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Update play state when video state changes
  useEffect(() => {
    const videoElement = ref as React.RefObject<HTMLVideoElement>;
    if (!videoElement.current) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.current.addEventListener('play', handlePlay);
    videoElement.current.addEventListener('pause', handlePause);

    return () => {
      if (videoElement.current) {
        videoElement.current.removeEventListener('play', handlePlay);
        videoElement.current.removeEventListener('pause', handlePause);
      }
    };
  }, [ref]);

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={ref}
          src="/wp-content/themes/athlete-dashboard-gym-engine/assets/videos/Mission-Bay-Footage.mp4"
          className="h-full w-full object-cover rounded-md"
          muted
          loop
          playsInline
        />

        {/* Overlay with play/pause button */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
          <button
            className="h-12 w-12 rounded-full bg-violet-500/80 flex items-center justify-center hover:bg-violet-600/80 transition-colors"
            onClick={() => {
              const videoElement = ref as React.RefObject<HTMLVideoElement>;
              if (videoElement.current) {
                if (isPlaying) {
                  videoElement.current.pause();
                } else {
                  videoElement.current.play().catch(console.error);
                }
              }
            }}
          >
            {isPlaying ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white ml-1" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="video-progress">
          <div
            className={`video-progress-bar ${isPlaying ? 'animate-progress' : ''}`}
            style={{
              width: isPlaying ? 'auto' : '0%'
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{isPlaying ? "2:34" : "0:00"}</span>
          <span>5:00</span>
        </div>
      </div>
    </div>
  );
});

// Add display name for forwarded ref component
VideoPlayer.displayName = 'VideoPlayer';

/**
 * Feature Data Interface
 */
interface FeatureData {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Props for the Features component
 */
interface FeaturesProps {
  className?: string;
}

/**
 * Features Section Component
 * 
 * Displays key features of the application in a grid layout
 */
const Features: React.FC<FeaturesProps> = ({ className = '' }) => {
  // Feature data
  const features: FeatureData[] = [
    {
      id: 'ai-powered',
      icon: <Brain size={24} />,
      title: 'AI-Powered Workouts',
      description: 'Our advanced AI analyzes your goals, fitness level, and preferences to create personalized workout plans.'
    },
    {
      id: 'expert-designed',
      icon: <Shield size={24} />,
      title: 'Expert Designed',
      description: 'All workout templates are created and verified by certified fitness professionals for safety and effectiveness.'
    },
    {
      id: 'progress-tracking',
      icon: <LineChart size={24} />,
      title: 'Progress Tracking',
      description: 'Track your improvements over time with detailed analytics and performance metrics.'
    },
    {
      id: 'exercise-library',
      icon: <Dumbbell size={24} />,
      title: 'Extensive Exercise Library',
      description: 'Access our database of 1000+ exercises with detailed instructions, videos, and form guidance.'
    },
    {
      id: 'quick-workouts',
      icon: <Zap size={24} />,
      title: 'Quick Workouts',
      description: 'Short on time? Generate effective workouts that fit your schedule, even if you only have 15 minutes.'
    },
    {
      id: 'adaptive',
      icon: <Activity size={24} />,
      title: 'Adaptive Training',
      description: 'Our system learns from your feedback and adjusts future workouts to match your progress and preferences.'
    }
  ];

  // Using both CSS classes and Tailwind classes for flexibility
  return (
    <section className={`features-section features-section-tw bg-ui-background ${className}`}>
      <div className="features-container container mx-auto px-4">
        <h2 className="section-title text-4xl font-bold text-text-primary mb-4 text-center">
          Powerful <span className="highlight text-accent-400">Features</span> for Your Fitness Journey
        </h2>

        <p className="section-description text-text-secondary max-w-3xl mx-auto mb-16 text-center">
          Our platform offers everything you need to succeed on your fitness journey with personalized workouts and expert guidance.
        </p>

        <div className="features-divider w-24 h-1 bg-gradient-to-r from-accent-400 to-accent-500 mx-auto mb-16 rounded-full"></div>

        <div className="features-grid features-grid-tw">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
