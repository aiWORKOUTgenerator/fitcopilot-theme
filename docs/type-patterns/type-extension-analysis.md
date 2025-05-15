# Type Extension Analysis

This document analyzes the extension patterns for our type system, identifying opportunities for reuse and extension of existing types.

## Component Type Extension Patterns

### 1. Discriminated Union Pattern

The primary pattern for component hierarchies with variants is the discriminated union pattern, using either `variant` or `type` as the discriminator.

#### When to Use Each Discriminator:

- **`type`**: Use when components represent fundamentally different HTML elements or behaviors
  - Example: Media component uses `type` because "image" vs "video" are different HTML elements
  
- **`variant`**: Use when components are styling variations of the same base element
  - Example: Button component uses `variant` because all variants are button elements with styling differences

#### Extension Pattern:

```typescript
// Base type with common properties
interface BaseCardProps extends BaseComponentProps, WithChildrenProps {
  title?: string;
}

// Primary variant
interface PrimaryCardProps extends BaseCardProps {
  variant: 'primary';
  accentColor: string;
}

// Secondary variant
interface SecondaryCardProps extends BaseCardProps {
  variant: 'secondary';
  bordered: boolean;
}

// Tertiary variant
interface TertiaryCardProps extends BaseCardProps {
  variant: 'tertiary';
  compact: boolean;
}

// Union type combining all variants
type CardProps = PrimaryCardProps | SecondaryCardProps | TertiaryCardProps;

// Component implementation
const Card: React.FC<CardProps> = (props) => {
  // Type narrowing with discriminated union
  switch (props.variant) {
    case 'primary':
      return <PrimaryCard {...props} />;
    case 'secondary':
      return <SecondaryCard {...props} />;
    case 'tertiary':
      return <TertiaryCard {...props} />;
  }
};
```

### 2. Extension From Base Props

All component props should extend from our base prop interfaces, with appropriate combinations based on component functionality.

#### Extension Pattern:

```typescript
// Button component props
interface ButtonProps extends 
  InteractiveComponentProps,
  SizeVariantProps,
  StyleVariantProps,
  WithChildrenProps {
  
  // Button-specific props
  label: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}
```

### 3. Utility Type Extensions

Use utility types for specialized component needs.

#### Extension Pattern:

```typescript
// Generic component with dynamic content types
interface GenericContainerProps<T> extends BaseComponentProps {
  content: T;
  renderItem: (item: T) => React.ReactNode;
}

// Specialized implementations
type StringContainerProps = GenericContainerProps<string>;
type UserContainerProps = GenericContainerProps<User>;
```

## Extension Opportunities

### 1. Form Components

Current form components can be extended with a standardized form field interface:

```typescript
interface FormFieldProps extends FormControlProps {
  // Add validation properties
  validate?: (value: unknown) => string | undefined;
  validationState?: 'valid' | 'invalid' | 'pending';
  
  // Add form integration properties
  onBlur?: InputBlurHandler;
  onChange?: (value: unknown) => void;
  
  // Common field properties
  placeholder?: string;
  initialValue?: unknown;
}

// Extend for specific field types
interface TextFieldProps extends FormFieldProps {
  type: 'text' | 'email' | 'password' | 'url';
  maxLength?: number;
  value?: string;
  onChange?: StringChangeHandler;
}

interface NumberFieldProps extends FormFieldProps {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: NumberChangeHandler;
}
```

### 2. Layout Components

Extend base props with layout-specific properties:

```typescript
interface LayoutProps extends BaseComponentProps, WithChildrenProps {
  spacing?: 'none' | 'small' | 'medium' | 'large';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

// Row extends LayoutProps
interface RowProps extends LayoutProps {
  direction?: 'row';
}

// Column extends LayoutProps
interface ColumnProps extends LayoutProps {
  direction?: 'column';
}

// Grid extends LayoutProps
interface GridProps extends LayoutProps {
  columns?: number | string;
  rows?: number | string;
  gap?: string;
}
```

### 3. Data Display Components

Extend with data-specific interfaces:

```typescript
interface DataProps<T> {
  data: T[];
  isLoading?: boolean;
  error?: Error | null;
}

// Table component
interface TableProps<T> extends BaseComponentProps, DataProps<T> {
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
}

// List component
interface ListProps<T> extends BaseComponentProps, DataProps<T> {
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}
```

## Inheritance Map

Based on analysis of our components, here is a proposed inheritance map:

```
BaseComponentProps
├── WithChildrenProps
│   ├── LayoutProps
│   │   ├── RowProps
│   │   ├── ColumnProps
│   │   └── GridProps
│   ├── CardProps (discriminated by variant)
│   └── ContainerProps
│
├── InteractiveComponentProps
│   ├── ButtonProps
│   ├── LinkProps
│   └── ToggleProps
│
├── FormControlProps
│   ├── FormFieldProps
│   │   ├── TextFieldProps
│   │   ├── NumberFieldProps
│   │   ├── SelectProps
│   │   └── CheckboxProps
│   └── FormProps
│
└── DataDisplayProps
    ├── TableProps
    ├── ListProps
    └── CardListProps
```

## Implementation Recommendations

1. **Create Base Types First**: Implement the base type interfaces before specific component types.

2. **Use Type Guards Consistently**: Each discriminated union should have corresponding type guards:

   ```typescript
   function isPrimaryCard(props: CardProps): props is PrimaryCardProps {
     return props.variant === 'primary';
   }
   ```

3. **Document Extension Points**: Add JSDoc comments to types indicating how they should be extended.

4. **Promote Type Reuse**: Before creating new types, check if existing types can be extended or combined.

5. **Use Type Testing**: Create test files to verify that your types behave as expected:

   ```typescript
   // Type testing
   type Assert<T, Expected> = T extends Expected 
     ? Expected extends T 
       ? true 
       : false 
     : false;
   
   // This should be true
   type ButtonTest = Assert<ButtonProps, InteractiveComponentProps>;
   ```

## Conclusion

By systematically extending our type system using these patterns, we can create a more maintainable and type-safe codebase. The discriminated union pattern provides strong type safety while maintaining flexibility for component variants. 