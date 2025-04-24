// src/features/Homepage/Features/Features.tsx

import { Activity, Apple, BarChart3, Bike, CheckCircle, Coffee, Dumbbell, Flame, Footprints, Heart, HeartHandshake, Medal, Pause, Play, Timer } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import './Features.scss';
import FeatureCard from './components/FeatureCard';
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
  Icon: React.ElementType;
  size: number;
  left: number;
  top: number;
  delay: number;
  speed: number;
}

/**
 * Features section component
 */
export const Features: React.FC<FeaturesProps> = ({
  features: _features = [],
  variant: _variant = 'default'
}) => {
  // Only tracking currentDemoIndex since hoveredIndex isn't being used
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const featureItems: Feature[] = [
    {
      icon: <BarChart3 size={48} className="text-lime-300 group-hover:scale-110 transition-transform duration-300" />,
      title: "Customized Workouts",
      description: "Dynamic plans personalized to your fitness goals and equipment.",
      gradient: "from-lime-300/20 to-emerald-500/20",
      demoComponent: <SampleWorkout />
    },
    {
      icon: <Activity size={48} className="text-lime-300 group-hover:scale-110 transition-transform duration-300" />,
      title: "Real-Time Tracking",
      description: "Instantly monitor and visualize your progress and achievements.",
      gradient: "from-lime-300/20 to-cyan-500/20",
      demoComponent: <ProgressChart />
    },
    {
      icon: <HeartHandshake size={48} className="text-lime-300 group-hover:scale-110 transition-transform duration-300" />,
      title: "Expert Advice",
      description: "Receive guidance and tips from professional fitness experts.",
      gradient: "from-lime-300/20 to-purple-500/20",
      demoComponent: <VideoPlayer />
    }
  ];

  const floatingIcons: FloatingIconData[] = [
    { Icon: Dumbbell, size: 24, left: 5, top: 15, delay: 0, speed: 8 },
    { Icon: Timer, size: 32, left: 15, top: 60, delay: 1.5, speed: 10 },
    { Icon: Medal, size: 28, left: 25, top: 25, delay: 0.8, speed: 12 },
    { Icon: Flame, size: 36, left: 80, top: 20, delay: 2, speed: 9 },
    { Icon: Heart, size: 28, left: 85, top: 65, delay: 1, speed: 11 },
    { Icon: Apple, size: 24, left: 10, top: 80, delay: 2.5, speed: 10 },
    { Icon: Coffee, size: 20, left: 70, top: 10, delay: 0.5, speed: 7 },
    { Icon: Footprints, size: 32, left: 90, top: 40, delay: 1.2, speed: 9 },
    { Icon: Bike, size: 36, left: 30, top: 70, delay: 1.8, speed: 13 }
  ];

  // Handle hover over features
  const handleFeatureHover = (index: number) => {
    setActiveFeatureIndex(index);

    // Auto-play video when hovering Expert Advice
    if (index === 2 && videoRef.current) {
      videoRef.current.play().catch(e => {
        console.error("Video autoplay failed:", e);
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
    <section
      className="features-section w-full py-16 md:pt-8 md:pb-24 px-4 bg-gray-900 overflow-hidden relative"
      aria-labelledby="features-heading"
    >
      {/* Create a visual connector from Hero to Features */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent z-0"></div>

      {/* Background Grid Pattern - Removed (using global grid) */}

      {/* Floating fitness icons - decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {floatingIcons.map((icon, index) => (
          <FloatingIcon
            key={index}
            left={icon.left}
            top={icon.top}
            delay={icon.delay}
            speed={icon.speed}
          >
            <icon.Icon size={icon.size} />
          </FloatingIcon>
        ))}
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-block mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">Fitness Evolution</span>
          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white">
            Innovative Features <br />
            <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient" data-text="Tailored for You">Tailored for You</span>
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureItems.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              demoComponent={index === 2 ? <VideoPlayer ref={videoRef} /> : feature.demoComponent}
              isActive={activeFeatureIndex === index}
              onMouseEnter={() => handleFeatureHover(index)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-16">
          <a
            href="https://aigymengine.com/workout-generator-registration"
            className="inline-flex items-center justify-center bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg shadow-lime-300/30 transition-all duration-300 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-gray-900 button primary"
            aria-label="Start your fitness journey"
          >
            Start Your Fitness Journey
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
