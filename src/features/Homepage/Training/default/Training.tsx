import {
    Activity,
    ArrowRight,
    CheckCircle,
    ChevronRight,
    Dumbbell,
    Flame,
    Zap
} from 'lucide-react';
import React, { useState } from 'react';
import Button from '../../../../components/UI/Button';
import '../Training.scss';

/**
 * Default Training Programs component for the homepage
 */
const Training: React.FC = () => {
    const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

    // Program types data
    const programTypes = [
        {
            title: "Strength Building",
            description: "Focus on compound movements and progressive overload for maximum strength gains.",
            icon: <Dumbbell size={24} className="text-lime-200" />,
            benefits: [
                "Increase overall strength and power",
                "Build functional muscle mass",
                "Improve bone density and joint health",
                "Boost metabolic rate for better fat loss"
            ],
            accentColor: "from-lime-300 to-emerald-400",
            textColor: "text-lime-200"
        },
        {
            title: "Fat Loss",
            description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
            icon: <Flame size={24} className="text-cyan-200" />,
            benefits: [
                "Sustainable fat loss without muscle loss",
                "Improved cardiovascular health",
                "Increased energy levels throughout the day",
                "Personalized nutrition strategy"
            ],
            accentColor: "from-cyan-300 to-blue-400",
            textColor: "text-cyan-200"
        },
        {
            title: "General Fitness",
            description: "Well-rounded programs balancing strength, endurance, and mobility.",
            icon: <Activity size={24} className="text-violet-200" />,
            benefits: [
                "Balanced approach to all fitness components",
                "Prevent injuries and improve daily function",
                "Adaptable to different fitness levels",
                "Focus on long-term health and wellbeing"
            ],
            accentColor: "from-violet-300 to-purple-400",
            textColor: "text-violet-200"
        },
        {
            title: "Athletic Performance",
            description: "Sport-specific training to enhance your competitive edge and results.",
            icon: <Zap size={24} className="text-amber-200" />,
            benefits: [
                "Sport-specific movement patterns",
                "Enhanced power, speed and agility",
                "Improved recovery protocols",
                "Periodized programming for competition"
            ],
            accentColor: "from-amber-300 to-orange-400",
            textColor: "text-amber-200"
        }
    ];

    // Toggle program details
    const toggleProgramDetails = (index: number) => {
        setSelectedProgram(selectedProgram === index ? null : index);
    };

    return (
        <section className="training-section w-full py-20 px-4 bg-gray-900">
            {/* Header */}
            <div className="text-center mb-16">
                <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">Training Solutions</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    Specialized <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Programs</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Our comprehensive training programs are designed to target specific fitness goals with proven methodologies and personalized approaches.
                </p>
            </div>

            {/* Programs list */}
            <div className="space-y-8 max-w-4xl mx-auto">
                {programTypes.map((program, index) => (
                    <div key={index} className="relative">
                        {/* Program Card */}
                        <div
                            className={`program-card group cursor-pointer ${selectedProgram === index ? 'active' : ''}`}
                            onClick={() => toggleProgramDetails(index)}
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Program Icon */}
                                <div className="relative">
                                    <div className={`program-icon bg-gradient-to-br ${program.accentColor}`}>
                                        {program.icon}
                                    </div>
                                </div>

                                {/* Program Information */}
                                <div className="flex-1">
                                    <h3 className={`text-xl md:text-2xl font-bold mb-2 ${program.textColor} group-hover:text-lime-300 transition-colors`}>
                                        {program.title}
                                    </h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors md:pr-12">
                                        {program.description}
                                    </p>
                                </div>

                                {/* Expand/Collapse Button */}
                                <div className={`p-2 rounded-full border border-lime-300/30 bg-lime-300/10 transition-all duration-300 ${selectedProgram === index ? 'rotate-90' : ''}`}>
                                    <ChevronRight size={20} className="text-lime-300" />
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {selectedProgram === index && (
                            <div className="expanded-content">
                                <h4 className="text-white font-semibold mb-4">Key Benefits</h4>
                                <ul className="benefits-list">
                                    {program.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckCircle className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                            <span className="text-gray-300">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <div className="text-center">
                                    <button className="cta-button">
                                        Explore {program.title}
                                        <ArrowRight size={16} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Visual connector line between programs */}
                        {index < programTypes.length - 1 && (
                            <div className="connector-line mx-auto"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main CTA */}
            <div className="text-center mt-16">
                <Button
                    variant="primary"
                    size="large"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                    onClick={() => window.location.href = 'https://builder.fitcopilot.ai/programs'}
                >
                    Find Your Perfect Program
                </Button>
            </div>
        </section>
    );
};

export default Training; 