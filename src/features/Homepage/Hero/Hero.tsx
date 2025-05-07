import { Dumbbell, Flame, Heart, LogIn, Shield, UserPlus, Zap } from 'lucide-react';
import React, { useEffect } from 'react';
import RegistrationButton from '../../../features/Registration/components/RegistrationButton';
import './Hero.scss';
import { FloatingIcons } from './components/FloatingIcons';
import { useTooltipAnimation } from './hooks';

interface HeroProps {
  registrationLink?: string;
  loginLink?: string;
  logoUrl?: string;
  onRegistrationStart?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  registrationLink = "#splash-section",
  loginLink = "#login",
  logoUrl = '/wp-content/themes/fitcopilot/assets/media/images/logo.png',
  onRegistrationStart
}) => {
  // Use the tooltip animation hook for managing tooltip states
  const {
    tooltipStates,
    clearAllTimeouts,
    handleMouseEnter,
    handleMouseLeave
  } = useTooltipAnimation();

  // On mount and unmount
  useEffect(() => {
    // Cleanup all timeouts on unmount
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Handle robust navigation to the splash section with fallbacks
  const handleScrollToSplash = (e: React.MouseEvent) => {
    e.preventDefault();

    // Option 1: Use onRegistrationStart callback if available (from Homepage component)
    if (onRegistrationStart) {
      console.log("Using registration start callback");
      onRegistrationStart();
      return;
    }

    // Option 2: Try to find and scroll to splash section by ID
    const splashSection = document.getElementById('splash-section');
    if (splashSection) {
      console.log("Found splash section, scrolling to it");
      splashSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Option 3: Navigate to the registration page directly
    console.log("Fallback: navigating to registration page");
    window.location.href = "/registration";
  };

  return (
    <section
      className="w-full min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-gray-900"
      aria-labelledby="hero-heading"
    >
      {/* Background Grid Pattern - Removed (using global grid) */}

      {/* Floating fitness icons - decorative */}
      <FloatingIcons />

      <div className="max-w-4xl mx-auto relative z-20 text-center">
        {/* Content Card with Backdrop Blur */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-700 mb-6">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src={logoUrl}
              alt="AI Workout Generator Logo"
              className="h-48 md:h-56 w-auto"
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
            Achieve your fitness goals with <span className="citron-text">customized plans</span> designed by AI and expert trainers.
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
              <button
                onClick={handleScrollToSplash}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
              >
                <Zap className="mr-2 h-5 w-5" />
                Get a Free Workout
              </button>

              {/* Tooltip - Updated to match Pricing */}
              <div className="tooltip-container">
                <div className={`tooltip ${tooltipStates.freeWorkout.show ? 'show' : 'hide'}`}>
                  <div className="tooltip-content">
                    <div className="tooltip-icon">
                      <Zap className="w-4 h-4 text-lime-300" />
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
              <button
                onClick={handleScrollToSplash}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gray-800 border-2 border-lime-300/30 text-white hover:bg-lime-300/10 hover:-translate-y-1 w-full sm:w-auto"
              >
                <UserPlus className="mr-2 h-5 w-5 text-lime-300" />
                Create Your Account
              </button>

              {/* Tooltip - Updated to match Pricing */}
              <div className="tooltip-container">
                <div className={`tooltip ${tooltipStates.createAccount.show ? 'show' : 'hide'}`}>
                  <div className="tooltip-content">
                    <div className="tooltip-icon">
                      <Shield className="w-4 h-4 text-lime-300" />
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

          {/* Divider between original and Button component implementation */}
          <div className="my-8 border-t border-gray-700"></div>

          {/* Alternative implementation using RegistrationButton component */}
          <div className="flex flex-col items-center">
            <p className="text-gray-400 mb-4 text-sm">Alternative implementation with component:</p>
            <div className="flex gap-4">
              <RegistrationButton
                onClick={handleScrollToSplash}
                variant="primary"
                size="large"
                className="bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <span className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Get a Free Workout
                </span>
              </RegistrationButton>
            </div>
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
      </div>
    </section>
  );
};

export default Hero;