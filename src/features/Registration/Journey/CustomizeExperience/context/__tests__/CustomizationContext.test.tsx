import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { JourneyProvider } from '../../../components/JourneyContext';
import { CustomizationProvider, useCustomization } from '../CustomizationContext';

// Mock sessionStorage
const mockSessionStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage
});

// Custom wrapper to provide both contexts
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <JourneyProvider>
        <CustomizationProvider>
            {children}
        </CustomizationProvider>
    </JourneyProvider>
);

describe('CustomizationContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSessionStorage.clear();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useCustomization(), { wrapper: Wrapper });

        expect(result.current.completedSections).toEqual([]);
        expect(result.current.validSections).toBeDefined();
        expect(result.current.isCustomizationValid).toBe(false);
        expect(result.current.isLoading).toBe(true); // Initially loading
    });

    it('should update equipment data and mark section as valid', async () => {
        const { result } = renderHook(() => useCustomization(), { wrapper: Wrapper });

        // Wait for initial loading to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Update equipment data
        await act(async () => {
            result.current.updateEquipmentData({
                selectedEquipment: ['Dumbbells', 'Resistance Bands'],
                hasNoEquipment: false
            });
        });

        // Verify equipment data was updated
        expect(result.current.equipmentData).toEqual({
            selectedEquipment: ['Dumbbells', 'Resistance Bands'],
            hasNoEquipment: false
        });

        // Mark equipment section as valid and complete
        await act(async () => {
            result.current.updateSectionValidity('equipment', true);
            result.current.markSectionComplete('equipment');
        });

        // Verify section is valid and complete
        expect(result.current.validSections.equipment).toBe(true);
        expect(result.current.completedSections).toContain('equipment');
        expect(result.current.isCustomizationValid).toBe(true);
    });

    it('should reset state correctly', async () => {
        const { result } = renderHook(() => useCustomization(), { wrapper: Wrapper });

        // First setup some state
        await act(async () => {
            result.current.updateEquipmentData({
                selectedEquipment: ['Dumbbells'],
                hasNoEquipment: false
            });
            result.current.updateSectionValidity('equipment', true);
            result.current.markSectionComplete('equipment');
        });

        // Then reset it
        await act(async () => {
            result.current.resetCustomizationState();
        });

        // Verify state was reset
        expect(result.current.equipmentData).toEqual({
            selectedEquipment: [],
            hasNoEquipment: false
        });
        expect(result.current.completedSections).toEqual([]);
        expect(result.current.isCustomizationValid).toBe(false);
        expect(mockSessionStorage.setItem).toHaveBeenCalled();
    });

    it('should sync with stored data', async () => {
        // Setup mock storage
        mockSessionStorage.setItem('fitcopilot_customization_data', JSON.stringify({
            equipment: {
                selectedEquipment: ['Kettlebells'],
                hasNoEquipment: false
            },
            completedSections: ['equipment']
        }));

        const { result } = renderHook(() => useCustomization(), { wrapper: Wrapper });

        // Wait for sync to complete
        await act(async () => {
            await result.current.syncWithStoredData();
        });

        // Verify data was synced
        expect(result.current.equipmentData).toEqual({
            selectedEquipment: ['Kettlebells'],
            hasNoEquipment: false
        });
        expect(result.current.completedSections).toEqual(['equipment']);
        expect(result.current.isCustomizationValid).toBe(true);
    });

    it('should save all data', async () => {
        const { result } = renderHook(() => useCustomization(), { wrapper: Wrapper });

        // Setup some state
        await act(async () => {
            result.current.updateTimeCommitmentData({
                preferredTimeOfDay: ['Morning'],
                preferredDuration: '30-45 minutes',
                otherDuration: '',
                timeCommitmentPackage: 'moderate',
                preferredDays: ['Monday', 'Wednesday', 'Friday'],
                trainingFrequency: '3-4 days per week'
            });
        });

        // Save data
        await act(async () => {
            const success = await result.current.saveAllData();
            expect(success).toBe(true);
        });

        // Verify data was saved to session storage
        expect(mockSessionStorage.setItem).toHaveBeenCalled();
        const savedData = JSON.parse(mockSessionStorage.setItem.mock.calls[0][1]);
        expect(savedData.timeCommitment.preferredTimeOfDay).toEqual(['Morning']);
        expect(savedData.timeCommitment.preferredDuration).toBe('30-45 minutes');
    });
}); 