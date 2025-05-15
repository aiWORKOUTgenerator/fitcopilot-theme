import React from 'react';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  background?: 'dark' | 'light';
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  background = 'dark',
  paddingY = 'lg',
  className = '',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16',
  };

  const backgroundClasses = {
    dark: 'bg-gray-900',
    light: 'bg-gray-100',
  };

  return (
      <section
          id={id}
          className={`
        ${backgroundClasses[background]}
        ${paddingClasses[paddingY]}
        ${className}
      `}
    >
          <div className="container mx-auto px-4">
              {children}
          </div>
      </section>
  );
};

export default Section; 