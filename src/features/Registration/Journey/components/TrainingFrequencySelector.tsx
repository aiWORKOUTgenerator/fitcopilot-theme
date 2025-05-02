import { Calendar, Check } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from './AccordionSection';
import ConfirmSectionButton from './ConfirmSectionButton';
import { useJourney } from './JourneyContext';

interface TrainingFrequencySelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
}

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const FREQUENCY_OPTIONS = [
    '1–2 Days',
    '2–3 Days',
    '3–5 Days',
    '6+ Days',
    'Everyday',
    'Flexible / Varies Weekly'
];

const TrainingFrequencySelector = forwardRef<AccordionSectionRef, TrainingFrequencySelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();
    const [selectedDays, setSelectedDays] = useState<string[]>(
        registrationData.preferredDays || []
    );
    const [frequency, setFrequency] = useState<string>(
        registrationData.trainingFrequency || ''
    );
    const [isValid, setIsValid] = useState(false);

    // Update validation status whenever selections change
    useEffect(() => {
        // Either days are selected or frequency is set (or both)
        const valid = selectedDays.length > 0 || !!frequency;
        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            preferredDays: selectedDays,
            trainingFrequency: frequency
        });
    }, [selectedDays, frequency, onValidChange, updateRegistrationData]);

    const toggleDay = (day: string) => {
        setSelectedDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            }
            return [...prev, day];
        });
    };

    // Prepare title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Training Frequency
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Training Frequency';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<Calendar size={18} className={isCompleted ? 'text-emerald-400' : 'text-cyan-300'} />}
            defaultOpen={false}
        >
            <div className="space-y-6">
                {/* Days of the Week Section */}
                <div>
                    <h4 className="text-sm font-medium text-white mb-3">Days of the Week</h4>
                    <p className="text-xs text-gray-400 mb-3">
                        Which days do you prefer to train? (Select all that apply)
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                        {DAYS_OF_WEEK.map((day, index) => (
                            <div
                                key={index}
                                onClick={() => toggleDay(day)}
                                className={`
                  py-1.5 px-2 rounded text-center text-sm cursor-pointer transition-colors
                  ${selectedDays.includes(day)
                                        ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-800'
                                        : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'}
                `}
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
                                {day.substring(0, 3)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Frequency Options Section */}
                <div>
                    <h4 className="text-sm font-medium text-white mb-3">Frequency Options</h4>
                    <p className="text-xs text-gray-400 mb-3">
                        How many days per week do you want to train?
                    </p>

                    <div className="space-y-2">
                        {FREQUENCY_OPTIONS.map((option, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`frequency-${index}`}
                                    name="frequency"
                                    className="w-4 h-4 text-cyan-400 border-gray-600 focus:ring-cyan-500 focus:ring-2 bg-gray-700"
                                    checked={frequency === option}
                                    onChange={() => setFrequency(option)}
                                />
                                <label
                                    htmlFor={`frequency-${index}`}
                                    className="ml-2 text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                {(selectedDays.length > 0 || frequency) && (
                    <div className="pt-2 space-y-1">
                        {selectedDays.length > 0 && (
                            <div className="text-sm text-cyan-300">
                                {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} selected
                            </div>
                        )}
                        {frequency && (
                            <div className="text-sm text-cyan-300">
                                Frequency: {frequency}
                            </div>
                        )}
                    </div>
                )}

                <ConfirmSectionButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    sectionName="training frequency"
                    isLast={true}
                />
            </div>
        </AccordionSection>
    );
});

TrainingFrequencySelector.displayName = 'TrainingFrequencySelector';

export default TrainingFrequencySelector; 