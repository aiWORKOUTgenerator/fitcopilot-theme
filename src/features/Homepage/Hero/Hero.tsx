import { Dumbbell, Flame, Heart, LogIn, UserPlus, Zap } from 'lucide-react';
import React, { useRef } from 'react';
// Import HeroButton directly from its component folder
import { ThemeProvider } from '../../../context/ThemeContext';
import Tooltip from '../../../features/shared/Tooltip';
import { HeroButton } from './components/HeroButton';
// Temporarily comment out the module style import until we fix the SCSS issues
// import styles from './Hero.module.scss';
import './Hero.scss';
import FloatingIcons from './components/FloatingIcons';
import { HeroProps } from './types';

// Button style overrides to ensure correct padding
const buttonStyles = {
  padding: '1rem 2rem', // py-4 px-8 in Tailwind
};

export const Hero: React.FC<HeroProps> = ({
  registrationLink = "#splash-section",
  loginLink = "#login",
  logoUrl = '/wp-content/themes/fitcopilot/assets/images/logo.png',
  onRegistrationStart
}) => {
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

  // Handle scroll to splash
  const handleScrollToSplash = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
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
    <ThemeProvider initialTheme="default">
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
              <span className="hero-heading-gradient" data-text="AI-Powered Workouts">
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
              <div className="hero-cta__wrapper">
                <Tooltip
                  content={
                    <p>Generate a personalized workout plan in seconds with our AI technology - no registration required.</p>
                  }
                  title="Quick Workout Builder"
                  icon={<Zap className="w-4 h-4 text-lime-300" />}
                  width="264px"
                >
                  <HeroButton
                    variant="primary"
                    size="large"
                    leftIcon={<Zap className="hero-icon" />}
                    onClick={handleScrollToSplash}
                    aria-label="Generate a personalized workout plan in seconds with our AI technology - no registration required"
                    style={buttonStyles}
                  >
                    Get a Free Workout
                  </HeroButton>
                </Tooltip>
              </div>

              {/* Secondary CTA: Create Your Account */}
              <div className="hero-cta__wrapper">
                <Tooltip
                  content={
                    <p>Save workouts, track progress, and access premium features with your free account.</p>
                  }
                  title="Member Benefits"
                  icon={<UserPlus className="w-4 h-4 text-lime-300" />}
                  width="264px"
                >
                  <HeroButton
                    variant="secondary"
                    size="large"
                    leftIcon={<UserPlus className="hero-icon-userplus" />}
                    onClick={handleScrollToSplash}
                    aria-label="Save workouts, track progress, and access premium features with your free account"
                    style={buttonStyles}
                  >
                    Create Your Account
                  </HeroButton>
                </Tooltip>
              </div>
            </div>

            {/* Login Link */}
            <div className="hero-signin">
              <a href={loginLink} className="signin-link">
                <LogIn className="signin-icon" />
                <span>Already have an account? Log in</span>
              </a>
            </div>

            {/* Feature Icons */}
            <div className="hero-features">
              <div className="hero-feature-pill" title="Beginner Friendly">
                <Heart className="feature-icon" />
                <span>Beginner Friendly</span>
              </div>
              <div className="hero-feature-pill" title="Strength & Cardio">
                <Dumbbell className="feature-icon" />
                <span>Strength & Cardio</span>
              </div>
              <div className="hero-feature-pill" title="HIIT Workouts">
                <Flame className="feature-icon" />
                <span>HIIT Workouts</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
};

export default Hero;