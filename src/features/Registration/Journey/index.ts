import CustomizeExperience from './CustomizeExperience';
import EquipmentSelector from './CustomizeExperience/components/EquipmentSelector';
import TimeCommitmentSelector from './CustomizeExperience/components/TimeCommitmentSelector';
import Journey from './Journey';
import AccordionSection from './components/AccordionSection';
import GoalSelector from './components/GoalSelector';
import { JourneyProvider, useJourney } from './components/JourneyContext';
import JourneyStepCard from './components/JourneyStepCard';
import SavingIndicator from './components/SavingIndicator';
import StepValidator from './components/StepValidator';
import WorkoutPreferenceSelector from './components/WorkoutPreferenceSelector';
import * as scrollUtils from './components/scrollUtils';

export {
    AccordionSection,
    CustomizeExperience,
    EquipmentSelector,
    GoalSelector,
    JourneyProvider,
    JourneyStepCard,
    SavingIndicator,
    scrollUtils,
    StepValidator,
    TimeCommitmentSelector,
    useJourney,
    WorkoutPreferenceSelector
};

export default Journey; 