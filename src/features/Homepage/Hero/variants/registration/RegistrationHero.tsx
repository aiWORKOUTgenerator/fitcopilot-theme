import { Dumbbell, Flame, Heart } from 'lucide-react';
import React, { useState } from 'react';
import { InputChangeEvent } from '../../../../../types/events';
import { FloatingIcons } from '../../components/FloatingIcons';
import '../../Hero.scss';
import { HeroProps } from '../../types';
import './RegistrationHero.scss';

/**
 * Splash page Hero component for the AI Workout Generator registration flow
 */
const RegistrationHero: React.FC<HeroProps> = ({
  loginLink: _loginLink = "https://aigymengine.com/react-login",
  logoUrl: _logoUrl = '/wp-content/themes/fitcopilot/assets/media/images/logo.png',
}) => {
  // Form state - prefixed with underscore as they're not yet used in this simplified view
  const [_firstName, setFirstName] = useState('');
  const [_email, setEmail] = useState('');
  const [_errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const [_isSubmitting, setIsSubmitting] = useState(false);

  // Note: These handlers are defined but unused in this simplified mock component
  // In a real implementation, they would be connected to form inputs
  const handleFirstNameChange = (e: InputChangeEvent) => {
    setFirstName(e.target.value);
    if (_errors.firstName) {
      setErrors(_prev => ({ ..._prev, firstName: undefined }));
    }
  };

  const handleEmailChange = (e: InputChangeEvent) => {
    setEmail(e.target.value);
    if (_errors.email) {
      setErrors(_prev => ({ ..._prev, email: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { firstName?: string; email?: string } = {};

    // Validate first name
    if (!_firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Validate email
    if (!_email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(_email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // If there are errors, update state and don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show loading state
    setIsSubmitting(true);

    // Simulate saving form data
    setTimeout(() => {
      // Save data to localStorage for use in Features section
      localStorage.setItem('registration_firstName', _firstName);
      localStorage.setItem('registration_email', _email);

      // Scroll to Features section
      const featuresSection = document.getElementById('features-section');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }

      setIsSubmitting(false);
    }, 600);
  };

  // These handlers are not connected to UI elements in this simplified mock
  // Include them with underscore prefix to indicate they are defined but not used
  const _handleFirstNameChange = handleFirstNameChange;
  const _handleEmailChange = handleEmailChange;
  const _handleSubmit = handleSubmit;

  return (
    <section
      className="w-full min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-gray-900"
      aria-labelledby="registration-hero-heading"
    >
      {/* Floating fitness icons - decorative */}
      <FloatingIcons variant="registration" />

      <div className="max-w-4xl mx-auto relative z-20 text-center">
        {/* Content Card with Backdrop Blur */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-700 mb-6">
          <h1
            id="registration-hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
          >
            Create Your <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">AI Workout Generator</span> Account
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-lime-300 to-emerald-400 mx-auto mb-6 rounded-full"></div>

          <p
            className="text-gray-300 mb-10 max-w-2xl mx-auto text-base md:text-xl"
          >
            Join thousands of fitness enthusiasts who use <span className="citron-text">AI Workout Generator</span> to reach their fitness goals faster.
          </p>

          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 mb-8">
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
      </div>
    </section>
  );
};

RegistrationHero.displayName = 'RegistrationHero';

export default RegistrationHero; 