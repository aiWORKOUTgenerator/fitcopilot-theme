/* eslint-disable */
/**
 * Tests for card component type guards
 */

import React from 'react';
import {
    BaseCardProps,
    CardProps,
    ContentCardProps,
    PricingCardProps,
    ProfileCardProps,
    ProgramCardProps,
    WorkoutCardProps
} from '../../types/card';

import {
    hasError,
    hasMedia,
    isContentCard,
    isInteractive,
    isLoading,
    isPricingCard,
    isProfileCard,
    isProgramCard,
    isWorkoutCard
} from '../cardTypeGuards';

describe('Card Type Guards', () => {
    // Base card props for testing
    const baseCardProps: BaseCardProps = {
        id: 'test-card',
        className: 'test-class',
        'data-testid': 'test-card'
    };

    describe('Card variant type guards', () => {
        it('should identify content cards', () => {
            const contentCard: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content'
            };

            expect(isContentCard(contentCard)).toBe(true);
            expect(isContentCard({ ...contentCard, variant: 'profile' } as unknown as CardProps)).toBe(false);
        });

        it('should identify profile cards', () => {
            const profileCard: ProfileCardProps = {
                ...baseCardProps,
                variant: 'profile',
                name: 'John Doe'
            };

            expect(isProfileCard(profileCard)).toBe(true);
            expect(isProfileCard({ ...profileCard, variant: 'content' } as unknown as CardProps)).toBe(false);
        });

        it('should identify workout cards', () => {
            const workoutCard: WorkoutCardProps = {
                ...baseCardProps,
                variant: 'workout',
                workoutName: 'HIIT Training'
            };

            expect(isWorkoutCard(workoutCard)).toBe(true);
            expect(isWorkoutCard({ ...workoutCard, variant: 'content' } as unknown as CardProps)).toBe(false);
        });

        it('should identify program cards', () => {
            const programCard: ProgramCardProps = {
                ...baseCardProps,
                variant: 'program',
                programName: 'Beginner Fitness'
            };

            expect(isProgramCard(programCard)).toBe(true);
            expect(isProgramCard({ ...programCard, variant: 'content' } as unknown as CardProps)).toBe(false);
        });

        it('should identify pricing cards', () => {
            const pricingCard: PricingCardProps = {
                ...baseCardProps,
                variant: 'pricing',
                planName: 'Premium',
                price: '$49.99',
                features: ['Feature 1', 'Feature 2'],
                ctaText: 'Subscribe'
            };

            expect(isPricingCard(pricingCard)).toBe(true);
            expect(isPricingCard({ ...pricingCard, variant: 'content' } as unknown as CardProps)).toBe(false);
        });
    });

    describe('Card state guards', () => {
        it('should identify cards with media', () => {
            const cardWithMedia: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content',
                media: React.createElement('div', {}, 'Media Content')
            };

            const cardWithoutMedia: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content'
            };

            expect(hasMedia(cardWithMedia)).toBe(true);
            expect(hasMedia(cardWithoutMedia)).toBe(false);
        });

        it('should identify cards with errors', () => {
            const cardWithError: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content',
                error: 'Error loading content'
            };

            const cardWithoutError: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content'
            };

            expect(hasError(cardWithError)).toBe(true);
            expect(hasError(cardWithoutError)).toBe(false);
        });

        it('should identify cards in loading state', () => {
            const loadingCard: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content',
                isLoading: true
            };

            const loadedCard: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content',
                isLoading: false
            };

            expect(isLoading(loadingCard)).toBe(true);
            expect(isLoading(loadedCard)).toBe(false);
        });

        it('should identify interactive cards', () => {
            const interactiveCard: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content',
                onClick: jest.fn()
            };

            const nonInteractiveCard: ContentCardProps = {
                ...baseCardProps,
                variant: 'content',
                title: 'Test Content'
            };

            expect(isInteractive(interactiveCard)).toBe(true);
            expect(isInteractive(nonInteractiveCard)).toBe(false);
        });
    });
});