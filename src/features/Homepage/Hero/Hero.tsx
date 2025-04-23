import React from 'react';
import { Zap, UserPlus, LogIn } from 'lucide-react';
import './Hero.scss';
import { HeroProps } from './types';
import { HeroLogo } from './components/HeroLogo';
import { HeroButton } from './components/HeroButton';

/**
 * Hero component - The main landing section of the homepage
 */
export const Hero: React.FC<HeroProps> = ({
  registrationLink = "https://builder.fitcopilot.ai/register",
  loginLink = "https://builder.fitcopilot.ai/login",
  logoUrl
}) => {
  return (
    <section 
      className="hero-section w-full min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-[#0B1121]"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-3xl mx-auto relative z-20 text-center">
        {/* Content Card with Backdrop Blur */}
        <div className="bg-[#0B1121]/30 backdrop-blur-lg rounded-[32px] p-12 border border-gray-800">
          {/* Logo */}
          <HeroLogo logoUrl={logoUrl} />
          
          <h1 
            id="hero-heading"
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-[#CCFF00] to-[#64D2B9] text-transparent bg-clip-text block mb-2">
              AI-Powered Workouts
            </span>
            <span className="text-white block">
              Tailored Just for You
            </span>
          </h1>
          
          <p className="text-gray-400 mb-12 text-lg">
            Achieve your fitness goals with <span className="text-[#CCFF00]">customized plans</span> designed by AI and expert trainers.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <HeroButton 
              href="https://builder.fitcopilot.ai" 
              variant="primary"
              icon={<Zap className="mr-2 h-5 w-5" />}
            >
              Get a Free Workout
            </HeroButton>
            
            <HeroButton 
              href={registrationLink}
              variant="secondary"
              icon={<UserPlus className="mr-2 h-5 w-5" />}
            >
              Create Your Account
            </HeroButton>
          </div>
          
          {/* Sign In Link */}
          <div>
            <a 
              href={loginLink}
              className="inline-flex items-center text-gray-400 hover:text-[#CCFF00] transition-colors duration-300"
            >
              <LogIn size={16} className="mr-1" />
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 