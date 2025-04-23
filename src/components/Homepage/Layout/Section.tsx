import React, { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  background?: 'dark' | 'light' | 'gradient';
  containerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  paddingY?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  children,
  background = 'dark',
  containerWidth = 'xl',
  paddingY = 'lg'
}) => {
  const bgClasses = {
    dark: 'bg-gray-900',
    light: 'bg-gray-800',
    gradient: 'bg-gradient-to-b from-gray-900 to-gray-800'
  };
  
  const containerClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'w-full'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
    xl: 'py-32'
  };
  
  return (
    <section 
      id={id}
      className={`w-full relative overflow-hidden ${bgClasses[background]} ${paddingClasses[paddingY]} ${className}`}
    >
      <div className={`mx-auto px-4 ${containerClasses[containerWidth]}`}>
        {children}
      </div>
    </section>
  );
};

export default Section; 