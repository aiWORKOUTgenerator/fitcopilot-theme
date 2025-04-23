/**
 * Interface for WordPress data returned from the REST API
 */
export interface WordPressData {
  siteLinks?: {
    registration?: string;
    login?: string;
  };
  assets?: {
    logo?: string;
  };
  features?: any[];
  journey?: any[];
  testimonials?: any[];
  pricing?: any[];
  footerLinks?: any[];
} 