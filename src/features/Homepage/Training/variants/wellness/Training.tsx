import { Leaf } from 'lucide-react';
import React from 'react';
import { Button } from '../../../../../features/shared/Button';
import { BenefitsList, ProgramCard } from '../../components';
import { useTrainingPrograms } from '../../hooks';
import '../../styles/theme-variants.scss';
import { TrainingProps } from '../../types';

/**
 * Wellness variant of the Training component
 * 
 * Features holistic health approach with balanced, mindful aesthetic
 * 
 * @param props Component props
 * @returns Wellness Training component
 */
const WellnessTraining: React.FC<TrainingProps> = ({
    programs,
    sectionTitle = "Wellness Journeys",
    sectionDescription = "Discover holistic training approaches that balance mind, body, and spirit for complete wellbeing and sustainable health."
}) => {
    // Use the training programs hook for state management
    const {
        programs: programData,
        selectedProgram,
        toggleProgramDetails,
        navigateToProgram
    } = useTrainingPrograms({
        initialPrograms: programs
    });

    return (
        <section className="training-section training-section--wellness">
            {/* Header with wellness aesthetic */}
            <div className="training-section__header">
                <span className="training-section__header-tag">Holistic Wellness</span>
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
                        {/* Program Card - using wellness styling */}
                        <ProgramCard
                            program={program}
                            isActive={selectedProgram === index}
                            onToggle={() => toggleProgramDetails(index)}
                            variant="wellness"
                        />

                        {/* Expanded Content */}
                        {selectedProgram === index && (
                            <div className="training-expanded">
                                <h4 className="training-expanded__title">Your Wellness Path</h4>

                                {/* Benefits List */}
                                <BenefitsList
                                    benefits={program.benefits}
                                    variant="wellness"
                                    className="training-expanded__benefits"
                                />

                                {/* CTA Button */}
                                <div className="training-expanded__cta mt-8">
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        onClick={() => navigateToProgram(program.title)}
                                    >
                                        Begin Your Journey
                                        <Leaf size={16} className="ml-2" />
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
                    size="lg"
                    onClick={() => navigateToProgram('all')}
                >
                    Start Your Wellness Journey
                    <Leaf size={20} className="ml-2" />
                </Button>
            </div>
        </section>
    );
};

export default WellnessTraining; 