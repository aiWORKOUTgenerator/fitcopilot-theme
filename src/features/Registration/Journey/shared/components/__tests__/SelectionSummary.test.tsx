import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import SelectionSummary from '../SelectionSummary';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

describe('SelectionSummary', () => {
    it('renders correctly with singular count', () => {
        render(
            <SelectionSummary
                selectedCount={1}
                singularLabel="item selected"
                pluralLabel="items selected"
                accentColor="lime"
            />
        );

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('item selected')).toBeInTheDocument();
    });

    it('renders correctly with plural count', () => {
        render(
            <SelectionSummary
                selectedCount={3}
                singularLabel="item selected"
                pluralLabel="items selected"
                accentColor="lime"
            />
        );

        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('items selected')).toBeInTheDocument();
    });

    it('renders maxAllowed when provided', () => {
        render(
            <SelectionSummary
                selectedCount={2}
                singularLabel="item selected"
                pluralLabel="items selected"
                accentColor="lime"
                maxAllowed={3}
            />
        );

        expect(screen.getByText('of 3 max')).toBeInTheDocument();
    });

    it('applies the correct accent color', () => {
        const { container } = render(
            <SelectionSummary
                selectedCount={1}
                singularLabel="item selected"
                pluralLabel="items selected"
                accentColor="amber"
            />
        );

        const badge = container.querySelector('.summary-badge');
        expect(badge).toHaveClass('amber-accent');
    });

    it('returns null when selectedCount is 0', () => {
        const { container } = render(
            <SelectionSummary
                selectedCount={0}
                singularLabel="item selected"
                pluralLabel="items selected"
                accentColor="lime"
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it('passes basic accessibility tests', async () => {
        const { container } = render(
            <SelectionSummary
                selectedCount={2}
                singularLabel="item selected"
                pluralLabel="items selected"
                accentColor="lime"
                maxAllowed={3}
            />
        );

        // Run axe on the rendered component
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
}); 