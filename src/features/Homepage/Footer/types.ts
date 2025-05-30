import { GlobalVariantKey } from '../types/shared';

export interface FooterLink {
  id: number;
  title: string;
  url: string;
}

export interface FooterLinkGroup {
  id: number;
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  links?: FooterLinkGroup[];
  /**
   * Theme variant to use for styling
   */
  variant?: GlobalVariantKey;
} 