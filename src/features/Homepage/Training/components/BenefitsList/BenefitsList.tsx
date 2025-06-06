import { CheckCircle } from 'lucide-react';
import React, { memo } from 'react';
import TrainingCTA from '../TrainingCTA/TrainingCTA';
import { TrainingVariantKey } from '../TrainingCTA/types';
import './BenefitsList.scss';
import { BenefitsListProps } from './types';

/**
 * BenefitsList component for displaying program benefits
 * Can optionally include a secondary TrainingCTA for enhanced call-to-action placement
 * 
 * @param props Component props
 * @returns React component
 */
const BenefitsList: React.FC<BenefitsListProps> = ({
  benefits,
  variant = 'default',
  className = '',
  ariaLabelledBy,
  id,
  includeCTA = false,
  onCTAClick,
  ctaText,
}) => {
  const listClasses = `benefits-list benefits-list--${variant} ${className}`;

  // Validation for CTA integration
  if (includeCTA && !onCTAClick) {
    console.warn('BenefitsList: includeCTA is true but onCTAClick is not provided. CTA will not be displayed.');
  }

  return (
    <div className={`benefits-list-container ${includeCTA ? 'benefits-list-container--with-cta' : ''}`}>
      <ul
        className={listClasses}
        aria-labelledby={ariaLabelledBy}
        id={id}
      >
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="benefits-list__item"
          >
            {variant === 'sports' ? (
            // Sports variant uses disc bullet points
              <span>{benefit}</span>
            ) : (
            // Default variant uses CheckCircle icons
              <>
                <CheckCircle
                  size={16}
                  className="benefits-list__icon"
                  aria-hidden="true"
                />
                <span>{benefit}</span>
              </>
            )}
          </li>
        ))}
      </ul>
      
      {/* Optional Secondary TrainingCTA Integration */}
      {includeCTA && onCTAClick && (
        <div className="benefits-list__cta">
          <TrainingCTA
            onNavigate={onCTAClick}
            variant={variant as TrainingVariantKey} // Safe casting since TrainingVariantKey extends VariantKey
            size="secondary"
            className="benefits-list__cta-button"
          />
        </div>
      )}
    </div>
  );
};

// Export memoized version for better performance
export default memo(BenefitsList); 