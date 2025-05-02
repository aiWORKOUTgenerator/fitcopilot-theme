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

  /**
   * Primary video source URL for the hero background video
   */
  videoSrc?: string;

  /**
   * Optional fallback video sources
   */
  videoFallbackSrc?: string | { src: string; type: string }[];

  /**
   * Video poster image to display before video plays
   */
  videoPoster?: string;

  /**
   * Whether to show video controls
   * @default true
   */
  videoControls?: boolean;

  /**
   * Whether video should autoplay
   * @default true
   */
  videoAutoPlay?: boolean;
} 