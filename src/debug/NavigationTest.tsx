import React from 'react';
import Registration from '../features/Registration/Registration';
import { NavigationProvider } from '../features/Registration/context/NavigationContext';
import { RegistrationStepId } from '../features/Registration/types';

/**
 * Simple test page for debugging navigation issues
 */
const NavigationTest: React.FC = () => {
    const handleComplete = (data: any) => {
        console.log('Registration complete with data:', data);
    };

    const handleCancel = () => {
        console.log('Registration cancelled');
    };

    return (
        <div className="navigation-test" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Registration Navigation Test</h1>

            <div style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                <NavigationProvider initialStep={RegistrationStepId.SPLASH}>
                    <Registration
                        onComplete={handleComplete}
                        onCancel={handleCancel}
                    />
                </NavigationProvider>
            </div>
        </div>
    );
};

export default NavigationTest; 