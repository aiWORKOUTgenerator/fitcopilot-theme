import React from 'react';
import { Brain, Activity, Award, Users } from 'lucide-react';
import './FeatureCard.scss';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
}

/**
 * Renders an individual feature card
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon = 'brain'
}) => {
  // Map icon names to actual icon components
  const getIcon = () => {
    switch(icon) {
      case 'brain':
        return <Brain size={32} className="text-[#CCFF00]" />;
      case 'chart':
        return <Activity size={32} className="text-[#CCFF00]" />;
      case 'medal':
        return <Award size={32} className="text-[#CCFF00]" />;
      case 'users':
        return <Users size={32} className="text-[#CCFF00]" />;
      default:
        return <Brain size={32} className="text-[#CCFF00]" />;
    }
  };

  return (
    <div className="feature-card bg-[#151F38] p-6 rounded-xl border border-gray-800 hover:border-[#CCFF00]/30 transition-all duration-300">
      <div className="feature-card__icon-container mb-5 p-3 inline-block rounded-lg bg-[#0F172A]">
        {getIcon()}
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}; 