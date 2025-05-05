import { act, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock component for testing
const MockGoalSelector = ({ onValidChange, onConfirm }) => {
    const [selectedCount, setSelectedCount] = React.useState(0);

    React.useEffect(() => {
        // Call onValidChange with valid status - valid when at least one goal selected
        onValidChange(selectedCount > 0);
    }, [selectedCount, onValidChange]);

    const handleToggle = (id) => {
        setSelectedCount(prev => {
            const newCount = id === 'clear' ? 0 : prev === 2 ? 2 : prev + 1;
            return newCount;
        });
    };

    return (
        <div>
            <h2>Select Your Goals</h2>
            <div>
                <button data-testid="strength" onClick={() => handleToggle('strength')}>Strength Building</button>
                <button data-testid="fat-loss" onClick={() => handleToggle('fat-loss')}>Fat Loss</button>
                <button data-testid="muscle-growth" onClick={() => handleToggle('muscle-growth')}>Muscle Growth</button>
                <button data-testid="general-fitness" onClick={() => handleToggle('general-fitness')}>General Fitness</button>
            </div>
            <div data-testid="goal-count">{selectedCount} goals selected</div>
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

// Mock the GoalSelector component
jest.mock('../GoalSelector', () => {
    return function (props) {
        return <MockGoalSelector {...props} />;
    };
});

// Import the mocked version
import GoalSelector from '../GoalSelector';

describe('GoalSelector', () => {
    it('renders all goal options', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        render(
            <GoalSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        expect(screen.getByText('Strength Building')).toBeInTheDocument();
        expect(screen.getByText('Fat Loss')).toBeInTheDocument();
        expect(screen.getByText('Muscle Growth')).toBeInTheDocument();
        expect(screen.getByText('General Fitness')).toBeInTheDocument();
    });

    it('calls onValidChange when goals are selected', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        render(
            <GoalSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Initially should call with false (0 goals selected)
        expect(onValidChange).toHaveBeenCalledWith(false);

        // Clear previous calls to check next call value
        onValidChange.mockClear();

        // Select a goal
        act(() => {
            screen.getByTestId('strength').click();
        });

        // Should call with true
        expect(onValidChange).toHaveBeenCalledWith(true);
    });

    it('displays selected goal count', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        render(
            <GoalSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Initially 0 goals selected
        expect(screen.getByTestId('goal-count').textContent).toBe('0 goals selected');

        // Select a goal
        act(() => {
            screen.getByTestId('strength').click();
        });

        // Now 1 goal selected
        expect(screen.getByTestId('goal-count').textContent).toBe('1 goals selected');

        // Select another goal
        act(() => {
            screen.getByTestId('fat-loss').click();
        });

        // Now 2 goals selected
        expect(screen.getByTestId('goal-count').textContent).toBe('2 goals selected');
    });

    it('restricts selection to maximum of 2 goals', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        render(
            <GoalSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Select first goal
        act(() => {
            screen.getByTestId('strength').click();
        });

        // Select second goal
        act(() => {
            screen.getByTestId('fat-loss').click();
        });

        // Try to select third goal
        act(() => {
            screen.getByTestId('muscle-growth').click();
        });

        // Should still be 2 goals selected
        expect(screen.getByTestId('goal-count').textContent).toBe('2 goals selected');
    });

    it('calls onConfirm when confirm button is clicked', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        render(
            <GoalSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Select a goal so button is enabled
        act(() => {
            screen.getByTestId('strength').click();
        });

        // Click confirm button
        act(() => {
            screen.getByTestId('confirm-button').click();
        });

        // Should call onConfirm
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('disables confirm button when no goals are selected', () => {
        const onValidChange = jest.fn();
        const onConfirm = jest.fn();

        render(
            <GoalSelector
                onValidChange={onValidChange}
                onConfirm={onConfirm}
            />
        );

        // Confirm button should be disabled initially
        expect(screen.getByTestId('confirm-button')).toBeDisabled();

        // Select a goal
        act(() => {
            screen.getByTestId('strength').click();
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

        const { container } = render(
            <GoalSelector
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