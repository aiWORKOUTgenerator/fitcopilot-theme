# Form Component Type System

This document outlines the type system for form components in the FitCopilot theme, providing a consistent pattern for type-safe form implementations.

## Core Type Pattern

Form components use a discriminated union pattern with the following structure:

1. **Base Props Interface**: Common properties for all form fields
2. **Variant Interfaces**: Extended interfaces for specific field types
3. **Union Type**: Combined type representing all possible variants
4. **Type Guards**: Functions to safely check component variants

## Type Hierarchy

```
BaseFormFieldProps
  ├── TextFieldProps (fieldType: 'text')
  ├── TextAreaFieldProps (fieldType: 'textarea')
  ├── SelectFieldProps (fieldType: 'select')
  ├── CheckboxFieldProps (fieldType: 'checkbox')
  ├── RadioFieldProps (fieldType: 'radio')
  ├── RadioGroupFieldProps (fieldType: 'radiogroup')
  ├── SwitchFieldProps (fieldType: 'switch')
  ├── DateFieldProps (fieldType: 'date')
  └── FileFieldProps (fieldType: 'file')
```

These types are combined into the `FormFieldProps` discriminated union:

```typescript
export type FormFieldProps =
  | TextFieldProps
  | TextAreaFieldProps
  | SelectFieldProps
  | CheckboxFieldProps
  | RadioFieldProps
  | RadioGroupFieldProps
  | SwitchFieldProps
  | DateFieldProps
  | FileFieldProps;
```

## Type Guards

Type guards are centralized in `src/utils/formTypeGuards.ts` and provide type-safe narrowing:

```typescript
export function isTextField(props: FormFieldProps): props is TextFieldProps {
  return props.fieldType === 'text';
}

// Additional guards for each field type...
```

## Form Component Implementation

The `FormField` component acts as a discriminated union switcher, using type guards to render the appropriate component:

```typescript
export const FormField: React.FC<FormFieldProps> = (props) => {
  if (isTextField(props)) {
    return <TextField {...props} />;
  }
  
  if (isTextAreaField(props)) {
    return <TextArea {...props} />;
  }
  
  // Additional type checks...
};
```

## Usage Examples

### Basic Form Field

```tsx
import { FormField } from 'features/shared/FormField';
import { TextFieldProps } from 'types/form';

const MyComponent: React.FC = () => {
  const textFieldProps: TextFieldProps = {
    fieldType: 'text',
    name: 'username',
    label: 'Username',
    value: '',
    onChange: (e) => console.log(e.currentTarget.value),
    required: true
  };

  return <FormField {...textFieldProps} />;
};
```

### Conditional Field Rendering

```tsx
import { FormFieldProps } from 'types/form';
import { isTextField, isSelectField } from 'utils/formTypeGuards';

const FormRenderer: React.FC<{ field: FormFieldProps }> = ({ field }) => {
  // Type-safe handling based on field type
  if (isTextField(field)) {
    return (
      <div>
        Text Field: {field.type} {field.value}
      </div>
    );
  }
  
  if (isSelectField(field)) {
    return (
      <div>
        Select Field with {field.options.length} options
      </div>
    );
  }
  
  // Handle other types...
};
```

### Field State Guards

In addition to type guards for field variants, utility guards are available for checking field states:

```tsx
import { FormFieldProps } from 'types/form';
import { hasError, isRequiredField, isDisabledField } from 'utils/formTypeGuards';

const FieldStatus: React.FC<{ field: FormFieldProps }> = ({ field }) => {
  return (
    <div className="field-status">
      {hasError(field) && <div className="error-icon">{field.error}</div>}
      {isRequiredField(field) && <span className="required-indicator">*</span>}
      {isDisabledField(field) && <span className="disabled-overlay" />}
    </div>
  );
};
```

## Benefits

This type system provides several advantages:

1. **Type Safety**: Ensures that component props are properly typed and validated
2. **Intellisense Support**: Provides code completion based on the specific field type
3. **Runtime Type Checking**: Guards work at runtime to ensure correct component rendering
4. **Consistency**: Establishes a uniform pattern for all form components
5. **Maintainability**: Centralizes form field type definitions and validations

## Form Types Organization

Form-related types are organized in:

- `src/types/form.ts`: Centralized type definitions for all form components
- `src/utils/formTypeGuards.ts`: Type guard functions for safe type narrowing
- `src/utils/__tests__/formTypeGuards.test.ts`: Tests for type guards 