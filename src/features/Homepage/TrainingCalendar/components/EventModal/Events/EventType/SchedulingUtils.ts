/**
 * Scheduling Utilities
 * 
 * Utility functions for smart scheduling calculations and time slot generation
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import {
    AvailableTimeSlot,
    SchedulingPreference,
    SmartSchedulingConfig
} from './EventTypeInterfaces';

/**
 * Generate time slots for a given date range
 */
export const generateTimeSlots = (
  startDate: Date,
  endDate: Date,
  config: SmartSchedulingConfig,
  duration: number
): AvailableTimeSlot[] => {
  const slots: AvailableTimeSlot[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Check if current day is allowed
    const dayOfWeek = currentDate.getDay();
    if (config.timeSlots.availableDays.includes(dayOfWeek)) {
      
      // Generate slots for this day
      const daySlots = generateDaySlotsForDate(currentDate, config, duration);
      slots.push(...daySlots);
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return slots;
};

/**
 * Generate time slots for a specific date
 */
export const generateDaySlotsForDate = (
  date: Date,
  config: SmartSchedulingConfig,
  duration: number
): AvailableTimeSlot[] => {
  const slots: AvailableTimeSlot[] = [];
  const { availableHours, bufferTime } = config.timeSlots;
  
  // Start from business start hour
  let currentHour = availableHours.start;
  let currentMinute = 0;
  
  while (currentHour < availableHours.end) {
    const slotStart = new Date(date);
    slotStart.setHours(currentHour, currentMinute, 0, 0);
    
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + duration);
    
    // Check if slot end time is within business hours
    if (slotEnd.getHours() <= availableHours.end) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        status: 'available' // Default status, will be updated based on actual availability
      });
    }
    
    // Move to next slot (duration + buffer time)
    currentMinute += duration + bufferTime;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }
  
  return slots;
};

/**
 * Filter slots based on scheduling preferences
 */
export const filterSlotsByPreferences = (
  slots: AvailableTimeSlot[],
  preferences: SchedulingPreference
): AvailableTimeSlot[] => {
  return slots.filter(slot => {
    // Filter by preferred days
    const dayOfWeek = slot.startTime.getDay();
    if (!preferences.preferredDays.includes(dayOfWeek)) {
      return false;
    }
    
    // Filter by preferred time of day
    if (preferences.preferredTimeOfDay !== 'any') {
      const hour = slot.startTime.getHours();
      
      switch (preferences.preferredTimeOfDay) {
        case 'morning':
          if (hour < 6 || hour >= 12) return false;
          break;
        case 'afternoon':
          if (hour < 12 || hour >= 17) return false;
          break;
        case 'evening':
          if (hour < 17 || hour >= 21) return false;
          break;
      }
    }
    
    // Filter by preferred date if specified
    if (preferences.preferredDate) {
      const slotDate = new Date(slot.startTime);
      slotDate.setHours(0, 0, 0, 0);
      
      const prefDate = new Date(preferences.preferredDate);
      prefDate.setHours(0, 0, 0, 0);
      
      if (slotDate.getTime() !== prefDate.getTime()) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Sort slots by preference score
 */
export const sortSlotsByPreference = (
  slots: AvailableTimeSlot[],
  preferences: SchedulingPreference
): AvailableTimeSlot[] => {
  return slots.sort((a, b) => {
    const scoreA = calculatePreferenceScore(a, preferences);
    const scoreB = calculatePreferenceScore(b, preferences);
    
    // Higher score is better
    return scoreB - scoreA;
  });
};

/**
 * Calculate preference score for a time slot
 */
export const calculatePreferenceScore = (
  slot: AvailableTimeSlot,
  preferences: SchedulingPreference
): number => {
  let score = 0;
  
  // Base score for availability status
  switch (slot.status) {
    case 'available':
      score += 100;
      break;
    case 'limited':
      score += 50;
      break;
    case 'waitlist':
      score += 10;
      break;
  }
  
  // Bonus for preferred days
  const dayOfWeek = slot.startTime.getDay();
  if (preferences.preferredDays.includes(dayOfWeek)) {
    score += 20;
  }
  
  // Bonus for preferred time of day
  const hour = slot.startTime.getHours();
  if (preferences.preferredTimeOfDay !== 'any') {
    let timeBonus = 0;
    
    switch (preferences.preferredTimeOfDay) {
      case 'morning':
        if (hour >= 8 && hour < 10) timeBonus = 15; // Peak morning
        else if (hour >= 6 && hour < 12) timeBonus = 10;
        break;
      case 'afternoon':
        if (hour >= 13 && hour < 15) timeBonus = 15; // Peak afternoon
        else if (hour >= 12 && hour < 17) timeBonus = 10;
        break;
      case 'evening':
        if (hour >= 18 && hour < 20) timeBonus = 15; // Peak evening
        else if (hour >= 17 && hour < 21) timeBonus = 10;
        break;
    }
    
    score += timeBonus;
  }
  
  // Bonus for earliest slot preference
  if (preferences.wantsEarliestSlot) {
    // Earlier slots get higher scores
    const daysSinceEpoch = Math.floor(slot.startTime.getTime() / (1000 * 60 * 60 * 24));
    const minutesInDay = slot.startTime.getHours() * 60 + slot.startTime.getMinutes();
    
    // Subtract from a large number to invert the score (earlier = higher)
    score += (10000 - daysSinceEpoch) * 0.1 + (1440 - minutesInDay) * 0.01;
  }
  
  // Bonus for preferred date match
  if (preferences.preferredDate) {
    const slotDate = new Date(slot.startTime);
    slotDate.setHours(0, 0, 0, 0);
    
    const prefDate = new Date(preferences.preferredDate);
    prefDate.setHours(0, 0, 0, 0);
    
    if (slotDate.getTime() === prefDate.getTime()) {
      score += 50; // Big bonus for exact date match
    }
  }
  
  return score;
};

/**
 * Get the next available slot
 */
export const getNextAvailableSlot = (
  slots: AvailableTimeSlot[],
  fromDate: Date = new Date()
): AvailableTimeSlot | null => {
  const availableSlots = slots.filter(slot => 
    slot.status === 'available' && slot.startTime > fromDate
  );
  
  if (availableSlots.length === 0) {
    return null;
  }
  
  // Sort by start time and return the earliest
  availableSlots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return availableSlots[0];
};

/**
 * Format time slot for display
 */
export const formatTimeSlot = (slot: AvailableTimeSlot): string => {
  const startTime = slot.startTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const endTime = slot.endTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const date = slot.startTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  return `${date} at ${startTime} - ${endTime}`;
};

/**
 * Calculate slot duration in minutes
 */
export const calculateSlotDuration = (slot: AvailableTimeSlot): number => {
  return Math.round((slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60));
};

/**
 * Check if two slots overlap
 */
export const slotsOverlap = (slot1: AvailableTimeSlot, slot2: AvailableTimeSlot): boolean => {
  return slot1.startTime < slot2.endTime && slot1.endTime > slot2.startTime;
};

/**
 * Get business days between two dates
 */
export const getBusinessDaysBetween = (startDate: Date, endDate: Date): number => {
  let businessDays = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    // Monday = 1, Friday = 5
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      businessDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return businessDays;
};

/**
 * Add business days to a date
 */
export const addBusinessDays = (date: Date, businessDays: number): Date => {
  const result = new Date(date);
  let daysAdded = 0;
  
  while (daysAdded < businessDays) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    
    // If it's a business day (Monday-Friday), count it
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      daysAdded++;
    }
  }
  
  return result;
}; 