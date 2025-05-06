import { ArrowRight, ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { RegistrationButton, SectionTitle } from '../components';
import { useNavigation } from '../navigation/context';
import { JourneySubstepId, RegistrationStepId } from '../navigation/types';
import { RegistrationStepProps } from '../types';

/**
 * AnalyticsPreferences component - Substep in the Journey flow
 * Allows users to set their preferences for analytics and tracking
 */
const AnalyticsPreferences: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    onBack
}) => {
    const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(
        data?.analyticsConsent ?? true
    );

    // Get navigation context
    const { markStepCompleted, markSubstepCompleted } = useNavigation();

    // Handle saving preferences and proceeding to next step
    const handleNext = () => {
        // Update data with analytics consent
        updateData({
            ...data,
            analyticsConsent,
            // Add completion flag for the journey
            completedCustomizationSections: [
                ...(data.completedCustomizationSections || []),
                'analytics_preferences_completed'
            ]
        });

        // Mark the analytics substep as completed
        markSubstepCompleted(JourneySubstepId.ANALYTICS, true);

        // Mark the overall Journey step as completed
        markStepCompleted(RegistrationStepId.JOURNEY, true);

        // Navigate to the next step (Pricing)
        if (onNext) {
            onNext();
        }
    };

    return (
        <div className="analytics-preferences-substep">
            <SectionTitle
                title="Analytics & Tracking Preferences"
                subtitle="Help us improve your experience by allowing us to collect anonymous usage data."
            />

            <div className="analytics-preferences-container">
                <div className="analytics-preferences-card">
                    <h3 className="analytics-preferences-heading">
                        Allow Anonymous Usage Data Collection
                    </h3>
                    <p className="analytics-preferences-description">
                        We collect anonymous data about how you use our app to improve the user experience.
                        This helps us understand which features are most valuable and identify areas for improvement.
                    </p>

                    <div className="analytics-toggle">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={analyticsConsent}
                                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                        <span className="toggle-label">
                            {analyticsConsent ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="analytics-navigation">
                <RegistrationButton
                    onClick={onBack}
                    variant="secondary"
                    size="medium"
                    leftIcon={<ChevronLeft className="h-5 w-5" />}
                >
                    Back
                </RegistrationButton>

                <RegistrationButton
                    onClick={handleNext}
                    variant="primary"
                    size="medium"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                    Next
                </RegistrationButton>
            </div>

            <style jsx>{`
                .analytics-preferences-substep {
                    padding: 2rem 0;
                }
                
                .analytics-preferences-container {
                    margin: 2rem 0;
                }
                
                .analytics-preferences-card {
                    background-color: rgba(23, 23, 23, 0.5);
                    border: 2px solid rgba(75, 85, 99, 0.5);
                    border-radius: 0.75rem;
                    padding: 2rem;
                }
                
                .analytics-preferences-heading {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.75rem;
                }
                
                .analytics-preferences-description {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin-bottom: 1.5rem;
                }
                
                .analytics-toggle {
                    display: flex;
                    align-items: center;
                    margin-top: 1.5rem;
                }
                
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #4b5563;
                    transition: .4s;
                    border-radius: 24px;
                }
                
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                
                input:checked + .toggle-slider {
                    background-color: #10b981;
                }
                
                input:checked + .toggle-slider:before {
                    transform: translateX(26px);
                }
                
                .toggle-label {
                    margin-left: 1rem;
                    font-size: 0.875rem;
                    color: white;
                }
                
                .analytics-navigation {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                }
            `}</style>
        </div>
    );
};

export default AnalyticsPreferences; 