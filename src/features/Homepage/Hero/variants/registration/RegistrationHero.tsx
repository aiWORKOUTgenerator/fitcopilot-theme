import { ArrowRight, LogIn, Shield, UserPlus, Zap } from 'lucide-react';
import React, { useState } from 'react';
import '../../Hero.css';
import { HeroProps } from '../../types';
import './RegistrationHero.css';

/**
 * Splash page Hero component for the AI Workout Generator registration flow
 */
const RegistrationHero: React.FC<HeroProps> = ({
    loginLink = "https://aigymengine.com/react-login",
    logoUrl = '/wp-content/themes/fitcopilot/assets/media/images/logo.png',
}) => {
    // Initial email state
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle email input change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    // Validate email and proceed to next section
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic email validation
        if (!email) {
            setError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Show loading state
        setIsSubmitting(true);

        // Simulate saving email to state/localStorage
        setTimeout(() => {
            // Save email to localStorage for use in Features section
            localStorage.setItem('registration_email', email);

            // Scroll to Features section
            const featuresSection = document.getElementById('features-section');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }

            setIsSubmitting(false);
        }, 600);
    };

    return (
        <section
            className="hero hero--registration w-full min-h-screen flex items-center justify-center relative overflow-hidden"
            aria-labelledby="hero-heading"
        >
            {/* Background animation with particles */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0">
                <div className="particles-container">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                    <div className="particle particle-5"></div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-20 px-4 py-16 text-center">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <img
                        src={logoUrl}
                        alt="AI Workout Generator Logo"
                        style={{ height: '100px', width: 'auto' }}
                        className="animate-fade-in"
                    />
                </div>

                <h1
                    id="hero-heading"
                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white animate-fade-in-up"
                >
                    <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient">
                        AI-Powered Workouts
                    </span>{' '}
                    <span className="block md:inline">Designed For You</span>
                </h1>

                <div className="w-32 h-1 bg-gradient-to-r from-lime-300 to-emerald-400 mx-auto mb-8 rounded-full animate-fade-in"></div>

                <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed animate-fade-in-up delay-1">
                    Get personalized workout plans created by AI and fitness experts
                    that adapt to your specific goals, experience level, and preferences.
                </p>

                {/* Email capture form */}
                <div className="max-w-lg mx-auto mb-12 animate-fade-in-up delay-2">
                    <form onSubmit={handleSubmit} className="registration-entry-form">
                        <div className="relative">
                            <input
                                type="email"
                                className={`w-full px-6 py-5 rounded-full bg-gray-800/50 border ${error ? 'border-red-500' : 'border-gray-700'} backdrop-blur-lg text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-300/50 pr-36`}
                                placeholder="Enter your email address"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isSubmitting}
                            />

                            <button
                                type="submit"
                                className="absolute right-2 top-2 px-6 py-3 rounded-full bg-gradient-to-r from-lime-300 to-emerald-400 text-gray-900 font-bold flex items-center transition transform hover:translate-x-1 disabled:opacity-70"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <span className="animate-pulse mr-2">Processing</span>
                                        <span className="loading-dots"></span>
                                    </span>
                                ) : (
                                    <>
                                        Start <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mt-2 text-left pl-4">
                                {error}
                            </div>
                        )}

                        <div className="text-gray-500 text-sm mt-2 text-center">
                            We'll use this email to create your personal workout plan
                        </div>
                    </form>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 animate-fade-in-up delay-3">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Zap className="h-6 w-6 text-lime-300" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            AI Personalization
                        </h3>
                        <p className="text-gray-400">
                            Workouts tailored to your body type, goals and available equipment
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Shield className="h-6 w-6 text-lime-300" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            Expert Guidance
                        </h3>
                        <p className="text-gray-400">
                            Programs designed with input from certified fitness professionals
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <UserPlus className="h-6 w-6 text-lime-300" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            Progress Tracking
                        </h3>
                        <p className="text-gray-400">
                            Monitor your improvements and adapt your workouts as you advance
                        </p>
                    </div>
                </div>

                {/* Sign In Link */}
                <div className="animate-fade-in-up delay-4">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <a
                            href={loginLink}
                            className="text-lime-300 hover:text-lime-200 font-medium inline-flex items-center"
                        >
                            <LogIn className="mr-1 h-3 w-3" />
                            Sign In
                        </a>
                    </p>
                </div>

                {/* Down arrow indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default RegistrationHero; 