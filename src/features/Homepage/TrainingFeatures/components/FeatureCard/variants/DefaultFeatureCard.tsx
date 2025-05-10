import React from 'react';
import FeatureCard from '../FeatureCard';
import { FeatureCardProps } from '../types';

/**
 * Default variant implementation of FeatureCard for the primary theme
 */
const DefaultFeatureCard: React.FC<Omit<FeatureCardProps, 'variant'>> = (props) => {
    return <FeatureCard {...props} variant="default" />;
};

export default DefaultFeatureCard; 