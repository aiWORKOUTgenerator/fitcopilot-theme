/**
 * Available theme variants for the Hero component
 */
export type VariantKey = 'default' | 'gym' | 'mobile' | 'sports' | 'wellness';

/**
 * Props for the Hero component
 */
export interface HeroProps {
  /**
   * URL for the registration page
   */
  registrationLink?: string;

  /**
   * URL for the login page
   */
  loginLink?: string;

  /**
   * Visual theme variant of the hero section
   */
  variant?: VariantKey;

  /**
   * URL for the logo image
   * @default '/wp-content/themes/fitcopilot/assets/media/images/logo.png'
   */
  logoUrl?: string;
} 