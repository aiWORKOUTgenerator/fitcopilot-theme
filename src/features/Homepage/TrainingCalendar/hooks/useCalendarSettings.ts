/**
 * Calendar Settings Hook
 * 
 * Manages calendar settings and preferences
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback, useState } from 'react';

export interface CalendarSettings {
  defaultView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  firstDay: 0 | 1; // 0 = Sunday, 1 = Monday
  timeFormat: string;
  dateFormat: string;
  slotDuration: string;
  businessHours: {
    start: string;
    end: string;
  };
  weekendEnabled: boolean;
  emailNotifications: boolean;
  calendarColors: {
    session: string;
    availability: string;
    blocked: string;
    group_class: string;
    workshop: string;
    assessment: string;
  };
}

export const useCalendarSettings = (initialSettings?: Partial<CalendarSettings>) => {
  const defaultSettings: CalendarSettings = {
    defaultView: 'dayGridMonth',
    firstDay: 0,
    timeFormat: 'h:mm a',
    dateFormat: 'MMM d, yyyy',
    slotDuration: '00:30:00',
    businessHours: {
      start: '09:00',
      end: '17:00'
    },
    weekendEnabled: false,
    emailNotifications: true,
    calendarColors: {
      session: '#4CAF50',
      availability: '#2196F3',
      blocked: '#F44336',
      group_class: '#FF9800',
      workshop: '#9C27B0',
      assessment: '#00BCD4'
    }
  };

  const [settings, setSettings] = useState<CalendarSettings>({
    ...defaultSettings,
    ...initialSettings
  });
  const [loading, setLoading] = useState(false);

  const updateSetting = useCallback(<K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    loading
  };
}; 