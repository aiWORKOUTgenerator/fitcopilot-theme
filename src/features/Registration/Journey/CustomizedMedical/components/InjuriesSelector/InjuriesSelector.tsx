import { ActivitySquare, Check } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import { AccordionSectionRef } from '../../../components/AccordionSection';
import { INJURY_CATEGORIES } from '../../constants/injuriesOptions';
import { SECTION_IDS } from '../../constants/sectionConstants';
import { useMedicalCustomization } from '../../context/MedicalCustomizationContext';
import { InjuriesSelectorProps, SectionComponentProps } from '../../types';
import { announceToScreenReader } from '../../utils/a11y';
import StandardSection from '../StandardSection';
import './InjuriesSelector.scss';

/**
 * InjuriesInnerForm component handles the form fields and validation
 */
const InjuriesInnerForm: React.FC<SectionComponentProps> = ({
  setIsValid,
  _isValid
}) => {
  const { state, updateSectionData } = useMedicalCustomization();
  const injuries = state.injuries || {};

  // Initialize state from context data
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>(
    injuries.selectedInjuries || []
  );

  const [otherInjuries, setOtherInjuries] = useState<string>(
    injuries.otherInjuries || ''
  );

  // Always valid even if no injuries selected (user might not have any)
  useEffect(() => {
    // Injuries selector is always valid - user can have no injuries
    if (setIsValid) {
      setIsValid(true);
    }

    // Update context with debouncing
    const timeoutId = setTimeout(() => {
      updateSectionData('injuries', {
        selectedInjuries,
        otherInjuries: otherInjuries || undefined
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedInjuries, otherInjuries, setIsValid, updateSectionData]);

  // Toggle injury selection
  const toggleInjury = (injury: string) => {
    setSelectedInjuries(prev => {
      if (prev.includes(injury)) {
        return prev.filter(i => i !== injury);
      }
      return [...prev, injury];
    });
  };

  return (
    <div className="injuries-selector">
      <p className="section-description">
        Select any injuries or physical limitations that apply to you. This helps us customize your workout to avoid exercises that might cause discomfort or aggravate existing conditions.
      </p>

      {/* Injuries by category */}
      {Object.entries(INJURY_CATEGORIES).map(([categoryKey, category]) => (
        <div key={categoryKey} className="injury-category">
          <h4 className="category-title">{category.label}</h4>
          <div className="category-items">
            {category.options.map((injury, index) => (
              <div
                key={index}
                className={`injury-item ${selectedInjuries.includes(injury) ? 'selected' : ''}`}
                onClick={() => toggleInjury(injury)}
                role="checkbox"
                aria-checked={selectedInjuries.includes(injury)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleInjury(injury);
                  }
                }}
              >
                <div className="item-checkbox">
                  {selectedInjuries.includes(injury) && <Check size={14} />}
                </div>
                <span className="item-label">{injury}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Other injuries input */}
      <div className="other-injuries">
        <label htmlFor="other-injuries" className="other-label">
          Other injuries or limitations not listed
        </label>
        <textarea
          id="other-injuries"
          className="other-input"
          placeholder="Please describe any other injuries or limitations not listed above"
          rows={3}
          value={otherInjuries}
          onChange={(e) => setOtherInjuries(e.target.value)}
          aria-label="Describe other injuries or limitations"
        />
      </div>

      {/* Selection summary */}
      {selectedInjuries.length > 0 && (
        <div className="selection-summary">
          <div className="summary-text" aria-live="polite">
            {selectedInjuries.length} {selectedInjuries.length === 1 ? 'injury' : 'injuries'} selected
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * InjuriesSelector component for selecting injuries and limitations
 * Refactored to use StandardSection and MedicalCustomizationContext
 */
const InjuriesSelector = forwardRef<AccordionSectionRef, InjuriesSelectorProps>(({
  onValidChange,
  isCompleted = false,
  onConfirm
}, ref) => {
  const { updateSectionValidity, error, isLoading, markSectionComplete } = useMedicalCustomization();

  // Handle validity change - always valid for injuries
  const handleValidChange = (isValid: boolean) => {
    updateSectionValidity(SECTION_IDS.injuries, isValid);
    onValidChange(isValid);
  };

  // Handle confirmation
  const handleConfirm = () => {
    markSectionComplete(SECTION_IDS.injuries);
    announceToScreenReader('Injuries information saved successfully');
    onConfirm();
  };

  return (
    <StandardSection
      ref={ref}
      sectionId={SECTION_IDS.injuries}
      title="Injuries & Limitations"
      icon={<ActivitySquare size={18} />}
      description="Tell us about any injuries or limitations so we can customize your workout plan"
      isCompleted={isCompleted}
      onValidChange={handleValidChange}
      onConfirm={handleConfirm}
      error={error}
      isLoading={isLoading}
    >
      <InjuriesInnerForm />
    </StandardSection>
  );
});

InjuriesSelector.displayName = 'InjuriesSelector';

export default InjuriesSelector; 