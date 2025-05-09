import {
    BarChart,
    Calendar,
    ChevronRight,
    Info,
    RotateCw,
    Smartphone,
    Video
} from 'lucide-react';
import React, { useState } from 'react';
import { Section } from '../../../../../components/shared';
import Button from '../../../../../components/UI/Button';
import '../../TrainingFeatures.scss';
import { ModernVariantProps, TrainingFeature } from '../../types';

/**
 * Modern theme variant of the TrainingFeatures component for the homepage
 * 
 * Features a clean, tech-inspired design with glass morphism effects, vibrant gradients,
 * and interactive elements that showcase the cutting-edge nature of the platform.
 */
const ModernTrainingFeatures: React.FC<ModernVariantProps> = (props) => {
    const {
        features: customFeatures,
        sectionTitle = "Next-Gen Training Technology",
        sectionDescription = "Experience the future of fitness with AI-powered training tools that adapt to your unique profile",
        sectionTagText = "Advanced Tech",
        variant = "modern",
        className = ''
    } = props;

    // Default features for modern variant
    const defaultFeatures: TrainingFeature[] = [
        {
            icon: <BarChart size={24} />,
            title: "Performance Analytics",
            description: "Real-time visualization of your progress with AI-powered insights and predictive modeling.",
            gradient: "from-blue-400 to-indigo-600",
            flipFront: "Track every metric that matters to your fitness journey.",
            flipBack: {
                title: "Smart Analytics",
                details: [
                    "Real-time performance tracking",
                    "Personalized insight reports",
                    "Predictive performance modeling",
                    "Goal progression visualization"
                ]
            }
        },
        {
            icon: <Calendar size={24} />,
            title: "Adaptive Scheduling",
            description: "Smart calendar that continually optimizes your training based on performance, recovery, and lifestyle.",
            gradient: "from-violet-400 to-purple-600",
            flipFront: "Your training schedule adapts as you progress and your life changes.",
            flipBack: {
                title: "Intelligent Planning",
                details: [
                    "Recovery-optimized programming",
                    "Sleep quality integration",
                    "Stress level adjustments",
                    "Dynamic workout intensity"
                ]
            }
        },
        {
            icon: <Smartphone size={24} />,
            title: "Seamless Integration",
            description: "Connect all your devices and fitness apps into one unified ecosystem for complete tracking.",
            gradient: "from-amber-400 to-orange-600",
            flipFront: "Bring your entire fitness ecosystem into one platform.",
            flipBack: {
                title: "Connected Experience",
                details: [
                    "Cross-platform synchronization",
                    "Wearable device compatibility",
                    "Third-party app integration",
                    "Offline capability"
                ]
            }
        },
        {
            icon: <Video size={24} />,
            title: "AI Form Analysis",
            description: "Computer vision technology that provides real-time feedback on movement patterns and technique.",
            gradient: "from-emerald-400 to-teal-600",
            flipFront: "Perfect your form with instant AI-powered feedback.",
            flipBack: {
                title: "Visual Coaching",
                details: [
                    "3D movement pattern analysis",
                    "Corrective technique guidance",
                    "Injury risk assessment",
                    "Progress comparison videos"
                ]
            }
        }
    ];

    // Use custom features if provided, otherwise use defaults
    const features = customFeatures || defaultFeatures;

    // State for tracking the expanded feature
    const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
    // State for hover effect
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    const toggleFeature = (index: number) => {
        setExpandedFeature(expandedFeature === index ? null : index);
    };

    // Create props for the Section component
    const sectionProps = {
        id: "training-features",
        className: `training-features-section training-features--modern ${className}`,
        backgroundColor: "secondary" as const,
        backgroundVariant: "gradient" as const,
        spacing: "lg" as const,
        variant
    };

    return (
        <Section {...sectionProps}>
            <div className="training-features__content">
                <div className="training-features__header text-center mb-16">
                    <span className="text-xs font-bold tracking-widest uppercase text-cyan-300 mb-2 block">{sectionTagText}</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500">{sectionTitle}</h2>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">{sectionDescription}</p>
                </div>

                <div className="training-features__grid grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`training-features__card group rounded-xl p-6 transition-all duration-300 backdrop-blur-sm
                                ${expandedFeature === index
                                    ? 'border-2 border-cyan-400 bg-gray-900/80 shadow-lg shadow-cyan-700/20'
                                    : hoveredFeature === index
                                        ? 'border border-gray-600 bg-gray-800/60 shadow-md shadow-cyan-700/10'
                                        : 'border border-gray-700 bg-gray-800/40'
                                }`}
                            onClick={() => toggleFeature(index)}
                            onMouseEnter={() => setHoveredFeature(index)}
                            onMouseLeave={() => setHoveredFeature(null)}
                        >
                            <div className="training-features__card-header flex items-center mb-4">
                                <div className={`training-features__card-icon p-3 rounded-lg mr-4 bg-gradient-to-br ${feature.gradient} shadow-md transform transition-transform duration-300 ${expandedFeature === index || hoveredFeature === index ? 'scale-110' : ''}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="training-features__card-title text-xl font-bold group-hover:text-cyan-300 transition-colors duration-300">{feature.title}</h3>
                            </div>
                            <p className="training-features__card-description text-gray-300 mb-4">{feature.description}</p>

                            {expandedFeature === index && (
                                <div className="training-features__card-details mt-4 pt-4 border-t border-gray-600 animate-fadeIn">
                                    <h4 className="font-medium text-cyan-300 mb-2">Key Benefits:</h4>
                                    <ul className="text-gray-300">
                                        {feature.flipBack.details.map((detail, detailIndex) => (
                                            <li key={detailIndex} className="mb-3 flex items-start animate-slideIn" style={{ animationDelay: `${detailIndex * 100}ms` }}>
                                                <div className="p-1 rounded-full bg-cyan-900/50 mr-3 flex-shrink-0">
                                                    <ChevronRight size={14} className="text-cyan-300" />
                                                </div>
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="small"
                                className={`mt-4 ${expandedFeature === index ? 'text-white border-cyan-500 hover:bg-cyan-900/30' : 'text-cyan-300'}`}
                                rightIcon={expandedFeature === index ? <RotateCw size={16} /> : <Info size={16} />}
                            >
                                {expandedFeature === index ? 'Show Less' : 'Learn More'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes slideIn {
                        from { transform: translateX(-10px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-in-out;
                    }
                    
                    .animate-slideIn {
                        animation: slideIn 0.3s ease-out forwards;
                    }
                `
            }} />
        </Section>
    );
};

export default ModernTrainingFeatures;
