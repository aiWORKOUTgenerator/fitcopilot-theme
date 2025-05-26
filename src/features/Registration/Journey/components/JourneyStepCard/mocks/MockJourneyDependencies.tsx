import * as React from 'react';
import { JourneyStepFeature } from '../../JourneyStepCard';

// Mock GoalSelector component
export const MockGoalSelector: React.FC<{
  features: JourneyStepFeature[];
  onValidChange: (isValid: boolean) => void;
}> = ({ features, onValidChange }) => {
  const [selectedGoals, setSelectedGoals] = React.useState<string[]>([]);

  React.useEffect(() => {
    onValidChange(selectedGoals.length > 0);
  }, [selectedGoals, onValidChange]);

  const toggleGoal = (goalTitle: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalTitle) 
        ? prev.filter(g => g !== goalTitle)
        : [...prev, goalTitle]
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Select Your Fitness Goals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => toggleGoal(feature.title)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedGoals.includes(feature.title)
                ? 'border-lime-400 bg-lime-400/10'
                : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-800">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedGoals.length > 0 && (
        <div className="mt-4 p-3 bg-lime-400/10 border border-lime-400/30 rounded-lg">
          <p className="text-lime-300 text-sm">
            Selected: {selectedGoals.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

// Mock CustomizeExperience component
export const MockCustomizeExperience: React.FC<{
  onValidChange: (isValid: boolean) => void;
}> = ({ onValidChange }) => {
  const [experience, setExperience] = React.useState('');
  const [equipment, setEquipment] = React.useState('');
  const [timeCommitment, setTimeCommitment] = React.useState('');

  React.useEffect(() => {
    onValidChange(experience !== '' && equipment !== '' && timeCommitment !== '');
  }, [experience, equipment, timeCommitment, onValidChange]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Customize Your Experience</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Experience Level
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Select your level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Available Equipment
          </label>
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Select equipment</option>
            <option value="home">Home/Bodyweight</option>
            <option value="basic">Basic Equipment</option>
            <option value="gym">Full Gym Access</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time Commitment (per session)
          </label>
          <select
            value={timeCommitment}
            onChange={(e) => setTimeCommitment(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Select duration</option>
            <option value="15-30">15-30 minutes</option>
            <option value="30-45">30-45 minutes</option>
            <option value="45-60">45-60 minutes</option>
            <option value="60+">60+ minutes</option>
          </select>
        </div>
      </div>

      {experience && equipment && timeCommitment && (
        <div className="mt-4 p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
          <p className="text-cyan-300 text-sm">
            Configuration: {experience} level, {equipment} equipment, {timeCommitment} sessions
          </p>
        </div>
      )}
    </div>
  );
};

// Mock CustomizedMedical component
export const MockCustomizedMedical: React.FC<{
  onValidChange: (isValid: boolean) => void;
}> = ({ onValidChange }) => {
  const [healthStatus, setHealthStatus] = React.useState('');
  const [injuries, setInjuries] = React.useState('');
  const [clearance, setClearance] = React.useState(false);

  React.useEffect(() => {
    onValidChange(healthStatus !== '' && injuries !== '' && clearance);
  }, [healthStatus, injuries, clearance, onValidChange]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Medical Information</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Overall Health Status
          </label>
          <select
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-400 focus:outline-none"
          >
            <option value="">Select health status</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Previous Injuries
          </label>
          <select
            value={injuries}
            onChange={(e) => setInjuries(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-400 focus:outline-none"
          >
            <option value="">Select injury history</option>
            <option value="none">No previous injuries</option>
            <option value="minor">Minor injuries (fully recovered)</option>
            <option value="ongoing">Ongoing issues</option>
            <option value="major">Major injuries</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="medical-clearance"
            checked={clearance}
            onChange={(e) => setClearance(e.target.checked)}
            className="w-4 h-4 text-violet-400 bg-gray-700 border-gray-600 rounded focus:ring-violet-400"
          />
          <label htmlFor="medical-clearance" className="text-sm text-gray-300">
            I have medical clearance for physical activity
          </label>
        </div>
      </div>

      {healthStatus && injuries && clearance && (
        <div className="mt-4 p-3 bg-violet-400/10 border border-violet-400/30 rounded-lg">
          <p className="text-violet-300 text-sm">
            Health assessment completed: {healthStatus} health, {injuries} injury history
          </p>
        </div>
      )}
    </div>
  );
};

// Mock AnalyticsSelector component
export const MockAnalyticsSelector: React.FC<{
  features: JourneyStepFeature[];
  onValidChange: (isValid: boolean) => void;
}> = ({ features, onValidChange }) => {
  const [selectedAnalytics, setSelectedAnalytics] = React.useState<string[]>([]);

  React.useEffect(() => {
    onValidChange(selectedAnalytics.length > 0);
  }, [selectedAnalytics, onValidChange]);

  const toggleAnalytic = (analyticTitle: string) => {
    setSelectedAnalytics(prev => 
      prev.includes(analyticTitle) 
        ? prev.filter(a => a !== analyticTitle)
        : [...prev, analyticTitle]
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Choose Your Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => toggleAnalytic(feature.title)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedAnalytics.includes(feature.title)
                ? 'border-amber-400 bg-amber-400/10'
                : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-800">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedAnalytics.length > 0 && (
        <div className="mt-4 p-3 bg-amber-400/10 border border-amber-400/30 rounded-lg">
          <p className="text-amber-300 text-sm">
            Selected: {selectedAnalytics.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

// Mock RegistrationButton component
export const MockRegistrationButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}> = ({ children, onClick, disabled = false, variant = 'primary', className = '' }) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 w-full";
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-md hover:shadow-lg hover:shadow-lime-300/30 hover:-translate-y-1"
    : "bg-gray-600 text-white border border-gray-500 hover:bg-gray-500";
  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}; 