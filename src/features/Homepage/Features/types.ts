/**
 * Available theme variants for the Features component
 */
export type VariantKey = 'default' | 'gym' | 'boutique' | 'classic' | 'minimalist' | 'modern' | 'registration' | 'sports' | 'wellness';

/**
 * Background color options for Section component
 */
export type BackgroundColorType = 'primary' | 'secondary' | 'tertiary' | 'surface' | 'none';

/**
 * Feature item type definition
 */
export interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  gradient?: string;
  demoComponent?: React.ReactNode;
}

/**
 * Features component props interface
 */
export interface FeaturesProps {
  features?: Feature[];
  variant?: VariantKey;
  backgroundColor?: BackgroundColorType;
} 