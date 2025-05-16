import React from 'react';
import FeatureCard from '../FeatureCard';
import { FeatureCardProps } from '../types';

/**
 * Gym variant implementation of FeatureCard with gym-specific styling
 */
const GymFeatureCard: React.FC<Omit<FeatureCardProps, 'variant'>> = (props) => {
  return <FeatureCard {...props} variant="gym" />;
};

export default GymFeatureCard; 