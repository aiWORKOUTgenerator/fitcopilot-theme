import { ArrowRight } from 'lucide-react';
import React, { memo } from 'react';
import { ThemeProvider } from '../../../../../context/ThemeContext';
import { mapVariantToTheme } from '../../utils/themeUtils';
import TrainingButton from '../TrainingButton';
import './TrainingCTA.scss';
import { TrainingCTAProps } from './types';

/**
 * Training CTA button for the Training section
 */
const TrainingCTA: React.FC<TrainingCTAProps> = memo(function TrainingCTA({
  onNavigate,
  variant = 'default',
  className = '',
}) {
  return (
    <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
      <div className={`training-cta training-cta--${variant} ${className}`}>
        <TrainingButton
          variant="primary"
          size="large"
          styleVariant="accent"
          className="training-cta-button"
          onClick={() => onNavigate('all')}
          rightIcon={<ArrowRight className="ml-2" size={20} />}
          aria-label="View all training programs"
        >
          View All Programs
        </TrainingButton>
      </div>
    </ThemeProvider>
  );
});

export default TrainingCTA; 