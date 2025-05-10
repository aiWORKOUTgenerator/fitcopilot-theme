import { Dumbbell, Flame, Heart } from 'lucide-react';
import React, { useState } from 'react';
// Add a custom hook to handle navigation with fallback
import { FloatingIcons } from '../../components/FloatingIcons';
import '../../Hero.scss';
import { HeroProps } from '../../types';
import './RegistrationHero.scss';

// Fallback hook for environments without react-router
const useNavigation = () => {
    try {
        // Dynamically import useNavigate to prevent build errors
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { useNavigate } = require('react-router-dom');
        return useNavigate();
    } catch (error) {
        // Return a no-op function if react-router-dom is not available
        return () => {
            console.warn('Navigation attempted but react-router-dom is not available');
        };
    }
};

/**
 * Splash page Hero component for the AI Workout Generator registration flow
 */
const RegistrationHero: React.FC<HeroProps> = ({
    loginLink = "https://aigymengine.com/react-login",
    logoUrl = '/wp-content/themes/fitcopilot/assets/media/images/logo.png',
}) => {
    const navigate = useNavigation();
    // Form state
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
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

        // Simulate saving form data
        setTimeout(() => {
            // Save data to localStorage for use in Features section
            localStorage.setItem('registration_firstName', firstName);
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

export default RegistrationHero; 