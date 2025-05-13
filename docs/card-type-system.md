# Card Component Type System

This document outlines the type system for card components in the FitCopilot theme, providing a consistent pattern for type-safe card implementations.

## Core Type Pattern

Card components use a discriminated union pattern with the following structure:

1. **Base Props Interface**: Common properties for all card variants
2. **Variant Interfaces**: Extended interfaces for specific card types
3. **Union Type**: Combined type representing all possible variants
4. **Type Guards**: Functions to safely check component variants

## Type Hierarchy

```
BaseCardProps
  ├── ContentCardProps (variant: 'content')
  ├── ProfileCardProps (variant: 'profile')
  ├── WorkoutCardProps (variant: 'workout')
  ├── ProgramCardProps (variant: 'program')
  └── PricingCardProps (variant: 'pricing')
```

These types are combined into the `CardProps` discriminated union:

```typescript
export type CardProps =
  | ContentCardProps
  | ProfileCardProps
  | WorkoutCardProps
  | ProgramCardProps
  | PricingCardProps;
```

## Type Guards

Type guards are provided for each card variant:

```typescript
export const isContentCard = (props: CardProps): props is ContentCardProps => {
  return props.variant === 'content';
};

export const isProfileCard = (props: CardProps): props is ProfileCardProps => {
  return props.variant === 'profile';
};

// Additional guards for each card variant...
```

## Card Component Implementation

The `Card` component acts as a discriminated union switcher, using type guards to render the appropriate component:

```typescript
export const Card: React.FC<CardProps> = (props) => {
  if (isContentCard(props)) return <ContentCard {...props} />;
  if (isProfileCard(props)) return <ProfileCard {...props} />;
  if (isWorkoutCard(props)) return <WorkoutCard {...props} />;
  if (isProgramCard(props)) return <ProgramCard {...props} />;
  if (isPricingCard(props)) return <PricingCard {...props} />;
  
  // Handle unsupported card variants
  logger.error(`Unsupported card variant: ${props.variant}`);
  return null;
};
```

## Usage Examples

### Content Card

```tsx
import { Card } from 'features/shared/Card';

<Card 
  variant="content"
  title="Getting Started with FitCopilot"
  description="Learn how to use our platform to optimize your training."
  media={<img src="/images/getting-started.jpg" alt="Getting started" />}
  footer={<Button variant="primary">Learn More</Button>}
/>
```

### Profile Card

```tsx
import { Card } from 'features/shared/Card';

<Card 
  variant="profile"
  name="Jane Smith"
  role="Fitness Trainer"
  bio="Certified personal trainer with 10+ years of experience."
  avatarUrl="/images/trainers/jane-smith.jpg"
/>
```

### Workout Card

```tsx
import { Card } from 'features/shared/Card';

<Card 
  variant="workout"
  workoutName="High Intensity Interval Training"
  difficulty="intermediate"
  duration={45}
  calories={450}
  targets={["Cardio", "Full Body"]}
  isBookmarked={false}
  onBookmark={(id, isBookmarked) => handleBookmark(id, isBookmarked)}
/>
```

## Enhanced Styling with ExtendedCSSProperties

Card components support theme tokens through `ExtendedCSSProperties`:

```tsx
import { Card } from 'features/shared/Card';
import { ExtendedCSSProperties } from '../types/components';

const customStyles: ExtendedCSSProperties = {
  '--card-accent-color': 'var(--color-brand-primary)',
  '--card-padding': 'var(--spacing-lg)',
};

<Card 
  variant="content"
  title="Custom Styled Card"
  style={customStyles}
/>
```

## Event Handling

Cards support type-safe event handlers:

```typescript
export type CardClickHandler = (event: React.MouseEvent<HTMLDivElement>) => void;
export type CardButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
```

Example usage:

```tsx
import { Card, CardClickHandler } from 'features/shared/Card';

const handleCardClick: CardClickHandler = (event) => {
  // Type-safe event handling
  console.log('Card clicked', event.currentTarget.dataset.id);
};

<Card 
  variant="content"
  title="Interactive Card"
  onClick={handleCardClick}
/>
```

## Best Practices

1. **Always use the variant discriminator** to ensure proper type checking
2. **Implement type guards** for conditional rendering
3. **Make cards accessible** with proper ARIA attributes and keyboard navigation
4. **Keep card content focused** on a single purpose
5. **Support responsive layouts** for different viewport sizes

## Card Variant Descriptions

### Content Card
General-purpose card for displaying content with a title, description, and optional media.

### Profile Card
Designed for user profiles with name, avatar, bio, and other user information.

### Workout Card
Specific to workout information, including workout name, difficulty, duration, and bookmark functionality.

### Program Card
For workout programs containing multiple workouts, including program name, difficulty level, and summary.

### Pricing Card
For displaying subscription or membership options with price, billing period, and feature list.

## Benefits

This type system provides several advantages:

1. **Type Safety**: Ensures that component props are properly typed and validated
2. **Intellisense Support**: Provides code completion based on the specific card variant
3. **Runtime Type Checking**: Guards work at runtime to ensure correct component rendering
4. **Consistency**: Establishes a uniform pattern for all card components
5. **Maintainability**: Centralizes card type definitions and validations

## Card Types Organization

Card-related types are organized in:

- `src/types/card.ts`: Centralized type definitions for all card components
- `src/utils/cardTypeGuards.ts`: Type guard functions for safe type narrowing
- `src/utils/__tests__/cardTypeGuards.test.ts`: Tests for type guards 