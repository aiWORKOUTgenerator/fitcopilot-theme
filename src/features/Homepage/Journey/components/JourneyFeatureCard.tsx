import { ArrowRight } from 'lucide-react';
import React from 'react';
import { UniversalButton } from '../../components/UniversalButton';
import { JourneyFeatureCardProps } from '../types';

/**
 * JourneyFeatureCard - Renders an individual feature card within an expanded journey step
 * Enhanced with optional action button support for better user engagement
 */
const JourneyFeatureCard: React.FC<JourneyFeatureCardProps> = ({
  feature,
  variant,
  showAction = false,
  actionText = "Learn More",
  onAction
}) => {
  // Generate action button if enabled
  const renderActionButton = () => {
    if (!showAction) return null;
    
    return (
      <div className="mt-3 flex justify-start">
        <UniversalButton
          sectionContext="journey"
          buttonVariant="tertiary"
          size="small"
          variant={variant}
          onClick={onAction}
          rightIcon={<ArrowRight size={14} />}
          className="text-xs"
        >
          {actionText}
        </UniversalButton>
      </div>
    );
  };

  return (
    <div
      className="journey-bg-feature-card hover:journey-bg-feature-card-hover flex flex-col gap-4 p-4 rounded-xl transition-colors group/feature"
      data-theme={variant !== 'default' ? variant : undefined}
    >
      <div className="flex items-start gap-4">
        <div className="journey-bg-feature-icon p-2 rounded-lg group-hover/feature:scale-110 transition-transform" aria-hidden="true">
          {feature.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold journey-text-heading mb-1">{feature.title}</h4>
          <p className="text-sm journey-text-description group-hover/feature:journey-text-description-hover transition-colors">
            {feature.description}
          </p>
        </div>
      </div>
      
      {renderActionButton()}
    </div>
  );
};

export default JourneyFeatureCard; 