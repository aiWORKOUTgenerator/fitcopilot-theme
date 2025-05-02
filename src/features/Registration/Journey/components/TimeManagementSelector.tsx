import { Check, Clock } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from './AccordionSection';
import ConfirmSectionButton from './ConfirmSectionButton';
import { useJourney } from './JourneyContext';

interface TimeManagementSelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
}

const TIME_OF_DAY_OPTIONS = [
    'Morning',
    'Midday',
    'Afternoon',
    'Evening',
    'Late Night'
];

const DURATION_OPTIONS = [
    '5–10 minutes (Quick session)',
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '60 minutes',
    '90 minutes',
    '120 minutes',
    '180 minutes (Marathon/Endurance)'
];

const TimeManagementSelector = forwardRef<AccordionSectionRef, TimeManagementSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();
    const [timeOfDay, setTimeOfDay] = useState<string[]>(
        registrationData.preferredTimeOfDay || []
    );
    const [duration, setDuration] = useState<string>(
        registrationData.preferredDuration || ''
    );
    const [otherDuration, setOtherDuration] = useState<string>(
        registrationData.otherDuration || ''
    );
    const [isValid, setIsValid] = useState(false);

    // Update validation status whenever selections change
    useEffect(() => {
        const valid = timeOfDay.length > 0 && (duration || otherDuration.trim());
        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            preferredTimeOfDay: timeOfDay,
            preferredDuration: duration,
            otherDuration
        });
    }, [timeOfDay, duration, otherDuration, onValidChange, updateRegistrationData]);

    const toggleTimeOfDay = (time: string) => {
        setTimeOfDay(prev => {
            if (prev.includes(time)) {
                return prev.filter(t => t !== time);
            }
            return [...prev, time];
        });
    };

    // Prepare title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Time Management
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Time Management';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<Clock size={18} className={isCompleted ? 'text-emerald-400' : 'text-cyan-300'} />}
            defaultOpen={false}
        >
            <div className="space-y-6">
                {/* Time of Day Section */}
                <div>
                    <h4 className="text-sm font-medium text-white mb-3">Time of Day</h4>
                    <p className="text-xs text-gray-400 mb-3">
                        When do you typically prefer to work out? (Select all that apply)
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {TIME_OF_DAY_OPTIONS.map((time, index) => (
                            <div
                                key={index}
                                onClick={() => toggleTimeOfDay(time)}
                                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors
                  ${timeOfDay.includes(time)
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                        : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'}
                `}
                                role="checkbox"
                                aria-checked={timeOfDay.includes(time)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleTimeOfDay(time);
                                    }
                                }}
                            >
                                {time}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Duration Section */}
                <div>
                    <h4 className="text-sm font-medium text-white mb-3">Duration Options</h4>
                    <p className="text-xs text-gray-400 mb-3">
                        How long do you typically prefer your workouts to be?
                    </p>

                    <div className="space-y-2">
                        {DURATION_OPTIONS.map((option, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`duration-${index}`}
                                    name="duration"
                                    className="w-4 h-4 text-cyan-400 border-gray-600 focus:ring-cyan-500 focus:ring-2 bg-gray-700"
                                    checked={duration === option}
                                    onChange={() => setDuration(option)}
                                />
                                <label
                                    htmlFor={`duration-${index}`}
                                    className="ml-2 text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="other-duration" className="block text-sm font-medium text-gray-300 mb-1">
                            Other preferred duration
                        </label>
                        <textarea
                            id="other-duration"
                            className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                            placeholder="Please specify any other preferred workout duration"
                            rows={1}
                            value={otherDuration}
                            onChange={(e) => {
                                setOtherDuration(e.target.value);
                                // Clear the radio selection if we're entering custom text
                                if (e.target.value.trim() && duration) {
                                    setDuration('');
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Summary */}
                {timeOfDay.length > 0 && (
                    <div className="pt-2">
                        <div className="text-sm text-cyan-300">
                            {timeOfDay.length} time preference{timeOfDay.length !== 1 ? 's' : ''} selected
                        </div>
                    </div>
                )}

                <ConfirmSectionButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    sectionName="time management"
                />
            </div>
        </AccordionSection>
    );
});

TimeManagementSelector.displayName = 'TimeManagementSelector';

export default TimeManagementSelector; 