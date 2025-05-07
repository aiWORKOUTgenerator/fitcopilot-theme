import { ArrowRight, Shield, UserPlus, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { RegistrationButton } from '../components';
import { RegistrationStepProps } from '../types';
import './Splash.scss';

/**
 * Splash page component that serves as the entry point for the registration flow
 */
const SplashComponent: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    className = '',
}) => {
    // Form state
    const [firstName, setFirstName] = useState(data?.firstName || '');
    const [email, setEmail] = useState(data?.email || '');
    const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle firstName input change
    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
        if (errors.firstName) {
            setErrors(prev => ({ ...prev, firstName: undefined }));
        }
    };

    // Handle email input change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    // Validate form and proceed to next section
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { firstName?: string; email?: string } = {};

        // Validate first name
        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        // Validate email
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // If there are errors, update state and don't proceed
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Show loading state
        setIsSubmitting(true);

        // Save the data and proceed to next step
        setTimeout(() => {
            // Update registration data
            updateData({
                ...data,
                firstName,
                email
            });

            // Move to next step in registration flow
            if (onNext) {
                onNext();
            }

            setIsSubmitting(false);
        }, 600);
    };

    return (
        <div id="splash-section" className={`splash-step registration-step ${className}`}>
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

            <div className="max-w-6xl mx-auto relative z-20 px-4 py-8 text-center">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <img
                        src="/wp-content/themes/fitcopilot/assets/media/images/logo.png"
                        alt="AI Workout Generator Logo"
                        style={{ height: '100px', width: 'auto' }}
                        className="animate-fade-in"
                    />
                </div>

                <h1
                    id="splash-heading"
                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white animate-fade-in-up"
                >
                    <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient">
                        AI-Powered Workouts
                    </span>{' '}
                    <span className="block md:inline">Designed For You</span>
                </h1>

                <div className="w-32 h-1 bg-gradient-to-r from-lime-300 to-emerald-400 mx-auto mb-8 rounded-full animate-fade-in"></div>

                {/* Registration form */}
                <div className="max-w-lg mx-auto mb-12 animate-fade-in-up">
                    <form onSubmit={handleSubmit} className="registration-entry-form space-y-4">
                        {/* First Name field */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`w-full px-6 py-5 rounded-full bg-gray-800/50 border ${errors.firstName ? 'border-red-500' : 'border-gray-700'} backdrop-blur-lg text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-300/50`}
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.firstName && (
                                <div className="text-red-500 text-sm mt-2 text-left pl-4">
                                    {errors.firstName}
                                </div>
                            )}
                        </div>

                        {/* Email field */}
                        <div>
                            <div className="relative">
                                <input
                                    type="email"
                                    className={`w-full px-6 py-5 rounded-full bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-gray-700'} backdrop-blur-lg text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-300/50`}
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.email && (
                                <div className="text-red-500 text-sm mt-2 text-left pl-4">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Submit button */}
                        <div className="mt-6">
                            <RegistrationButton
                                type="submit"
                                size="large"
                                variant="primary"
                                isLoading={isSubmitting}
                                rightIcon={<ArrowRight className="h-5 w-5" />}
                                fullWidth
                            >
                                Get Started
                            </RegistrationButton>
                        </div>

                        <div className="text-gray-500 text-sm mt-2 text-center">
                            We'll use this information to create your personal workout plan
                        </div>
                    </form>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 animate-fade-in-up">
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
            </div>
        </div>
    );
};

export default SplashComponent; 