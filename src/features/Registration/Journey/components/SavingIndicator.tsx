import { Check, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useJourney } from './JourneyContext';

/**
 * SavingIndicator component shows a status indicator when data is being saved
 */
const SavingIndicator: React.FC = () => {
  const { isDirty, isSaving } = useJourney();
  const [showSaved, setShowSaved] = useState(false);

  // Show "Saved" message briefly after saving completes
  useEffect(() => {
    if (!isDirty && !isSaving && showSaved === false) {
      setShowSaved(true);
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isDirty, isSaving, showSaved]);

  // Don't render anything if there's no saving activity
  if (!isSaving && !showSaved) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-opacity duration-300 ${isSaving ? 'bg-gray-700/90' : 'bg-emerald-700/90'
      } ${showSaved && !isSaving ? 'opacity-100' : 'opacity-90'}`}
      role="status"
      aria-live="polite"
    >
      {isSaving ? (
        <>
          <Save size={16} className="text-gray-300 animate-pulse" />
          <span className="text-gray-300">Saving...</span>
        </>
      ) : (
        <>
          <Check size={16} className="text-emerald-300" />
          <span className="text-emerald-300">Saved</span>
        </>
      )}
    </div>
  );
};

export default SavingIndicator; 