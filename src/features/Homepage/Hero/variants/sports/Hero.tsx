import { Activity, ArrowRight, Award, BarChart, Check, Sun, Timer, Zap } from 'lucide-react';
import React from 'react';
import { HeroProps } from '../../types';
import './sports-hero.scss';

/**
 * Interface for floating icon props
 */
interface FloatingIconProps {
    icon: React.ReactNode;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    size?: number;
    opacity?: number;
    rotation?: number;
}

/**
 * Floating icon component for decorative background elements
 */
const FloatingIcon: React.FC<FloatingIconProps> = ({
    icon,
    top,
    left,
    right,
    bottom,
    size = 24,
    opacity = 0.7,
    rotation = 0
}) => {
    return (
        <div
            className="floating-icon"
            style={{
                top, left, right, bottom,
                opacity,
                transform: `rotate(${rotation}deg)`
            }}
        >
            {React.cloneElement(icon as React.ReactElement, { size })}
        </div>
    );
};

// Define floating icons
const floatingIcons = [
    { icon: <Activity color="#38bdf8" />, top: '15%', left: '10%', size: 32, rotation: -15 },
    { icon: <Zap color="#22d3ee" />, top: '25%', right: '12%', size: 28, rotation: 10 },
    { icon: <Timer color="#38bdf8" />, bottom: '20%', left: '15%', size: 24, rotation: 5 },
    { icon: <Award color="#22d3ee" />, top: '60%', right: '18%', size: 36, rotation: -5 },
    { icon: <BarChart color="#38bdf8" />, bottom: '35%', right: '25%', size: 22, rotation: 15 },
    { icon: <Sun color="#22d3ee" />, top: '40%', left: '18%', size: 26, rotation: 0 },
];

/**
 * Interface for floating icon data
 * @deprecated - This will be used in future animations - do not remove
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FloatingIconData {
    Icon: React.ElementType;
    size: number;
    left: number;
    top: number;
    delay: number;
    speed: number;
}

export const Hero: React.FC<HeroProps> = ({
    headline = 'Level Up Your Sports Training with AI-Powered Workouts',
    subheadline = 'Generate sport-specific training routines tailored to your performance goals',
    ctaText = 'Create My Training Plan',
    secondaryCtaText = 'Learn more',
    logoUrl = 'http://fitcopilot-theme.local/wp-content/uploads/2025/05/AI-Workout-Generater-TransparentBG-400x516-1.png',
    variant: _variant = 'sports'
}) => {
    const benefits = [
        'Sport-specific training programs',
        'Performance analysis & tracking',
        'Recovery optimization',
        'Competition preparation'
    ];

    return (
        <section className="sports-hero relative overflow-hidden bg-gradient-to-b from-blue-900 to-blue-950 py-12 lg:py-20">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-pattern-grid opacity-10"></div>
            <div className="sports-hero-overlay absolute inset-0 z-0"></div>

            {/* Floating icons */}
            {floatingIcons.map((icon, index) => (
                <FloatingIcon key={index} {...icon} />
            ))}

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center mb-8">
                    {/* Logo centered at the top */}
                    <div className="mb-8 flex justify-center">
                        <img
                            src={logoUrl}
                            alt="AI Workout Generator Logo"
                            className="h-48 md:h-56 w-auto"
                        />
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto">
                        {headline}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        {subheadline}
                    </p>

                    {/* Benefits list */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-blue-800/30 backdrop-blur-sm rounded-full px-4 py-2 text-blue-100"
                            >
                                <Check size={16} className="mr-2 text-cyan-400" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button className="bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center">
                            {ctaText}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                        <button className="border border-blue-400 text-blue-100 hover:bg-blue-800/50 py-3 px-6 rounded-full transition-all">
                            {secondaryCtaText}
                        </button>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="mt-12 relative max-w-5xl mx-auto">
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-blue-800/20 backdrop-blur-sm border border-blue-700/30">
                        <img
                            src="/images/sports-workout-preview.jpg"
                            alt="Sports training dashboard preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.classList.add('image-fallback');
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center image-fallback-content">
                            <div className="text-center">
                                <span className="block text-blue-300 text-lg mb-2">Interactive Training Preview</span>
                                <span className="text-sm text-blue-400">Coming soon</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-dot-pattern opacity-30"></div>
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-dot-pattern opacity-20"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero; 