import { ArrowRight } from 'lucide-react';
import React from 'react';
import { Button } from '../../../../../features/shared/Button';
import { BenefitsList, ProgramCard } from '../../components';
import { useTrainingPrograms } from '../../hooks';
import '../../styles/theme-variants.scss';
import { TrainingProps } from '../../types';

/**
 * Classic variant of the Training component
 * 
 * Features traditional fitness aesthetics with a focus on strength and performance
 * 
 * @param props Component props
 * @returns Classic Training component
 */
const ClassicTraining: React.FC<TrainingProps> = ({
  programs,
  sectionTitle = "FITNESS PROGRAMS",
  sectionDescription = "Build strength, endurance, and overall health with our proven fitness programs designed for all levels."
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
    <section className="training-section training-section--classic">
      {/* Header with classic fitness aesthetic */}
      <div className="training-section__header">
        <span className="training-section__header-tag">TRAIN HARD</span>
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
            {/* Program Card - using classic styling */}
            <ProgramCard
              program={program}
              isActive={selectedProgram === index}
              onToggle={() => toggleProgramDetails(index)}
              variant="classic"
            />

            {/* Expanded Content */}
            {selectedProgram === index && (
              <div className="training-expanded">
                <h4 className="training-expanded__title">PROGRAM DETAILS</h4>

                {/* Benefits List */}
                <BenefitsList
                  benefits={program.benefits}
                  variant="classic"
                  className="training-expanded__benefits"
                />

                {/* CTA Button */}
                <div className="training-expanded__cta mt-8">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigateToProgram(program.title)}
                  >
                    START NOW
                    <ArrowRight size={16} className="ml-2" />
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
          GET STARTED NOW
          <ArrowRight size={20} className="ml-2" />
        </Button>
      </div>
    </section>
  );
};

export default ClassicTraining; 