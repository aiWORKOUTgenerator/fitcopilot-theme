/**
 * Multi-Feature Integration Hook
 * 
 * Manages integration between Training Calendar and other FitCopilot features
 * including Personal Training, Training Features, and Journey components
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback, useEffect, useState } from 'react';
import { CalendarEvent } from '../types';

export interface PersonalTrainingData {
  id: string;
  name: string;
  specialty: string;
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  bookingSettings: {
    sessionDuration: number;
    bufferTime: number;
    maxDailyBookings: number;
  };
}

export interface TrainingFeatureData {
  id: string;
  title: string;
  type: 'workshop' | 'seminar' | 'class';
  duration: number;
  maxParticipants: number;
  requirements: string[];
}

export interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  type: 'assessment' | 'check_in' | 'goal_review';
  schedulingRequired: boolean;
  estimatedDuration: number;
}

export interface IntegrationData {
  personalTraining: {
    trainers: PersonalTrainingData[];
    settings: any;
    lastSync: string;
  };
  trainingFeatures: {
    features: TrainingFeatureData[];
    settings: any;
    lastSync: string;
  };
  journey: {
    milestones: JourneyMilestone[];
    settings: any;
    lastSync: string;
  };
}

export interface IntegrationCallbacks {
  onTrainerDataUpdate?: (trainers: PersonalTrainingData[]) => void;
  onFeatureDataUpdate?: (features: TrainingFeatureData[]) => void;
  onJourneyDataUpdate?: (milestones: JourneyMilestone[]) => void;
  onEventCreatedFromIntegration?: (event: CalendarEvent, source: 'personal_training' | 'training_features' | 'journey') => void;
  onSyncError?: (feature: string, error: Error) => void;
}

export const useMultiFeatureIntegration = (callbacks: IntegrationCallbacks) => {
  const [integrationData, setIntegrationData] = useState<IntegrationData>({
    personalTraining: { trainers: [], settings: {}, lastSync: '' },
    trainingFeatures: { features: [], settings: {}, lastSync: '' },
    journey: { milestones: [], settings: {}, lastSync: '' }
  });

  const [syncStatus, setSyncStatus] = useState<{
    personalTraining: 'idle' | 'syncing' | 'success' | 'error';
    trainingFeatures: 'idle' | 'syncing' | 'success' | 'error';
    journey: 'idle' | 'syncing' | 'success' | 'error';
  }>({
    personalTraining: 'idle',
    trainingFeatures: 'idle',
    journey: 'idle'
  });

  // Sync Personal Training data
  const syncPersonalTraining = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, personalTraining: 'syncing' }));

    try {
      // Get Personal Training data from WordPress
      const personalTrainingData = (window as any).fitcopilotPersonalTrainingData;
      
      if (personalTrainingData && personalTrainingData.trainerData) {
        const trainers: PersonalTrainingData[] = personalTrainingData.trainerData.map((trainer: any) => ({
          id: trainer.id,
          name: trainer.name,
          specialty: trainer.specialty,
          availability: trainer.availability || [],
          bookingSettings: {
            sessionDuration: trainer.sessionDuration || 60,
            bufferTime: trainer.bufferTime || 15,
            maxDailyBookings: trainer.maxDailyBookings || 8
          }
        }));

        setIntegrationData(prev => ({
          ...prev,
          personalTraining: {
            trainers,
            settings: personalTrainingData.settings || {},
            lastSync: new Date().toISOString()
          }
        }));

        callbacks.onTrainerDataUpdate?.(trainers);
        setSyncStatus(prev => ({ ...prev, personalTraining: 'success' }));
      } else {
        throw new Error('Personal Training data not available');
      }

    } catch (error) {
      setSyncStatus(prev => ({ ...prev, personalTraining: 'error' }));
      callbacks.onSyncError?.('personal_training', error instanceof Error ? error : new Error('Sync failed'));
    }
  }, [callbacks]);

  // Sync Training Features data
  const syncTrainingFeatures = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, trainingFeatures: 'syncing' }));

    try {
      // Get Training Features data from WordPress
      const trainingFeaturesData = (window as any).fitcopilotTrainingFeaturesData;
      
      if (trainingFeaturesData && trainingFeaturesData.features) {
        const features: TrainingFeatureData[] = trainingFeaturesData.features
          .filter((feature: any) => feature.schedulable)
          .map((feature: any) => ({
            id: feature.id,
            title: feature.title,
            type: feature.type || 'workshop',
            duration: feature.duration || 120,
            maxParticipants: feature.maxParticipants || 20,
            requirements: feature.requirements || []
          }));

        setIntegrationData(prev => ({
          ...prev,
          trainingFeatures: {
            features,
            settings: trainingFeaturesData.settings || {},
            lastSync: new Date().toISOString()
          }
        }));

        callbacks.onFeatureDataUpdate?.(features);
        setSyncStatus(prev => ({ ...prev, trainingFeatures: 'success' }));
      } else {
        throw new Error('Training Features data not available');
      }

    } catch (error) {
      setSyncStatus(prev => ({ ...prev, trainingFeatures: 'error' }));
      callbacks.onSyncError?.('training_features', error instanceof Error ? error : new Error('Sync failed'));
    }
  }, [callbacks]);

  // Sync Journey data
  const syncJourney = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, journey: 'syncing' }));

    try {
      // Get Journey data from WordPress
      const journeyData = (window as any).fitcopilotJourneyData;
      
      if (journeyData && journeyData.milestones) {
        const milestones: JourneyMilestone[] = journeyData.milestones
          .filter((milestone: any) => milestone.schedulingRequired)
          .map((milestone: any) => ({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description,
            type: milestone.type || 'check_in',
            schedulingRequired: milestone.schedulingRequired,
            estimatedDuration: milestone.estimatedDuration || 30
          }));

        setIntegrationData(prev => ({
          ...prev,
          journey: {
            milestones,
            settings: journeyData.settings || {},
            lastSync: new Date().toISOString()
          }
        }));

        callbacks.onJourneyDataUpdate?.(milestones);
        setSyncStatus(prev => ({ ...prev, journey: 'success' }));
      } else {
        throw new Error('Journey data not available');
      }

    } catch (error) {
      setSyncStatus(prev => ({ ...prev, journey: 'error' }));
      callbacks.onSyncError?.('journey', error instanceof Error ? error : new Error('Sync failed'));
    }
  }, [callbacks]);

  // Sync all features
  const syncAll = useCallback(async () => {
    await Promise.all([
      syncPersonalTraining(),
      syncTrainingFeatures(),
      syncJourney()
    ]);
  }, [syncPersonalTraining, syncTrainingFeatures, syncJourney]);

  // Create event from Personal Training session
  const createEventFromPersonalTraining = useCallback((
    trainerId: string,
    sessionData: {
      title: string;
      start: string;
      end: string;
      clientInfo?: any;
    }
  ): CalendarEvent => {
    const trainer = integrationData.personalTraining.trainers.find(t => t.id === trainerId);
    
    const event: CalendarEvent = {
      id: `pt_${Date.now()}`,
      title: sessionData.title || 'Personal Training Session',
      start: sessionData.start,
      end: sessionData.end,
      trainer: trainer ? {
        id: trainer.id,
        name: trainer.name,
        specialty: trainer.specialty
      } : undefined,
      eventType: 'personal_training',
      status: 'pending',
      source: 'personal_training',
      integration: {
        sourceFeature: 'personal_training',
        sourceId: trainerId,
        syncRequired: true
      }
    };

    callbacks.onEventCreatedFromIntegration?.(event, 'personal_training');
    return event;
  }, [integrationData.personalTraining.trainers, callbacks]);

  // Create event from Training Feature
  const createEventFromTrainingFeature = useCallback((
    featureId: string,
    sessionData: {
      title?: string;
      start: string;
      end: string;
      participants?: number;
    }
  ): CalendarEvent => {
    const feature = integrationData.trainingFeatures.features.find(f => f.id === featureId);
    
    const event: CalendarEvent = {
      id: `tf_${Date.now()}`,
      title: sessionData.title || feature?.title || 'Training Workshop',
      start: sessionData.start,
      end: sessionData.end,
      eventType: feature?.type || 'workshop',
      status: 'available',
      maxParticipants: feature?.maxParticipants || 20,
      currentParticipants: 0,
      source: 'training_features',
      integration: {
        sourceFeature: 'training_features',
        sourceId: featureId,
        syncRequired: true
      }
    };

    callbacks.onEventCreatedFromIntegration?.(event, 'training_features');
    return event;
  }, [integrationData.trainingFeatures.features, callbacks]);

  // Create event from Journey milestone
  const createEventFromJourney = useCallback((
    milestoneId: string,
    sessionData: {
      title?: string;
      start: string;
      end: string;
      clientId?: string;
    }
  ): CalendarEvent => {
    const milestone = integrationData.journey.milestones.find(m => m.id === milestoneId);
    
    const event: CalendarEvent = {
      id: `j_${Date.now()}`,
      title: sessionData.title || milestone?.title || 'Journey Milestone',
      start: sessionData.start,
      end: sessionData.end,
      eventType: milestone?.type || 'check_in',
      status: 'pending',
      maxParticipants: 1,
      currentParticipants: sessionData.clientId ? 1 : 0,
      source: 'journey',
      integration: {
        sourceFeature: 'journey',
        sourceId: milestoneId,
        syncRequired: true
      }
    };

    callbacks.onEventCreatedFromIntegration?.(event, 'journey');
    return event;
  }, [integrationData.journey.milestones, callbacks]);

  // Get available trainers for time slot
  const getAvailableTrainers = useCallback((startTime: string, endTime: string): PersonalTrainingData[] => {
    const startDate = new Date(startTime);
    const dayOfWeek = startDate.getDay();
    const timeSlot = startDate.toTimeString().slice(0, 5);

    return integrationData.personalTraining.trainers.filter(trainer => {
      return trainer.availability.some(slot => 
        slot.dayOfWeek === dayOfWeek &&
        slot.startTime <= timeSlot &&
        slot.endTime >= timeSlot
      );
    });
  }, [integrationData.personalTraining.trainers]);

  // Get schedulable features
  const getSchedulableFeatures = useCallback((filters?: {
    type?: string;
    maxDuration?: number;
    maxParticipants?: number;
  }): TrainingFeatureData[] => {
    let features = integrationData.trainingFeatures.features;

    if (filters) {
      if (filters.type) {
        features = features.filter(f => f.type === filters.type);
      }
      if (filters.maxDuration) {
        features = features.filter(f => f.duration <= filters.maxDuration);
      }
      if (filters.maxParticipants) {
        features = features.filter(f => f.maxParticipants <= filters.maxParticipants);
      }
    }

    return features;
  }, [integrationData.trainingFeatures.features]);

  // Get pending journey milestones
  const getPendingMilestones = useCallback((clientId?: string): JourneyMilestone[] => {
    // In a real implementation, this would filter by client ID
    return integrationData.journey.milestones.filter(milestone => 
      milestone.schedulingRequired
    );
  }, [integrationData.journey.milestones]);

  // Initialize data sync on mount
  useEffect(() => {
    syncAll();
  }, [syncAll]);

  // Auto-sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      syncAll();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [syncAll]);

  return {
    // Data
    integrationData,
    syncStatus,

    // Sync actions
    syncPersonalTraining,
    syncTrainingFeatures,
    syncJourney,
    syncAll,

    // Event creation
    createEventFromPersonalTraining,
    createEventFromTrainingFeature,
    createEventFromJourney,

    // Utilities
    getAvailableTrainers,
    getSchedulableFeatures,
    getPendingMilestones,

    // Status checks
    isPersonalTrainingAvailable: integrationData.personalTraining.trainers.length > 0,
    isTrainingFeaturesAvailable: integrationData.trainingFeatures.features.length > 0,
    isJourneyAvailable: integrationData.journey.milestones.length > 0,
    isSyncing: Object.values(syncStatus).some(status => status === 'syncing'),
    hasErrors: Object.values(syncStatus).some(status => status === 'error')
  };
}; 