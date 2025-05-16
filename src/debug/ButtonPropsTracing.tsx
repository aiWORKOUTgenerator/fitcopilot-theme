import React from 'react';
import Button from '../components/UI/Button/Button';
import { ButtonProps as GlobalButtonProps } from '../types/button';
import logger from '../utils/logger';

// Create component-specific logger
const tracingLogger = logger.addContext('ButtonPropsTracing');

// Type for debug component that extends the global button props
// This maintains compatibility with the original Button component
interface DebugButtonProps extends Omit<GlobalButtonProps, 'variant' | 'size'> {
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'small' | 'medium' | 'large';
    themeContext?: string;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean;
    // Type-safe index signature for additional data attributes
    [key: `data-${string}`]: string | number | boolean;
}

/**
 * Wrapper component that logs all Button props before passing them through
 */
export const TracedButton: React.FC<DebugButtonProps> = (props) => {
  // Log props using structured logger
  tracingLogger.group('Button Props Tracing', () => {
    tracingLogger.debug('Props received:', { ...props });

    // Analyze themeContext
    if (props.themeContext) {
      tracingLogger.debug('themeContext value:', props.themeContext);
      tracingLogger.debug('Expected class:', `button--${props.themeContext}`);
    } else {
      tracingLogger.warn('No themeContext provided');
    }

    // Log CSS class composition 
    const expectedClasses = [
      'button',
      `button--${props.variant || 'primary'}`,
      `button--${props.size || 'medium'}`,
      props.themeContext && `button--${props.themeContext}`,
      props.fullWidth && 'button--fullwidth',
      props.className
    ].filter(Boolean).join(' ');

    tracingLogger.debug('Expected final class string:', expectedClasses);
  });

  // Pass all props to the original Button
  return <Button {...props} data-traced="true" />;
};

/**
 * Demo component with various button configurations for testing
 */
export const ButtonPropsTracing: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Button Props Tracing</h2>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Standard Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <TracedButton variant="primary" size="medium">
            Primary Button
          </TracedButton>

          <TracedButton variant="secondary" size="medium">
            Secondary Button
          </TracedButton>

          <TracedButton variant="tertiary" size="medium">
            Tertiary Button
          </TracedButton>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Size Variants</h3>
        <div className="flex flex-wrap gap-4">
          <TracedButton variant="primary" size="small">
            Small Button
          </TracedButton>

          <TracedButton variant="primary" size="medium">
            Medium Button
          </TracedButton>

          <TracedButton variant="primary" size="large">
            Large Button
          </TracedButton>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Theme Context Variants</h3>
        <div className="flex flex-wrap gap-4">
          <TracedButton variant="primary" size="medium" themeContext="personal-training">
            Personal Training
          </TracedButton>

          <TracedButton variant="primary" size="medium" themeContext="hero">
            Hero Context
          </TracedButton>

          <TracedButton variant="primary" size="medium" themeContext="features">
            Features Context
          </TracedButton>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Additional Props</h3>
        <div className="flex flex-wrap gap-4">
          <TracedButton
            variant="primary"
            size="medium"
            themeContext="personal-training"
            fullWidth
            className="additional-test-class"
          >
            Full Width + Custom Class
          </TracedButton>

          <TracedButton
            variant="primary"
            size="medium"
            disabled
          >
            Disabled Button
          </TracedButton>

          <TracedButton
            variant="primary"
            size="medium"
            loading
          >
            Loading Button
          </TracedButton>
        </div>
      </div>

      <div>
        <p className="text-gray-700">Check the console for detailed props tracing information.</p>
      </div>
    </div>
  );
};

export default ButtonPropsTracing; 