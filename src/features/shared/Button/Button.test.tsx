/**
 * Button Component Tests
 */

import React from 'react';
import {
    ButtonProps,
    isFloatingActionButton,
    isIconButton,
    isLinkButton,
    isPrimaryButton,
    isSecondaryButton,
    isTextButton,
    isToggleButton,
    isWorkoutButton
} from './';

describe('Button Type Guards', () => {
    describe('isPrimaryButton', () => {
        it('should return true for primary button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text',
                size: 'medium'
            };

            expect(isPrimaryButton(props)).toBe(true);
        });

        it('should return false for non-primary button props', () => {
            const props: ButtonProps = {
                variant: 'secondary',
                children: 'Button Text'
            };

            expect(isPrimaryButton(props)).toBe(false);
        });
    });

    describe('isSecondaryButton', () => {
        it('should return true for secondary button props', () => {
            const props: ButtonProps = {
                variant: 'secondary',
                children: 'Button Text',
                outline: true
            };

            expect(isSecondaryButton(props)).toBe(true);
        });

        it('should return false for non-secondary button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isSecondaryButton(props)).toBe(false);
        });
    });

    describe('isTextButton', () => {
        it('should return true for text button props', () => {
            const props: ButtonProps = {
                variant: 'text',
                children: 'Button Text',
                underline: true
            };

            expect(isTextButton(props)).toBe(true);
        });

        it('should return false for non-text button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isTextButton(props)).toBe(false);
        });
    });

    describe('isLinkButton', () => {
        it('should return true for link button props', () => {
            const props: ButtonProps = {
                variant: 'link',
                children: 'Button Text',
                href: 'https://example.com'
            };

            expect(isLinkButton(props)).toBe(true);
        });

        it('should return false for non-link button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isLinkButton(props)).toBe(false);
        });
    });

    describe('isIconButton', () => {
        it('should return true for icon button props', () => {
            const props: ButtonProps = {
                variant: 'icon',
                children: 'Button Text',
                icon: <span data-testid="icon" />
            };

            expect(isIconButton(props)).toBe(true);
        });

        it('should return false for non-icon button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isIconButton(props)).toBe(false);
        });
    });

    describe('isToggleButton', () => {
        it('should return true for toggle button props', () => {
            const props: ButtonProps = {
                variant: 'toggle',
                children: 'Button Text',
                isActive: true
            };

            expect(isToggleButton(props)).toBe(true);
        });

        it('should return false for non-toggle button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isToggleButton(props)).toBe(false);
        });
    });

    describe('isFloatingActionButton', () => {
        it('should return true for floating action button props', () => {
            const props: ButtonProps = {
                variant: 'floating',
                children: 'Button Text',
                icon: <span data-testid="icon" />
            };

            expect(isFloatingActionButton(props)).toBe(true);
        });

        it('should return false for non-floating button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isFloatingActionButton(props)).toBe(false);
        });
    });

    describe('isWorkoutButton', () => {
        it('should return true for workout button props', () => {
            const props: ButtonProps = {
                variant: 'workout',
                children: 'Button Text',
                exerciseId: '123'
            };

            expect(isWorkoutButton(props)).toBe(true);
        });

        it('should return false for non-workout button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isWorkoutButton(props)).toBe(false);
        });
    });
}); 