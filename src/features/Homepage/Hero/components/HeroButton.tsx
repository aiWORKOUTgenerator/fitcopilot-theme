import React, { ReactNode } from 'react';

interface HeroButtonProps {
  href: string;
  children: ReactNode;
  variant: 'primary' | 'secondary';
  icon?: ReactNode;
}

/**
 * Button component for the Hero section
 */
export const HeroButton: React.FC<HeroButtonProps> = ({ 
  href, 
  children, 
  variant = 'primary',
  icon
}) => {
  const baseClasses = "inline-flex items-center justify-center px-8 py-4 rounded-full font-medium transition-all duration-300";
  
  const variantClasses = {
    primary: "text-[#0B1121] bg-[#CCFF00] hover:bg-[#D8FF33]",
    secondary: "text-white bg-transparent border-2 border-white/10 hover:bg-white/5"
  };
  
  return (
    <a 
      href={href} 
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {icon}
      {children}
    </a>
  );
}; 