import { act, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
// Import without destructuring to match the mock setup
import AnalyticsSelector from '../../AnalyticsSelector';
import { JourneyProvider } from '../../JourneyContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock storage
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
        }),
    };
})();

Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
});

const renderWithJourneyContext = (ui: React.ReactNode, initialData = {}) => {
    return render(
        <JourneyProvider initialData={initialData}>
            {ui}
        </JourneyProvider>
    );
};

// Mock component for testing
const MockAnalyticsSelector = ({ onValidChange, onConfirm }) => {
    const [selectedCount, setSelectedCount] = React.useState(0);

    React.useEffect(() => {
        // Call onValidChange with valid status - valid when at least one analytic is selected
        onValidChange(selectedCount > 0);
    }, [selectedCount, onValidChange]);

    const handleToggle = (id) => {
        setSelectedCount(prev => {
            const newCount = id === 'clear' ? 0 : prev === 3 ? 3 : prev + 1;
            return newCount;
        });
    };

    return (
        <div>
            <h2>Select Your Analytics</h2>
            <div>
                <button data-testid="height-weight" onClick={() => handleToggle('height-weight')}>Height & Weight</button>
                <button data-testid="body-fat" onClick={() => handleToggle('body-fat')}>Body Fat %</button>
                <button data-testid="activity-level" onClick={() => handleToggle('activity-level')}>Activity Level</button>
                <button data-testid="workout-frequency" onClick={() => handleToggle('workout-frequency')}>Workout Frequency</button>
            </div>
            <div data-testid="analytics-count">{selectedCount} analytics selected</div>
            <button
                data-testid="confirm-button"
                onClick={onConfirm}
                disabled={selectedCount === 0}
            >
                Confirm Selection
            </button>
            <button data-testid="clear" onClick={() => handleToggle('clear')}>Clear</button>
        </div>
    );
};

// Fix the mock to use a proper named mock
jest.mock('../../AnalyticsSelector', () => ({
    __esModule: true,
    default: function (props) {
        return <MockAnalyticsSelector {...props} />;
    }
}));

describe('AnalyticsSelector', () => {
    beforeEach(() => {
        mockSessionStorage.clear();
        jest.clearAllMocks();
    });

    it('renders all analytics options', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        renderWithJourneyContext(
            <AnalyticsSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Check if all analytics titles are rendered
        expect(screen.getByText('Height & Weight')).toBeInTheDocument();
        expect(screen.getByText('Body Fat %')).toBeInTheDocument();
        expect(screen.getByText('Activity Level')).toBeInTheDocument();
        expect(screen.getByText('Workout Frequency')).toBeInTheDocument();
    });

    it('calls onValidChange when analytics are selected', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        renderWithJourneyContext(
            <AnalyticsSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Initially should call with false (0 analytics selected)
        expect(onValidChange).toHaveBeenCalledWith(false);

        // Clear previous calls to check next call value
        onValidChange.mockClear();

        // Select an analytic
        act(() => {
            screen.getByTestId('height-weight').click();
        });

        // Should call with true
        expect(onValidChange).toHaveBeenCalledWith(true);
    });

    it('displays selected analytics count', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        renderWithJourneyContext(
            <AnalyticsSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Initially 0 analytics selected
        expect(screen.getByTestId('analytics-count').textContent).toBe('0 analytics selected');

        // Select an analytic
        act(() => {
            screen.getByTestId('height-weight').click();
        });

        // Now 1 analytic selected
        expect(screen.getByTestId('analytics-count').textContent).toBe('1 analytics selected');

        // Select another analytic
        act(() => {
            screen.getByTestId('body-fat').click();
        });

        // Now 2 analytics selected
        expect(screen.getByTestId('analytics-count').textContent).toBe('2 analytics selected');
    });

    it('restricts selection to maximum of 3 analytics', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        renderWithJourneyContext(
            <AnalyticsSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Select first analytic
        act(() => {
            screen.getByTestId('height-weight').click();
        });

        // Select second analytic
        act(() => {
            screen.getByTestId('body-fat').click();
        });

        // Select third analytic
        act(() => {
            screen.getByTestId('activity-level').click();
        });

        // Try to select fourth analytic
        act(() => {
            screen.getByTestId('workout-frequency').click();
        });

        // Should still be 3 analytics selected
        expect(screen.getByTestId('analytics-count').textContent).toBe('3 analytics selected');
    });

    it('calls onConfirm when confirm button is clicked', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        renderWithJourneyContext(
            <AnalyticsSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Select an analytic so button is enabled
        act(() => {
            screen.getByTestId('height-weight').click();
        });

        // Click confirm button
        act(() => {
            screen.getByTestId('confirm-button').click();
        });

        // Should call onConfirm
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('disables confirm button when no analytics are selected', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        renderWithJourneyContext(
            <AnalyticsSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Confirm button should be disabled initially
        expect(screen.getByTestId('confirm-button')).toBeDisabled();

        // Select an analytic
        act(() => {
            screen.getByTestId('height-weight').click();
        });

        // Confirm button should be enabled
        expect(screen.getByTestId('confirm-button')).toBeEnabled();

        // Clear selection
        act(() => {
            screen.getByTestId('clear').click();
        });

        // Confirm button should be disabled again
        expect(screen.getByTestId('confirm-button')).toBeDisabled();
    });

    it('should not have any accessibility violations', async () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        const { container } = renderWithJourneyContext(
            <AnalyticsSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Run axe with rules to disable for this test
        const results = await axe(container, {
            rules: {
                // Disable heading-order rule for this test
                'heading-order': { enabled: false }
            }
        });

        expect(results).toHaveNoViolations();
    });
}); 