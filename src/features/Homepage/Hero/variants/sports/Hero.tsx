import { ArrowRight, Check } from 'lucide-react';
import React from 'react';
import '../../Hero.scss';

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

/**
 * Hero component for the homepage sports variant
 */
const Hero: React.FC = () => {
    // Benefits list
    const benefits = [
        "Access to state-of-the-art equipment",
        "Expert personal trainers available",
        "Group fitness classes included",
        "Clean, spacious workout environment"
    ];

    return (
        <section className="relative w-full min-h-[90vh] bg-gray-900 overflow-hidden flex items-center py-20">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-90"></div>

            {/* Background image overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "url('/assets/gym-background.jpg')",
                    backgroundPosition: "center"
                }}
            ></div>

            {/* Grain overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] z-20"></div>

            {/* Content container */}
            <div className="container mx-auto px-4 relative z-30 flex flex-col lg:flex-row items-center">
                {/* Left column - Text content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-red-700/30 text-red-300 rounded-full mb-6">
                        Premium Fitness Club
                    </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Transform Your Body at <span className="bg-gradient-to-r from-red-500 to-orange-400 text-transparent bg-clip-text">FitCopilot</span> Gym
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                        Join our state-of-the-art fitness center with expert trainers, premium equipment, and AI-powered workout plans.
                    </p>

                    {/* Benefits list */}
                    <ul className="mb-10 space-y-3 max-w-lg mx-auto lg:mx-0">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600/40 flex items-center justify-center mr-3 mt-0.5">
                                    <Check size={14} className="text-red-300" />
                                </span>
                                <span className="text-gray-300">{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center">
                            Join Now
                            <ArrowRight size={18} className="ml-2" />
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-red-500/30 hover:bg-red-700/10 hover:border-red-500 text-red-300 font-medium rounded-lg transition-all duration-200">
                            Tour Our Facility
                        </button>
                    </div>
                </div>

                {/* Right column - Gym image or promotional content */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="relative mx-auto overflow-hidden rounded-2xl shadow-2xl">
                        {/* Main image */}
                        <img
                            src="/assets/gym-interior.jpg"
                            alt="FitCopilot Gym Interior"
                            className="w-full h-auto rounded-2xl"
                            onError={(e) => {
                                // Fallback if image doesn't load
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLElement).parentElement!.classList.add('bg-gradient-to-b', 'from-red-800', 'to-gray-900', 'p-10', 'flex', 'items-center', 'justify-center', 'h-[400px]');

                                // Add text content as fallback
                                const textDiv = document.createElement('div');
                                textDiv.className = 'text-center';
                                textDiv.innerHTML = `
                                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/30 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                    <h3 class="text-2xl font-bold text-white mb-2">Premium Facilities</h3>
                                    <p class="text-gray-300">Experience our world-class gym with top-tier equipment and expert trainers</p>
                                `;
                                (e.target as HTMLElement).parentElement!.appendChild(textDiv);
                            }}
                        />

                        {/* Overlay with stats */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">24/7</p>
                                    <p className="text-xs text-red-300 uppercase tracking-wider">Access</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">50+</p>
                                    <p className="text-xs text-red-300 uppercase tracking-wider">Classes</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">100%</p>
                                    <p className="text-xs text-red-300 uppercase tracking-wider">Satisfaction</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                            <span className="mr-1">NEW</span>
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-r from-red-500 to-orange-500 blur-xl opacity-70 animate-pulse"></div>
                    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-r from-orange-500 to-red-600 blur-xl opacity-70 animate-pulse delay-300"></div>
                </div>
            </div>

            {/* Membership banner */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold text-white">Limited Time Offer</h3>
                        <p className="text-gray-300">50% off your first month when you sign up today!</p>
                    </div>
                    <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 whitespace-nowrap">
                        Get Started
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero; 