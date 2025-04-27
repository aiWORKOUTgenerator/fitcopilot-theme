import { Activity, Apple, BarChart3, Bike, Coffee, Dumbbell, Flame, Footprints, Heart, HeartHandshake, Medal, Timer } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { FloatingIconData, renderFloatingIcon } from '../components';
import FeatureCard from '../components/FeatureCard';
import { ProgressChart, SampleWorkout, VideoPlayer } from '../components/FeatureCardDemos';
import '../Features.scss';

/**
 * Gym variant of Features component
 */
const Features: React.FC = () => {
    const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const features = [
        {
            icon: <BarChart3 size={48} className="text-violet-300 group-hover:scale-110 transition-transform duration-300" />,
            title: "Gym-Ready Workouts",
            description: "Professional workout plans designed for full gym equipment access.",
            gradient: "from-violet-300/20 to-fuchsia-500/20",
            demoComponent: <SampleWorkout />
        },
        {
            icon: <Activity size={48} className="text-violet-300 group-hover:scale-110 transition-transform duration-300" />,
            title: "Performance Tracking",
            description: "Track your personal records and monitor progress over time.",
            gradient: "from-violet-300/20 to-blue-500/20",
            demoComponent: <ProgressChart />
        },
        {
            icon: <HeartHandshake size={48} className="text-violet-300 group-hover:scale-110 transition-transform duration-300" />,
            title: "Pro Training Tips",
            description: "Get expert advice from professional trainers and athletes.",
            gradient: "from-violet-300/20 to-indigo-500/20",
            demoComponent: <VideoPlayer ref={videoRef} />
        }
    ];

    const floatingIcons: FloatingIconData[] = [
        { Icon: Dumbbell, size: 24, left: 5, top: 15, delay: 0, speed: 8, className: "text-violet-300/20" },
        { Icon: Timer, size: 32, left: 15, top: 60, delay: 1.5, speed: 10, className: "text-violet-300/20" },
        { Icon: Medal, size: 28, left: 25, top: 25, delay: 0.8, speed: 12, className: "text-violet-300/20" },
        { Icon: Flame, size: 36, left: 80, top: 20, delay: 2, speed: 9, className: "text-violet-300/20" },
        { Icon: Heart, size: 28, left: 85, top: 65, delay: 1, speed: 11, className: "text-violet-300/20" },
        { Icon: Apple, size: 24, left: 10, top: 80, delay: 2.5, speed: 10, className: "text-violet-300/20" },
        { Icon: Coffee, size: 20, left: 70, top: 10, delay: 0.5, speed: 7, className: "text-violet-300/20" },
        { Icon: Footprints, size: 32, left: 90, top: 40, delay: 1.2, speed: 9, className: "text-violet-300/20" },
        { Icon: Bike, size: 36, left: 30, top: 70, delay: 1.8, speed: 13, className: "text-violet-300/20" }
    ];

    // Handle hover over features
    const handleFeatureHover = (index: number) => {
        setActiveFeatureIndex(index);

        // Auto-play video when hovering Expert Advice
        if (index === 2 && videoRef.current) {
            videoRef.current.play().catch(e => {
                console.error("Video autoplay failed:", e);
            });
        }
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        setActiveFeatureIndex(null);

        // Pause video when no longer hovering
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <section
            className="features-section w-full py-16 md:pt-8 md:pb-24 px-4 bg-gray-900 overflow-hidden relative"
            aria-labelledby="features-heading"
        >
            {/* Create a visual connector from Hero to Features */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent z-0"></div>

            {/* Floating fitness icons - decorative */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                {floatingIcons.map((icon, index) => renderFloatingIcon(icon, index))}
            </div>

            {/* Main content */}
            <div className="max-w-6xl mx-auto text-center relative z-10">
                <div className="inline-block mb-16">
                    <span className="text-xs font-bold tracking-widest uppercase text-violet-300 mb-2 block">Gym Experience</span>
                    <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white">
                        Powerful Features <br />
                        <span className="bg-gradient-to-r from-violet-300 to-fuchsia-400 text-transparent bg-clip-text text-gradient" data-text="For Serious Athletes">For Serious Athletes</span>
                    </h2>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index}>
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                gradient={feature.gradient}
                                demoComponent={feature.demoComponent}
                                isActive={activeFeatureIndex === index}
                                onMouseEnter={() => handleFeatureHover(index)}
                                onMouseLeave={handleMouseLeave}
                                darkMode={true}
                            />
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mt-16">
                    <a
                        href="#"
                        className="inline-flex items-center justify-center bg-gradient-to-r from-violet-300 to-fuchsia-400 hover:from-violet-400 hover:to-fuchsia-500 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg shadow-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 button primary"
                        aria-label="Start your fitness journey"
                    >
                        Level Up Your Training
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Features; 