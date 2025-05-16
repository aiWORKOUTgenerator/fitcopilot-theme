import React from 'react';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
}

/**
 * Standardized section title component for registration steps
 */
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`section-title ${className} text-center mb-8 animate-fade-in-up`}>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
        <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">
          {title}
        </span>
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="w-32 h-1 bg-gradient-to-r from-lime-300 to-emerald-400 mx-auto mt-6 rounded-full"></div>
    </div>
  );
};

export default SectionTitle; 