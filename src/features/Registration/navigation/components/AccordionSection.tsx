import React, { ReactNode, useState } from 'react';
import { useNavigation } from '../context';
import { SectionId } from '../types';

interface AccordionSectionProps {
    /**
     * Section identifier
     */
    sectionId: SectionId;

    /**
     * Section title displayed in the header
     */
    title: string;

    /**
     * Section content
     */
    children: ReactNode;

    /**
     * Whether the section can be expanded/collapsed
     */
    collapsible?: boolean;

    /**
     * Whether the section starts expanded
     */
    defaultExpanded?: boolean;

    /**
     * CSS class name for custom styling
     */
    className?: string;

    /**
     * Function to validate section data
     */
    validateSection?: () => boolean;
}

/**
 * Reusable accordion section component for customization steps
 */
const AccordionSection: React.FC<AccordionSectionProps> = ({
    sectionId,
    title,
    children,
    collapsible = true,
    defaultExpanded = false,
    className = '',
    validateSection,
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const { state, markSectionCompleted, markSectionValid, isCurrentSection, goToSection } = useNavigation();

    const sectionProgress = state.sectionProgress[sectionId];
    const isActive = isCurrentSection(sectionId);

    // Handle expansion toggle
    const toggleExpanded = () => {
        if (collapsible) {
            setExpanded(!expanded);

            // If expanding, set as current section
            if (!expanded) {
                goToSection(sectionId);
            }
        }
    };

    // Handle section completion
    const handleComplete = () => {
        // Validate section data if validator provided
        const isValid = validateSection ? validateSection() : true;

        // Update section progress
        markSectionValid(sectionId, isValid);
        markSectionCompleted(sectionId, true);

        // Close section if valid and collapsible
        if (isValid && collapsible) {
            setExpanded(false);
        }
    };

    return (
        <div
            className={`accordion-section ${className} ${expanded ? 'expanded' : 'collapsed'} ${isActive ? 'active' : ''} ${sectionProgress.completed ? 'completed' : ''}`}
        >
            <div className="accordion-header" onClick={toggleExpanded}>
                <div className="accordion-title">{title}</div>
                <div className="accordion-status">
                    {sectionProgress.completed && (
                        <span className="status-icon completed">✓</span>
                    )}
                    {collapsible && (
                        <span className="accordion-toggle">{expanded ? '−' : '+'}</span>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="accordion-content">
                    {children}

                    <div className="section-controls">
                        <button
                            className="section-complete-button"
                            onClick={handleComplete}
                        >
                            {sectionProgress.completed ? 'Update' : 'Complete'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccordionSection; 