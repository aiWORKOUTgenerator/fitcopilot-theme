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

Type guards are centralized in `src/utils/cardTypeGuards.ts` and provide type-safe narrowing:

```typescript
export function isContentCard(props: CardProps): props is ContentCardProps {
  return props.variant === 'content';
}

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
  // Handle other variants...
  return null;
};
```

## Usage Examples

### Basic Card

```tsx
import { Card } from 'features/shared/Card';
import { ContentCardProps } from 'types/card';

const MyComponent: React.FC = () => {
  const cardProps: ContentCardProps = {
    variant: 'content',
    title: 'Getting Started',
    description: 'Learn how to use the FitCopilot platform',
    media: <img src="/images/getting-started.jpg" alt="Getting Started" />
  };

  return <Card {...cardProps} />;
};
```

### Conditional Card Rendering

```tsx
import { CardProps } from 'types/card';
import { isContentCard, isWorkoutCard } from 'utils/cardTypeGuards';

const CardDetails: React.FC<{ card: CardProps }> = ({ card }) => {
  // Type-safe handling based on card variant
  if (isContentCard(card)) {
    return (
      <div>
        Content Card: {card.title}
        <p>{card.description}</p>
      </div>
    );
  }
  
  if (isWorkoutCard(card)) {
    return (
      <div>
        Workout: {card.workoutName}
        <span>Difficulty: {card.difficulty}</span>
        <span>Duration: {card.duration} min</span>
      </div>
    );
  }
  
  // Handle other variants...
};
```

### Card State Guards

In addition to type guards for card variants, utility guards are available for checking card states:

```tsx
import { CardProps } from 'types/card';
import { hasError, isLoading, hasMedia } from 'utils/cardTypeGuards';

const CardWrapper: React.FC<{ card: CardProps }> = ({ card }) => {
  return (
    <div className="card-container">
      {isLoading(card) && <div className="loading-overlay">Loading...</div>}
      {hasError(card) && <div className="error-message">{card.error}</div>}
      {!isLoading(card) && !hasError(card) && <Card {...card} />}
      {hasMedia(card) && <div className="media-badge">Has Media</div>}
    </div>
  );
};
```

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