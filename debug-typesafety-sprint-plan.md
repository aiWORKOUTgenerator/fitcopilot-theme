# Debug & UI Components Type-Safety Sprint Plan

## Sprint Overview

This sprint focuses on implementing Phase 1 of our ESLint Remediation Implementation Plan, targeting the elimination of `any` types in Debug utilities and UI components. The sprint follows our established type-safety patterns and builds on the successful MediaPlayer implementation.

## Sprint Duration: 2 weeks

### Week 1: Debug Utilities & Button Components (5 business days)

#### Day 1-2: Debug Utilities Type System

**Tasks:**
1. Create proper typings for debug utilities in `src/utils/debug.tsx`:
   - Replace `{ from: any, to: any }` with generic typed structure
   - Create proper interface for Performance API memory
   - Create `DebugPropChanges<T>` interface for prop change tracking
   
2. Implement reusable type guards for debug utilities:
   - Create `isPerformanceMemoryAvailable()` type guard
   - Implement `isPropChanged<T>()` for type-safe prop comparison

**Deliverables:**
- Zero `any` types in debug utilities
- Comprehensive type documentation
- Type guard tests for debug utilities

#### Day 3-5: Button Components Type System

**Tasks:**
1. Audit all Button variant components for `any` types:
   - Map all button components and their prop types
   - Identify event handler types using `any`
   - Document button component inheritance patterns

2. Create strong type definitions for button components:
   - Implement proper `ButtonProps` interface hierarchy
   - Create specific event handler types for button interactions
   - Define theme-specific button prop extensions

3. Apply type system to all button components:
   - Update base Button component with proper typing
   - Refactor button variants to use the type system
   - Implement proper event typing throughout

**Deliverables:**
- All Button components free of `any` types
- Button component type documentation
- Usage examples for typed button components

### Week 2: Form Components Type System (5 business days)

#### Day 1-2: Form Field Base Types

**Tasks:**
1. Create form field type foundation:
   - Implement `BaseFormFieldProps` interface
   - Create discriminated union for field types:
     ```typescript
     type FormFieldProps = 
       | TextFieldProps
       | SelectFieldProps
       | CheckboxFieldProps
       | RadioFieldProps
       | SwitchFieldProps;
     ```
   - Implement specific event handlers for each field type

2. Develop form validation types:
   - Create type-safe validation rule system
   - Implement error state types
   - Design touched/dirty state tracking types

**Deliverables:**
- Form field type system foundation
- Type-safe validation system
- Form state type definitions

#### Day 3-5: Form Component Implementation

**Tasks:**
1. Apply type system to text input components:
   - Refactor TextField to use proper typing
   - Update TextArea with specific event handling
   - Apply types to specialized text inputs (email, password, etc.)

2. Apply type system to selection components:
   - Update Select component with proper option typing
   - Apply types to Checkbox and Radio components
   - Implement proper event typing for selection changes

3. Create Form Container type system:
   - Implement Form component typing
   - Create FormContext with proper types
   - Type the form submission process

**Deliverables:**
- All form components free of `any` types
- Form component type documentation
- Usage examples for typed form components

## Implementation Details

### Debug Utilities Type System

Replace current implementation:
```typescript
// Before
const changes: Record<string, { from: any, to: any }> = {};
```

With type-safe implementation:
```typescript
// After
interface PropChange<T> {
  from: T;
  to: T;
}

const changes: Record<string, PropChange<unknown>> = {};
```

For performance memory API:
```typescript
// Before
if (memoryRef.current && (performance as any).memory) {
  const memory = (performance as any).memory;
}

// After
interface PerformanceMemory {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface PerformanceWithMemory extends Performance {
  memory: PerformanceMemory;
}

function hasMemoryInfo(performance: Performance): performance is PerformanceWithMemory {
  return 'memory' in performance;
}

// Usage
if (memoryRef.current && hasMemoryInfo(performance)) {
  const memory = performance.memory;
}
```

### Button Type System

Create proper button type hierarchy:
```typescript
// Base button props
interface BaseButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

// Button style variants
type ButtonVariant = 'primary' | 'secondary' | 'text' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

// Event handler types
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type ButtonHoverHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

// Complete button props
interface ButtonProps extends BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: ButtonClickHandler;
  onMouseEnter?: ButtonHoverHandler;
  onMouseLeave?: ButtonHoverHandler;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

// Theme-specific button props
interface ThemeButtonProps extends ButtonProps {
  themeVariant?: 'gym' | 'wellness' | 'sports';
  intensity?: 'low' | 'medium' | 'high';
}
```

### Form Field Type System

Create discriminated union for form fields:
```typescript
// Base form field props
interface BaseFormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Text field props
interface TextFieldProps extends BaseFormFieldProps {
  type: 'text';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
}

// Select field props
interface SelectFieldProps extends BaseFormFieldProps {
  type: 'select';
  value: string | string[];
  options: Array<{ value: string; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  multiple?: boolean;
}

// Checkbox field props
interface CheckboxFieldProps extends BaseFormFieldProps {
  type: 'checkbox';
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Discriminated union
type FormFieldProps = TextFieldProps | SelectFieldProps | CheckboxFieldProps;

// Type guard for field types
function isTextField(field: FormFieldProps): field is TextFieldProps {
  return field.type === 'text';
}

function isSelectField(field: FormFieldProps): field is SelectFieldProps {
  return field.type === 'select';
}

function isCheckboxField(field: FormFieldProps): field is CheckboxFieldProps {
  return field.type === 'checkbox';
}
```

## Testing Strategy

1. Unit test all type guards for proper type narrowing
2. Create type utility tests for form validation
3. Test edge cases with null/undefined handling
4. Verify proper event handling in components

## Documentation Requirements

1. Update component prop documentation with JSDoc
2. Create usage examples showing proper typing
3. Document type guard patterns and inheritance structure
4. Add migration guide for existing untyped implementations

## Success Criteria

- Zero `any` types in debug utilities, button components, and form components
- All components pass ESLint without warnings
- Type system enables proper IDE autocompletion and error checking
- Tests verify runtime type validation works correctly
- Documentation provides clear guidance for developers 