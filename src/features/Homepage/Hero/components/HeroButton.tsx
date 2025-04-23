import React, { ReactNode } from 'react';
import Button from '../../../../components/UI/Button';

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
  // Map local variants to shared Button variants
  const buttonVariant = variant === 'primary' ? 'hero-primary' : 'hero-secondary';

  return (
    <Button
      href={href}
      variant={buttonVariant}
      size="lg"
      rounded="full"
      icon={icon}
    >
      {children}
    </Button>
  );
}; 