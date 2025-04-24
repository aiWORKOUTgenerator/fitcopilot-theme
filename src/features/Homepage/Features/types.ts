/**
 * Available theme variants for the Features component
 */
export type VariantKey = 'default' | 'gym';

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: string;
  gradient?: string;
  demoComponent?: React.ReactNode;
}

export interface FeaturesProps {
  features?: Feature[];
  variant?: VariantKey;
} 