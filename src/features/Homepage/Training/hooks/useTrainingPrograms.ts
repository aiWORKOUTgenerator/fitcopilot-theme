import { useState } from 'react';
import { ProgramType } from '../types';

/**
 * Props interface for the useTrainingPrograms hook
 */
interface UseTrainingProgramsProps {
    /**
     * Initial programs data to use
     */
    initialPrograms: ProgramType[];
}

/**
 * Result interface for the useTrainingPrograms hook
 */
interface UseTrainingProgramsResult {
    /**
     * The programs data
     */
    programs: ProgramType[];

    /**
     * Currently selected program index or null if none selected
     */
    selectedProgram: number | null;

    /**
     * Function to toggle a program's expanded state
     */
    toggleProgramDetails: (index: number) => void;

    /**
     * Function to navigate to a program's detail page
     */
    navigateToProgram: (programTitle: string) => void;
}

/**
 * Custom hook for managing training program selection and interaction
 * 
 * @param props Hook props
 * @returns Hook state and functions
 */
export const useTrainingPrograms = ({
    initialPrograms
}: UseTrainingProgramsProps): UseTrainingProgramsResult => {
    // State for tracking the currently selected program
    const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

    /**
     * Toggle a program's expanded state
     * @param index Program index to toggle
     */
    const toggleProgramDetails = (index: number) => {
        setSelectedProgram(selectedProgram === index ? null : index);
    };

    /**
     * Navigate to a program's detail page
     * @param programTitle Title of the program to navigate to
     */
    const navigateToProgram = (programTitle: string) => {
        window.location.href = `https://builder.fitcopilot.ai/programs/${programTitle.toLowerCase().replace(/\s+/g, '-')}`;
    };

    return {
        programs: initialPrograms,
        selectedProgram,
        toggleProgramDetails,
        navigateToProgram
    };
}; 