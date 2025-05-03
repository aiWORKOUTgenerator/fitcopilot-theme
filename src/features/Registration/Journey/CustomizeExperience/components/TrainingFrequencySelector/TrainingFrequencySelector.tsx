import { Calendar, Check } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../../../components/AccordionSection';
import { useJourney } from '../../../components/JourneyContext';
import { FREQUENCY_OPTIONS } from '../../constants/timeCommitmentOptions';
import { updateCustomizationSection } from '../../utils/customizationStorage';
import ConfirmButton from '../shared/ConfirmButton';
import './TrainingFrequencySelector.scss';

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

interface TrainingFrequencySelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
}

/**
 * Component for selecting training frequency preferences
 */
const TrainingFrequencySelector = forwardRef<AccordionSectionRef, TrainingFrequencySelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Initialize state from saved data
    const [frequencyOption, setFrequencyOption] = useState<string>(
        registrationData.frequencyOption || ''
    );

    const [selectedDays, setSelectedDays] = useState<string[]>(
        registrationData.preferredTrainingDays || []
    );

    const [isValid, setIsValid] = useState(false);

    // Calculate number of days from the frequency option
    const getDaysPerWeek = (option: string): number => {
        if (option.includes('1-2')) return 2;
        if (option.includes('3-4')) return 4;
        if (option.includes('5-6')) return 6;
        if (option.includes('Every day')) return 7;
        return 0;
    };

    // Check if a time commitment package is already selected
    const hasTimeCommitmentPackage = (): boolean => {
        return !!registrationData.timeCommitmentPackage;
    };

    // Initial validation on component mount
    useEffect(() => {
        // Component is valid if frequency is selected OR a time commitment package is selected
        const valid = !!frequencyOption || hasTimeCommitmentPackage();
        setIsValid(valid);
        onValidChange(valid);
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Update validation status when selections change
    useEffect(() => {
        // Component is valid if frequency is selected OR a time commitment package is selected
        const valid = !!frequencyOption || hasTimeCommitmentPackage();
        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            frequencyOption,
            preferredTrainingDays: selectedDays,
            daysPerWeek: getDaysPerWeek(frequencyOption)
        });

        // Persist to local storage
        updateCustomizationSection('trainingFrequency', {
            daysPerWeek: getDaysPerWeek(frequencyOption),
            preferredDays: selectedDays
        });
    }, [frequencyOption, selectedDays, onValidChange, updateRegistrationData, registrationData.timeCommitmentPackage]);

    // Handle frequency selection
    const handleFrequencyChange = (option: string) => {
        setFrequencyOption(option);

        // Auto-select days based on frequency
        const daysPerWeek = getDaysPerWeek(option);

        // Clear current selections if changing frequency
        if (selectedDays.length > daysPerWeek) {
            setSelectedDays([]);
        }
    };

    // Toggle day selection
    const toggleDay = (day: string) => {
        setSelectedDays(prev => {
            // If already selected, remove it
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            }

            // Get max allowed days from selected frequency
            const maxDays = getDaysPerWeek(frequencyOption);

            // If we've hit the max, replace the oldest selection
            if (prev.length >= maxDays) {
                const newSelection = [...prev];
                newSelection.shift(); // Remove the first (oldest) item
                return [...newSelection, day];
            }

            // Otherwise, add the new day
            return [...prev, day];
        });
    };

    // Prepare accordion title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Training Frequency
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Training Frequency';

    // Generate validation message based on whether a package is selected
    const getValidationMessage = () => {
        if (hasTimeCommitmentPackage()) {
            return "Training frequency is already configured via your time commitment package. You can customize it here if you prefer.";
        }
        return "Please select your weekly training frequency";
    };

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<Calendar size={18} className={isCompleted ? 'text-emerald-400' : 'text-cyan-300'} />}
            defaultOpen={false}
        >
            <div className="training-frequency-selector">
                {hasTimeCommitmentPackage() && (
                    <div className="mb-4 p-3 bg-cyan-900/20 border border-cyan-800/40 rounded-lg">
                        <p className="text-cyan-300 text-sm">
                            You've already selected a time commitment package that includes frequency preferences.
                            You can skip this section or customize it further.
                        </p>
                    </div>
                )}

                <p className="section-description">
                    How often would you like to train each week?
                </p>

                {/* Frequency options */}
                <div className="frequency-options">
                    {FREQUENCY_OPTIONS.map((option, index) => (
                        <div key={index} className="frequency-option">
                            <input
                                type="radio"
                                id={`frequency-${index}`}
                                name="frequency"
                                className="radio-input"
                                checked={frequencyOption === option}
                                onChange={() => handleFrequencyChange(option)}
                            />
                            <label
                                htmlFor={`frequency-${index}`}
                                className="radio-label"
                            >
                                {option}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Day preferences - only show if a frequency is selected */}
                {frequencyOption && (
                    <div className="day-preferences">
                        <h4 className="section-subtitle">Preferred Training Days</h4>
                        <p className="section-subdescription">
                            Select up to {getDaysPerWeek(frequencyOption)} days when you prefer to train
                        </p>

                        <div className="days-container">
                            {DAYS_OF_WEEK.map((day, index) => (
                                <div
                                    key={index}
                                    className={`day-option ${selectedDays.includes(day) ? 'selected' : ''}`}
                                    onClick={() => toggleDay(day)}
                                    role="checkbox"
                                    aria-checked={selectedDays.includes(day)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            toggleDay(day);
                                        }
                                    }}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="selection-hint">
                            {selectedDays.length > 0 ? (
                                <span className="text-cyan-300">
                                    {selectedDays.length} of {getDaysPerWeek(frequencyOption)} days selected
                                </span>
                            ) : (
                                <span className="text-gray-400">
                                    Click to select your preferred training days
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Confirm button */}
                <ConfirmButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    validationMessage={getValidationMessage()}
                />
            </div>
        </AccordionSection>
    );
});

TrainingFrequencySelector.displayName = 'TrainingFrequencySelector';

export default TrainingFrequencySelector; 