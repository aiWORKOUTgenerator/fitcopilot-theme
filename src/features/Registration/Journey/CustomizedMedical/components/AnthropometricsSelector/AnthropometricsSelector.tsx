import { Check, Ruler } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../../../components/AccordionSection';
import { useJourney } from '../../../components/JourneyContext';
import { BIOLOGICAL_SEX_OPTIONS, HEIGHT_UNITS, WEIGHT_UNITS } from '../../constants/anthropometricsOptions';
import { AnthropometricsSelectorProps } from '../../types';
import { getMedicalCustomizationData, updateCustomizationSection } from '../../utils/customizationStorage';
import ConfirmButton from '../shared/ConfirmButton';
import './AnthropometricsSelector.scss';

/**
 * AnthropometricsSelector component for collecting basic physical metrics
 */
const AnthropometricsSelector = forwardRef<AccordionSectionRef, AnthropometricsSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Get stored data if available
    const storedData = getMedicalCustomizationData();
    const storedAnthropometrics = storedData.anthropometrics || {};

    // Initialize state from stored data, falling back to registrationData if needed
    const [heightUnit, setHeightUnit] = useState(
        storedAnthropometrics.height?.unit || registrationData.heightUnit || 'cm'
    );

    const [heightValue, setHeightValue] = useState(() => {
        // Try to get from stored data first
        if (storedAnthropometrics.height?.value) {
            return storedAnthropometrics.height.value.toString();
        }
        return registrationData.heightValue || '';
    });

    const [heightInches, setHeightInches] = useState(registrationData.heightInches || '');

    const [weightUnit, setWeightUnit] = useState(
        storedAnthropometrics.weight?.unit || registrationData.weightUnit || 'kg'
    );

    const [weightValue, setWeightValue] = useState(() => {
        // Try to get from stored data first
        if (storedAnthropometrics.weight?.value) {
            return storedAnthropometrics.weight.value.toString();
        }
        return registrationData.weightValue || '';
    });

    const [age, setAge] = useState(() => {
        if (storedAnthropometrics.age) {
            return storedAnthropometrics.age.toString();
        }
        return registrationData.age?.toString() || '';
    });

    const [biologicalSex, setBiologicalSex] = useState(
        storedAnthropometrics.biologicalSex || registrationData.biologicalSex || ''
    );

    const [isValid, setIsValid] = useState(false);

    // Initial validation on component mount
    useEffect(() => {
        // Validate initial values
        const heightValid = heightValue.trim() !== '' &&
            (heightUnit !== 'ft' || heightInches.trim() !== '');
        const weightValid = weightValue.trim() !== '';

        const valid = heightValid && weightValid;
        setIsValid(valid);
        onValidChange(valid);
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Validate inputs and update parent
    useEffect(() => {
        // Basic validation - at least height and weight should be provided
        const heightValid = heightValue.trim() !== '' &&
            (heightUnit !== 'ft' || heightInches.trim() !== '');
        const weightValid = weightValue.trim() !== '';

        const valid = heightValid && weightValid;
        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            heightUnit,
            heightValue,
            heightInches,
            weightUnit,
            weightValue,
            age: age ? parseInt(age) : undefined,
            biologicalSex
        });

        // Persist to local storage
        const heightValueNumeric = heightValue ? parseFloat(heightValue) : undefined;
        const heightInchesNumeric = heightInches ? parseFloat(heightInches) : undefined;
        const weightValueNumeric = weightValue ? parseFloat(weightValue) : undefined;
        const ageNumeric = age ? parseInt(age) : undefined;

        updateCustomizationSection('anthropometrics', {
            height: heightValueNumeric ? {
                value: heightValueNumeric,
                unit: heightUnit as 'cm' | 'ft',
            } : undefined,
            weight: weightValueNumeric ? {
                value: weightValueNumeric,
                unit: weightUnit as 'kg' | 'lbs',
            } : undefined,
            age: ageNumeric,
            biologicalSex: biologicalSex as 'male' | 'female' | 'other' | 'prefer-not-to-say' | undefined
        });
    }, [
        heightUnit, heightValue, heightInches,
        weightUnit, weightValue,
        age, biologicalSex,
        onValidChange, updateRegistrationData
    ]);

    // Prepare accordion title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Anthropometrics
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Anthropometrics';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<Ruler size={18} className={isCompleted ? 'text-emerald-400' : 'text-purple-300'} />}
            defaultOpen={false}
        >
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
                                onChange={(e) => setHeightUnit(e.target.value)}
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
                                onChange={(e) => setWeightUnit(e.target.value)}
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

                {/* Confirmation button */}
                <ConfirmButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    validationMessage="Please provide at least your height and weight"
                    buttonText="Confirm Measurements"
                />
            </div>
        </AccordionSection>
    );
});

AnthropometricsSelector.displayName = 'AnthropometricsSelector';

export default AnthropometricsSelector; 