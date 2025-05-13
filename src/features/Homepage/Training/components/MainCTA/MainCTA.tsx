import { ArrowRight } from 'lucide-react';
import React, { memo } from 'react';
import { Button } from '../../../../../features/shared/Button';
import './MainCTA.scss';
import { MainCTAProps } from './types';

/**
 * Main CTA button for the Training section
 */
const MainCTA: React.FC<MainCTAProps> = memo(function MainCTA({
    onNavigate,
    variant = 'default',
    className = '',
}) {
    return (
        <div className={`main-cta main-cta--${variant} ${className}`}>
            <Button
                variant="primary"
                size="lg"
                className="training-button-primary"
                onClick={() => onNavigate('all')}
                aria-label="View all training programs"
            >
                View All Programs
                <ArrowRight className="ml-2" size={20} />
            </Button>
        </div>
    );
});

export default MainCTA; 