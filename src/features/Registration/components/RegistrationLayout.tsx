import React from 'react';

interface RegistrationLayoutProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Layout wrapper for all registration pages
 * Provides consistent layout structure
 */
const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`registration-layout ${className}`}>
            <div className="registration-layout__header">
                {/* Progress indicator now moved to parent component */}
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