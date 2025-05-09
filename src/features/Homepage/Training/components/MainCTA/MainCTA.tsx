import { ArrowRight } from 'lucide-react';
import React, { memo } from 'react';
import Button from '../../../../../components/UI/Button';
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
                size="large"
                rightIcon={<ArrowRight size={20} />}
                onClick={() => onNavigate('all')}
                aria-label="View all training programs"
            >
                View All Programs
            </Button>
        </div>
    );
});

export default MainCTA; 