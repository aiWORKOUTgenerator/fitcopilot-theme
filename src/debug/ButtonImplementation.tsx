import { ArrowRight } from 'lucide-react';
import React from 'react';
import Button from '../components/UI/Button/Button';
import '../features/Homepage/PersonalTraining/PersonalTraining.scss';

/**
 * Demonstration of proper button implementation using the themeContext prop
 */
const ButtonImplementation: React.FC = () => {
    return (
        <div className="p-8 bg-gray-100">
            <h2 className="text-2xl font-bold mb-6">Button Implementation Reference</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">Current Implementation (Inline Styles)</h3>
                    <p className="mb-4 text-gray-600">
                        The current implementation uses a custom StyledButton component with inline styles,
                        bypassing the theme system.
                    </p>

                    <pre className="bg-gray-100 p-4 rounded mb-4 text-sm overflow-auto">
                        {`// Custom component with inline styles
const StyledButton = ({ children, ...props }) => (
  <button
    style={{
      background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
      color: 'white',
      borderRadius: '0.5rem',
      // ...more inline styles
    }}
    {...props}
  >
    {children}
  </button>
);

// Usage
<StyledButton>Schedule Session</StyledButton>`}
                    </pre>

                    {/* Example of current implementation */}
                    <div className="mt-4">
                        <button
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
                                color: 'white',
                                borderRadius: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Schedule Session
                            <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">Recommended Implementation (Theme Context)</h3>
                    <p className="mb-4 text-gray-600">
                        This implementation uses the existing Button component with themeContext,
                        leveraging the theme system properly.
                    </p>

                    <pre className="bg-gray-100 p-4 rounded mb-4 text-sm overflow-auto">
                        {`// Import the standard Button component
import Button from '../components/UI/Button/Button';
import { ArrowRight } from 'lucide-react';

// Usage with themeContext
<Button
  variant="primary"
  size="medium"
  fullWidth
  themeContext="personal-training"
  rightIcon={<ArrowRight size={18} />}
>
  Schedule Session
</Button>`}
                    </pre>

                    {/* Example of proper implementation */}
                    <div className="mt-4 personal-training-section">
                        <Button
                            variant="primary"
                            size="medium"
                            themeContext="personal-training"
                            rightIcon={<ArrowRight size={18} />}
                        >
                            Schedule Session
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Implementation for Different Contexts</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded bg-gray-100">
                        <h4 className="font-bold mb-2">Standard Button</h4>
                        <Button
                            variant="primary"
                            size="medium"
                            rightIcon={<ArrowRight size={18} />}
                        >
                            Standard Button
                        </Button>
                    </div>

                    <div className="p-4 rounded personal-training-section">
                        <h4 className="font-bold mb-2 text-white">Personal Training</h4>
                        <Button
                            variant="primary"
                            size="medium"
                            themeContext="personal-training"
                            rightIcon={<ArrowRight size={18} />}
                        >
                            Training Button
                        </Button>
                    </div>

                    <div className="p-4 rounded bg-violet-600">
                        <h4 className="font-bold mb-2 text-white">CTA Section</h4>
                        <Button
                            variant="primary"
                            size="medium"
                            themeContext="personal-training-cta"
                            rightIcon={<ArrowRight size={18} />}
                        >
                            CTA Button
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Key Benefits</h3>

                <ul className="list-disc ml-6 space-y-2">
                    <li>Uses the existing button component, maintaining consistency across the application</li>
                    <li>Leverages the theme system without requiring duplicate component logic</li>
                    <li>Separates styling from component implementation</li>
                    <li>Makes future styling updates easier by keeping all button styles in one system</li>
                    <li>Follows the project's component architecture guidelines</li>
                </ul>
            </div>
        </div>
    );
};

export default ButtonImplementation; 