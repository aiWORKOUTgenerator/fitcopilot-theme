import {
    ArrowRight
} from 'lucide-react';
import React from 'react';
import Button from '../../../components/UI/Button';
import { BenefitsList, ProgramCard } from './components';
import { useTrainingPrograms } from './hooks';
import './Training.scss';
import { ProgramType, TrainingProps } from './types';

/**
 * Default data for training programs
 */
const DEFAULT_PROGRAMS: ProgramType[] = [
    {
        title: "Strength Building",
        description: "Focus on compound movements and progressive overload for maximum strength gains.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-200"><path d="M6.5 6.5h11"></path><path d="M6.5 17.5h11"></path><path d="M6 12h12"></path><path d="M3 22V2"></path><path d="M21 22V2"></path></svg>, // Dumbbell icon
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-200"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>, // Flame icon
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-200"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, // Activity icon
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-200"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>, // Zap icon
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

/**
 * Default section title
 */
const DEFAULT_SECTION_TITLE = "Specialized Programs";

/**
 * Default section description
 */
const DEFAULT_SECTION_DESCRIPTION = "Our comprehensive training programs are designed to target specific fitness goals with proven methodologies and personalized approaches.";

/**
 * Training Programs component for the homepage
 * 
 * @param props - Component props
 * @returns React component
 */
const Training: React.FC<TrainingProps> = ({
    programs = DEFAULT_PROGRAMS,
    sectionTitle = DEFAULT_SECTION_TITLE,
    sectionDescription = DEFAULT_SECTION_DESCRIPTION
}) => {
    // Use the extracted hook for program state management
    const {
        programs: programData,
        selectedProgram,
        toggleProgramDetails,
        navigateToProgram
    } = useTrainingPrograms({
        initialPrograms: programs
    });

    return (
        <section className="training-section">
            {/* Header */}
            <div className="training-section__header">
                <span className="training-section__header-tag">Training Solutions</span>
                <h2 className="training-section__header-title">
                    {sectionTitle.split(' ').slice(0, -1).join(' ')}{' '}
                    <span className="training-section__header-title-highlight">
                        {sectionTitle.split(' ').slice(-1)}
                    </span>
                </h2>
                <p className="training-section__header-description">
                    {sectionDescription}
                </p>
            </div>

            {/* Programs list */}
            <div className="training-section__programs">
                {programData.map((program, index) => (
                    <div key={index} className="relative">
                        {/* Program Card - using extracted component */}
                        <ProgramCard
                            program={program}
                            isActive={selectedProgram === index}
                            onToggle={() => toggleProgramDetails(index)}
                            variant="default"
                        />

                        {/* Expanded Content */}
                        {selectedProgram === index && (
                            <div className="training-expanded">
                                <h4 className="training-expanded__title">Key Benefits</h4>

                                {/* Benefits List - using extracted component */}
                                <BenefitsList
                                    benefits={program.benefits}
                                    variant="default"
                                    className="training-expanded__benefits"
                                />

                                {/* CTA Button */}
                                <div className="training-expanded__cta">
                                    <Button
                                        variant="secondary"
                                        size="medium"
                                        rightIcon={<ArrowRight size={16} />}
                                        onClick={() => navigateToProgram(program.title)}
                                    >
                                        Explore {program.title}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Visual connector line between programs */}
                        {index < programData.length - 1 && (
                            <div className="training-connector"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main CTA */}
            <div className="training-section__cta">
                <Button
                    variant="primary"
                    size="large"
                    rightIcon={<ArrowRight size={20} />}
                    onClick={() => navigateToProgram('all')}
                >
                    Find Your Perfect Program
                </Button>
            </div>
        </section>
    );
};

export default Training; 