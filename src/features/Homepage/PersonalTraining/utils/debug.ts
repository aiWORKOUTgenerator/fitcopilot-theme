/**
 * PersonalTraining Debug Utilities
 * 
 * Production-safe debugging utilities for PersonalTraining feature
 * All debug output is conditionally disabled in production builds
 */

import logger from '../../../../utils/logger';
import { DataSource, Trainer, WordPressPersonalTrainingData, WordPressTrainer } from '../interfaces';

/**
 * Debug utility class for PersonalTraining feature
 */
export class PersonalTrainingDebugger {
  private static readonly FEATURE_NAME = 'PersonalTraining';
  
  /**
   * Debug WordPress data loading
   */
  static debugDataLoad(wpData: WordPressPersonalTrainingData | undefined): void {
    if (process.env.NODE_ENV !== 'development') return;
    
    if (!wpData) {
      logger.debug(`${this.FEATURE_NAME}: No WordPress data available`);
      return;
    }
    
    logger.debug(`${this.FEATURE_NAME}: Data loaded successfully`, {
      trainerCount: wpData.trainers?.length || 0,
      hasSettings: !!wpData.settings,
      hasMeta: !!wpData.meta,
      lastUpdated: wpData.meta?.last_updated ? new Date(wpData.meta.last_updated * 1000).toISOString() : 'unknown'
    });
  }
  
  /**
   * Debug trainer data processing
   */
  static debugTrainerProcessing(
    wordPressTrainers: WordPressTrainer[], 
    processedTrainers: Trainer[]
  ): void {
    if (process.env.NODE_ENV !== 'development') return;
    
    const featuredCount = processedTrainers.filter(t => t.featured).length;
    
    logger.debug(`${this.FEATURE_NAME}: Trainer processing complete`, {
      inputCount: wordPressTrainers.length,
      outputCount: processedTrainers.length,
      featuredCount,
      regularCount: processedTrainers.length - featuredCount
    });
  }
  
  /**
   * Debug trainer data validation issues
   */
  static debugDataValidation(trainers: Trainer[]): void {
    if (process.env.NODE_ENV !== 'development') return;
    
    const featuredCount = trainers.filter(t => t.featured).length;
    const issues: string[] = [];
    
    // Check for common data issues
    if (featuredCount === 0) {
      issues.push('No featured trainers found');
    }
    if (featuredCount > 2) {
      issues.push(`Multiple featured trainers (${featuredCount}) may affect layout`);
    }
    
    const trainersWithoutImages = trainers.filter(t => 
      !t.image || t.image.includes('trainer-placeholder.jpg')
    ).length;
    
    if (trainersWithoutImages > 0) {
      issues.push(`${trainersWithoutImages} trainers using placeholder images`);
    }
    
    if (issues.length > 0) {
      logger.warn(`${this.FEATURE_NAME}: Data validation warnings`, {
        issues,
        trainerCount: trainers.length,
        featuredCount
      });
    } else {
      logger.debug(`${this.FEATURE_NAME}: Data validation passed`, {
        trainerCount: trainers.length,
        featuredCount
      });
    }
  }
  
  /**
   * Debug video data availability
   */
  static debugVideoData(hasVideoData: boolean, videoUrl?: string): void {
    if (process.env.NODE_ENV !== 'development') return;
    
    logger.debug(`${this.FEATURE_NAME}: Video data status`, {
      hasVideoData,
      hasCustomVideo: !!videoUrl && !videoUrl.includes('L27wfHkk2O8') // Not default fallback
    });
  }
  
  /**
   * Debug error conditions
   */
  static debugError(errorType: string, context: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'development') return;
    
    logger.error(`${this.FEATURE_NAME}: ${errorType}`, context);
  }
  
  /**
   * Debug component lifecycle
   */
  static debugLifecycle(phase: 'mounting' | 'data-loaded' | 'rendering' | 'error', data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'development') return;
    
    logger.debug(`${this.FEATURE_NAME}: ${phase}`, data || {});
  }
  
  /**
   * Get debug summary for development tools
   */
  static getDebugSummary(
    dataSource: DataSource,
    trainers: Trainer[],
    hasError: boolean
  ): Record<string, unknown> {
    if (process.env.NODE_ENV !== 'development') return {};
    
    return {
      feature: this.FEATURE_NAME,
      dataSource,
      trainerCount: trainers.length,
      featuredCount: trainers.filter(t => t.featured).length,
      hasError,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Production-safe console wrapper
 * Only outputs in development mode
 */
export const debugPersonalTraining = {
  /**
   * Log data loading process
   */
  dataLoad: (wpData?: WordPressPersonalTrainingData) => {
    PersonalTrainingDebugger.debugDataLoad(wpData);
  },
  
  /**
   * Log trainer processing
   */
  trainerProcessing: (input: WordPressTrainer[], output: Trainer[]) => {
    PersonalTrainingDebugger.debugTrainerProcessing(input, output);
  },
  
  /**
   * Log data validation
   */
  dataValidation: (trainers: Trainer[]) => {
    PersonalTrainingDebugger.debugDataValidation(trainers);
  },
  
  /**
   * Log video data status
   */
  videoData: (hasData: boolean, url?: string) => {
    PersonalTrainingDebugger.debugVideoData(hasData, url);
  },
  
  /**
   * Log errors
   */
  error: (type: string, context: Record<string, unknown>) => {
    PersonalTrainingDebugger.debugError(type, context);
  },
  
  /**
   * Log component lifecycle
   */
  lifecycle: (phase: 'mounting' | 'data-loaded' | 'rendering' | 'error', data?: Record<string, unknown>) => {
    PersonalTrainingDebugger.debugLifecycle(phase, data);
  }
};

// Export for external debugging (development only)
if (process.env.NODE_ENV === 'development') {
  (window as any).personalTrainingDebug = PersonalTrainingDebugger;
} 