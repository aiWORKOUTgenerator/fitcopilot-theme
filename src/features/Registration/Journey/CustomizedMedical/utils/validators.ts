/**
 * Standardized validation helpers for CustomizedMedical sections
 */

import logger from "../../../../../utils/logger";
import { AnthropometricsData, InjuriesData, LiabilityWaiverData, MedicalClearanceData } from '../types';

/**
 * Validators for each section
 */
export const validators = {
    /**
     * Anthropometrics is valid if height and weight are provided
     */
    anthropometrics: (data: AnthropometricsData | null): boolean => {
        if (!data) return false;

        // Height validation
        const hasValidHeight = data.height && data.height.value > 0 &&
            (data.height.unit !== 'ft' || (data.height.inches !== undefined));

        // Weight validation
        const hasValidWeight = data.weight && data.weight.value > 0;

        return hasValidHeight && hasValidWeight;
    },

    /**
     * Injuries is valid if selection has been made
     */
    injuries: (data: InjuriesData | null): boolean => {
        if (!data) return false;

        // Valid if user made a selection (either has injuries or doesn't)
        const hasSelection = data.hasInjuries !== undefined;

        // If they have injuries, they should specify at least one or provide details
        if (data.hasInjuries === true) {
            return (data.selectedInjuries?.length > 0) ||
                (data.otherInjuries?.trim()?.length > 0);
        }

        return hasSelection;
    },

    /**
     * Medical clearance is valid if proper acknowledgment is provided
     */
    medicalClearance: (data: MedicalClearanceData | null): boolean => {
        if (!data) return false;

        // Valid if user acknowledged medical conditions
        const hasMedicalSelection = data.hasMedicalCondition !== undefined;

        // If they have medical conditions, they should provide some details
        if (data.hasMedicalCondition === true) {
            return !!data.medicalDetails && data.medicalDetails.trim().length > 0;
        }

        return hasMedicalSelection;
    },

    /**
     * Liability waiver is valid if accepted
     */
    liabilityWaiver: (data: LiabilityWaiverData | null): boolean => {
        if (!data) return false;

        return data.hasAcceptedWaiver === true;
    }
};

/**
 * Get validation error message for a section
 */
export const getValidationMessage = (sectionId: string): string => {
    switch (sectionId) {
        case 'anthropometrics':
            return 'Please provide your height and weight';
        case 'injuries':
            return 'Please indicate if you have any injuries';
        case 'medicalClearance':
            return 'Please provide information about any medical conditions';
        case 'liabilityWaiver':
            return 'Please accept the liability waiver to continue';
        default:
            return 'Please complete all required fields';
    }
};

/**
 * Helper to safely save data with basic retry functionality
 */
export const saveWithRetry = async <T>(
    saveFunction: (data: T) => Promise<boolean>,
    data: T,
    maxRetries = 1
): Promise<{ success: boolean; error?: string }> => {
    let attempts = 0;

    const attempt = async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await saveFunction(data);
            return { success: true };
        } catch (error) {
            logger.error(`Error saving data (attempt ${attempts + 1}):`, error);

            if (++attempts <= maxRetries) {
                // Simple linear retry with small delay
                await new Promise(resolve => setTimeout(resolve, 300));
                return attempt();
            } else {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to save your medical information"
                };
            }
        }
    };

    return attempt();
}; 