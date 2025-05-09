import {
    Apple,
    BarChart,
    Bike,
    Calendar,
    ChevronRight,
    Coffee,
    Download,
    Dumbbell,
    Flame,
    Footprints,
    Heart,
    Info,
    Medal,
    MessageSquare,
    RotateCw,
    Smartphone,
    Timer,
    Video
} from 'lucide-react';
import React, { useState } from 'react';
import Button from '../../../components/UI/Button';
import { MediaContainer } from './components';
import './TrainingFeatures.scss';
import { DefaultVariantProps, TrainingFeature } from './types';

/**
 * FloatingIcon component for decorative background
 */
interface FloatingIconProps {
    children: React.ReactNode;
    delay: number;
    speed: number;
    left: number;
    top: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
    children,
    delay,
    speed,
    left,
    top
}) => {
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
 * Default Training Features component for the homepage
 */
const TrainingFeatures: React.FC<DefaultVariantProps> = (props) => {
    const {
        features: customFeatures,
        sectionTitle = "Comprehensive Training Features",
        sectionDescription = "Our training platform includes everything you need to succeed on your fitness journey, from cutting-edge tools to personalized support.",
        sectionTagText = "Premium Experience",
        variant = 'default',
        className = '',
    } = props;

    const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

    // Floating icons data - similar to Features section
    const floatingIcons = [
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

    // Default training features data
    const defaultFeatures: TrainingFeature[] = [
        {
            icon: <Video size={24} className="text-gray-900" />,
            title: "Live Virtual Sessions",
            description: "Real-time coaching and feedback from anywhere in the world.",
            gradient: "from-lime-300 to-emerald-400",
            flipFront: "Get expert coaching from anywhere with our high-quality video platform.",
            media: {
                type: 'video',
                src: '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/Drone Video 3.mp4',
                poster: '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/drone-video-poster.jpg',
                alt: 'Aerial drone footage showing fitness activities',
                fallbackSrc: [
                    {
                        src: '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/Drone Video 3.webm',
                        type: 'video/webm'
                    }
                ]
            },
            flipBack: {
                title: "Live Virtual Session",
                details: [
                    "HD video with crystal clear audio",
                    "Screen sharing for technique analysis",
                    "Record sessions for later review",
                    "Works on any device"
                ]
            }
        },
        {
            icon: <Calendar size={24} className="text-gray-900" />,
            title: "Flexible Scheduling",
            description: "Book sessions when it works for you with easy rescheduling.",
            gradient: "from-cyan-300 to-blue-400",
            flipFront: "Life gets busy. Our flexible scheduling adapts to your changing needs.",
            media: {
                type: 'image',
                src: '/assets/features/calendar.jpg',
                alt: 'Calendar scheduling interface showing workout appointments'
            },
            flipBack: {
                title: "Smart Calendar",
                details: [
                    "24/7 online booking system",
                    "Automated reminders and notifications",
                    "Easy rescheduling with no fees",
                    "Time zone intelligent"
                ]
            }
        },
        {
            icon: <BarChart size={24} className="text-gray-900" />,
            title: "Progress Tracking",
            description: "Detailed metrics and benchmarks to visualize your improvement.",
            gradient: "from-violet-300 to-purple-400",
            flipFront: "Track every aspect of your fitness journey with intuitive visualizations.",
            media: {
                type: 'image',
                src: '/assets/features/progress-tracking.jpg',
                alt: 'Fitness progress dashboard with charts and metrics'
            },
            flipBack: {
                title: "Data Insights",
                details: [
                    "Custom progress dashboards",
                    "Performance trend analysis",
                    "Goal achievement tracking",
                    "Body composition metrics"
                ]
            }
        },
        {
            icon: <MessageSquare size={24} className="text-gray-900" />,
            title: "Continuous Support",
            description: "Direct messaging with your trainer between sessions.",
            gradient: "from-amber-300 to-orange-400",
            flipFront: "Questions between sessions? Your trainer is just a message away.",
            media: {
                type: 'image',
                src: '/assets/features/support.jpg',
                alt: 'Trainer and client messaging interface'
            },
            flipBack: {
                title: "Always Connected",
                details: [
                    "Encrypted private messaging",
                    "Share photos and videos for form checks",
                    "Quick response time guarantee",
                    "Access to knowledge base"
                ]
            }
        },
        {
            icon: <Download size={24} className="text-gray-900" />,
            title: "Custom Workouts",
            description: "Personalized training plans designed for your specific goals.",
            gradient: "from-lime-300 to-emerald-400",
            flipFront: "Every workout is designed specifically for your body, goals, and equipment.",
            media: {
                type: 'image',
                src: '/assets/features/custom-workout.jpg',
                alt: 'Customized workout plan'
            },
            flipBack: {
                title: "Tailored Programs",
                details: [
                    "AI-assisted program design",
                    "Adapts to your progress rate",
                    "Equipment-flexible options",
                    "Recovery-optimized scheduling"
                ]
            }
        },
        {
            icon: <Smartphone size={24} className="text-gray-900" />,
            title: "Mobile Experience",
            description: "Access your training plan and resources on any device.",
            gradient: "from-cyan-300 to-blue-400",
            flipFront: "Your entire fitness plan in your pocket, accessible anywhere and anytime.",
            media: {
                type: 'image',
                src: '/assets/features/mobile.jpg',
                alt: 'Mobile app interface showing workout details'
            },
            flipBack: {
                title: "Mobile-First Design",
                details: [
                    "Works offline for gym usage",
                    "Exercise video library",
                    "Voice-guided workouts",
                    "Wearable device integration"
                ]
            }
        }
    ];

    // Use custom features if provided, otherwise use defaults
    const trainingFeatures = customFeatures || defaultFeatures;

    // Toggle flip for a specific card
    const toggleFlip = (index: number, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }

        setFlippedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <section
            className={`training-features-section w-full py-16 md:pt-8 md:pb-24 px-4 relative overflow-hidden ${className}`}
            data-theme={variant}
            id="training-features"
        >
            {/* Create a visual connector from previous section */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background-primary to-transparent z-0"></div>

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
                        <icon.Icon size={icon.size} />
                    </FloatingIcon>
                ))}
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">{sectionTagText}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">{sectionTitle}</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">{sectionDescription}</p>
                </div>

                {/* Features List */}
                <div className="space-y-8">
                    {trainingFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card rounded-xl border border-gray-700 hover:border-lime-300/30 transition-all duration-300 hover:shadow-lg hover:shadow-lime-300/10"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Feature Info - Left Side */}
                                <div className="p-6 md:w-1/2">
                                    <div className="flex items-start">
                                        <div className={`feature-icon bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                                            {feature.icon}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="feature-title text-white text-lg mb-2 hover:text-lime-300 transition-colors">{feature.title}</h3>
                                            <p className="feature-description text-gray-400 hover:text-gray-300 transition-colors">{feature.description}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mt-4">{feature.flipFront}</p>
                                    <Button
                                        variant="ghost"
                                        size="small"
                                        className="mt-4 text-lime-300 hover:text-lime-400"
                                        onClick={(e) => toggleFlip(index, e)}
                                    >
                                        <Info size={16} className="mr-1" />
                                        See more details
                                    </Button>
                                </div>

                                {/* Flip Card - Right Side */}
                                <div className="md:w-1/2 h-80 relative perspective-container">
                                    <div
                                        className={`flip-card ${flippedCards[index] ? 'flipped' : ''}`}
                                        onClick={() => toggleFlip(index)}
                                    >
                                        {/* Front Side */}
                                        <div className="flip-front bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-r-xl">
                                            {feature.media ? (
                                                <>
                                                    <MediaContainer
                                                        src={feature.media.src}
                                                        type={feature.media.type}
                                                        aspectRatio="16/9"
                                                        alt={feature.media.alt || feature.title}
                                                        poster={feature.media.type === 'video' ? feature.media.poster : undefined}
                                                        fallbackSrc={feature.media.type === 'video' ? feature.media.fallbackSrc : undefined}
                                                        controls={feature.media.type === 'video'}
                                                        muted={true}
                                                        autoPlay={false}
                                                        autoPlayOnScroll={feature.media.type === 'video'}
                                                    />
                                                    <p className="text-gray-300 text-sm italic text-center">Click to explore feature details</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={`w-full h-48 bg-gradient-to-br ${feature.gradient} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                                                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                                            {React.isValidElement(feature.icon)
                                                                ? <div className="text-white opacity-80">{feature.icon}</div>
                                                                : <div className="text-white opacity-80" style={{ width: 32, height: 32 }}></div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300 text-sm italic text-center mt-4">Click to explore feature details</p>
                                                </>
                                            )}
                                        </div>

                                        {/* Back Side */}
                                        <div className="flip-back bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-r-xl">
                                            <h4 className={`flip-back-title bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text`}>
                                                {feature.flipBack.title}
                                            </h4>
                                            <ul className="feature-details text-sm text-gray-300 space-y-2">
                                                {feature.flipBack.details.map((detail, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="detail-bullet text-lime-300 mr-2">•</span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                variant="ghost"
                                                size="small"
                                                className="mt-2 text-xs text-lime-300 hover:text-lime-400"
                                                onClick={(e) => toggleFlip(index, e)}
                                            >
                                                <RotateCw size={12} className="mr-1" />
                                                Flip back
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-16">
                    <Button
                        variant="primary"
                        className="bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Explore All Features
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default TrainingFeatures; 