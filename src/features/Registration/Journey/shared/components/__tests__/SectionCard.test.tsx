/* eslint-disable */
import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import SectionCard from '../SectionCard';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

describe('SectionCard', () => {
    // Mock props and reset mocks before each test
    let mockProps;

    beforeEach(() => {
        mockProps = {
            id: 'test-card',
            title: 'Test Card',
            description: 'This is a test card',
            icon: <div data-testid="test-icon">Icon</div>,
            isSelected: false,
            accentColor: 'lime',
            onToggle: jest.fn(),
            testId: 'test-section-card'
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with all props', () => {
        render(<SectionCard {...mockProps} />);

        expect(screen.getByText('Test Card')).toBeInTheDocument();
        expect(screen.getByText('This is a test card')).toBeInTheDocument();
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('calls onToggle when clicked', () => {
        render(<SectionCard {...mockProps} />);

        fireEvent.click(screen.getByTestId('test-section-card'));
        expect(mockProps.onToggle).toHaveBeenCalledTimes(1);
    });

    it('renders with selected state when isSelected is true', () => {
        render(<SectionCard {...mockProps} isSelected={true} />);

        const card = screen.getByTestId('test-section-card');
        expect(card).toHaveClass('selected');
        expect(card).toHaveAttribute('aria-checked', 'true');

        // Check for check indicator
        expect(screen.getByText('Test Card')).toHaveClass('selected');
    });

    it('renders with unselected state when isSelected is false', () => {
        render(<SectionCard {...mockProps} />);

        const card = screen.getByTestId('test-section-card');
        expect(card).not.toHaveClass('selected');
        expect(card).toHaveAttribute('aria-checked', 'false');
    });

    it('applies correct accent color class', () => {
        render(<SectionCard {...mockProps} accentColor="amber" />);

        const card = screen.getByTestId('test-section-card');
        expect(card).toHaveClass('amber-accent');
    });

    it('is keyboard accessible with Enter key', () => {
        // Create a fresh mock for this test only
        const onToggleMock = jest.fn();
        render(<SectionCard {...mockProps} onToggle={onToggleMock} />);

        const card = screen.getByTestId('test-section-card');
        card.focus();
        fireEvent.keyDown(card, { key: 'Enter' });

        expect(onToggleMock).toHaveBeenCalledTimes(1);
    });

    it('is keyboard accessible with Space key', () => {
        // Create a fresh mock for this test only
        const onToggleMock = jest.fn();
        render(<SectionCard {...mockProps} onToggle={onToggleMock} />);

        const card = screen.getByTestId('test-section-card');
        card.focus();
        fireEvent.keyDown(card, { key: ' ' });

        expect(onToggleMock).toHaveBeenCalledTimes(1);
    });

    it('has correct ARIA attributes for accessibility', () => {
        render(<SectionCard {...mockProps} />);

        const card = screen.getByTestId('test-section-card');
        expect(card).toHaveAttribute('role', 'checkbox');
        expect(card).toHaveAttribute('aria-checked', 'false');
        expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('passes basic accessibility tests', async () => {
        const { container } = render(<SectionCard {...mockProps} />);

        // Run axe on the rendered component
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
}); 