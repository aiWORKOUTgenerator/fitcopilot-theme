import { ArrowRight } from 'lucide-react';
import React, { memo } from 'react';
import Button from '../../../../../components/UI/Button';
import './MainCTA.scss';
import { MainCTAProps } from './types';

/**
 * MainCTA component for the training section
 */
const MainCTA: React.FC<MainCTAProps> = ({
    onNavigate,
    variant = 'default',
    className = ''
}) => {
    return (
        <div className={`training-section__cta ${className}`}>
            <Button
                variant="primary"
                size="large"
                rightIcon={<ArrowRight size={20} />}
                onClick={() => onNavigate('all')}
                aria-label="Browse all training programs"
            >
                Find Your Perfect Program
            </Button>
        </div>
    );
};

export default memo(MainCTA); 