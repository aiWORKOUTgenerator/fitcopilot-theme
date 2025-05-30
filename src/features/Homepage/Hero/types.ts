import { SectionProps } from '../../../components/shared/Section';
import { GlobalVariantKey } from '../types/shared';

/**
 * Available theme variants for the Hero component
 * @deprecated Use GlobalVariantKey from '../types/shared' instead
 */
export type HeroVariantKey = GlobalVariantKey;

/**
 * Interface for floating icon props
 */
export interface FloatingIconProps {
  Icon: React.ElementType;
  size?: number;
  delay?: number;
  speed?: number;
  left?: number;
  top?: number;
}

/**
 * Interface for floating icon data
 */
export interface FloatingIconData {
  Icon: React.ElementType;
  size: number;
  left: number;
  top: number;
  delay: number;
  speed: number;
}

/**
 * Props for the Hero component
 */
export interface HeroProps extends Omit<SectionProps, 'variant'> {
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
  variant?: HeroVariantKey;

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

  /**
   * Callback function to trigger when registration starts
   */
  onRegistrationStart?: () => void;
} 