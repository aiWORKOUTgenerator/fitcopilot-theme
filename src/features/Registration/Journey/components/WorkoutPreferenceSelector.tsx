import { Check, Layers } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from './AccordionSection';
import ConfirmSectionButton from './ConfirmSectionButton';
import { useJourney } from './JourneyContext';

interface WorkoutPreferenceSelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
}

const WORKOUT_PREFERENCES = [
  'HIIT (High Intensity Interval Training)',
  'Circuit Training',
  'Straight Sets',
  'AMRAP (As Many Rounds as Possible)',
  'EMOM (Every Minute on the Minute)',
  'Tabata',
  'Strength & Power Focus'
];

const WorkoutPreferenceSelector = forwardRef<AccordionSectionRef, WorkoutPreferenceSelectorProps>(({
  onValidChange,
  isCompleted = false,
  onConfirm
}, ref) => {
  const { registrationData, updateRegistrationData } = useJourney();
  const [preferences, setPreferences] = useState<string[]>(
    registrationData.workoutPreferences || []
  );
  const [isValid, setIsValid] = useState(false);

  // Update validation status whenever selections change
  useEffect(() => {
    const valid = preferences.length > 0;
    setIsValid(valid);
    onValidChange(valid);

    // Update registration data
    updateRegistrationData({
      workoutPreferences: preferences
    });
  }, [preferences, onValidChange, updateRegistrationData]);

  const togglePreference = (preference: string) => {
    setPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference);
      }
      return [...prev, preference];
    });
  };

  // Prepare title with completion indicator
  const sectionTitle = isCompleted ? (
    <div className="flex items-center">
      Workout Preference
      <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
        <Check size={12} className="mr-1" />
        Completed
      </span>
    </div>
  ) : 'Workout Preference';

  return (
    <AccordionSection
      ref={ref}
      title={sectionTitle}
      icon={<Layers size={18} className={isCompleted ? 'text-emerald-400' : 'text-cyan-300'} />}
      defaultOpen={false}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-400 mb-3">
          Select your preferred training styles (select all that apply)
        </p>

        <div className="grid grid-cols-1 gap-3">
          {WORKOUT_PREFERENCES.map((preference, index) => (
            <div
              key={index}
              onClick={() => togglePreference(preference)}
              className={`
                px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center
                ${preferences.includes(preference)
              ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/70'
              : 'bg-gray-700/60 text-gray-300 border border-gray-600 hover:bg-gray-700'}
              `}
              role="checkbox"
              aria-checked={preferences.includes(preference)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  togglePreference(preference);
                }
              }}
            >
              <div className={`
                w-4 h-4 mr-3 rounded border flex items-center justify-center transition-colors
                ${preferences.includes(preference)
              ? 'bg-cyan-400 border-cyan-500'
              : 'border-gray-500'}
              `}>
                {preferences.includes(preference) && (
                  <svg className="w-2.5 h-2.5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </div>
              {preference}
            </div>
          ))}
        </div>

        {preferences.length > 0 && (
          <div className="pt-2">
            <div className="text-sm text-cyan-300">
              {preferences.length} {preferences.length === 1 ? 'preference' : 'preferences'} selected
            </div>
          </div>
        )}

        <ConfirmSectionButton
          isValid={isValid}
          onConfirm={onConfirm}
          sectionName="workout preference"
        />
      </div>
    </AccordionSection>
  );
});

WorkoutPreferenceSelector.displayName = 'WorkoutPreferenceSelector';

export default WorkoutPreferenceSelector; 