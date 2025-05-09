import { create } from 'zustand';

interface JourneyState {
    expandedStep: number | null;
    setExpandedStep: (step: number | null) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
    expandedStep: null,
    setExpandedStep: (step) => set({ expandedStep: step }),
})); 