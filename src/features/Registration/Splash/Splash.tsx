import React from 'react';
import { NavigationButtons } from '../components';
import { RegistrationStepProps } from '../types';
import { ProgressIndicator, SplashHeader } from './components';
import './Splash.scss';

interface SplashComponentProps extends RegistrationStepProps { }

/**
 * Splash page component that serves as the entry point for the registration flow
 */
const SplashComponent: React.FC<SplashComponentProps> = ({
    data,
    updateData,
    onNext,
    className = '',
}) => {
    return (
        <div className={`splash-step registration-step ${className}`}>
            <SplashHeader />

            <div className="splash-content">
                <div className="splash-content__left">
                    <h1 className="splash-content__title">Get Your Personalized Workout Plan</h1>
                    <p className="splash-content__subtitle">
                        Answer a few questions about your fitness experience, goals, and preferences,
                        and we'll create a customized workout program just for you.
                    </p>

                    <div className="splash-benefits">
                        <div className="splash-benefit">
                            <div className="splash-benefit__icon">⏱️</div>
                            <div className="splash-benefit__text">
                                <h3>Quick Setup</h3>
                                <p>Takes less than 3 minutes</p>
                            </div>
                        </div>

                        <div className="splash-benefit">
                            <div className="splash-benefit__icon">🎯</div>
                            <div className="splash-benefit__text">
                                <h3>Personalized Plan</h3>
                                <p>Tailored to your fitness level</p>
                            </div>
                        </div>

                        <div className="splash-benefit">
                            <div className="splash-benefit__icon">🔄</div>
                            <div className="splash-benefit__text">
                                <h3>Adaptive Program</h3>
                                <p>Adjusts as you progress</p>
                            </div>
                        </div>
                    </div>

                    <NavigationButtons
                        onNext={onNext}
                        nextLabel="Get Started"
                    />
                </div>

                <div className="splash-content__right">
                    <div className="splash-preview">
                        <img
                            src="/wp-content/themes/fitcopilot/src/assets/images/workout-preview.jpg"
                            alt="Workout Preview"
                            className="splash-preview__image"
                        />
                        <div className="splash-preview__overlay">
                            <ProgressIndicator />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashComponent; 