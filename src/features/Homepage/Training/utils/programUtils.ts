import { BarChart, CircleDashed, CreditCard, Dumbbell } from 'lucide-react';
import React from 'react';
import { ProgramType } from '../types';

/**
 * Map of program types to their respective icons
 */
export const programIconMap = {
    strength: Dumbbell,
    fatLoss: CreditCard,
    fitness: CircleDashed,
    athletic: BarChart
};

/**
 * Maps programs with their corresponding icons based on programType
 *
 * @param programs Programs without icons
 * @returns Programs with icons
 */
export const mapProgramsWithIcons = (programs: Omit<ProgramType, 'icon'>[]): ProgramType[] => {
    return programs.map(program => ({
        ...program,
        icon: program.programType && programIconMap[program.programType] ?
            React.createElement(programIconMap[program.programType], { className: 'program-icon', size: 24 }) :
            React.createElement(Dumbbell, { className: 'program-icon', size: 24 })
    }));
}; 