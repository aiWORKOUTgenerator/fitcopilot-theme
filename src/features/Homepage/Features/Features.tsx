// src/features/Homepage/Features/Features.tsx

import { Activity, Apple, BarChart3, Bike, CheckCircle, Coffee, Dumbbell, Flame, Footprints, Heart, HeartHandshake, LucideIcon, Medal, Pause, Play, Timer, UserPlus, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '../../../context/ThemeContext';
import logger from '../../../utils/logger';
import { ThemeOption } from '../../../utils/theming';
import FeatureButton from './components/FeatureButton';
import FeatureCard from './components/FeatureCard';
import './Features.scss';

// Define the variant type to match what's in FeatureCard
type VariantKey = 'default' | 'gym' | 'boutique' | 'modern' | 'wellness' | 'classic' | 'sports' | 'minimalist' | 'registration';

// Map VariantKey to ThemeOption for ThemeProvider
const mapVariantToTheme = (variant: VariantKey): ThemeOption => {
  // Direct mappings
  if (variant === 'default' || variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant;
  }
  
  // Custom mappings
  switch (variant) {
    case 'boutique': return 'wellness';
    case 'modern': return 'sports';
    case 'classic': return 'default';
    case 'minimalist': return 'default';
    case 'registration': return 'default';
    default: return 'default';
  }
};

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
const SampleWorkout: React.FC = () => {
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
const ProgressChart: React.FC = () => {
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
const VideoPlayer: React.FC<{ videoRef: React.RefObject<HTMLVideoElement> }> = ({ videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Update play state when video state changes
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [videoRef]);

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={videoRef}
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
              if (videoRef.current) {
                if (isPlaying) {
                  videoRef.current.pause();
                } else {
                  videoRef.current.play().catch(error => {
                    logger.error("Video playback failed:", error);
                  });
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
};

/**
 * Background video player component for the features section
 */
const BackgroundVideoPlayer: React.FC<{ onScrollToSplash: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void }> = ({ onScrollToSplash }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        logger.error("Background video autoplay failed:", e);
      });
    }
  }, [videoRef]);

  return (
    <div className="video-background relative w-full h-80 md:h-[500px] mt-20 mb-20 overflow-hidden rounded-xl">
      <video
        ref={videoRef}
        src="/wp-content/themes/fitcopilot/src/features/Homepage/Features/media/videos/Mission-Bay-Footage.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/30 flex items-center justify-center">
        <div className="text-center max-w-xl px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Experience Fitness Evolution</h3>
          <p className="text-gray-300 mb-6">Our technology adapts to your unique fitness journey, helping you achieve optimal results safely and efficiently.</p>

          <div className="features-cta">
            <FeatureButton
              variant="primary"
              size="large"
              className="inline-flex items-center rounded-full font-medium"
              leftIcon={<Zap className="features-icon" />}
              onClick={onScrollToSplash}
            >
              Get Started
            </FeatureButton>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Interface for floating icon data
 */
interface FloatingIconData {
  Icon: LucideIcon;
  size: number;
  left: number;
  top: number;
  delay: number;
  speed: number;
}

/**
 * Features section component
 */
interface FeaturesProps {
  variant?: VariantKey;
}

const Features: React.FC<FeaturesProps> = ({ variant = 'default' }) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const features = [
    {
      icon: <BarChart3 />,
      title: "Customized Workouts",
      description: "Dynamic plans personalized to your fitness goals and equipment.",
      gradient: "from-lime-300/20 to-emerald-500/20",
      demoComponent: <SampleWorkout />
    },
    {
      icon: <Activity />,
      title: "Real-Time Tracking",
      description: "Instantly monitor and visualize your progress and achievements.",
      gradient: "from-lime-300/20 to-cyan-500/20",
      demoComponent: <ProgressChart />
    },
    {
      icon: <HeartHandshake />,
      title: "Expert Advice",
      description: "Receive guidance and tips from professional fitness experts.",
      gradient: "from-lime-300/20 to-purple-500/20",
      demoComponent: <VideoPlayer videoRef={videoRef} />
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

  // Handle scroll to splash
  const handleScrollToSplash = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const splashSection = document.getElementById('splash-section');
    if (splashSection) {
      splashSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
      <section
        className="features-section w-full py-16 md:pt-8 md:pb-24 px-4 bg-gray-900 overflow-hidden relative"
        aria-labelledby="features-heading"
      >
        {/* Create a visual connector from Hero to Features */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent z-0"></div>

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
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">Fitness Evolution</span>
            <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white">
              Innovative Features <br />
              <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text" data-text="Tailored for You">Tailored for You</span>
            </h2>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                _gradient={feature.gradient}
                demoComponent={feature.demoComponent}
                _isActive={activeFeatureIndex === index}
                onMouseEnter={() => handleFeatureHover(index)}
                onMouseLeave={handleMouseLeave}
                variant={variant}
              />
            ))}
          </div>

          {/* Background video player */}
          <BackgroundVideoPlayer onScrollToSplash={handleScrollToSplash} />

          {/* CTA Button */}
          <div className="mt-16 text-center">
            <div className="inline-block w-3/4 md:w-1/2 mx-auto">
              <FeatureButton
                variant="primary"
                size="large"
                className="w-full"
                fullWidth
                leftIcon={<UserPlus className="features-icon" />}
                onClick={handleScrollToSplash}
              >
                Start Your Fitness Journey
              </FeatureButton>
            </div>
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
};

export default Features;
