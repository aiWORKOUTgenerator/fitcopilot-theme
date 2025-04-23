import { Dumbbell, Heart, LogIn, Medal, Shield, Timer, UserPlus, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import '../Hero.scss';
import { HeroProps } from '../types';

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
    Icon: React.ElementType;
    size: number;
    left: number;
    top: number;
    delay: number;
    speed: number;
}

const Hero: React.FC<HeroProps> = ({
    registrationLink = "https://aigymengine.com/workout-generator-registration",
    loginLink = "https://aigymengine.com/react-login",
    logoUrl = '/wp-content/themes/athlete-dashboard-gym-engine/assets/images/AI-Workout-Generater-TransparentBG-1-2880x1800.png'
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

    // Floating icons data - gym specific icons
    const floatingIcons: FloatingIconData[] = [
        { Icon: Dumbbell, size: 32, left: 5, top: 15, delay: 0, speed: 8 },
        { Icon: Dumbbell, size: 40, left: 15, top: 60, delay: 1.5, speed: 10 },
        { Icon: Medal, size: 32, left: 25, top: 25, delay: 0.8, speed: 12 },
        { Icon: Zap, size: 40, left: 80, top: 20, delay: 2, speed: 9 },
        { Icon: Heart, size: 32, left: 85, top: 65, delay: 1, speed: 11 },
        { Icon: Dumbbell, size: 28, left: 10, top: 80, delay: 2.5, speed: 10 },
        { Icon: Timer, size: 28, left: 70, top: 10, delay: 0.5, speed: 7 },
        { Icon: Medal, size: 36, left: 90, top: 40, delay: 1.2, speed: 9 },
        { Icon: Dumbbell, size: 42, left: 30, top: 70, delay: 1.8, speed: 13 }
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
            style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.7)), url("/wp-content/themes/fitcopilot/assets/images/gym-background.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
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
                        <icon.Icon size={icon.size} className="text-red-500" />
                    </FloatingIcon>
                ))}
            </div>

            <div className="max-w-4xl mx-auto relative z-20 text-center">
                {/* Content Card with Backdrop Blur */}
                <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-red-900/30 mb-6">
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
                        <span className="bg-gradient-to-r from-red-500 to-orange-400 text-transparent bg-clip-text text-gradient" data-text="GYM-POWERED AI">
                            GYM-POWERED AI
                        </span> Workout Builder
                    </h1>

                    <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-400 mx-auto mb-6 rounded-full"></div>

                    <p
                        className="text-gray-300 mb-10 max-w-2xl mx-auto text-base md:text-xl lead"
                    >
                        Transform your gym sessions with <span className="text-red-400">professional-grade workouts</span> customized for your equipment and goals.
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
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white shadow-optimized hover:shadow-optimized-hover hover:-translate-y-1 w-full sm:w-auto button primary hero-button"
                            >
                                <Zap className="mr-2 h-5 w-5" />
                                Build Gym Workout
                            </a>

                            {/* Tooltip styled to match Pricing */}
                            <div
                                className={`tooltip ${tooltipStates.freeWorkout.show ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                                role="tooltip"
                                id="freeWorkout-tooltip"
                                aria-hidden={!tooltipStates.freeWorkout.show}
                            >
                                <div className="tooltip-content">
                                    <div className="tooltip-icon">
                                        <Zap className="w-4 h-4 text-red-400" />
                                    </div>
                                    <div className="tooltip-text">
                                        <h5 className="tooltip-title">Gym Workout Builder</h5>
                                        <p className="text-xs text-gray-300">
                                            Generate professional gym workouts optimized for your equipment and experience level.
                                        </p>
                                    </div>
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
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gray-900 border-2 border-red-500/30 text-white hover:bg-red-500/10 hover:-translate-y-1 w-full sm:w-auto button secondary hero-button"
                            >
                                <UserPlus className="mr-2 h-5 w-5 text-red-400" />
                                Join Our Gym
                            </a>

                            {/* Tooltip styled to match Pricing */}
                            <div
                                className={`tooltip ${tooltipStates.createAccount.show ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                                role="tooltip"
                                id="createAccount-tooltip"
                                aria-hidden={!tooltipStates.createAccount.show}
                            >
                                <div className="tooltip-content">
                                    <div className="tooltip-icon">
                                        <Shield className="w-4 h-4 text-red-400" />
                                    </div>
                                    <div className="tooltip-text">
                                        <h5 className="tooltip-title">Premium Gym Membership</h5>
                                        <p className="text-xs text-gray-300">
                                            Track your gym progress, save customized workouts, and access pro features.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6">
                        <a
                            href={loginLink}
                            className="text-gray-400 hover:text-red-400 transition inline-flex items-center"
                        >
                            <LogIn className="w-4 h-4 mr-1" />
                            <span>Existing members login here</span>
                        </a>
                    </div>
                </div>

                {/* Features Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-300">
                    <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-sm border border-red-900/20">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-3 mx-auto">
                            <Dumbbell className="w-5 h-5 text-red-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-1">Gym-Specific Routines</h3>
                        <p className="text-sm">Optimized for gym equipment and professional training environments.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-sm border border-red-900/20">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-3 mx-auto">
                            <Timer className="w-5 h-5 text-red-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-1">Efficient Scheduling</h3>
                        <p className="text-sm">Maximize your gym time with scientifically designed workout splits.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-sm border border-red-900/20">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-3 mx-auto">
                            <Medal className="w-5 h-5 text-red-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-1">Progress Tracking</h3>
                        <p className="text-sm">Monitor performance and adjust training intensity for optimal results.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero; 