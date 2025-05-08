import React, { useCallback } from 'react';
import { MainCTA, ProgramsList, SectionHeader } from './components';
import { DEFAULT_PROGRAMS, DEFAULT_SECTION_DESCRIPTION, DEFAULT_SECTION_TITLE } from './data/defaultProgramsData';
import { useTrainingPrograms } from './hooks';
import useReducedMotion from './hooks/useReducedMotion';
import './Training.scss';
import { TrainingProps } from './types';
import { mapProgramsWithIcons } from './utils/programUtils';

/**
 * Training component displays the available training programs
 */
function Training({
    className = '',
    sectionTitle = DEFAULT_SECTION_TITLE,
    sectionDescription = DEFAULT_SECTION_DESCRIPTION,
    variant = 'default',
    programs = mapProgramsWithIcons(DEFAULT_PROGRAMS),
    onProgramSelect = (title: string) => console.log(`Program selected: ${title}`),
}: TrainingProps) {
    const { programs: activePrograms, selectedProgram, toggleProgramDetails, navigateToProgram } =
        useTrainingPrograms({ initialPrograms: programs });

    const prefersReducedMotion = useReducedMotion();

    const handleProgramClick = useCallback((index: number) => {
        toggleProgramDetails(index);
    }, [toggleProgramDetails]);

    const handleNavigate = useCallback((title: string) => {
        navigateToProgram(title);
        onProgramSelect(title);
    }, [navigateToProgram, onProgramSelect]);

    return (
        <section className={`training-section training-section--${variant} ${prefersReducedMotion ? 'reduced-motion' : ''} ${className}`} aria-labelledby="training-section-title">
            <div className="training-section__container">
                {/* Section Header */}
                <SectionHeader
                    title={sectionTitle}
                    description={sectionDescription}
                    tagText="Training Solutions"
                    variant={variant}
                    id="training-section-title"
                />

                {/* Programs List */}
                <ProgramsList
                    programs={activePrograms}
                    selectedProgram={selectedProgram}
                    onProgramClick={handleProgramClick}
                    onNavigate={handleNavigate}
                    variant={variant}
                    prefersReducedMotion={prefersReducedMotion}
                />

                {/* Main CTA */}
                <MainCTA
                    onNavigate={handleNavigate}
                    variant={variant}
                />
            </div>
        </section>
    );
}

export default Training; 