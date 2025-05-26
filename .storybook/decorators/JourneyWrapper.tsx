import * as React from 'react';
import { ThemeProvider } from '../../src/context/ThemeContext';

interface JourneyWrapperProps {
  children: React.ReactNode;
  theme?: string;
  withParticles?: boolean;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

/**
 * Sophisticated Journey Wrapper for Storybook Stories
 * 
 * Provides the complete environment for journey components including:
 * - Theme context
 * - Particle background effects
 * - Progress indicator
 * - Proper styling context
 */
export const SophisticatedJourneyWrapper: React.FC<JourneyWrapperProps> = ({
  children,
  theme = 'default',
  withParticles = true,
  showProgress = false,
  currentStep = 1,
  totalSteps = 4
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <ThemeProvider initialTheme={theme}>
      <div 
        className={`journey-wrapper ${withParticles ? 'with-particles' : ''}`}
        data-theme={theme}
      >
        {showProgress && (
          <div className="journey-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="progress-text">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        )}
        
        <div className="journey-section">
          <div className="max-w-4xl mx-auto space-y-8">
            {children}
          </div>
          
          {/* Journey path for multi-step sequences */}
          <div className="journey-path" aria-hidden="true" />
        </div>
      </div>
    </ThemeProvider>
  );
};

/**
 * Simple Journey Context Wrapper
 * For basic journey components that don't need the full sophisticated environment
 */
export const JourneyContextWrapper: React.FC<{ children: React.ReactNode; theme?: string }> = ({ 
  children, 
  theme = 'default' 
}) => {
  return (
    <ThemeProvider initialTheme={theme}>
      <div className="journey-context-wrapper" data-theme={theme}>
        <div className="registration-journey">
          <div className="journey-step">
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

/**
 * Dark Theme Journey Wrapper
 * Specialized wrapper for dark theme demonstrations
 */
export const DarkJourneyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SophisticatedJourneyWrapper theme="dark" withParticles={true}>
      {children}
    </SophisticatedJourneyWrapper>
  );
};

/**
 * Interactive Journey Wrapper
 * For stories that need state management and interaction
 */
export const InteractiveJourneyWrapper: React.FC<{ 
  children: React.ReactNode;
  onStepChange?: (step: number) => void;
}> = ({ children, onStepChange }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    onStepChange?.(step);
  };

  return (
    <SophisticatedJourneyWrapper 
      showProgress={true} 
      currentStep={currentStep} 
      totalSteps={4}
      withParticles={true}
    >
      <div className="space-y-6">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              index,
              onStepAction: () => handleStepChange(index + 1)
            });
          }
          return child;
        })}
      </div>
    </SophisticatedJourneyWrapper>
  );
}; 