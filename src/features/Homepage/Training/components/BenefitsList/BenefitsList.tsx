import { CheckCircle } from 'lucide-react';
import React from 'react';
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
}) => {
    const listClasses = `benefits-list benefits-list--${variant} ${className}`;

    return (
        <ul className={listClasses}>
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
                            <CheckCircle size={16} className="benefits-list__icon" />
                            <span>{benefit}</span>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default BenefitsList; 