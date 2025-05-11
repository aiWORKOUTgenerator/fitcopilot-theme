import { Dumbbell, Flame, Heart } from 'lucide-react';
import React, { useState } from 'react';
import { FloatingIcons } from '../../components/FloatingIcons';
import '../../Hero.scss';
import { HeroProps } from '../../types';
import './RegistrationHero.scss';

/**
 * Splash page Hero component for the AI Workout Generator registration flow
 */
const RegistrationHero: React.FC<HeroProps> = ({
    _loginLink = "https://aigymengine.com/react-login",
    _logoUrl = '/wp-content/themes/fitcopilot/assets/media/images/logo.png',
}) => {
    // Form state - prefixed with underscore as they're not yet used in this simplified view
    const [_firstName, _setFirstName] = useState('');
    const [_email, _setEmail] = useState('');
    const [_errors, _setErrors] = useState<{ firstName?: string; email?: string }>({});
    const [_isSubmitting, _setIsSubmitting] = useState(false);

    // Note: These handlers are defined but unused in this simplified mock component
    // In a real implementation, they would be connected to form inputs
    const _handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        _setFirstName(e.target.value);
        if (_errors.firstName) {
            _setErrors(prev => ({ ...prev, firstName: undefined }));
        }
    };

    const _handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        _setEmail(e.target.value);
        if (_errors.email) {
            _setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const _handleSubmit = (e: React.FormEvent) => {
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
            _setErrors(newErrors);
            return;
        }

        // Show loading state
        _setIsSubmitting(true);

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

            _setIsSubmitting(false);
        }, 600);
    };

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