# TypeScript Type System Recommendations

Based on the analysis of component families, here are recommendations for standardizing the type system:

## 1. Type Organization Pattern

**Recommendation:** Move inline types to centralized type files

Many components are currently using inline type definitions. For consistency and reusability, these should be moved to separate type files.

## 2. Interface Architecture

**Recommendation:** Standardize on Base Interface + Extension pattern

Several component families are already using a base interface pattern. This should be standardized across all component families:

```typescript
interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

interface PrimaryButtonProps extends BaseButtonProps {
  variant: "primary";
  onClick: (event: ButtonClickEvent) => void;
}

interface SecondaryButtonProps extends BaseButtonProps {
  variant: "secondary";
  onClick?: (event: ButtonClickEvent) => void;
}

type ButtonProps = PrimaryButtonProps | SecondaryButtonProps;
```

## 3. Variant Handling

**Recommendation:** Use discriminated unions for component variants

Several component families are using discriminated unions for variant handling. This pattern should be applied to all component families with variants:

```typescript
type CardProps = ContentCardProps | ProfileCardProps | MediaCardProps;

// Type guard for content card
function isContentCard(props: CardProps): props is ContentCardProps {
  return props.variant === "content";
}
```

## 4. Event Handler Types

**Recommendation:** Create centralized event type definitions

Event handler types should be defined in a central location (`src/types/events.ts`) and imported where needed:

```typescript
// In src/types/events.ts
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type ButtonClickHandler = (event: ButtonClickEvent) => void;

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type InputChangeHandler = (event: InputChangeEvent) => void;
```

