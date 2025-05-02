import { useCallback, useState } from 'react';
import { RegistrationData } from '../types';

/**
 * Hook for managing registration data state
 * 
 * @returns Object containing registration data and update methods
 */
export const useRegistrationData = () => {
    // Initialize with empty registration data
    const [data, setData] = useState<RegistrationData>({});

    // Update the data with partial updates
    const updateData = useCallback((newData: Partial<RegistrationData>) => {
        setData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    }, []);

    // Reset all data
    const resetData = useCallback(() => {
        setData({});
    }, []);

    // Check if the data has required fields for a specific step
    const validateStepData = useCallback((requiredFields: (keyof RegistrationData)[]) => {
        return requiredFields.every((field) => {
            const value = data[field];

            // Check for empty arrays
            if (Array.isArray(value)) {
                return value.length > 0;
            }

            // Check for empty strings and other falsy values (except 0)
            return value !== undefined && value !== null && value !== '';
        });
    }, [data]);

    return {
        data,
        updateData,
        resetData,
        validateStepData,
    };
};

export default useRegistrationData; 