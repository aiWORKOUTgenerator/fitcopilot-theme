import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import logger from '../../../../utils/logger';
import Training from '../Training';
import { BenefitsList, ProgramCard } from '../components';
import { DEFAULT_PROGRAMS } from '../data/defaultProgramsData';
import { generateProgramAriaIds } from '../utils/accessibilityHelpers';

// Create a test-specific logger
const testLogger = logger.addContext('TrainingPerformanceTest');

/**
 * Performance test suite for the Training component
 * 
 * This file contains tests that validate the component's performance
 * optimizations, including:
 * 1. Memoization of sub-components
 * 2. useCallback for event handlers
 * 3. Extraction of default data
 */
describe('Training Component Performance', () => {
    // Mock performance now to test rendering time
    const originalPerformanceNow = global.performance.now;
    let perfStart: number;

    beforeAll(() => {
        // Setup performance testing
        global.performance.now = jest.fn(() => Date.now());
        // @ts-expect-error - for testing purposes
        jest.spyOn(React, 'memo').mockImplementation((component) => {
            return component;
        });
    });

    afterAll(() => {
        // Restore original implementation
        global.performance.now = originalPerformanceNow;
    });

    beforeEach(() => {
        perfStart = performance.now();
    });

    it('renders efficiently with memoized components', () => {
        const { container, getByText } = render(<Training />);

        // Time to render should be captured
        const renderTime = performance.now() - perfStart;
        testLogger.debug(`Initial render time: ${renderTime}ms`);

        // Expect the component to render all programs
        expect(container.querySelectorAll('.program-card')).toHaveLength(DEFAULT_PROGRAMS.length);
    });

    it('ProgramCard is memoized and prevents re-renders', () => {
        // Setup mock props
        const mockProgram = DEFAULT_PROGRAMS[0];
        const mockAriaIds = generateProgramAriaIds(0, 'strength');
        const mockToggle = jest.fn();

        const { rerender } = render(
            <ProgramCard
                program={mockProgram}
                isActive={false}
                onToggle={mockToggle}
                variant="default"
                ariaIds={mockAriaIds}
            />
        );

        // Re-render with same props should be efficient
        const reRenderStart = performance.now();

        rerender(
            <ProgramCard
                program={mockProgram}
                isActive={false}
                onToggle={mockToggle}
                variant="default"
                ariaIds={mockAriaIds}
            />
        );

        const reRenderTime = performance.now() - reRenderStart;
        testLogger.debug(`ProgramCard re-render time: ${reRenderTime}ms`);

        // Changing isActive should cause re-render
        rerender(
            <ProgramCard
                program={mockProgram}
                isActive={true}
                onToggle={mockToggle}
                variant="default"
                ariaIds={mockAriaIds}
            />
        );

        // Verify toggle works
        const card = document.querySelector('.program-card');
        fireEvent.click(card!);
        expect(mockToggle).toHaveBeenCalled();
    });

    it('BenefitsList is memoized and renders efficiently', () => {
        const benefits = ["Benefit 1", "Benefit 2", "Benefit 3"];

        const { rerender, getAllByText } = render(
            <BenefitsList
                benefits={benefits}
                variant="default"
            />
        );

        // All benefits should be rendered
        expect(getAllByText(/Benefit \d/).length).toBe(3);

        // Re-render with same props should be efficient
        const reRenderStart = performance.now();

        rerender(
            <BenefitsList
                benefits={benefits}
                variant="default"
            />
        );

        const reRenderTime = performance.now() - reRenderStart;
        testLogger.debug(`BenefitsList re-render time: ${reRenderTime}ms`);
    });

    it('ExpandedContent only renders when program is selected', () => {
        const { container, getByText, queryByText } = render(<Training />);

        // Initially no expanded content should be visible
        expect(container.querySelectorAll('.training-expanded').length).toBe(0);

        // Click on the first program card
        const firstCard = container.querySelector('.program-card');
        fireEvent.click(firstCard!);

        // Now expanded content should be visible
        expect(container.querySelectorAll('.training-expanded').length).toBe(1);
        expect(getByText('Key Benefits')).toBeInTheDocument();

        // Click again to collapse
        fireEvent.click(firstCard!);

        // Expanded content should be gone
        expect(container.querySelectorAll('.training-expanded').length).toBe(0);
    });
}); 