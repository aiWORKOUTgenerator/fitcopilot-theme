import React from 'react';
import Section from '../../Layout/Section';
import Button from '../../UI/Button';

interface HeroProps {
  registrationLink: string;
  loginLink: string;
  logoUrl: string;
}

const Hero: React.FC<HeroProps> = ({ registrationLink, loginLink, logoUrl }) => {
  return (
    <Section id="hero" background="dark" paddingY="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div data-aos="fade-right">
          <img src={logoUrl} alt="AI Workout Generator" className="mb-6 max-w-[200px]" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            AI-Powered Workouts <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Tailored Just for You</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Achieve your fitness goals with customized plans designed by AI and expert trainers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href={registrationLink} size="lg">Get a Free Workout</Button>
            <Button href={loginLink} variant="secondary" size="lg">Create Your Account</Button>
          </div>
        </div>
        <div data-aos="fade-left" className="hidden md:block">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-lime-300/20 to-emerald-400/20 rounded-lg filter blur-xl"></div>
            <img 
              src="/wp-content/themes/fitcopilot/assets/images/hero-workout.webp" 
              alt="AI Workout Generator Interface" 
              className="relative z-10 w-full h-auto rounded-lg shadow-optimized"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero; 