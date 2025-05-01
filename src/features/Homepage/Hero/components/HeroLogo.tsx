import React from 'react';

interface HeroLogoProps {
  logoUrl?: string;
}

/**
 * Logo component for the Hero section
 */
export const HeroLogo: React.FC<HeroLogoProps> = ({ logoUrl }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {logoUrl ? (
        <picture>
          <source srcSet={logoUrl} type="image/png" />
          <img
            src={logoUrl}
            alt="AI Workout Generator"
            className="hero-logo"
            loading="eager"
            width="380"
            height="180"
          />
        </picture>
      ) : (
        <>
          <span className="text-gray-400 text-lg tracking-wider">ai</span>
          <span className="text-white text-2xl font-bold tracking-wide">WORKOUT</span>
          <span className="bg-[#CCFF00] text-[#0B1121] text-sm px-4 py-0.5 rounded-full font-medium tracking-wider">
            GENERATOR
          </span>
        </>
      )}
    </div>
  );
}; 