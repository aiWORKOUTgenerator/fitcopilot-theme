import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'hero-primary' | 'hero-secondary';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  rounded?: 'default' | 'full';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  type = 'button',
  icon,
  rounded = 'default',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-in-out';

  const variantClasses = {
    'primary': 'bg-gradient-to-r from-lime-300 to-emerald-400 text-gray-900 hover:shadow-optimized-hover',
    'secondary': 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700',
    'hero-primary': 'text-[#0B1121] bg-[#CCFF00] hover:bg-[#D8FF33]',
    'hero-secondary': 'text-white bg-transparent border-2 border-white/10 hover:bg-white/5'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const roundedClasses = {
    default: 'rounded-lg',
    full: 'rounded-full',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${className}
  `;

  if (href) {
    return (
      <a href={href} className={classes}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button; 