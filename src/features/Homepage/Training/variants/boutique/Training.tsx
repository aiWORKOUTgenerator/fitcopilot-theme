import { ArrowRightCircle } from 'lucide-react';
import React from 'react';
import { Button } from '../../../../../features/shared/Button';
import { BenefitsList, ProgramCard } from '../../components';
import { useTrainingPrograms } from '../../hooks';
import '../../styles/theme-variants.scss';
import { TrainingProps } from '../../types';

/**
 * Boutique variant of the Training component
 * 
 * Features elegant styling with luxury aesthetic
 * 
 * @param props Component props
 * @returns Boutique Training component
 */
const BoutiqueTraining: React.FC<TrainingProps> = ({
    programs,
    sectionTitle = "Premium Training Programs",
    sectionDescription = "Experience our exclusive training programs designed by elite fitness experts to help you reach your goals with personalized approaches."
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
        <section className="training-section training-section--boutique">
            {/* Header with luxury aesthetic */}
            <div className="training-section__header">
                <span className="training-section__header-tag">Exclusive Training</span>
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
                        {/* Program Card - using boutique styling */}
                        <ProgramCard
                            program={program}
                            isActive={selectedProgram === index}
                            onToggle={() => toggleProgramDetails(index)}
                            variant="boutique"
                        />

                        {/* Expanded Content */}
                        {selectedProgram === index && (
                            <div className="training-expanded">
                                <h4 className="training-expanded__title">Program Benefits</h4>

                                {/* Benefits List */}
                                <BenefitsList
                                    benefits={program.benefits}
                                    variant="boutique"
                                    className="training-expanded__benefits"
                                />

                                {/* CTA Button */}
                                <div className="training-expanded__cta">
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        onClick={() => navigateToProgram(program.title)}
                                    >
                                        Explore {program.title}
                                        <ArrowRightCircle size={16} className="ml-2" />
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
                    Discover Your Ideal Program
                    <ArrowRightCircle size={20} className="ml-2" />
                </Button>
            </div>
        </section>
    );
};

export default BoutiqueTraining; 