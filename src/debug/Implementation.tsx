import { ArrowRight } from 'lucide-react';
import React from 'react';
import Button from '../components/UI/Button/Button';
import '../features/Homepage/PersonalTraining/PersonalTraining.scss';

/**
 * A reference implementation of the Personal Training section using the Button component properly
 */
const Implementation: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Fixed Implementation Reference</h2>

      <div className="personal-training-section w-full py-20 px-4 bg-black rounded-xl mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-violet-300 mb-2 block">Expert Coaching</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Personal <span className="bg-gradient-to-r from-violet-300 to-indigo-400 text-transparent bg-clip-text">Trainers</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Example of using the proper Button component with themeContext for consistent styling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Trainer Card Example</h3>
                <p className="text-gray-400 mb-6">
                  This card demonstrates how to properly use the Button component with themeContext
                  to achieve the desired styling for the PersonalTraining section.
                </p>

                <div className="mb-8">
                  <h4 className="text-lg font-bold mb-2 text-white">Button with themeContext prop:</h4>
                  <Button
                    variant="primary"
                    size="medium"
                    fullWidth
                    themeContext="personal-training"
                    rightIcon={<ArrowRight size={18} />}
                  >
                    Schedule Session
                  </Button>

                  <div className="mt-4 text-sm text-gray-500">
                    <code>{'<Button themeContext="personal-training" />'}</code>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <pre className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 text-gray-300 h-full overflow-auto">
                {`// Before: Using custom StyledButton
<StyledButton fullWidth>
  Schedule Session
</StyledButton>

// After: Using Button component with themeContext
<Button
  variant="primary"
  size="medium"
  fullWidth
  themeContext="personal-training"
  rightIcon={<ArrowRight size={18} />}
>
  Schedule Session
</Button>

/* PersonalTraining.scss already has styles for:
.button--personal-training {
  background: linear-gradient(to right, #8b5cf6, #6d28d9);
  color: white;
  border-radius: 0.5rem;
  // other styles...
}
*/`}
              </pre>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-violet-600 p-8">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 text-white">CTA Section Example</h3>
              <p className="text-violet-100 mb-8">
                This demonstrates how to use the Button component with a different themeContext value
                for the CTA section styling.
              </p>

              <Button
                variant="primary"
                size="medium"
                themeContext="personal-training-cta"
                rightIcon={<ArrowRight size={20} />}
              >
                Book Free Consultation
              </Button>

              <div className="mt-4 text-sm text-violet-200">
                <code>{'<Button themeContext="personal-training-cta" />'}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Implementation Steps</h3>

        <ol className="list-decimal ml-6 space-y-3">
          <li>
            <strong>Replace StyledButton with Button:</strong>
            <p className="mt-1 mb-2">Remove the custom StyledButton component and use the standard Button component.</p>
          </li>

          <li>
            <strong>Add themeContext prop:</strong>
            <p className="mt-1 mb-2">Set themeContext="personal-training" for standard buttons and themeContext="personal-training-cta" for CTA buttons.</p>
          </li>

          <li>
            <strong>Keep the existing SCSS:</strong>
            <p className="mt-1 mb-2">The PersonalTraining.scss file already has the proper .button--personal-training and .button--personal-training-cta selectors.</p>
          </li>

          <li>
            <strong>Remove !important flags (if possible):</strong>
            <p className="mt-1 mb-2">After testing, see if the !important flags in the SCSS can be removed once the proper class structure is in place.</p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Implementation; 