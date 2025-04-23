import React from 'react';
import './Features.scss';
import { FeaturesProps } from './types';
import { FeatureCard } from './components/FeatureCard';

/**
 * Features component - Displays the main features of the application
 */
export const Features: React.FC<FeaturesProps> = ({ features = [] }) => {
  // Default features if none provided from props
  const defaultFeatures = features.length > 0 ? features : [
    {
      id: 1,
      title: 'AI Workout Generation',
      description: 'Create personalized workout routines tailored to your goals, equipment, and fitness level.',
      icon: 'brain'
    },
    {
      id: 2,
      title: 'Progress Tracking',
      description: 'Monitor your fitness journey with detailed metrics and visualizations of your progress.',
      icon: 'chart'
    },
    {
      id: 3,
      title: 'Expert Guidance',
      description: 'Access workout plans designed with input from certified fitness professionals.',
      icon: 'medal'
    },
    {
      id: 4,
      title: 'Community Support',
      description: 'Join a community of like-minded individuals on their fitness journey.',
      icon: 'users'
    }
  ];

  return (
    <section className="features-section py-24 bg-[#0F172A]" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#CCFF00] to-[#64D2B9] text-transparent bg-clip-text inline-block">
            Powerful Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform provides everything you need to achieve your fitness goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {defaultFeatures.map(feature => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 