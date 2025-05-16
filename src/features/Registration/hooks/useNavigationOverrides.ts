import { useEffect, useState } from 'react';
import { RegistrationStep } from '../types';

/**
 * Hook for managing emergency navigation overrides in the registration flow
 * Extracts override logic from useRegistrationProgress for better separation of concerns
 * 
 * @param defaultStep - The default registration step to use if no overrides exist
 * @returns The step to use after checking all possible overrides
 */
export const useNavigationOverrides = (defaultStep: RegistrationStep): RegistrationStep => {
  const [overrideStep, setOverrideStep] = useState<RegistrationStep | null>(null);

  // Check for overrides on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for forced pricing navigation
      const forcePricing = window.sessionStorage.getItem('FORCE_GOTO_PRICING');
      if (forcePricing === 'true') {
        window.sessionStorage.removeItem('FORCE_GOTO_PRICING');
        setOverrideStep(RegistrationStep.PRICING);
        return;
      }

      // Add other override checks here if needed in the future
    }
  }, []);

  return overrideStep || defaultStep;
};

export default useNavigationOverrides; 