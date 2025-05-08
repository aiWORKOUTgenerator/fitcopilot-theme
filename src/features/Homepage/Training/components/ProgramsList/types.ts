import { ProgramType } from '../../types';

/**
 * Props for the ProgramsList component
 */
export interface ProgramsListProps {
    /**
     * List of programs to display
     */
    programs: ProgramType[];

    /**
     * Index of the currently selected program
     */
    selectedProgram: number | null;

    /**
     * Function called when a program card is clicked
     */
    onProgramClick: (index: number) => void;

    /**
     * Function called when a program navigation action is triggered
     */
    onNavigate: (title: string) => void;

    /**
     * Visual variant
     * @default 'default'
     */
    variant?: string;

    /**
     * Whether the user prefers reduced motion
     */
    prefersReducedMotion?: boolean;

    /**
     * Additional CSS class names
     */
    className?: string;
} 