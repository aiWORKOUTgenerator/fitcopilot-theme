import React from 'react';
import ProgressBar from './ProgressBar';

interface RegistrationLayoutProps {
    children: React.ReactNode;
    progress: number;
    className?: string;
}

/**
 * Layout wrapper for all registration pages
 * Provides consistent layout structure and progress bar
 */
const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
    children,
    progress,
    className = '',
}) => {
    return (
        <div className={`registration-layout ${className}`}>
            <div className="registration-layout__header">
                <div className="registration-layout__logo">
                    <img src="/wp-content/themes/fitcopilot/src/assets/images/logo.svg" alt="FitCopilot" />
                </div>
                <ProgressBar progress={progress} />
            </div>

            <div className="registration-layout__content">
                {children}
            </div>

            <div className="registration-layout__footer">
                <div className="registration-layout__footer-content">
                    <p className="registration-layout__footer-text">
                        © {new Date().getFullYear()} FitCopilot. All rights reserved.
                    </p>
                    <div className="registration-layout__footer-links">
                        <a href="/privacy-policy" className="registration-layout__footer-link">
                            Privacy Policy
                        </a>
                        <a href="/terms-of-service" className="registration-layout__footer-link">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationLayout; 