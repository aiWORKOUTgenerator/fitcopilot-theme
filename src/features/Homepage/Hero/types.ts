/**
 * Available theme variants for the Hero component
 */
export type VariantKey = 'default' | 'gym' | 'mobile';

/**
 * Props for the Hero component
 */
export interface HeroProps {
  registrationLink?: string;
  loginLink?: string;
  logoUrl?: string;
  variant?: VariantKey;
} 