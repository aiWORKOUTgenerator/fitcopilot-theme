import { CheckCircle } from 'lucide-react';
import React from 'react';
import { CustomizationProgressProps } from '../types';

/**
 * Shows progress through the customization sections
 */
const CustomizationProgress: React.FC<CustomizationProgressProps> = ({
  completedSections,
  totalSections
}) => {
  // If no sections are completed, don't render anything
  if (completedSections.length === 0) return null;

  // Calculate completion percentage
  const completionPercentage = Math.round((completedSections.length / totalSections) * 100);

  // Determine message based on completion level
  const getMessage = () => {
    if (completedSections.length === totalSections) {
      return "All sections completed! You can now continue to the next step.";
    } else {
      return `${completedSections.length} of ${totalSections} sections completed. Continue to the next step or complete more sections.`;
    }
  };

  return (
    <div className="customization-progress">
      <div className="flex items-center text-cyan-300 mb-1">
        <CheckCircle size={16} className="mr-2" />
        <span className="text-sm font-medium">{completionPercentage}% Complete</span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${completionPercentage}%` }}
          role="progressbar"
          aria-valuenow={completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      <p className="mt-1.5">{getMessage()}</p>
    </div>
  );
};

export default CustomizationProgress; 