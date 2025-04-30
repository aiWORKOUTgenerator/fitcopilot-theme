import { ArrowRight, Check } from 'lucide-react';
import React from 'react';
import '../Hero.scss';

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
 * Hero component for the homepage mobile app variant
 */
const Hero: React.FC = () => {
    // Benefits list
    const benefits = [
        "Personalized workout plans that fit your schedule",
        "Track progress directly from your mobile device",
        "Connect with fitness communities on the go",
        "Sync with wearable devices for real-time feedback"
    ];

    return (
        <section className="relative w-full min-h-[90vh] bg-gray-900 overflow-hidden flex items-center py-20">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-teal-900 to-gray-900 opacity-90"></div>

            {/* Grain overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] z-20"></div>

            {/* Content container */}
            <div className="container mx-auto px-4 relative z-30 flex flex-col lg:flex-row items-center">
                {/* Left column - Text content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-teal-700/30 text-teal-300 rounded-full mb-6">
                        Mobile App Experience
                    </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Fitness in Your <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">Pocket</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                        Take your fitness journey anywhere with our mobile app. Get workouts, tracking, and coaching right on your smartphone.
                    </p>

                    {/* Benefits list */}
                    <ul className="mb-10 space-y-3 max-w-lg mx-auto lg:mx-0">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600/40 flex items-center justify-center mr-3 mt-0.5">
                                    <Check size={14} className="text-teal-300" />
                                </span>
                                <span className="text-gray-300">{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center">
                            Download App
                            <ArrowRight size={18} className="ml-2" />
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-teal-500/30 hover:bg-teal-700/10 hover:border-teal-500 text-teal-300 font-medium rounded-lg transition-all duration-200">
                            View Features
                        </button>
                    </div>
                </div>

                {/* Right column - Phone mockup with app preview */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="relative mx-auto max-w-xs">
                        {/* Phone frame */}
                        <div className="relative mx-auto h-[600px] w-[300px] rounded-[3rem] border-[14px] border-gray-800 bg-gray-800 shadow-xl">
                            {/* Phone notch */}
                            <div className="absolute top-0 inset-x-0 h-6 w-40 mx-auto rounded-b-xl bg-gray-800 z-30"></div>

                            {/* Phone display */}
                            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                                {/* App screenshot */}
                                <img
                                    src="/assets/mobile-app-screenshot.jpg"
                                    alt="FitCopilot Mobile App"
                                    className="absolute inset-0 h-full w-full object-cover"
                                    onError={(e) => {
                                        // Fallback if image doesn't load
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLElement).parentElement!.classList.add('bg-gradient-to-b', 'from-teal-800', 'to-gray-900');

                                        // Add app interface mockup as fallback
                                        const mockupDiv = document.createElement('div');
                                        mockupDiv.className = 'p-4 h-full flex flex-col';
                                        mockupDiv.innerHTML = `
                                            <div class="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 class="text-lg font-bold text-white">FitCopilot</h3>
                                                    <p class="text-xs text-teal-300">Your fitness journey</p>
                                                </div>
                                                <div class="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div class="bg-gray-800/50 rounded-xl p-4 mb-4">
                                                <h4 class="text-sm font-medium text-white mb-2">Today's Workout</h4>
                                                <p class="text-xs text-gray-400 mb-3">Upper Body Focus • 45 min</p>
                                                <div class="flex justify-between items-center">
                                                    <button class="bg-teal-600 text-xs text-white px-3 py-1 rounded-lg">Start</button>
                                                    <span class="text-xs text-teal-300">4 exercises</span>
                                                </div>
                                            </div>
                                            <div class="bg-gray-800/50 rounded-xl p-4 mb-4">
                                                <h4 class="text-sm font-medium text-white mb-2">Weekly Progress</h4>
                                                <div class="flex justify-between items-center mb-2">
                                                    <span class="text-xs text-gray-400">3 of 5 workouts</span>
                                                    <span class="text-xs text-teal-300">60%</span>
                                                </div>
                                                <div class="h-2 w-full bg-gray-700 rounded-full">
                                                    <div class="h-full w-3/5 bg-teal-500 rounded-full"></div>
                                                </div>
                                            </div>
                                            <div class="mt-auto">
                                                <div class="flex justify-between text-center text-xs">
                                                    <div class="w-1/4 text-teal-300">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        Home
                                                    </div>
                                                    <div class="w-1/4 text-gray-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                        Stats
                                                    </div>
                                                    <div class="w-1/4 text-gray-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        Plans
                                                    </div>
                                                    <div class="w-1/4 text-gray-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Settings
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                        (e.target as HTMLElement).parentElement!.appendChild(mockupDiv);
                                    }}
                                />

                                {/* Notification overlay */}
                                <div className="absolute top-6 left-6 right-6 rounded-lg bg-white/10 backdrop-blur-md p-4 animate-fade-in-down shadow-lg">
                                    <div className="flex items-start">
                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-teal-500 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-xs font-medium text-white">Workout Ready</p>
                                            <p className="mt-1 text-xs text-gray-300">Your customized HIIT session is available now!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phone buttons (for realism) */}
                            <div className="absolute -right-[14px] top-[120px] w-[3px] h-[30px] bg-gray-700 rounded-l-md"></div>
                            <div className="absolute -left-[14px] top-[100px] w-[3px] h-[40px] bg-gray-700 rounded-r-md"></div>
                            <div className="absolute -left-[14px] top-[160px] w-[3px] h-[40px] bg-gray-700 rounded-r-md"></div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-70 blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 opacity-70 blur-3xl animate-pulse delay-1000"></div>
                    </div>
                </div>
            </div>

            {/* App stats */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 grid grid-cols-4 gap-4 border border-teal-500/20">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">4.9</p>
                        <p className="text-xs text-teal-300 uppercase tracking-wider">App Rating</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">50K+</p>
                        <p className="text-xs text-teal-300 uppercase tracking-wider">Downloads</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">200+</p>
                        <p className="text-xs text-teal-300 uppercase tracking-wider">Workouts</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">15M+</p>
                        <p className="text-xs text-teal-300 uppercase tracking-wider">Calories Burned</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero; 