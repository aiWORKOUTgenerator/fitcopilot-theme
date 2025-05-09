import { ArrowRight } from 'lucide-react';
import React from 'react';
import Button from '../../../../../components/UI/Button';
import { BenefitsList, ProgramCard } from '../../components';
import { useTrainingPrograms } from '../../hooks';
import '../../styles/theme-variants.scss';
import { TrainingProps } from '../../types';

/**
 * Minimalist variant of the Training component
 * 
 * Features clean, distraction-free design with reduced visual elements
 * 
 * @param props Component props
 * @returns Minimalist Training component
 */
const MinimalistTraining: React.FC<TrainingProps> = ({
    programs,
    sectionTitle = "Training Programs",
    sectionDescription = "Focused training solutions designed to deliver results with simplified methodology and clear progression."
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
        <section className="training-section training-section--minimalist">
            {/* Header with minimalist aesthetic */}
            <div className="training-section__header">
                <span className="training-section__header-tag">Training</span>
                <h2 className="training-section__header-title">
                    {sectionTitle}
                </h2>
                <p className="training-section__header-description">
                    {sectionDescription}
                </p>
            </div>

            {/* Programs list */}
            <div className="training-section__programs">
                {programData.map((program, index) => (
                    <div key={index} className="relative">
                        {/* Program Card - using minimalist styling */}
                        <ProgramCard
                            program={program}
                            isActive={selectedProgram === index}
                            onToggle={() => toggleProgramDetails(index)}
                            variant="minimalist"
                        />

                        {/* Expanded Content */}
                        {selectedProgram === index && (
                            <div className="training-expanded">
                                <h4 className="training-expanded__title">Benefits</h4>

                                {/* Benefits List */}
                                <BenefitsList
                                    benefits={program.benefits}
                                    variant="minimalist"
                                    className="training-expanded__benefits"
                                />

                                {/* CTA Button */}
                                <div className="training-expanded__cta mt-8">
                                    <Button
                                        variant="secondary"
                                        size="medium"
                                        rightIcon={<ArrowRight size={16} />}
                                        onClick={() => navigateToProgram(program.title)}
                                    >
                                        View {program.title}
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
                    Select Program
                </Button>
            </div>
        </section>
    );
};

export default MinimalistTraining; 