import Journey from './Journey';
import AccordionSection from './components/AccordionSection';
import CustomizationContainer from './components/CustomizationContainer';
import EquipmentSelector from './components/EquipmentSelector';
import GoalSelector from './components/GoalSelector';
import { JourneyProvider, useJourney } from './components/JourneyContext';
import JourneyStepCard from './components/JourneyStepCard';
import SavingIndicator from './components/SavingIndicator';
import StepValidator from './components/StepValidator';
import TimeManagementSelector from './components/TimeManagementSelector';
import TrainingFrequencySelector from './components/TrainingFrequencySelector';
import WorkoutPreferenceSelector from './components/WorkoutPreferenceSelector';
import * as scrollUtils from './components/scrollUtils';

export {
    AccordionSection, CustomizationContainer,
    EquipmentSelector, GoalSelector, JourneyProvider,
    JourneyStepCard,
    SavingIndicator, scrollUtils, StepValidator, TimeManagementSelector, TrainingFrequencySelector, useJourney, WorkoutPreferenceSelector
};

export default Journey; 