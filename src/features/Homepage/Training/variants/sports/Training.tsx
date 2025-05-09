import { ArrowRight } from 'lucide-react';
import React from 'react';
import Button from '../../../../../components/UI/Button';
import { BenefitsList, ProgramCard, SectionHeader } from '../../components';
import { useTrainingPrograms } from '../../hooks';
import '../../Training.scss';
import { ProgramType, TrainingProps } from '../../types';

/**
 * Default sports-themed program data
 */
const DEFAULT_SPORTS_PROGRAMS: ProgramType[] = [
    {
        title: 'Hypertrophy Training',
        description: 'Build lean muscle mass with optimized training protocols',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-violet-400"><path d="M6.5 6.5h11"></path><path d="M6.5 17.5h11"></path><path d="M6 12h12"></path><path d="M3 22V2"></path><path d="M21 22V2"></path></svg>, // DumbbellIcon
        benefits: [
            'Progressive overload methodology',
            'Scientific volume management',
            'Specialized muscle group targeting',
            'Recovery optimization'
        ],
        accentColor: 'bg-violet-500',
        accentClass: 'accent-primary'
    },
    {
        title: 'Strength & Power',
        description: 'Develop functional strength for improved performance',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-violet-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>, // Zap
        benefits: [
            'Compound movement focus',
            'Neural efficiency training',
            'Periodized programming',
            'Progressive intensity scaling'
        ],
        accentColor: 'bg-violet-600',
        accentClass: 'accent-secondary'
    },
    {
        title: 'Body Recomposition',
        description: 'Transform your physique through strategic training and nutrition',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-violet-400"><path d="M3 6h18"></path><path d="M7 12h10"></path><path d="M9 18h6"></path><path d="M13 6v12"></path></svg>, // Scale
        benefits: [
            'Fat loss while preserving muscle',
            'Metabolic conditioning',
            'Sustainable approach to body change',
            'Balanced macro programming'
        ],
        accentColor: 'bg-violet-700',
        accentClass: 'accent-tertiary'
    },
    {
        title: 'Sports Performance',
        description: 'Enhance athletic capabilities for your chosen sport',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-violet-400"><path d="M6 4l12 4-8 4 8 4-12 4"></path><path d="M6 4v2a6 6 0 0 0 12 0v-2"></path></svg>, // Trophy
        benefits: [
            'Sport-specific movement patterns',
            'Power and agility development',
            'Injury prevention protocols',
            'Peak performance timing'
        ],
        accentColor: 'bg-violet-800',
        accentClass: 'accent-quaternary'
    }
];

/**
 * Default section title for sports variant
 */
const DEFAULT_SPORTS_TITLE = "Personalized Training Programs";

/**
 * Default section description for sports variant
 */
const DEFAULT_SPORTS_DESCRIPTION = "Our sports center offers specialized training methodologies designed to meet your individual goals, whether you're looking to build muscle, increase strength, or improve athletic performance.";

/**
 * Sports-themed Training component
 * 
 * @param props - Component props
 * @returns React component
 */
const Training: React.FC<Omit<TrainingProps, 'variant'>> = ({
    programs = DEFAULT_SPORTS_PROGRAMS,
    sectionTitle = DEFAULT_SPORTS_TITLE,
    sectionDescription = DEFAULT_SPORTS_DESCRIPTION
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
            {/* Background decoration - maintained for sports specific layout */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-gray-50 opacity-70"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header - updated to use SectionHeader component */}
                <SectionHeader
                    title={sectionTitle}
                    description={sectionDescription}
                    tagText="Training Solutions"
                    variant="sports"
                    id="training-section-title"
                    className="training-section__header"
                    programType="athletic"
                />

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {programData.map((program, index) => (
                        <div
                            key={index}
                            className="training-card flex flex-col h-full"
                        >
                            <div className={`h-2 ${program.accentColor} w-full`}></div>
                            <div className="p-6 flex-grow">
                                {/* Using ProgramCard component */}
                                <ProgramCard
                                    program={program}
                                    isActive={selectedProgram === index}
                                    onToggle={() => toggleProgramDetails(index)}
                                    variant="sports"
                                    className="mb-4"
                                />

                                <div
                                    className={`overflow-hidden transition-all duration-300 mt-2 ${selectedProgram === index ? 'max-h-60' : 'max-h-0'}`}
                                >
                                    {/* Using BenefitsList component */}
                                    <BenefitsList
                                        benefits={program.benefits}
                                        variant="sports"
                                        className="pl-5 space-y-2"
                                    />

                                    <div className="mt-8 text-center">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            rightIcon={<ArrowRight size={14} />}
                                            onClick={() => navigateToProgram(program.title)}
                                        >
                                            Learn More
                                        </Button>
                                    </div>
                                </div>
                            </div>
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
                        Get Your Custom Program
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Training; 