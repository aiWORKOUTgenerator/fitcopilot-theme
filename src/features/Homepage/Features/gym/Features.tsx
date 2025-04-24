import { Activity, BellRing, Clock, Dumbbell, FastForward, Flame, Heart, MessageCircle, Timer, Users, Zap } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import '../Features.css';
import '../Features.scss';
import FeatureCard from '../components/FeatureCard';
import { FeaturesProps } from '../types';

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
 * Sample workout component for the Strength Training feature
 */
export const SampleWorkout: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="bg-black/50 rounded-lg px-4 py-3 mb-3">
                <h4 className="text-red-500 font-bold mb-2">Today's Strength Workout</h4>
                <ul className="text-gray-200 text-sm">
                    <li className="flex justify-between mb-2">
                        <span>Dynamic Warmup</span>
                        <span>5 min</span>
                    </li>
                    <li className="flex justify-between mb-2">
                        <span>Barbell Squats</span>
                        <span>4 x 8</span>
                    </li>
                    <li className="flex justify-between mb-2">
                        <span>Deadlifts</span>
                        <span>4 x 6</span>
                    </li>
                    <li className="flex justify-between mb-2">
                        <span>Bench Press</span>
                        <span>4 x 8</span>
                    </li>
                    <li className="flex justify-between mb-2">
                        <span>Pull-ups</span>
                        <span>3 x 10</span>
                    </li>
                    <li className="flex justify-between mb-2">
                        <span>Core Circuit</span>
                        <span>3 rounds</span>
                    </li>
                </ul>
            </div>
            <div className="flex-1 bg-black/50 rounded-lg p-3 text-gray-200 text-sm">
                <div className="flex justify-between mb-2">
                    <span className="text-red-500 font-semibold">Estimated time:</span>
                    <span>45 minutes</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-red-500 font-semibold">Difficulty:</span>
                    <span>Intermediate</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-red-500 font-semibold">Calories:</span>
                    <span>~450</span>
                </div>
            </div>
        </div>
    );
};

/**
 * Progress chart component for the Strength Progress feature
 */
export const ProgressChart: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="bg-black/50 rounded-lg p-4 h-full">
                <h4 className="text-red-500 font-bold mb-3">Strength Progress</h4>
                <div className="relative h-[170px] w-full">
                    {/* Chart grid */}
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className="border-[0.5px] border-gray-700"
                            />
                        ))}
                    </div>

                    {/* Chart line */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden">
                        <div
                            className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 to-red-400"
                            style={{
                                clipPath: 'polygon(0% 100%, 5% 70%, 15% 85%, 25% 50%, 40% 60%, 50% 20%, 65% 40%, 75% 15%, 85% 30%, 95% 10%, 100% 25%, 100% 100%, 0% 100%)'
                            }}
                        />
                    </div>

                    {/* Data points */}
                    {[
                        { x: '5%', y: '70%' },
                        { x: '15%', y: '85%' },
                        { x: '25%', y: '50%' },
                        { x: '40%', y: '60%' },
                        { x: '50%', y: '20%' },
                        { x: '65%', y: '40%' },
                        { x: '75%', y: '15%' },
                        { x: '85%', y: '30%' },
                        { x: '95%', y: '10%' },
                    ].map((point, i) => (
                        <div
                            key={i}
                            className="absolute h-3 w-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                            style={{ left: point.x, top: point.y }}
                        />
                    ))}

                    {/* X-axis labels */}
                    <div className="absolute bottom-[-20px] left-0 w-full flex justify-between text-xs text-gray-400">
                        <span>Week 1</span>
                        <span>Week 4</span>
                        <span>Week 8</span>
                        <span>Week 12</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Video player component for the Training Advice feature
 */
export const VideoPlayer = forwardRef<HTMLVideoElement>((_, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Update play state when video state changes
    useEffect(() => {
        const videoElement = ref as React.RefObject<HTMLVideoElement>;
        if (!videoElement.current) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        videoElement.current.addEventListener('play', handlePlay);
        videoElement.current.addEventListener('pause', handlePause);

        return () => {
            if (videoElement.current) {
                videoElement.current.removeEventListener('play', handlePlay);
                videoElement.current.removeEventListener('pause', handlePause);
            }
        };
    }, [ref]);

    return (
        <div className="h-full flex flex-col">
            <div className="bg-black/50 rounded-lg h-full relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
                />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[15px] border-l-white ml-1"></div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h5 className="text-white font-bold mb-1">Form Check: Perfect Squat</h5>
                    <div className="flex items-center text-gray-300 text-xs">
                        <span>5:24</span>
                        <span className="mx-2">•</span>
                        <span>Coach Mike</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Add display name for forwarded ref component
VideoPlayer.displayName = 'VideoPlayer';

/**
 * Interface for feature data
 */
interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    demoComponent: React.ReactNode;
}

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
 * Features section component - Gym variant
 */
const Features: React.FC<FeaturesProps> = ({
    features: _features = [],
}) => {
    // Only tracking currentDemoIndex since hoveredIndex isn't being used
    const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const featureItems: Feature[] = [
        {
            icon: <Dumbbell size={48} className="text-red-500 group-hover:scale-110 transition-transform duration-300" />,
            title: "Strength Training",
            description: "Progressive overload programs designed to maximize muscle growth and raw power.",
            gradient: "from-red-500/20 to-orange-500/20",
            demoComponent: <SampleWorkout />
        },
        {
            icon: <Activity size={48} className="text-red-500 group-hover:scale-110 transition-transform duration-300" />,
            title: "Performance Tracking",
            description: "Track your personal records, see your strength progress, and visualize gains.",
            gradient: "from-red-500/20 to-orange-500/20",
            demoComponent: <ProgressChart />
        },
        {
            icon: <MessageCircle size={48} className="text-red-500 group-hover:scale-110 transition-transform duration-300" />,
            title: "Training Advice",
            description: "Expert form guidance and technique tips from professional bodybuilders and trainers.",
            gradient: "from-red-500/20 to-orange-500/20",
            demoComponent: <VideoPlayer />
        }
    ];

    const floatingIcons: FloatingIconData[] = [
        { Icon: Dumbbell, size: 24, left: 5, top: 15, delay: 0, speed: 8 },
        { Icon: Timer, size: 32, left: 15, top: 60, delay: 1.5, speed: 10 },
        { Icon: Heart, size: 28, left: 25, top: 25, delay: 0.8, speed: 12 },
        { Icon: Flame, size: 36, left: 80, top: 20, delay: 2, speed: 9 },
        { Icon: BellRing, size: 28, left: 85, top: 65, delay: 1, speed: 11 },
        { Icon: FastForward, size: 24, left: 10, top: 80, delay: 2.5, speed: 10 },
        { Icon: Users, size: 20, left: 70, top: 10, delay: 0.5, speed: 7 },
        { Icon: Clock, size: 32, left: 90, top: 40, delay: 1.2, speed: 9 },
        { Icon: Zap, size: 36, left: 30, top: 70, delay: 1.8, speed: 13 }
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
            className="w-full py-16 md:pt-8 md:pb-24 px-4 overflow-hidden relative bg-gradient-to-b from-gray-900 to-black"
            aria-labelledby="features-heading"
        >
            {/* Radial gradient overlay */}
            <div
                className="absolute inset-0 bg-radial-gradient"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.08) 0%, rgba(0, 0, 0, 0) 70%)'
                }}
                aria-hidden="true"
            ></div>

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
                        <icon.Icon size={icon.size} className="text-red-500/20" />
                    </FloatingIcon>
                ))}
            </div>

            {/* Main content */}
            <div className="max-w-6xl mx-auto text-center relative z-10">
                <div className="inline-block mb-16">
                    <span className="text-xs font-bold tracking-widest uppercase text-red-500 mb-2 block">Gym Features</span>
                    <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white">
                        Transform Your Body <br />
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text text-gradient" data-text="With Our Gym Features">With Our Gym Features</span>
                    </h2>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featureItems.map((feature, index) => (
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
                            darkMode={true}
                        />
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mt-16">
                    <a
                        href="https://aigymengine.com/workout-generator-registration"
                        className="inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-red-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 button primary"
                        aria-label="Start your gym journey"
                    >
                        Start Your Transformation
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Features; 