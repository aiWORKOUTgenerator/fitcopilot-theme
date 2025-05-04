import React, { useEffect, useState } from 'react';
import { DAYS_OF_WEEK, DURATION_OPTIONS, FREQUENCY_OPTIONS, TIME_COMMITMENT_PACKAGES, TIME_OF_DAY_OPTIONS } from '../../constants/timeCommitmentOptions';
import { useCustomization } from '../../context/CustomizationContext';
import './TimeCommitmentSelector.scss';

/**
 * Enhanced time commitment selector component with smart option linking and training frequency
 * using the centralized CustomizationContext
 */
const TimeCommitmentSelector: React.FC<{ setIsValid?: (isValid: boolean) => void }> = ({
    setIsValid
}) => {
    const {
        timeCommitmentData,
        updateTimeCommitmentData,
        saveAllData
    } = useCustomization();

    // Initialize state from context data
    const [timeOfDay, setTimeOfDay] = useState<string[]>(
        timeCommitmentData?.preferredTimeOfDay || []
    );

    const [duration, setDuration] = useState<string>(
        timeCommitmentData?.preferredDuration || ''
    );

    const [otherDuration, setOtherDuration] = useState<string>(
        timeCommitmentData?.otherDuration || ''
    );

    const [selectedPackage, setSelectedPackage] = useState<string>(
        timeCommitmentData?.timeCommitmentPackage || ''
    );

    // Training frequency state
    const [selectedDays, setSelectedDays] = useState<string[]>(
        timeCommitmentData?.preferredDays || []
    );

    const [frequency, setFrequency] = useState<string>(
        timeCommitmentData?.trainingFrequency || ''
    );

    // Validate selection
    useEffect(() => {
        const hasTimeOfDay = timeOfDay.length > 0;
        const hasDuration = !!duration || !!otherDuration.trim();
        const hasFrequency = !!frequency;
        const hasDays = selectedDays.length > 0;

        // Valid if time and duration are set, and either training frequency or package is selected
        const isValid = (hasTimeOfDay && hasDuration) && (hasFrequency || hasDays || !!selectedPackage);

        if (setIsValid) {
            setIsValid(isValid);
        }

        // Update context data when selections change
        updateTimeCommitmentData({
            preferredTimeOfDay: timeOfDay,
            preferredDuration: duration,
            otherDuration,
            timeCommitmentPackage: selectedPackage,
            preferredDays: selectedDays,
            trainingFrequency: frequency
        });

        // Save to storage
        saveAllData();
    }, [timeOfDay, duration, otherDuration, selectedPackage, selectedDays, frequency, updateTimeCommitmentData, saveAllData, setIsValid]);

    // Toggle time of day selection
    const toggleTimeOfDay = (option: string) => {
        setTimeOfDay(prev => {
            if (prev.includes(option)) {
                return prev.filter(time => time !== option);
            }
            return [...prev, option];
        });
    };

    // Select duration option
    const selectDuration = (option: string) => {
        setDuration(option);
        setOtherDuration('');

        // If package was selected, clear it since user is customizing
        if (selectedPackage) {
            setSelectedPackage('');
        }
    };

    // Toggle day selection
    const toggleDay = (day: string) => {
        setSelectedDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            }
            return [...prev, day];
        });

        // If package was selected, clear it since user is customizing
        if (selectedPackage) {
            setSelectedPackage('');
        }
    };

    // Select package option (preset of duration and frequency)
    const selectPackage = (packageKey: string) => {
        const packageData = TIME_COMMITMENT_PACKAGES[packageKey];
        setSelectedPackage(packageKey);

        // Apply package settings
        if (packageData) {
            // Set duration from package
            setDuration(packageData.duration);
            setOtherDuration('');

            // Set frequency and days from package
            setFrequency(packageData.frequency);
            setSelectedDays(packageData.days);
        }
    };

    // Handle other duration change
    const handleOtherDurationChange = (value: string) => {
        setOtherDuration(value);

        // Clear duration selection if entering custom text
        if (value.trim() && duration) {
            setDuration('');
        }

        // Clear package selection since user is customizing
        if (selectedPackage) {
            setSelectedPackage('');
        }
    };

    // Handle frequency change
    const handleFrequencyChange = (newFrequency: string) => {
        setFrequency(newFrequency);

        // Clear package selection since user is customizing
        if (selectedPackage) {
            setSelectedPackage('');
        }
    };

    return (
        <div className="time-commitment-selector">
            {/* Time of day selection */}
            <div className="section-group">
                <h4 className="section-subtitle">Preferred Time of Day</h4>
                <div className="time-options">
                    {TIME_OF_DAY_OPTIONS.map((option, index) => (
                        <div
                            key={index}
                            className={`time-option ${timeOfDay.includes(option) ? 'selected' : ''}`}
                            onClick={() => toggleTimeOfDay(option)}
                            role="checkbox"
                            aria-checked={timeOfDay.includes(option)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleTimeOfDay(option);
                                }
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>

            {/* Duration selection */}
            <div className="section-group">
                <h4 className="section-subtitle">Workout Duration</h4>
                <div className="duration-options">
                    {DURATION_OPTIONS.map((option, index) => (
                        <div
                            key={index}
                            className={`duration-option ${duration === option ? 'selected' : ''}`}
                            onClick={() => selectDuration(option)}
                            role="radio"
                            aria-checked={duration === option}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    selectDuration(option);
                                }
                            }}
                        >
                            {option}
                        </div>
                    ))}

                    <div className="other-duration">
                        <input
                            type="text"
                            placeholder="Other duration..."
                            value={otherDuration}
                            onChange={(e) => handleOtherDurationChange(e.target.value)}
                            className={otherDuration ? 'has-value' : ''}
                        />
                    </div>
                </div>
            </div>

            {/* Training frequency */}
            <div className="section-group">
                <h4 className="section-subtitle">Training Frequency</h4>

                <div className="frequency-options">
                    {FREQUENCY_OPTIONS.map((option, index) => (
                        <div
                            key={index}
                            className={`frequency-option ${frequency === option ? 'selected' : ''}`}
                            onClick={() => handleFrequencyChange(option)}
                            role="radio"
                            aria-checked={frequency === option}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleFrequencyChange(option);
                                }
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>

                <div className="days-selection">
                    <h5 className="days-subtitle">Preferred Training Days</h5>
                    <div className="days-options">
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
                                {day.substring(0, 3)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Package selection */}
            <div className="section-group">
                <h4 className="section-subtitle">Quick Selection Packages</h4>
                <p className="package-description">
                    Choose a package to automatically set your duration and frequency
                </p>

                <div className="package-options">
                    {Object.entries(TIME_COMMITMENT_PACKAGES).map(([key, pkg]) => (
                        <div
                            key={key}
                            className={`package-option ${selectedPackage === key ? 'selected' : ''}`}
                            onClick={() => selectPackage(key)}
                            role="radio"
                            aria-checked={selectedPackage === key}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    selectPackage(key);
                                }
                            }}
                        >
                            <div className="package-name">{pkg.name}</div>
                            <div className="package-description">{pkg.description}</div>
                            <div className="package-details">
                                <span>{pkg.duration}</span>
                                <span className="separator">•</span>
                                <span>{pkg.frequency}</span>
                                <span className="separator">•</span>
                                <span>{pkg.totalWeeklyTime}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimeCommitmentSelector;