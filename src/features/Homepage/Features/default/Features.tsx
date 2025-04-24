import { Activity, Apple, BarChart3, Bike, Coffee, Dumbbell, Flame, Footprints, Heart, HeartHandshake, Medal, Timer } from 'lucide-react';
import React, { useRef, useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import { ProgressChart, SampleWorkout, VideoPlayer } from '../components/FeatureCardDemos';
import '../Features.scss';

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
 * Default Features component with flip cards
 */
const Features: React.FC = () => {
    const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const features = [
        {
            icon: <BarChart3 size={48} className="text-lime-300 group-hover:scale-110 transition-transform duration-300" />,
            title: "Customized Workouts",
            description: "Dynamic plans personalized to your fitness goals and equipment.",
            gradient: "from-lime-300/20 to-emerald-500/20",
            demoComponent: <SampleWorkout />
        },
        {
            icon: <Activity size={48} className="text-lime-300 group-hover:scale-110 transition-transform duration-300" />,
            title: "Real-Time Tracking",
            description: "Instantly monitor and visualize your progress and achievements.",
            gradient: "from-lime-300/20 to-cyan-500/20",
            demoComponent: <ProgressChart />
        },
        {
            icon: <HeartHandshake size={48} className="text-lime-300 group-hover:scale-110 transition-transform duration-300" />,
            title: "Expert Advice",
            description: "Receive guidance and tips from professional fitness experts.",
            gradient: "from-lime-300/20 to-purple-500/20",
            demoComponent: <VideoPlayer ref={videoRef} />
        }
    ];

    const floatingIcons: FloatingIconData[] = [
        { Icon: Dumbbell, size: 24, left: 5, top: 15, delay: 0, speed: 8 },
        { Icon: Timer, size: 32, left: 15, top: 60, delay: 1.5, speed: 10 },
        { Icon: Medal, size: 28, left: 25, top: 25, delay: 0.8, speed: 12 },
        { Icon: Flame, size: 36, left: 80, top: 20, delay: 2, speed: 9 },
        { Icon: Heart, size: 28, left: 85, top: 65, delay: 1, speed: 11 },
        { Icon: Apple, size: 24, left: 10, top: 80, delay: 2.5, speed: 10 },
        { Icon: Coffee, size: 20, left: 70, top: 10, delay: 0.5, speed: 7 },
        { Icon: Footprints, size: 32, left: 90, top: 40, delay: 1.2, speed: 9 },
        { Icon: Bike, size: 36, left: 30, top: 70, delay: 1.8, speed: 13 }
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
                {floatingIcons.map((icon, index) => (
                    <FloatingIcon
                        key={index}
                        left={icon.left}
                        top={icon.top}
                        delay={icon.delay}
                        speed={icon.speed}
                    >
                        <icon.Icon size={icon.size} className="text-lime-300/20" />
                    </FloatingIcon>
                ))}
            </div>

            {/* Main content */}
            <div className="max-w-6xl mx-auto text-center relative z-10">
                <div className="inline-block mb-16">
                    <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">Fitness Evolution</span>
                    <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white">
                        Innovative Features <br />
                        <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient" data-text="Tailored for You">Tailored for You</span>
                    </h2>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            gradient={feature.gradient}
                            demoComponent={index === 2 ? <VideoPlayer ref={videoRef} /> : feature.demoComponent}
                            isActive={activeFeatureIndex === index}
                            onMouseEnter={() => handleFeatureHover(index)}
                            onMouseLeave={handleMouseLeave}
                        />
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mt-16">
                    <a
                        href="https://aigymengine.com/workout-generator-registration"
                        className="inline-flex items-center justify-center bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg shadow-lime-300/30 transition-all duration-300 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-gray-900 button primary"
                        aria-label="Start your fitness journey"
                    >
                        Start Your Fitness Journey
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Features; 