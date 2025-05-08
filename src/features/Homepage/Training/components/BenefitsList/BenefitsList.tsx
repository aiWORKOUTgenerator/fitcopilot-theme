import { CheckCircle } from 'lucide-react';
import React, { memo } from 'react';
import './BenefitsList.scss';
import { BenefitsListProps } from './types';

/**
 * BenefitsList component for displaying program benefits
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
}) => {
    const listClasses = `benefits-list benefits-list--${variant} ${className}`;

    return (
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
    );
};

// Export memoized version for better performance
export default memo(BenefitsList); 