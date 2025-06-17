/**
 * Trainer API Service
 * 
 * Frontend service for handling trainer availability API calls
 * Integrates with WordPress REST API endpoints
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { AvailableTimeSlot, SchedulingPreference, SchedulingResult } from '../components/EventModal/Events/EventType/EventTypeInterfaces';

/**
 * API Configuration
 */
const API_CONFIG = {
  baseUrl: window.location.origin + '/wp-json/fitcopilot/v1',
  timeout: 10000, // 10 seconds
  retries: 3
};

/**
 * API Response Types
 */
interface TrainerAvailabilityResponse {
  success: boolean;
  available_slots: Array<{
    start_time: string;
    end_time: string;
    trainer_id?: string;
    trainer_name?: string;
    status: 'available' | 'limited' | 'waitlist';
    spots_remaining?: number;
    price?: number;
  }>;
  recommended_slot?: {
    start_time: string;
    end_time: string;
    trainer_id?: string;
    trainer_name?: string;
    status: 'available' | 'limited' | 'waitlist';
    spots_remaining?: number;
    price?: number;
  };
  metadata: {
    date: string;
    event_type: string;
    duration: number;
    total_slots_checked: number;
    performance_ms: number;
    search_criteria: {
      event_type: string;
      duration: number;
      date_range: {
        start: string;
        end: string;
      };
    };
  };
}

/**
 * API Error Response
 */
interface ApiErrorResponse {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

/**
 * Trainer API Service Class
 */
export class TrainerApiService {
  private abortController: AbortController | null = null;
  
  /**
   * Get trainer availability for specific date
   */
  async getTrainerAvailability(
    date: Date,
    eventType: string,
    duration?: number,
    trainerId?: string
  ): Promise<SchedulingResult> {
    const startTime = performance.now();
    
    try {
      // Cancel any existing request
      this.cancelPendingRequests();
      
      // Create new abort controller
      this.abortController = new AbortController();
      
      // Format date for API
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Build query parameters
      const params = new URLSearchParams({
        date: dateString,
        event_type: eventType
      });
      
      if (duration) {
        params.append('duration', duration.toString());
      }
      
      if (trainerId) {
        params.append('trainer_id', trainerId);
      }
      
      const nonce = this.getNonce();
      const requestUrl = `${API_CONFIG.baseUrl}/trainer-availability?${params}`;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Making API request:', {
          url: requestUrl,
          nonce: nonce ? `${nonce.substring(0, 10)}...` : 'NOT SET',
          eventType,
          duration,
          date: dateString
        });
      }
      
      // Primary request with nonce header
      let response = await this.makeRequest(requestUrl, nonce, 'header');
      
      // If primary request fails with 403, try fallback methods
      if (!response.ok && response.status === 403) {
        console.warn('🔄 Primary request failed with 403, trying fallback methods...');
        
        // Fallback 1: Try nonce as URL parameter
        const fallbackUrl = `${requestUrl}&_wpnonce=${encodeURIComponent(nonce)}`;
        response = await this.makeRequest(fallbackUrl, nonce, 'parameter');
        
        // Fallback 2: Try without nonce (public access)
        if (!response.ok && response.status === 403) {
          console.warn('🔄 Fallback 1 failed, trying public access...');
          response = await this.makeRequest(requestUrl, '', 'none');
        }
        
        // Fallback 3: Try with credentials
        if (!response.ok && response.status === 403) {
          console.warn('🔄 Fallback 2 failed, trying with credentials...');
          response = await this.makeRequest(requestUrl, nonce, 'credentials');
        }
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData: ApiErrorResponse = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          console.warn('Could not parse error response:', parseError);
        }
        
        // Provide specific guidance for 403 errors
        if (response.status === 403) {
          errorMessage = `Authentication failed (403): ${errorMessage}. Please check WordPress REST API permissions.`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data: TrainerAvailabilityResponse = await response.json();
      
      if (!data.success) {
        throw new Error('API returned unsuccessful response');
      }
      
      // Transform API response to frontend format
      const result = this.transformApiResponse(data, startTime);
      
      // Log performance metrics
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Trainer Availability Performance:', {
          apiCallMs: data.metadata.performance_ms,
          totalMs: result.metadata.performanceMs,
          slotsFound: result.availableSlots.length,
          hasRecommendation: !!result.recommendedSlot
        });
      }
      
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Trainer availability request was cancelled');
        throw new Error('Request was cancelled');
      }
      
      console.error('Trainer Availability API Error:', error);
      
      return {
        success: false,
        availableSlots: [],
        error: error instanceof Error ? error.message : 'Unknown API error',
        metadata: {
          totalSlotsChecked: 0,
          searchCriteria: {
            eventType,
            duration: duration || 0,
            dateRange: {
              start: date,
              end: date
            }
          },
          performanceMs: endTime - startTime
        }
      };
    }
  }
  
  /**
   * Get trainer availability with retry mechanism
   */
  async getTrainerAvailabilityWithRetry(
    date: Date,
    eventType: string,
    duration?: number,
    trainerId?: string,
    retryCount = 0
  ): Promise<SchedulingResult> {
    try {
      return await this.getTrainerAvailability(date, eventType, duration, trainerId);
    } catch (error) {
      if (retryCount < API_CONFIG.retries) {
        console.log(`Retrying trainer availability request (${retryCount + 1}/${API_CONFIG.retries})`);
        
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.getTrainerAvailabilityWithRetry(date, eventType, duration, trainerId, retryCount + 1);
      }
      
      throw error;
    }
  }
  
  /**
   * Find available slots with preferences
   */
  async findAvailableSlotsWithPreferences(
    date: Date,
    eventType: string,
    duration: number,
    preferences: SchedulingPreference
  ): Promise<SchedulingResult> {
    try {
      // Get base availability
      const result = await this.getTrainerAvailabilityWithRetry(date, eventType, duration);
      
      if (!result.success) {
        return result;
      }
      
      // Apply client-side preference filtering
      const filteredSlots = this.filterSlotsByPreferences(result.availableSlots, preferences);
      const sortedSlots = this.sortSlotsByPreferences(filteredSlots, preferences);
      const recommendedSlot = this.findBestSlotForPreferences(sortedSlots, preferences);
      
      return {
        ...result,
        availableSlots: sortedSlots,
        recommendedSlot: recommendedSlot || result.recommendedSlot
      };
      
    } catch (error) {
      console.error('Error finding slots with preferences:', error);
      throw error;
    }
  }
  
  /**
   * Transform API response to frontend format
   */
  private transformApiResponse(data: TrainerAvailabilityResponse, startTime: number): SchedulingResult {
    const endTime = performance.now();
    
    // Transform slots
    const availableSlots: AvailableTimeSlot[] = data.available_slots.map(slot => ({
      startTime: new Date(slot.start_time),
      endTime: new Date(slot.end_time),
      trainerId: slot.trainer_id,
      trainerName: slot.trainer_name,
      status: slot.status,
      spotsRemaining: slot.spots_remaining,
      price: slot.price
    }));
    
    // Transform recommended slot
    let recommendedSlot: AvailableTimeSlot | undefined;
    if (data.recommended_slot) {
      recommendedSlot = {
        startTime: new Date(data.recommended_slot.start_time),
        endTime: new Date(data.recommended_slot.end_time),
        trainerId: data.recommended_slot.trainer_id,
        trainerName: data.recommended_slot.trainer_name,
        status: data.recommended_slot.status,
        spotsRemaining: data.recommended_slot.spots_remaining,
        price: data.recommended_slot.price
      };
    }
    
    return {
      success: true,
      availableSlots,
      recommendedSlot,
      metadata: {
        totalSlotsChecked: data.metadata.total_slots_checked,
        searchCriteria: {
          eventType: data.metadata.event_type,
          duration: data.metadata.duration,
          dateRange: {
            start: new Date(data.metadata.search_criteria.date_range.start),
            end: new Date(data.metadata.search_criteria.date_range.end)
          }
        },
        performanceMs: endTime - startTime
      }
    };
  }
  
  /**
   * Filter slots by client preferences
   */
  private filterSlotsByPreferences(
    slots: AvailableTimeSlot[], 
    preferences: SchedulingPreference
  ): AvailableTimeSlot[] {
    return slots.filter(slot => {
      const hour = slot.startTime.getHours();
      const dayOfWeek = slot.startTime.getDay();
      
      // Filter by preferred days
      if (preferences.preferredDays.length > 0 && !preferences.preferredDays.includes(dayOfWeek)) {
        return false;
      }
      
      // Filter by preferred time of day
      switch (preferences.preferredTimeOfDay) {
        case 'morning':
          return hour >= 6 && hour < 12;
        case 'afternoon':
          return hour >= 12 && hour < 17;
        case 'evening':
          return hour >= 17 && hour < 21;
        case 'any':
        default:
          return true;
      }
    });
  }
  
  /**
   * Sort slots by preferences
   */
  private sortSlotsByPreferences(
    slots: AvailableTimeSlot[],
    preferences: SchedulingPreference
  ): AvailableTimeSlot[] {
    return [...slots].sort((a, b) => {
      // If client wants earliest slot, sort by time
      if (preferences.wantsEarliestSlot) {
        return a.startTime.getTime() - b.startTime.getTime();
      }
      
      // Calculate preference scores
      const scoreA = this.calculatePreferenceScore(a, preferences);
      const scoreB = this.calculatePreferenceScore(b, preferences);
      
      return scoreB - scoreA; // Higher score first
    });
  }
  
  /**
   * Calculate preference score for a slot
   */
  private calculatePreferenceScore(slot: AvailableTimeSlot, preferences: SchedulingPreference): number {
    let score = 0;
    
    const hour = slot.startTime.getHours();
    const dayOfWeek = slot.startTime.getDay();
    
    // Day of week preference
    if (preferences.preferredDays.includes(dayOfWeek)) {
      score += 10;
    }
    
    // Time of day preference
    switch (preferences.preferredTimeOfDay) {
      case 'morning':
        if (hour >= 9 && hour < 12) score += 15;
        else if (hour >= 6 && hour < 9) score += 10;
        break;
      case 'afternoon':
        if (hour >= 13 && hour < 16) score += 15;
        else if (hour >= 12 && hour < 17) score += 10;
        break;
      case 'evening':
        if (hour >= 17 && hour < 19) score += 15;
        else if (hour >= 19 && hour < 21) score += 10;
        break;
    }
    
    // Status preference (available > limited > waitlist)
    switch (slot.status) {
      case 'available':
        score += 20;
        break;
      case 'limited':
        score += 10;
        break;
      case 'waitlist':
        score += 5;
        break;
    }
    
    // Price preference (lower is better, but not the primary factor)
    if (slot.price !== undefined) {
      score += Math.max(0, 10 - (slot.price / 10));
    }
    
    return score;
  }
  
  /**
   * Find best slot for preferences
   */
  private findBestSlotForPreferences(
    slots: AvailableTimeSlot[],
    preferences: SchedulingPreference
  ): AvailableTimeSlot | undefined {
    if (slots.length === 0) return undefined;
    
    // If specific date preference, try to find slot on that date
    if (preferences.preferredDate) {
      const preferredDateSlots = slots.filter(slot => 
        slot.startTime.toDateString() === preferences.preferredDate!.toDateString()
      );
      
      if (preferredDateSlots.length > 0) {
        return preferredDateSlots[0];
      }
    }
    
    // Return highest scoring available slot
    return slots.find(slot => slot.status === 'available') || slots[0];
  }
  
  /**
   * Cancel pending requests
   */
  cancelPendingRequests(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  
  /**
   * Get WordPress nonce for API requests
   */
  private getNonce(): string {
    // Try to get REST API nonce from different global sources
    const restNonce = 
      (window as any).fitcopilotTrainingCalendarData?.api?.restNonce ||
      (window as any).wpApiSettings?.nonce ||
      (window as any).fitcopilotTrainingCalendarAjax?.nonce ||
      (window as any).fitcopilotTrainingCalendarData?.nonce ||
      '';
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Nonce Debug:', {
        restNonce: (window as any).fitcopilotTrainingCalendarData?.api?.restNonce,
        wpApiSettings: (window as any).wpApiSettings?.nonce,
        ajaxNonce: (window as any).fitcopilotTrainingCalendarAjax?.nonce,
        legacyNonce: (window as any).fitcopilotTrainingCalendarData?.nonce,
        selectedNonce: restNonce,
        globalObjects: {
          fitcopilotTrainingCalendarData: !!(window as any).fitcopilotTrainingCalendarData,
          fitcopilotTrainingCalendarAjax: !!(window as any).fitcopilotTrainingCalendarAjax,
          wpApiSettings: !!(window as any).wpApiSettings
        }
      });
    }
    
    if (!restNonce && process.env.NODE_ENV === 'development') {
      console.warn('⚠️ No REST API nonce found for API requests. Available global objects:', {
        fitcopilotTrainingCalendarData: (window as any).fitcopilotTrainingCalendarData,
        fitcopilotTrainingCalendarAjax: (window as any).fitcopilotTrainingCalendarAjax,
        wpApiSettings: (window as any).wpApiSettings
      });
    }
    
    return restNonce;
  }
  
  /**
   * Get API health status
   */
  async getApiHealthStatus(): Promise<{ healthy: boolean; responseTime: number; error?: string }> {
    const startTime = performance.now();
    
    try {
      const testDate = new Date();
      testDate.setDate(testDate.getDate() + 1); // Tomorrow
      
      const response = await fetch(
        `${API_CONFIG.baseUrl}/trainer-availability?date=${testDate.toISOString().split('T')[0]}&event_type=Personal Training Session&duration=30`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': this.getNonce()
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout for health check
        }
      );
      
      const endTime = performance.now();
      
      return {
        healthy: response.ok,
        responseTime: endTime - startTime,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
      
    } catch (error) {
      const endTime = performance.now();
      
      return {
        healthy: false,
        responseTime: endTime - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Make request with different authentication strategies
   */
  private async makeRequest(url: string, nonce: string, strategy: 'header' | 'parameter' | 'none' | 'credentials'): Promise<Response> {
    const options: RequestInit = {
      method: 'GET',
      signal: this.abortController?.signal
    };
    
    switch (strategy) {
      case 'header':
        options.headers = {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce
        };
        break;
        
      case 'parameter':
        // Nonce already in URL for this strategy
        options.headers = {
          'Content-Type': 'application/json'
        };
        break;
        
      case 'credentials':
        options.headers = {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce
        };
        options.credentials = 'include';
        break;
        
      case 'none':
      default:
        options.headers = {
          'Content-Type': 'application/json'
        };
        break;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔗 Request strategy: ${strategy}`, {
        url: url.length > 100 ? `${url.substring(0, 100)}...` : url,
        headers: options.headers,
        credentials: options.credentials
      });
    }
    
    return fetch(url, options);
  }
}

// Export singleton instance
export const trainerApiService = new TrainerApiService();

// Export types for use in other files
export type { ApiErrorResponse, TrainerAvailabilityResponse };
