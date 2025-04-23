import React from 'react';
import { Zap, UserPlus, LogIn } from 'lucide-react';
import './Hero.css';

interface HeroProps {
  registrationLink?: string;
  loginLink?: string;
  logoUrl?: string;
}

const Hero: React.FC<HeroProps> = ({
  registrationLink = "https://builder.fitcopilot.ai/register",
  loginLink = "https://builder.fitcopilot.ai/login",
  logoUrl
}) => {
  return (
    <section 
      className="w-full min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-[#0B1121]"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-3xl mx-auto relative z-20 text-center">
        {/* Content Card with Backdrop Blur */}
        <div className="bg-[#0B1121]/30 backdrop-blur-lg rounded-[32px] p-12 border border-gray-800">
          {/* Logo */}
          <div className="mb-12 flex flex-col items-center justify-center">
            <span className="text-gray-400 text-lg tracking-wider">ai</span>
            <span className="text-white text-2xl font-bold tracking-wide">WORKOUT</span>
            <span className="bg-[#CCFF00] text-[#0B1121] text-sm px-4 py-0.5 rounded-full font-medium tracking-wider">
              GENERATOR
            </span>
          </div>
          
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
            <a 
              href="https://builder.fitcopilot.ai" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-[#0B1121] bg-[#CCFF00] hover:bg-[#D8FF33] transition-all duration-300"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get a Free Workout
            </a>
            
            <a 
              href={registrationLink}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-white bg-transparent border-2 border-white/10 hover:bg-white/5 transition-all duration-300"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Your Account
            </a>
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