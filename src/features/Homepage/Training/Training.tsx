import React, { useCallback } from 'react';
import { ThemeProvider } from '../../../context/ThemeContext';
import logger from '../../../utils/logger';
import { ThemeOption } from '../../../utils/theming';
import { ProgramsList, SectionHeader, TrainingCTA } from './components';
import { DEFAULT_PROGRAMS, DEFAULT_SECTION_DESCRIPTION, DEFAULT_SECTION_TITLE } from './data/defaultProgramsData';
import { useTrainingPrograms } from './hooks';
import useReducedMotion from './hooks/useReducedMotion';
import './Training.scss';
import { TrainingProps } from './types';
import { mapProgramsWithIcons } from './utils/programUtils';

/**
 * Map variant to ThemeOption for ThemeProvider
 */
const mapVariantToTheme = (variant: string | undefined): ThemeOption => {
  // Direct mappings for variants that match themes
  if (variant === 'default' || variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant;
  }
  
  // Map other variants to appropriate themes
  switch (variant) {
  case 'modern': return 'sports';
  case 'classic': return 'default';
  case 'minimalist': return 'default';
  case 'boutique': return 'wellness';
  case 'registration': return 'default';
  case 'mobile': return 'default';
  default: return 'default';
  }
};

/**
 * Training component displays the available training programs
 */
function Training({
  className = '',
  sectionTitle = DEFAULT_SECTION_TITLE,
  sectionDescription = DEFAULT_SECTION_DESCRIPTION,
  variant = 'default',
  programs = mapProgramsWithIcons(DEFAULT_PROGRAMS),
  onProgramSelect = (title: string) => logger.debug(`Program selected: ${title}`),
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
    <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
      <section
        className={`training-section training-section--${variant} ${prefersReducedMotion ? 'reduced-motion' : ''} ${className}`}
        aria-labelledby="training-section-title"
        data-theme-accent="amber"
        style={{ '--text-primary': 'var(--training-text)' } as React.CSSProperties}
      >
        {/* Decorative accent shapes for visual interest */}
        <div className="training-section__accent-shape training-section__accent-shape--1" aria-hidden="true"></div>
        <div className="training-section__accent-shape training-section__accent-shape--2" aria-hidden="true"></div>
        <div className="training-section__accent-shape--3" aria-hidden="true"></div>

        <div className="training-section__container">
          {/* Section Header */}
          <SectionHeader
            title={sectionTitle}
            description={sectionDescription}
            tagText="Training Solutions"
            variant={variant}
            id="training-section-title"
            className="training-section__header animate-fade-in"
            programType="athletic"
          />

          {/* Programs List */}
          <ProgramsList
            programs={activePrograms}
            selectedProgram={selectedProgram}
            onProgramClick={handleProgramClick}
            onNavigate={handleNavigate}
            variant={variant}
            prefersReducedMotion={prefersReducedMotion}
            className="animate-fade-slide-up"
          />

          {/* Main CTA */}
          <div className="training-section__cta">
            <TrainingCTA
              onNavigate={handleNavigate}
              variant={variant}
              className="animate-fade-in"
            />
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
}

export default Training; 