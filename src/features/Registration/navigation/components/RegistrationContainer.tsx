import React from 'react';
import { NavigationProvider } from '../context';
import RegistrationProgressIndicator from './RegistrationProgressIndicator';
import Confirmation from './stubs/Confirmation';
import ExperienceLevel from './stubs/ExperienceLevel';
import Journey from './stubs/Journey';
import Payment from './stubs/Payment';
import Pricing from './stubs/Pricing';
import Splash from './stubs/Splash';

/**
 * Main container component for the registration flow
 * Provides context and renders the appropriate step component
 */
const RegistrationContainer: React.FC = () => {
    return (
        <NavigationProvider>
            <RegistrationFlow />
        </NavigationProvider>
    );
};

/**
 * Component that renders the current step based on NavigationContext
 */
const RegistrationFlow: React.FC = () => {
    // This will be updated to use the useNavigation hook
    // For simplicity in this initial implementation, we'll just render a stub for each step
    return (
        <div className="registration-container">
            <RegistrationProgressIndicator />
            <div className="registration-content">
                <Splash />
                <ExperienceLevel />
                <Journey />
                <Pricing />
                <Payment />
                <Confirmation />
            </div>
        </div>
    );
};

export default RegistrationContainer; 