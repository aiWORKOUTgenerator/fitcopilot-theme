import { Button } from '@features/shared/Button';
import { Dumbbell, Flame, Heart, LogIn, UserPlus, Zap } from 'lucide-react';
import React, { useRef } from 'react';
// Tooltip component has been deprecated
// import { Tooltip } from '@components/UI/Tooltip';
// Temporarily comment out the module style import until we fix the SCSS issues
// import styles from './Hero.module.scss';
import { ThemeCSSProperties } from '../../../types/theme';
import './Hero.scss';
import { FloatingIcons } from './components/FloatingIcons';
import { HeroProps } from './types';

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

  // Calculate gradient styles
  const gradientStyles: ThemeCSSProperties = {
    '--hero-gradient-start': 'var(--color-primary, #4CAF50)',
    '--hero-gradient-end': 'var(--color-accent, #8BC34A)'
  };

  return (
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
            <span className="hero-divider-gradient" data-text="AI-Powered Workouts" style={gradientStyles}>
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
              <Button
                variant="primary"
                size="lg"
                className="inline-flex items-center rounded-full font-medium hero-button-primary hero-divider-gradient-btn"
                onClick={handleScrollToSplash}
                aria-label="Generate a personalized workout plan in seconds with our AI technology - no registration required"
              >
                <Zap className="hero-icon" />
                Get a Free Workout
              </Button>
            </div>

            {/* Secondary CTA: Create Your Account */}
            <div className="hero-cta__wrapper">
              <Button
                variant="secondary"
                size="lg"
                className="inline-flex items-center rounded-full font-medium hero-button-secondary"
                onClick={handleScrollToSplash}
                aria-label="Save workouts, track progress, and access premium features with your free account"
              >
                <UserPlus className="hero-icon-userplus" />
                Create Your Account
              </Button>
            </div>
          </div>

          {/* Login Link */}
          <div className="hero-login-link">
            <p>
              Already have an account? <a href={loginLink} className="login-link">
                <LogIn className="login-icon" size={14} /> Log in
              </a>
            </p>
          </div>

          {/* Feature Icons */}
          <div className="hero-features">
            <div className="hero-feature" title="Beginner Friendly">
              <Heart className="hero-feature-icon" />
              <span>Beginner Friendly</span>
            </div>
            <div className="hero-feature" title="Strength & Cardio">
              <Dumbbell className="hero-feature-icon" />
              <span>Strength & Cardio</span>
            </div>
            <div className="hero-feature" title="HIIT Workouts">
              <Flame className="hero-feature-icon" />
              <span>HIIT Workouts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;