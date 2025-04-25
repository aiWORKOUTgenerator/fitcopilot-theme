import {
    BarChart,
    Calendar,
    ChevronRight,
    Download,
    Info,
    MessageSquare,
    RotateCw,
    Smartphone,
    Video
} from 'lucide-react';
import React, { useState } from 'react';
import '../TrainingFeatures.scss';

/**
 * Gym variant of Training Features component
 */
const TrainingFeatures: React.FC = () => {
    const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

    // Training features data with gym-focused content
    const trainingFeatures = [
        {
            icon: <Video size={24} className="text-white" />,
            title: "Live Virtual Sessions",
            description: "Connect with professional trainers for personalized coaching sessions.",
            gradient: "from-violet-600 to-purple-600",
            flipFront: "Train with the world's best coaches no matter where you are located.",
            flipBack: {
                title: "Professional Virtual Sessions",
                image: "/assets/features/virtual-session.jpg", // Replace with actual image path
                details: [
                    "4K video streaming capability",
                    "Multi-angle viewing options",
                    "Private and group session options",
                    "International trainer network"
                ]
            }
        },
        {
            icon: <Calendar size={24} className="text-white" />,
            title: "Flexible Scheduling",
            description: "Book sessions 24/7 with our intuitive scheduling system.",
            gradient: "from-fuchsia-600 to-pink-600",
            flipFront: "Our gym never sleeps. Schedule sessions that work with your lifestyle.",
            flipBack: {
                title: "Advanced Scheduling",
                image: "/assets/features/calendar.jpg", // Replace with actual image path
                details: [
                    "Google/Apple calendar integration",
                    "Smart scheduling suggestions",
                    "Priority booking for members",
                    "Last-minute availability alerts"
                ]
            }
        },
        {
            icon: <BarChart size={24} className="text-white" />,
            title: "Progress Analytics",
            description: "Comprehensive tracking and analysis of your fitness journey.",
            gradient: "from-blue-600 to-indigo-600",
            flipFront: "Make data-driven decisions with our comprehensive analytics platform.",
            flipBack: {
                title: "Performance Metrics",
                image: "/assets/features/progress-tracking.jpg", // Replace with actual image path
                details: [
                    "3D body composition scanning",
                    "Strength and endurance benchmarking",
                    "Nutrition and workout correlation",
                    "Recovery and readiness scoring"
                ]
            }
        },
        {
            icon: <MessageSquare size={24} className="text-white" />,
            title: "Expert Guidance",
            description: "Direct access to trainers and nutritionists for personalized advice.",
            gradient: "from-pink-600 to-rose-600",
            flipFront: "Get answers to your fitness and nutrition questions from certified professionals.",
            flipBack: {
                title: "Continuous Support",
                image: "/assets/features/support.jpg", // Replace with actual image path
                details: [
                    "Video form check submissions",
                    "Weekly progress reviews",
                    "Nutritionist consultations",
                    "Dedicated account manager"
                ]
            }
        },
        {
            icon: <Download size={24} className="text-white" />,
            title: "Premium Workout Library",
            description: "Access thousands of professionally designed workout programs.",
            gradient: "from-violet-600 to-purple-600",
            flipFront: "Browse our extensive collection of workouts designed by elite trainers.",
            flipBack: {
                title: "Pro Workout Database",
                image: "/assets/features/custom-workout.jpg", // Replace with actual image path
                details: [
                    "Filter by equipment available",
                    "Periodized programming",
                    "Sport-specific training options",
                    "Difficulty progression system"
                ]
            }
        },
        {
            icon: <Smartphone size={24} className="text-white" />,
            title: "Connected Experience",
            description: "Seamless integration with fitness devices and wearables.",
            gradient: "from-blue-600 to-indigo-600",
            flipFront: "Connect your favorite fitness devices for a fully integrated training experience.",
            flipBack: {
                title: "Smart Integration",
                image: "/assets/features/mobile.jpg", // Replace with actual image path
                details: [
                    "Apple Watch & Garmin support",
                    "Heart rate training zones",
                    "Sleep quality analysis",
                    "Recovery recommendation engine"
                ]
            }
        }
    ];

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
        <section className="py-20 px-4 bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-70"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-xs font-bold tracking-widest uppercase text-violet-600 mb-2 block">Advanced Features</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Elite <span className="bg-gradient-to-r from-violet-600 to-purple-600 text-transparent bg-clip-text">Training Solutions</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our premium platform delivers professional-grade tools and personalized coaching to help you achieve extraordinary results.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {trainingFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex flex-col h-full">
                                {/* Feature Header */}
                                <div className={`h-2 w-full bg-gradient-to-r ${feature.gradient}`}></div>

                                {/* Feature Content */}
                                <div className="p-6">
                                    <div className="flex items-start mb-4">
                                        <div className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 text-sm mb-4">{feature.flipFront}</p>

                                    {/* Flip Card */}
                                    <div className="h-48 relative perspective-container mt-4">
                                        <div
                                            className={`flip-card ${flippedCards[index] ? 'flipped' : ''}`}
                                            onClick={() => toggleFlip(index)}
                                        >
                                            {/* Front Side */}
                                            <div className="flip-front bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg flex flex-col justify-center items-center">
                                                {feature.flipBack.image && !feature.flipBack.image.includes('/assets/features') ? (
                                                    <img
                                                        src={feature.flipBack.image}
                                                        alt={feature.title}
                                                        className="mb-2 rounded"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-24 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-lg mb-2 flex items-center justify-center`}>
                                                        {React.cloneElement(feature.icon, { size: 32, className: "text-gray-700 opacity-60" })}
                                                    </div>
                                                )}
                                                <button
                                                    className={`text-xs flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-medium`}
                                                    onClick={(e) => toggleFlip(index, e)}
                                                >
                                                    <Info size={12} className="mr-1" />
                                                    View Details
                                                </button>
                                            </div>

                                            {/* Back Side */}
                                            <div className="flip-back bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                                                <h4 className={`text-sm font-bold mb-3 bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text`}>
                                                    {feature.flipBack.title}
                                                </h4>
                                                <ul className="feature-details space-y-1 mb-3">
                                                    {feature.flipBack.details.map((detail, i) => (
                                                        <li key={i} className="flex items-start text-xs text-gray-700">
                                                            <span className={`detail-bullet text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`}>•</span>
                                                            <span className="ml-1">{detail}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    onClick={(e) => toggleFlip(index, e)}
                                                    className="flip-button text-xs text-violet-600 hover:text-violet-800 transition-colors"
                                                >
                                                    <RotateCw size={10} className="mr-1" />
                                                    Back
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-16">
                    <button className="cta-button px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300">
                        Get Started Today
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TrainingFeatures; 