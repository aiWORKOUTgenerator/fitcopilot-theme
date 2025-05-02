import { Apple, Bike, Coffee, Dumbbell, Flame, Footprints, Heart, LogIn, Medal, Shield, Timer, UserPlus, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { VideoPlayer } from './components';
import './Hero.css';
import { HeroProps } from './types';

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

const Hero: React.FC<HeroProps> = ({
  registrationLink = "https://aigymengine.com/workout-generator-registration",
  loginLink = "https://aigymengine.com/react-login",
  variant = "default",
  logoUrl = '/wp-content/themes/fitcopilot/assets/media/images/logo.png',
  videoSrc,
  videoFallbackSrc,
  videoPoster,
  videoControls = true,
  videoAutoPlay = true,
}) => {
  // Animation states for tooltips
  const [tooltipStates, setTooltipStates] = useState({
    freeWorkout: {
      show: false,
      isAutoShow: false,
      isHovered: false,
    },
    createAccount: {
      show: false,
      isAutoShow: false,
      isHovered: false,
    }
  });

  // Animation timeline references
  const timeoutsRef = useRef<number[]>([]);

  // Clear all timeouts on cleanup
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  // Floating icons data
  const floatingIcons: FloatingIconData[] = [
    { Icon: Dumbbell, size: 28, left: 5, top: 15, delay: 0, speed: 8 },
    { Icon: Timer, size: 36, left: 15, top: 60, delay: 1.5, speed: 10 },
    { Icon: Medal, size: 32, left: 25, top: 25, delay: 0.8, speed: 12 },
    { Icon: Flame, size: 40, left: 80, top: 20, delay: 2, speed: 9 },
    { Icon: Heart, size: 32, left: 85, top: 65, delay: 1, speed: 11 },
    { Icon: Apple, size: 28, left: 10, top: 80, delay: 2.5, speed: 10 },
    { Icon: Coffee, size: 24, left: 70, top: 10, delay: 0.5, speed: 7 },
    { Icon: Footprints, size: 36, left: 90, top: 40, delay: 1.2, speed: 9 },
    { Icon: Bike, size: 40, left: 30, top: 70, delay: 1.8, speed: 13 }
  ];

  // On mount and unmount
  useEffect(() => {
    // Cleanup all timeouts on unmount
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Mouse enter handler
  const handleMouseEnter = (button: 'freeWorkout' | 'createAccount') => {
    setTooltipStates(prev => ({
      ...prev,
      [button]: {
        ...prev[button],
        show: true,
        isHovered: true,
      }
    }));
  };

  // Mouse leave handler
  const handleMouseLeave = (button: 'freeWorkout' | 'createAccount') => {
    setTooltipStates(prev => ({
      ...prev,
      [button]: {
        ...prev[button],
        show: false,
        isHovered: false,
      }
    }));
  };

  return (
    <section
      className="w-full min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-gray-900"
      aria-labelledby="hero-heading"
    >
      {/* Background Grid Pattern - Removed (using global grid) */}

      {/* Floating fitness icons - decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden="true">
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

      <div className="max-w-4xl mx-auto relative z-20 text-center">
        {/* Content Card with Backdrop Blur */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-700 mb-6">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/wp-content/themes/fitcopilot/assets/media/images/logo.png"
              alt="AI Workout Generator Logo"
              style={{ height: '150px', width: 'auto' }}
            />
          </div>

          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
          >
            <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient" data-text="AI-Powered Workouts">
              AI-Powered Workouts
            </span> Tailored Just for You
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-lime-300 to-emerald-400 mx-auto mb-6 rounded-full"></div>

          <p
            className="text-gray-300 mb-10 max-w-2xl mx-auto text-base md:text-xl lead"
          >
            Achieve your fitness goals with <span className="accent-text">customized plans</span> designed by AI and expert trainers.
          </p>

          {/* CTA Buttons Container */}
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-6"
          >
            {/* Primary CTA: Get a Free Workout */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('freeWorkout')}
              onMouseLeave={() => handleMouseLeave('freeWorkout')}
            >
              <a
                href="https://builder.fitcopilot.ai"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-optimized hover:shadow-optimized-hover hover:-translate-y-1 w-full sm:w-auto button primary hero-button"
              >
                <Zap className="mr-2 h-5 w-5" />
                Get a Free Workout
              </a>

              {/* Tooltip - Updated to match Pricing */}
              <div className="tooltip-container">
                <div className={`tooltip ${tooltipStates.freeWorkout.show ? 'show' : 'hide'}`}>
                  <div className="tooltip-content">
                    <div className="tooltip-icon">
                      <Zap className="w-4 h-4 accent-text" />
                    </div>
                    <div className="tooltip-text">
                      <h5 className="tooltip-title">Quick Workout Builder</h5>
                      <p className="text-xs text-gray-300">
                        Generate a personalized workout plan in seconds with our AI technology - no registration required.
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-800"></div>
                </div>
              </div>
            </div>

            {/* Secondary CTA: Create Your Account */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('createAccount')}
              onMouseLeave={() => handleMouseLeave('createAccount')}
            >
              <a
                href={registrationLink}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gray-800 border-2 border-lime-300/30 text-white hover:bg-lime-300/10 hover:-translate-y-1 w-full sm:w-auto button secondary hero-button"
              >
                <UserPlus className="mr-2 h-5 w-5 accent-text" />
                Create Your Account
              </a>

              {/* Tooltip - Updated to match Pricing */}
              <div className="tooltip-container">
                <div className={`tooltip ${tooltipStates.createAccount.show ? 'show' : 'hide'}`}>
                  <div className="tooltip-content">
                    <div className="tooltip-icon">
                      <Shield className="w-4 h-4 accent-text" />
                    </div>
                    <div className="tooltip-text">
                      <h5 className="tooltip-title">Member Benefits</h5>
                      <p className="text-xs text-gray-300">
                        Save workouts, track progress, and access premium features with your free account.
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-800"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div>
            <a
              href={loginLink}
              className="inline-flex items-center text-gray-400 hover:text-lime-300 transition-colors duration-300"
            >
              <LogIn size={16} className="mr-1" />
              Already have an account? Sign in
            </a>
          </div>
        </div>

        {/* Features Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center">
            <Dumbbell size={14} className="text-lime-300 mr-2" />
            <span>Personalized Workouts</span>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center">
            <Flame size={14} className="text-lime-300 mr-2" />
            <span>AI-Optimized Routines</span>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center">
            <Heart size={14} className="text-lime-300 mr-2" />
            <span>Expert Guidance</span>
          </div>
        </div>

        {/* Feature Video */}
        {videoSrc && (
          <div className="mt-10 max-w-3xl mx-auto">
            <VideoPlayer
              src={videoSrc}
              fallbackSrc={videoFallbackSrc}
              poster={videoPoster}
              controls={videoControls}
              autoPlay={videoAutoPlay}
              muted={true}
              loop={true}
              ariaLabel="Demonstration of AI Workout Generator features"
              className="hero-video"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;