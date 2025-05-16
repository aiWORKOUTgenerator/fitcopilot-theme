import React from 'react';
import { MedicalCustomizationProvider } from './context/MedicalCustomizationContext';
import CustomizedMedicalContent from './CustomizedMedicalContent';

interface CustomizedMedicalProps {
    onValidChange: (isValid: boolean) => void;
}

/**
 * Main container component with context provider
 * This component follows the pattern from CustomizeExperience
 * by separating provider and consumer components
 */
const CustomizedMedical: React.FC<CustomizedMedicalProps> = ({ onValidChange }) => {
  return (
    <MedicalCustomizationProvider>
      <CustomizedMedicalContent onValidChange={onValidChange} />
    </MedicalCustomizationProvider>
  );
};

export default CustomizedMedical; 