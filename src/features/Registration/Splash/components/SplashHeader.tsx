import React from 'react';

interface SplashHeaderProps {
    className?: string;
}

/**
 * Header component for the splash page
 */
const SplashHeader: React.FC<SplashHeaderProps> = ({
    className = '',
}) => {
    return (
        <header className={`splash-header ${className}`}>
            <div className="splash-header__logo">
                <img src="/wp-content/themes/fitcopilot/src/assets/images/logo.svg" alt="FitCopilot" />
            </div>

            <nav className="splash-header__nav">
                <a href="/about" className="splash-header__nav-link">About</a>
                <a href="/pricing" className="splash-header__nav-link">Pricing</a>
                <a href="/login" className="splash-header__nav-link">Login</a>
            </nav>
        </header>
    );
};

export default SplashHeader; 