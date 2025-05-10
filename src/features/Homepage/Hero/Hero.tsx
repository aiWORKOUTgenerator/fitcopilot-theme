import { Dumbbell, Flame, Heart, LogIn, Shield, UserPlus, Zap } from 'lucide-react';
import React, { useRef, useState } from 'react';
import Button from '../../../components/UI/Button';
import { Tooltip, TooltipThemeProvider } from '../../../components/UI/Tooltip';
// Temporarily comment out the module style import until we fix the SCSS issues
// import styles from './Hero.module.scss';
import './Hero.scss';
import FloatingIcons from './components/FloatingIcons';
import { HeroProps } from './types';

export const Hero: React.FC<HeroProps> = ({
  registrationLink = "#splash-section",
  loginLink = "#login",
  logoUrl = '/wp-content/themes/fitcopilot/assets/images/logo.png',
  onRegistrationStart
}) => {
  // Animation states for tooltips
  const [tooltipStates, setTooltipStates] = useState({
    freeWorkout: {
      show: false,
      isHovered: false,
    },
    createAccount: {
      show: false,
      isHovered: false,
    }
  });

  // Cleanup reference
  const timeoutsRef = useRef<number[]>([]);

  // Clear all timeouts on cleanup
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  // Component cleanup
  React.useEffect(() => {
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

  // Handle scroll to splash
  const handleScrollToSplash = (e: React.MouseEvent) => {
    e.preventDefault();

    // Option 1: Use onRegistrationStart callback if available
    if (onRegistrationStart) {
      onRegistrationStart();
      return;
    }

    // Option 2: Try to find and scroll to splash section
    const splashSection = document.getElementById('splash-section');
    if (splashSection) {
      splashSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Option 3: Fallback to registration page
    window.location.href = registrationLink;
  };

  return (
    <TooltipThemeProvider theme="hero">
      <section
        className="hero-section"
        aria-labelledby="hero-heading"
      >
        {/* Floating fitness icons - decorative */}
        <FloatingIcons />

        <div className="hero-content">
          {/* Content Card with Backdrop Blur */}
          <div className="hero-card">
            {/* Logo */}
            <div className="hero-logo">
              <img
                src={logoUrl}
                alt="AI Workout Generator Logo"
                style={{ maxWidth: '25%' }}
                onError={(e) => {
                  // Fallback mechanism if the direct path fails
                  const target = e.target as HTMLImageElement;
                  // Try alternative paths
                  if (target.src.includes('/assets/images/logo.png')) {
                    target.src = '/wp-content/themes/fitcopilot/assets/media/images/logo.png';
                  }
                }}
              />
            </div>

            <h1
              id="hero-heading"
              className="hero-heading"
            >
              <span className="hero-divider-gradient" data-text="AI-Powered Workouts">
                AI-Powered Workouts
              </span> Tailored Just for You
            </h1>

            <div className="hero-divider"></div>

            <p className="hero-subtitle">
              Achieve your fitness goals with <span className="citron-text">customized plans</span> designed by AI and expert trainers. Advanced AI technology creates workouts tailored to your goals, fitness level, and available equipment.
            </p>

            {/* CTA Buttons Container */}
            <div className="hero-cta__container">
              {/* Primary CTA: Get a Free Workout */}
              <div className="hero-cta__wrapper"
                onMouseEnter={() => handleMouseEnter('freeWorkout')}
                onMouseLeave={() => handleMouseLeave('freeWorkout')}
              >
                <Button
                  href="#splash-section"
                  variant="primary"
                  themeContext="hero"
                  leftIcon={<Zap className="hero-icon" />}
                  fullWidth
                  className="hero-button-primary hero-divider-gradient-btn"
                  onClick={handleScrollToSplash}
                >
                  Get a Free Workout
                </Button>

                {/* Tooltip */}
                <Tooltip
                  content={
                    <p className="hero-tooltip-content">
                      Generate a personalized workout plan in seconds with our AI technology - no registration required.
                    </p>
                  }
                  title="Quick Workout Builder"
                  icon={<Zap className="hero-tooltip-icon" />}
                  isVisible={tooltipStates.freeWorkout.show}
                  showOnHover={false}
                  position="bottom"
                  id="workout-tooltip"
                >
                  <div></div> {/* Empty div as child since we're controlling visibility externally */}
                </Tooltip>
              </div>

              {/* Secondary CTA: Create Your Account */}
              <div className="hero-cta__wrapper"
                onMouseEnter={() => handleMouseEnter('createAccount')}
                onMouseLeave={() => handleMouseLeave('createAccount')}
              >
                <Button
                  href={registrationLink}
                  variant="secondary"
                  themeContext="hero"
                  leftIcon={<UserPlus className="hero-icon-userplus" />}
                  fullWidth
                  className="hero-button-secondary"
                  onClick={handleScrollToSplash}
                >
                  Create Your Account
                </Button>

                {/* Tooltip */}
                <Tooltip
                  content={
                    <p className="hero-tooltip-content">
                      Save workouts, track progress, and access premium features with your free account.
                    </p>
                  }
                  title="Member Benefits"
                  icon={<Shield className="hero-tooltip-icon" />}
                  isVisible={tooltipStates.createAccount.show}
                  showOnHover={false}
                  position="bottom"
                  id="account-tooltip"
                >
                  <div></div> {/* Empty div as child since we're controlling visibility externally */}
                </Tooltip>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="hero-signin">
              <a
                href={loginLink}
                className="signin-link"
              >
                <LogIn size={16} className="signin-icon" />
                Already have an account? Sign in
              </a>
            </div>
          </div>

          {/* Features Pills */}
          <div className="hero-features">
            <div className="hero-feature-pill">
              <Dumbbell size={14} className="feature-icon" />
              <span>Personalized Workouts</span>
            </div>
            <div className="hero-feature-pill">
              <Flame size={14} className="feature-icon" />
              <span>AI-Optimized Routines</span>
            </div>
            <div className="hero-feature-pill">
              <Heart size={14} className="feature-icon" />
              <span>Expert Guidance</span>
            </div>
          </div>
        </div>
      </section>
    </TooltipThemeProvider>
  );
};

export default Hero;