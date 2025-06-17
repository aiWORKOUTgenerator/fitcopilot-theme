/**
 * Real-Time Updates Hook
 * 
 * Manages real-time calendar updates using polling and WebSocket connections
 * Provides live updates when events are created, modified, or deleted
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarEvent } from '../types';

export interface RealTimeUpdate {
  id: string;
  type: 'event_created' | 'event_updated' | 'event_deleted' | 'booking_confirmed' | 'booking_cancelled';
  entityId: string;
  data: any;
  timestamp: string;
  userId: string;
  source: 'admin' | 'frontend' | 'api';
}

export interface RealTimeSettings {
  enabled: boolean;
  method: 'polling' | 'websocket';
  pollingInterval: number; // milliseconds
  reconnectAttempts: number;
  reconnectDelay: number; // milliseconds
}

export interface RealTimeCallbacks {
  onEventCreated?: (event: CalendarEvent) => void;
  onEventUpdated?: (event: CalendarEvent) => void;
  onEventDeleted?: (eventId: string) => void;
  onBookingConfirmed?: (eventId: string, bookingData: any) => void;
  onBookingCancelled?: (eventId: string, reason?: string) => void;
  onConnectionStatusChange?: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
  onError?: (error: Error) => void;
}

export const useRealTimeUpdates = (
  settings: RealTimeSettings,
  callbacks: RealTimeCallbacks
) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs for managing connections and intervals
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Start polling for updates
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    const pollForUpdates = async () => {
      try {
        const response = await fetch('/wp-admin/admin-ajax.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            action: 'get_calendar_updates',
            last_update: lastUpdate,
            nonce: (window as any).fitcopilotTrainingCalendarAjax?.nonce || ''
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data.updates.length > 0) {
          const newUpdates = data.data.updates as RealTimeUpdate[];
          processUpdates(newUpdates);
          setLastUpdate(data.data.server_time);
        }

        if (connectionStatus !== 'connected') {
          setConnectionStatus('connected');
          callbacks.onConnectionStatusChange?.('connected');
          reconnectAttemptsRef.current = 0;
        }

      } catch (error) {
        console.error('Polling error:', error);
        if (connectionStatus !== 'disconnected') {
          setConnectionStatus('disconnected');
          callbacks.onConnectionStatusChange?.('disconnected');
          callbacks.onError?.(error instanceof Error ? error : new Error('Polling failed'));
        }
      }
    };

    // Initial poll
    pollForUpdates();

    // Set up recurring polling
    pollingIntervalRef.current = setInterval(pollForUpdates, settings.pollingInterval);
  }, [lastUpdate, connectionStatus, settings.pollingInterval, callbacks]);

  // Start WebSocket connection
  const startWebSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    try {
      // Note: This would need actual WebSocket server configuration
      const wsUrl = `ws://${window.location.host}/fitcopilot-calendar-updates`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        callbacks.onConnectionStatusChange?.('connected');
        reconnectAttemptsRef.current = 0;
      };

      websocket.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data) as RealTimeUpdate;
          processUpdates([update]);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      websocket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
        callbacks.onConnectionStatusChange?.('disconnected');

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < settings.reconnectAttempts) {
          attemptReconnect();
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        callbacks.onError?.(new Error('WebSocket connection error'));
      };

      websocketRef.current = websocket;

    } catch (error) {
      console.error('WebSocket initialization error:', error);
      callbacks.onError?.(error instanceof Error ? error : new Error('WebSocket initialization failed'));
    }
  }, [settings.reconnectAttempts, callbacks]);

  // Attempt to reconnect
  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= settings.reconnectAttempts) {
      return;
    }

    setConnectionStatus('reconnecting');
    callbacks.onConnectionStatusChange?.('reconnecting');
    reconnectAttemptsRef.current++;

    reconnectTimeoutRef.current = setTimeout(() => {
      if (settings.method === 'websocket') {
        startWebSocket();
      } else {
        startPolling();
      }
    }, settings.reconnectDelay);
  }, [settings.method, settings.reconnectAttempts, settings.reconnectDelay, callbacks, startWebSocket, startPolling]);

  // Process incoming updates
  const processUpdates = useCallback((newUpdates: RealTimeUpdate[]) => {
    setUpdates(prev => [...prev, ...newUpdates]);
    setUnreadCount(prev => prev + newUpdates.length);

    newUpdates.forEach(update => {
      switch (update.type) {
        case 'event_created':
          callbacks.onEventCreated?.(update.data as CalendarEvent);
          break;
        case 'event_updated':
          callbacks.onEventUpdated?.(update.data as CalendarEvent);
          break;
        case 'event_deleted':
          callbacks.onEventDeleted?.(update.entityId);
          break;
        case 'booking_confirmed':
          callbacks.onBookingConfirmed?.(update.entityId, update.data);
          break;
        case 'booking_cancelled':
          callbacks.onBookingCancelled?.(update.entityId, update.data?.reason);
          break;
      }
    });
  }, [callbacks]);

  // Start real-time updates
  const start = useCallback(() => {
    if (!settings.enabled) {
      return;
    }

    if (settings.method === 'websocket') {
      startWebSocket();
    } else {
      startPolling();
    }
  }, [settings.enabled, settings.method, startWebSocket, startPolling]);

  // Stop real-time updates
  const stop = useCallback(() => {
    // Clear polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Close WebSocket connection
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnectionStatus('disconnected');
    callbacks.onConnectionStatusChange?.('disconnected');
  }, [callbacks]);

  // Mark updates as read
  const markAsRead = useCallback((updateIds?: string[]) => {
    if (updateIds) {
      setUpdates(prev => prev.filter(update => !updateIds.includes(update.id)));
      setUnreadCount(prev => Math.max(0, prev - updateIds.length));
    } else {
      setUpdates([]);
      setUnreadCount(0);
    }

    // Notify server about read status
    fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'mark_updates_seen',
        update_ids: updateIds ? updateIds.join(',') : 'all',
        nonce: (window as any).fitcopilotTrainingCalendarAjax?.nonce || ''
      })
    }).catch(error => {
      console.error('Failed to mark updates as read:', error);
    });
  }, []);

  // Get filtered updates
  const getUpdates = useCallback((type?: RealTimeUpdate['type'], limit?: number) => {
    let filteredUpdates = updates;
    
    if (type) {
      filteredUpdates = filteredUpdates.filter(update => update.type === type);
    }
    
    if (limit) {
      filteredUpdates = filteredUpdates.slice(-limit);
    }
    
    return filteredUpdates;
  }, [updates]);

  // Force refresh
  const refresh = useCallback(() => {
    setLastUpdate('');
    if (settings.method === 'polling' && pollingIntervalRef.current) {
      // Trigger immediate poll
      clearInterval(pollingIntervalRef.current);
      startPolling();
    }
  }, [settings.method, startPolling]);

  // Initialize on mount
  useEffect(() => {
    if (settings.enabled) {
      start();
    }

    return () => {
      stop();
    };
  }, [settings.enabled, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    // State
    connectionStatus,
    updates,
    unreadCount,
    lastUpdate,

    // Actions
    start,
    stop,
    refresh,
    markAsRead,

    // Utilities
    getUpdates,
    isConnected: connectionStatus === 'connected',
    isReconnecting: connectionStatus === 'reconnecting'
  };
}; 