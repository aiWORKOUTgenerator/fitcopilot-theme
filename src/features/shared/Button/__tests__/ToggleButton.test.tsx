/**
 * ToggleButton Component Tests
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ToggleButton from '../ToggleButton';

// Mock logger
jest.mock('../../../../utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    createLoggedEventHandler: jest.fn((component, action, handler) => handler)
}));

describe('ToggleButton Component', () => {
    it('renders in inactive state by default', () => {
        render(
            <ToggleButton data-testid="toggle-button">
                Toggle Me
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        expect(button).toHaveClass('toggle-button', 'toggle-button--inactive');
        expect(button).not.toHaveClass('toggle-button--active');
        expect(button).toHaveTextContent('Toggle Me');
    });

    it('renders in active state when isActive is true', () => {
        render(
            <ToggleButton isActive={true} data-testid="toggle-button">
                Active Toggle
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        expect(button).toHaveClass('toggle-button--active');
        expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onToggle with new state when clicked', () => {
        const handleToggle = jest.fn();

        render(
            <ToggleButton
                isActive={false}
                onToggle={handleToggle}
                data-testid="toggle-button"
            >
                Click to Toggle
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        fireEvent.click(button);

        expect(handleToggle).toHaveBeenCalledTimes(1);
        expect(handleToggle).toHaveBeenCalledWith(true, expect.any(Object));
    });

    it('toggles from active to inactive when clicked', () => {
        const handleToggle = jest.fn();

        render(
            <ToggleButton
                isActive={true}
                onToggle={handleToggle}
                data-testid="toggle-button"
            >
                Toggle Off
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        fireEvent.click(button);

        expect(handleToggle).toHaveBeenCalledWith(false, expect.any(Object));
    });

    it('displays activeLabel when active', () => {
        render(
            <ToggleButton
                isActive={true}
                activeLabel="ON"
                inactiveLabel="OFF"
                data-testid="toggle-button"
            >
                Base Text
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        expect(button).toHaveTextContent('ON');
        expect(button).not.toHaveTextContent('OFF');
    });

    it('displays inactiveLabel when inactive', () => {
        render(
            <ToggleButton
                isActive={false}
                activeLabel="ON"
                inactiveLabel="OFF"
                data-testid="toggle-button"
            >
                Base Text
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        expect(button).toHaveTextContent('OFF');
        expect(button).not.toHaveTextContent('ON');
    });

    it('displays children when no labels are provided', () => {
        render(
            <ToggleButton data-testid="toggle-button">
                Default Text
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        expect(button).toHaveTextContent('Default Text');
    });

    it('applies custom className', () => {
        render(
            <ToggleButton
                className="custom-toggle"
                data-testid="toggle-button"
            >
                Custom Toggle
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        expect(button).toHaveClass('custom-toggle');
    });

    it('disables the button when disabled is true', () => {
        render(
            <ToggleButton
                disabled={true}
                data-testid="toggle-button"
            >
                Disabled Toggle
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        expect(button).toBeDisabled();
    });

    it('calls onClick when provided', () => {
        const handleClick = jest.fn();

        render(
            <ToggleButton
                onClick={handleClick}
                data-testid="toggle-button"
            >
                Click Me
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls both onClick and onToggle when both are provided', () => {
        const handleClick = jest.fn();
        const handleToggle = jest.fn();

        render(
            <ToggleButton
                onClick={handleClick}
                onToggle={handleToggle}
                isActive={false}
                data-testid="toggle-button"
            >
                Click Me
            </ToggleButton>
        );

        const button = screen.getByTestId('toggle-button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleToggle).toHaveBeenCalledTimes(1);
        expect(handleToggle).toHaveBeenCalledWith(true, expect.any(Object));
    });
}); 