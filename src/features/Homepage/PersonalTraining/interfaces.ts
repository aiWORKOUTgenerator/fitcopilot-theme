import { ReactNode } from 'react';

/**
 * WordPress Personal Training Settings Interface
 * Mirrors the PHP settings structure from the backend
 */
export interface PersonalTrainingSettings {
  section_title: string;
  section_subtitle: string;
  show_featured_trainer: boolean;
  show_group_instructor: boolean;
  max_display_count: number;
  cta_enabled: boolean;
  cta_title: string;
  cta_subtitle: string;
  cta_button_text: string;
  cta_button_url: string;
  cta_background_color: string;
  cta_text_color: string;
  cta_icon_type: 'lucide' | 'logo' | 'none';
  cta_lucide_icon: string;
  cta_logo_url: string;
}

/**
 * WordPress Trainer Data Interface
 * Mirrors the PHP trainer data structure from the backend
 */
export interface WordPressTrainer {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  image_url: string;
  years_experience: number;
  clients_count: number;
  featured: boolean;
  active: boolean;
  coach_type: 'strength' | 'nutrition' | 'performance' | 'recovery';
  video_title?: string;
  video_url?: string;
  video_poster?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Meta information about trainer data
 */
export interface TrainerDataMeta {
  total_count: number;
  active_count: number;
  last_updated: number;
}

/**
 * Complete WordPress Personal Training Data Structure
 * This is what's provided by wp_localize_script
 */
export interface WordPressPersonalTrainingData {
  trainers: WordPressTrainer[];
  settings: PersonalTrainingSettings;
  meta: TrainerDataMeta;
}

/**
 * Frontend Trainer Interface (transformed from WordPress data)
 */
export interface Trainer {
  id: string;
  name: string;
  image: string;
  specialty: string;
  specialtyIcon: ReactNode;
  bio: string;
  years: number;
  clients: number;
  featured: boolean;
  videoCard?: {
    title: string;
    image: string;
    videoUrl: string;
  };
}

/**
 * Data loading states for the component
 */
export type DataSource = 'wordpress' | 'none';

/**
 * Loading states for the component
 */
export type LoadingState = 'loading' | 'success' | 'error';

/**
 * Extended Window interface to include WordPress data
 */
export interface WindowExtensions {
  fitcopilotPersonalTrainingData?: WordPressPersonalTrainingData;
  fitcopilotVideoData?: WordPressVideoData;
  athleteDashboardData?: AthleteDashboardData;
}

/**
 * Global WordPress video data structure
 */
export interface WordPressVideoData {
  personalTraining?: {
    featuredTrainer?: {
      url: string;
      title: string;
      image: string;
    };
  };
}

/**
 * WordPress dashboard video data structure
 */
export interface WordPressVideoDataStructure {
  personalTraining?: {
    featuredTrainer?: {
      url: string;
      title: string;
      image: string;
    };
  };
}

/**
 * WordPress dashboard data structure
 */
export interface AthleteDashboardData {
  wpData: {
    videoData?: WordPressVideoDataStructure;
    [key: string]: unknown; // Allow additional properties
  };
}

/**
 * Runtime validation type guards
 */
export const isWordPressPersonalTrainingData = (
  data: unknown
): data is WordPressPersonalTrainingData => {
  if (!data || typeof data !== 'object') return false;
  
  const wpData = data as Partial<WordPressPersonalTrainingData>;
  
  return !!(
    wpData.trainers && 
    Array.isArray(wpData.trainers) &&
    wpData.settings &&
    typeof wpData.settings === 'object' &&
    wpData.meta &&
    typeof wpData.meta === 'object'
  );
};

/**
 * Validates individual WordPress trainer data
 */
export const isValidWordPressTrainer = (
  trainer: unknown
): trainer is WordPressTrainer => {
  if (!trainer || typeof trainer !== 'object') return false;
  
  const t = trainer as Partial<WordPressTrainer>;
  
  return !!(
    typeof t.id === 'number' &&
    typeof t.name === 'string' &&
    typeof t.specialty === 'string' &&
    typeof t.bio === 'string' &&
    typeof t.years_experience === 'number' &&
    typeof t.clients_count === 'number' &&
    typeof t.featured === 'boolean' &&
    typeof t.active === 'boolean' &&
    ['strength', 'nutrition', 'performance', 'recovery'].includes(t.coach_type || '')
  );
};

// Extend global Window interface
declare global {
  interface Window extends WindowExtensions {}
} 