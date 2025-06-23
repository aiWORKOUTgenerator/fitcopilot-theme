/**
 * Booking Flow Hook
 * 
 * Manages the complete booking workflow including validation, submission,
 * and integration with payment systems
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback, useState } from 'react';
import { BookingData, CalendarEvent, PaymentData } from '../types';

export interface BookingFlowState {
  currentStep: number;
  maxSteps: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
  bookingData: Partial<BookingData>;
  paymentData: Partial<PaymentData>;
}

export interface BookingFlowCallbacks {
  onBookingSubmit: (bookingData: BookingData) => Promise<{ success: boolean; bookingId?: string; error?: string }>;
  onPaymentProcess?: (paymentData: PaymentData) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  onBookingCancel?: () => void;
  onStepChange?: (step: number) => void;
}

export const useBookingFlow = (event: CalendarEvent, callbacks: BookingFlowCallbacks) => {
  const [state, setState] = useState<BookingFlowState>({
    currentStep: 1,
    maxSteps: 4, // Client Info, Emergency Contact, Medical/Goals, Payment/Confirmation
    isSubmitting: false,
    errors: {},
    bookingData: {
      eventId: event.id as number,
      bookingStatus: 'pending',
      bookingDate: new Date().toISOString(),
    },
    paymentData: {}
  });

  // Update booking data
  const updateBookingData = useCallback((updates: Partial<BookingData>) => {
    setState(prev => ({
      ...prev,
      bookingData: { ...prev.bookingData, ...updates },
      errors: {} // Clear errors when data is updated
    }));
  }, []);

  // Update payment data
  const updatePaymentData = useCallback((updates: Partial<PaymentData>) => {
    setState(prev => ({
      ...prev,
      paymentData: { ...prev.paymentData, ...updates }
    }));
  }, []);

  // Validate current step
  const validateStep = useCallback((step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
    case 1: // Client Information
      if (!state.bookingData.clientInfo?.name?.trim()) {
        errors.clientName = 'Full name is required';
      }
      if (!state.bookingData.clientInfo?.email?.trim()) {
        errors.clientEmail = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.bookingData.clientInfo.email)) {
        errors.clientEmail = 'Please enter a valid email address';
      }
      if (!state.bookingData.clientInfo?.phone?.trim()) {
        errors.clientPhone = 'Phone number is required';
      }
      break;

    case 2: // Emergency Contact
      if (!state.bookingData.emergencyContact?.name?.trim()) {
        errors.emergencyName = 'Emergency contact name is required';
      }
      if (!state.bookingData.emergencyContact?.phone?.trim()) {
        errors.emergencyPhone = 'Emergency contact phone is required';
      }
      break;

    case 3: // Medical & Goals
      // Optional validation - can add requirements if needed
      break;

    case 4: // Payment & Confirmation
      if (event.price && event.price > 0) {
        if (!state.paymentData.method) {
          errors.paymentMethod = 'Payment method is required';
        }
        if (state.paymentData.method === 'card' && !state.paymentData.cardNumber) {
          errors.cardNumber = 'Card number is required';
        }
      }
      break;
    }

    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [state.bookingData, state.paymentData, event.price]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (validateStep(state.currentStep) && state.currentStep < state.maxSteps) {
      const newStep = state.currentStep + 1;
      setState(prev => ({ ...prev, currentStep: newStep }));
      callbacks.onStepChange?.(newStep);
    }
  }, [state.currentStep, state.maxSteps, validateStep, callbacks]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      const newStep = state.currentStep - 1;
      setState(prev => ({ ...prev, currentStep: newStep }));
      callbacks.onStepChange?.(newStep);
    }
  }, [state.currentStep, callbacks]);

  // Go to specific step
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= state.maxSteps) {
      setState(prev => ({ ...prev, currentStep: step }));
      callbacks.onStepChange?.(step);
    }
  }, [state.maxSteps, callbacks]);

  // Submit booking
  const submitBooking = useCallback(async () => {
    if (!validateStep(state.currentStep)) {
      return { success: false, error: 'Please correct the form errors' };
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Process payment if required
      let paymentResult = { success: true, transactionId: undefined };
      if (event.price && event.price > 0 && callbacks.onPaymentProcess) {
        paymentResult = await callbacks.onPaymentProcess(state.paymentData as PaymentData);
        if (!paymentResult.success) {
          throw new Error(paymentResult.error || 'Payment processing failed');
        }
      }

      // Complete booking data
      const completeBookingData: BookingData = {
        ...state.bookingData,
        paymentStatus: paymentResult.transactionId ? 'paid' : 'unpaid',
        paymentTransactionId: paymentResult.transactionId,
        confirmedDate: new Date().toISOString()
      } as BookingData;

      // Submit booking
      const result = await callbacks.onBookingSubmit(completeBookingData);

      setState(prev => ({ ...prev, isSubmitting: false }));
      return result;

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        errors: { submit: error instanceof Error ? error.message : 'Booking submission failed' }
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Booking submission failed' };
    }
  }, [state, event.price, callbacks, validateStep]);

  // Cancel booking
  const cancelBooking = useCallback(() => {
    callbacks.onBookingCancel?.();
  }, [callbacks]);

  // Reset form
  const resetForm = useCallback(() => {
    setState({
      currentStep: 1,
      maxSteps: 4,
      isSubmitting: false,
      errors: {},
      bookingData: {
        eventId: event.id as number,
        bookingStatus: 'pending',
        bookingDate: new Date().toISOString(),
      },
      paymentData: {}
    });
  }, [event.id]);

  // Get step progress
  const getStepProgress = useCallback(() => {
    return {
      current: state.currentStep,
      max: state.maxSteps,
      percentage: (state.currentStep / state.maxSteps) * 100,
      isFirstStep: state.currentStep === 1,
      isLastStep: state.currentStep === state.maxSteps
    };
  }, [state.currentStep, state.maxSteps]);

  // Check if booking is valid
  const isBookingValid = useCallback(() => {
    // Check all steps are completed
    for (let step = 1; step <= state.maxSteps; step++) {
      if (!validateStep(step)) {
        return false;
      }
    }
    return true;
  }, [state.maxSteps, validateStep]);

  return {
    // State
    state,
    
    // Actions
    updateBookingData,
    updatePaymentData,
    nextStep,
    prevStep,
    goToStep,
    submitBooking,
    cancelBooking,
    resetForm,
    
    // Computed
    getStepProgress,
    isBookingValid,
    
    // Validation
    validateStep
  };
}; 