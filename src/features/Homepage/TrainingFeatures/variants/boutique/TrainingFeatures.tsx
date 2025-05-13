import {
    BookMarked,
    ChevronRight,
    Compass,
    Dumbbell,
    Heart
} from 'lucide-react';
import React, { useState } from 'react';
import { Section } from '../../../../../components/shared';
import { Button } from '../../../../../features/shared/Button';
import '../../TrainingFeatures.scss';
import { BoutiqueVariantProps, TrainingFeature } from '../../types';

/**
 * Boutique theme variant of the TrainingFeatures component for the homepage
 * 
 * Features an elegant, personalized design with luxury aesthetics and refined typography
 */
const BoutiqueTrainingFeatures: React.FC<BoutiqueVariantProps> = (props) => {
    const {
        features: customFeatures,
        sectionTitle = "Premium Training Features",
        sectionDescription = "Elevate your fitness journey with our exclusive training technology",
        sectionTagText = "Exclusive Features",
        className = ''
    } = props;

    // Default features for boutique variant
    const defaultFeatures: TrainingFeature[] = [
        {
            icon: <Dumbbell size={24} />,
            title: "Personalized Programs",
            description: "Custom-tailored workout programs designed specifically for your unique fitness profile and goals.",
            gradient: "from-rose-400 to-rose-600",
            flipFront: "Workouts designed exclusively for you.",
            flipBack: {
                title: "Tailored Approach",
                details: [
                    "Custom exercise selection",
                    "Progression aligned to your goals",
                    "Adapted to your preferences",
                    "Regular program refinement"
                ]
            }
        },
        {
            icon: <Heart size={24} />,
            title: "Recovery Tracking",
            description: "Advanced recovery metrics to ensure optimal rest periods and peak performance for each session.",
            gradient: "from-amber-400 to-amber-600",
            flipFront: "Monitor your body's recovery for optimal results.",
            flipBack: {
                title: "Holistic Recovery",
                details: [
                    "Heart rate variability tracking",
                    "Sleep quality assessment",
                    "Stress level monitoring",
                    "Recovery recommendations"
                ]
            }
        },
        {
            icon: <Compass size={24} />,
            title: "Goal Alignment",
            description: "Intelligent goal-setting that adapts to your progress and keeps your training perfectly aligned.",
            gradient: "from-blue-400 to-blue-600",
            flipFront: "Stay on course with smart goal tracking.",
            flipBack: {
                title: "Goal Mastery",
                details: [
                    "Milestone celebration system",
                    "Progress visualization",
                    "Regular goal reassessment",
                    "Achievement rewards"
                ]
            }
        },
        {
            icon: <BookMarked size={24} />,
            title: "Nutrition Integration",
            description: "Seamless nutrition tracking that synchronizes with your training program for complete wellness.",
            gradient: "from-emerald-400 to-emerald-600",
            flipFront: "Fuel your body with precision.",
            flipBack: {
                title: "Nutritional Excellence",
                details: [
                    "Meal planning assistance",
                    "Macronutrient optimization",
                    "Hydration monitoring",
                    "Supplement recommendations"
                ]
            }
        }
    ];

    // Use custom features if provided, otherwise use defaults
    const features = customFeatures || defaultFeatures;

    // State for tracking the expanded feature
    const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

    const toggleFeature = (index: number) => {
        setExpandedFeature(expandedFeature === index ? null : index);
    };

    // Create props for the Section component
    const sectionProps = {
        id: "training-features",
        className: "training-features-section training-features--boutique",
        backgroundColor: "secondary" as const,
        backgroundVariant: "gradient" as const,
        spacing: "lg" as const,
        variant: "classic" as const
    };

    return (
        <Section {...sectionProps}>
            <div className="training-features__header text-center mb-16">
                <span className="text-xs font-bold tracking-widest uppercase text-rose-300 mb-2 block">{sectionTagText}</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{sectionTitle}</h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{sectionDescription}</p>
            </div>

            <div className="training-features__grid grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`training-features__card group rounded-xl p-6 transition-all duration-300 hover:shadow-xl 
                            ${expandedFeature === index ? 'border-2 border-rose-400' : 'border border-gray-700'}`}
                        onClick={() => toggleFeature(index)}
                    >
                        <div className="training-features__card-header flex items-center mb-4">
                            <div className={`training-features__card-icon p-3 rounded-lg mr-4 bg-gradient-to-br ${feature.gradient}`}>
                                {feature.icon}
                            </div>
                            <h3 className="training-features__card-title text-xl font-serif font-bold">{feature.title}</h3>
                        </div>
                        <p className="training-features__card-description text-gray-300 mb-4">{feature.description}</p>

                        {expandedFeature === index && (
                            <div className="training-features__card-details mt-4 pt-4 border-t border-gray-700">
                                <h4 className="font-medium text-rose-300 mb-2 font-serif">{feature.flipBack.title}:</h4>
                                <ul className="text-gray-300">
                                    {feature.flipBack.details.map((detail, detailIndex) => (
                                        <li key={detailIndex} className="mb-2 flex items-start">
                                            <ChevronRight size={16} className="text-rose-300 mt-1 mr-2 flex-shrink-0" />
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 text-rose-300 font-serif"
                        >
                            {expandedFeature === index ? 'Show Less' : 'Learn More'}
                            <ChevronRight size={16} className="ml-2" />
                        </Button>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default BoutiqueTrainingFeatures; 