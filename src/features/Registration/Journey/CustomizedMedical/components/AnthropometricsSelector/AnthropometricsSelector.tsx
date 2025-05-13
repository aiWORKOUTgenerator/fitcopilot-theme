import { Ruler } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import { AccordionSectionRef } from '../../../components/AccordionSection';
import { BIOLOGICAL_SEX_OPTIONS, HEIGHT_UNITS, WEIGHT_UNITS } from '../../constants/anthropometricsOptions';
import { SECTION_IDS } from '../../constants/sectionConstants';
import { useMedicalCustomization } from '../../context/MedicalCustomizationContext';
import { AnthropometricsSelectorProps, SectionComponentProps } from '../../types';
import { announceToScreenReader } from '../../utils/a11y';
import StandardSection from '../StandardSection';
import './AnthropometricsSelector.scss';

/**
 * AnthropometricsInnerForm component handles the form fields and validation
 */
const AnthropometricsInnerForm: React.FC<SectionComponentProps> = ({
    setIsValid,
    _isValid
}) => {
    const { state, updateSectionData } = useMedicalCustomization();
    const anthropometrics = state.anthropometrics || {};

    // Initialize state from context data
    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(
        anthropometrics?.height?.unit || 'cm'
    );

    const [heightValue, setHeightValue] = useState(() => {
        if (anthropometrics?.height?.value) {
            return anthropometrics.height.value.toString();
        }
        return '';
    });

    const [heightInches, setHeightInches] = useState(() => {
        if (anthropometrics?.height?.inches) {
            return anthropometrics.height.inches.toString();
        }
        return '';
    });

    const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
        anthropometrics?.weight?.unit || 'kg'
    );

    const [weightValue, setWeightValue] = useState(() => {
        if (anthropometrics?.weight?.value) {
            return anthropometrics.weight.value.toString();
        }
        return '';
    });

    const [age, setAge] = useState(() => {
        if (anthropometrics?.age) {
            return anthropometrics.age.toString();
        }
        return '';
    });

    const [biologicalSex, setBiologicalSex] = useState(
        anthropometrics?.biologicalSex || ''
    );

    // Validate inputs and update context with debouncing
    useEffect(() => {
        // Basic validation - at least height and weight should be provided
        const heightValid = heightValue.trim() !== '' &&
            (heightUnit !== 'ft' || heightInches.trim() !== '');
        const weightValid = weightValue.trim() !== '';

        const isFormValid = heightValid && weightValid;

        // Report validity to parent StandardSection
        if (setIsValid) {
            setIsValid(isFormValid);
        }

        // Update context with debouncing
        const timeoutId = setTimeout(() => {
            // Parse numeric values
            const heightValueNumeric = heightValue ? parseFloat(heightValue) : undefined;
            const heightInchesNumeric = heightInches ? parseFloat(heightInches) : undefined;
            const weightValueNumeric = weightValue ? parseFloat(weightValue) : undefined;
            const ageNumeric = age ? parseInt(age) : undefined;

            // Update context
            updateSectionData('anthropometrics', {
                height: heightValueNumeric ? {
                    value: heightValueNumeric,
                    unit: heightUnit,
                    inches: heightUnit === 'ft' ? heightInchesNumeric : undefined
                } : undefined,
                weight: weightValueNumeric ? {
                    value: weightValueNumeric,
                    unit: weightUnit,
                } : undefined,
                age: ageNumeric,
                biologicalSex: biologicalSex as 'male' | 'female' | 'other' | 'prefer-not-to-say' | undefined
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [
        heightUnit, heightValue, heightInches,
        weightUnit, weightValue,
        age, biologicalSex,
        setIsValid, updateSectionData
    ]);

    return (
        <div className="anthropometrics-selector">
            <p className="section-description">
                Please provide your basic physical measurements to help us customize your workout plan.
            </p>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="height-unit">Height</label>
                    <div className="input-group">
                        <select
                            id="height-unit"
                            className="unit-selector"
                            value={heightUnit}
                            onChange={(e) => setHeightUnit(e.target.value as 'cm' | 'ft')}
                            aria-label="Select height unit"
                        >
                            {HEIGHT_UNITS.map(unit => (
                                <option key={unit.value} value={unit.value}>{unit.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group mt-2">
                        {heightUnit === 'cm' ? (
                            <>
                                <input
                                    type="number"
                                    id="height-cm"
                                    className="numeric-input"
                                    placeholder="Height in cm"
                                    min="50"
                                    max="250"
                                    value={heightValue}
                                    onChange={(e) => setHeightValue(e.target.value)}
                                    aria-label="Height in centimeters"
                                />
                                <span className="unit-label">cm</span>
                            </>
                        ) : (
                            <div className="feet-inches-container">
                                <div className="feet-input">
                                    <input
                                        type="number"
                                        id="height-feet"
                                        className="numeric-input"
                                        placeholder="Feet"
                                        min="1"
                                        max="8"
                                        value={heightValue}
                                        onChange={(e) => setHeightValue(e.target.value)}
                                        aria-label="Height in feet"
                                    />
                                    <span className="unit-label">ft</span>
                                </div>
                                <div className="inches-input">
                                    <input
                                        type="number"
                                        id="height-inches"
                                        className="numeric-input"
                                        placeholder="Inches"
                                        min="0"
                                        max="11"
                                        value={heightInches}
                                        onChange={(e) => setHeightInches(e.target.value)}
                                        aria-label="Height in inches"
                                    />
                                    <span className="unit-label">in</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="weight-unit">Weight</label>
                    <div className="input-group">
                        <select
                            id="weight-unit"
                            className="unit-selector"
                            value={weightUnit}
                            onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                            aria-label="Select weight unit"
                        >
                            {WEIGHT_UNITS.map(unit => (
                                <option key={unit.value} value={unit.value}>{unit.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group mt-2">
                        <input
                            type="number"
                            id="weight-value"
                            className="numeric-input"
                            placeholder={`Weight in ${weightUnit}`}
                            min="20"
                            max={weightUnit === 'kg' ? "250" : "550"}
                            value={weightValue}
                            onChange={(e) => setWeightValue(e.target.value)}
                            aria-label={`Weight in ${weightUnit}`}
                        />
                        <span className="unit-label">{weightUnit}</span>
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="age"
                            className="numeric-input"
                            placeholder="Your age"
                            min="13"
                            max="120"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            aria-label="Your age"
                        />
                        <span className="unit-label">years</span>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="biological-sex">Biological Sex / Gender</label>
                    <select
                        id="biological-sex"
                        className="full-width-selector"
                        value={biologicalSex}
                        onChange={(e) => setBiologicalSex(e.target.value)}
                        aria-label="Select your biological sex or gender"
                    >
                        <option value="">Select option</option>
                        {BIOLOGICAL_SEX_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

/**
 * AnthropometricsSelector component for collecting basic physical metrics
 * Refactored to use StandardSection and MedicalCustomizationContext
 */
const AnthropometricsSelector = forwardRef<AccordionSectionRef, AnthropometricsSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { updateSectionValidity, _state, error, isLoading, markSectionComplete } = useMedicalCustomization();

    // Handle validity change
    const handleValidChange = (isValid: boolean) => {
        updateSectionValidity(SECTION_IDS.anthropometrics, isValid);
        onValidChange(isValid);
    };

    // Handle confirmation
    const handleConfirm = () => {
        markSectionComplete(SECTION_IDS.anthropometrics);
        announceToScreenReader('Anthropometrics information saved successfully');
        onConfirm();
    };

    return (
        <StandardSection
            ref={ref}
            sectionId={SECTION_IDS.anthropometrics}
            title="Anthropometrics"
            icon={<Ruler size={18} />}
            description="Your physical measurements help us customize your workout plan"
            isCompleted={isCompleted}
            onValidChange={handleValidChange}
            onConfirm={handleConfirm}
            error={error}
            isLoading={isLoading}
            required={true}
        >
            <AnthropometricsInnerForm />
        </StandardSection>
    );
});

AnthropometricsSelector.displayName = 'AnthropometricsSelector';

export default AnthropometricsSelector; 