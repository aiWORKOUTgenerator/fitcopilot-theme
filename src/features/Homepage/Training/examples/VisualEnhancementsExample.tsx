import React, { useState } from 'react';
import Training from '../Training';

/**
 * VisualEnhancementsExample Component
 * 
 * This component demonstrates the visual enhancements and section transition options
 * available in the Training component.
 */
const VisualEnhancementsExample: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string>('default');

    // Options for different visual configurations
    const options = [
        { value: 'default', label: 'Default' },
        { value: 'seamless', label: 'Seamless Transition' },
        { value: 'overlap-bottom', label: 'Overlap (Bottom)' },
        { value: 'no-gradient', label: 'No Gradient Overlay' },
    ];

    // Dynamic class based on selected option
    const getClassName = () => {
        switch (selectedOption) {
            case 'seamless':
                return 'section-seamless';
            case 'overlap-bottom':
                return 'section-overlap-bottom';
            case 'no-gradient':
                return 'training-section--no-gradient';
            default:
                return '';
        }
    };

    return (
        <div className="visual-enhancements-example">
            <div className="controls">
                <h3>Visual Enhancement Options</h3>
                <div className="options">
                    {options.map(option => (
                        <label key={option.value} className="option">
                            <input
                                type="radio"
                                name="visualOption"
                                value={option.value}
                                checked={selectedOption === option.value}
                                onChange={() => setSelectedOption(option.value)}
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Placeholder for previous section when using overlap */}
            {selectedOption === 'overlap-bottom' && (
                <div className="placeholder-section">
                    <h3>Previous Section</h3>
                    <p>This is a placeholder for the previous section</p>
                </div>
            )}

            {/* Training component with selected visual options */}
            <Training
                className={getClassName()}
                sectionTitle="Visual Enhancements Example"
                sectionDescription="This example demonstrates the visual enhancements and section transitions available in the Training component."
            />

            {/* Placeholder for next section when using overlap */}
            {selectedOption === 'overlap-bottom' && (
                <div className="placeholder-section section-overlap-top">
                    <h3>Next Section</h3>
                    <p>This placeholder demonstrates the seamless transition to the next section</p>
                </div>
            )}

            <div className="documentation">
                <h3>Implementation</h3>
                <pre className="code-example">
                    {`// Example implementation
<Training
  className="${getClassName()}"
  sectionTitle="Training Programs"
/>

// For overlapping sections
<PreviousSection />
<Training className="section-overlap-top" />

// Or
<Training className="section-overlap-bottom" />
<NextSection className="section-overlap-top" />
`}
                </pre>
            </div>
        </div>
    );
};

export default VisualEnhancementsExample; 