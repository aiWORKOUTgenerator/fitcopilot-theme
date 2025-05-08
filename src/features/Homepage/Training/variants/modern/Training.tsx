import { ArrowRight } from 'lucide-react';
import React from 'react';
import Button from '../../../../../components/UI/Button';
import { BenefitsList, ProgramCard } from '../../components';
import { useTrainingPrograms } from '../../hooks';
import '../../styles/theme-variants.scss';
import { TrainingProps } from '../../types';

/**
 * Modern variant of the Training component
 * 
 * Features sleek, tech-focused design with contemporary aesthetic
 * 
 * @param props Component props
 * @returns Modern Training component
 */
const ModernTraining: React.FC<TrainingProps> = ({
    programs,
    sectionTitle = "Advanced Training Protocols",
    sectionDescription = "Leveraging cutting-edge exercise science and performance analytics to optimize your training and deliver measurable results."
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
        <section className="training-section training-section--modern">
            {/* Header with modern aesthetic */}
            <div className="training-section__header">
                <span className="training-section__header-tag">Performance Optimization</span>
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
                        {/* Program Card - using modern styling */}
                        <ProgramCard
                            program={program}
                            isActive={selectedProgram === index}
                            onToggle={() => toggleProgramDetails(index)}
                            variant="modern"
                        />

                        {/* Expanded Content */}
                        {selectedProgram === index && (
                            <div className="training-expanded">
                                <h4 className="training-expanded__title">Program Analytics</h4>

                                {/* Benefits List */}
                                <BenefitsList
                                    benefits={program.benefits}
                                    variant="modern"
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
                                        Access {program.title}
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
                    Explore Training Solutions
                </Button>
            </div>
        </section>
    );
};

export default ModernTraining; 