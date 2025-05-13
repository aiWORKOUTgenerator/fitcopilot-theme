# ESLint Warning Remediation Patterns

This document outlines the patterns implemented during our ESLint remediation effort. These patterns provide consistent approaches to fixing common warning types, making future development more maintainable and type-safe.

## Type Safety Patterns

### Button Component Pattern

The Button component pattern uses a discriminated union to handle different button variants:

**Before:**
```typescript
// Using 'any' in component props
interface ButtonProps {
  variant?: string;
  onClick?: any;
  href?: string;
  children: any;
}

function Button(props: ButtonProps) {
  if (props.href) {
    return <a href={props.href}>{props.children}</a>;
  }
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

**After:**
```typescript
// Using discriminated union pattern
interface BaseButtonProps {
  variant?: VariantKey;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ActionButtonProps extends BaseButtonProps {
  onClick: ButtonClickHandler;
  type?: 'button' | 'submit' | 'reset';
  href?: never; // Discriminator property
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: never; // Discriminator property
  type?: never; // Discriminator property
}

type ButtonProps = ActionButtonProps | LinkButtonProps;

// Type guard
const isLinkButton = (props: ButtonProps): props is LinkButtonProps => {
  return 'href' in props && typeof props.href === 'string';
};

// Component implementation
function Button(props: ButtonProps) {
  if (isLinkButton(props)) {
    return <a href={props.href} target={props.target}>{props.children}</a>;
  }
  return <button onClick={props.onClick} type={props.type || 'button'}>{props.children}</button>;
}
```

### Form Field Pattern

Form fields use a similar discriminated union pattern:

**Before:**
```typescript
// Loose typing with any
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value?: any;
  checked?: boolean;
  onChange: any;
}

function FormField(props: FormFieldProps) {
  if (props.type === 'checkbox') {
    return <input type="checkbox" checked={props.checked} onChange={props.onChange} />;
  }
  return <input type={props.type || 'text'} value={props.value} onChange={props.onChange} />;
}
```

**After:**
```typescript
// Strongly typed with discriminated unions
interface BaseFormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

interface TextFieldProps extends BaseFormFieldProps {
  type: 'text' | 'email' | 'password';
  value: string;
  placeholder?: string;
  onChange: TextFieldChangeHandler;
  options?: never; // Discriminator
  checked?: never; // Discriminator
}

interface CheckboxFieldProps extends BaseFormFieldProps {
  checked: boolean;
  onChange: CheckboxChangeHandler;
  type?: never; // Discriminator
  value?: never; // Discriminator
  placeholder?: never; // Discriminator
}

type FormFieldProps = TextFieldProps | CheckboxFieldProps;

// Type guards
const isTextField = (props: FormFieldProps): props is TextFieldProps => {
  return 'type' in props && typeof props.type === 'string';
};

const isCheckboxField = (props: FormFieldProps): props is CheckboxFieldProps => {
  return 'checked' in props && typeof props.checked === 'boolean';
};

// Component implementation
function FormField(props: FormFieldProps) {
  if (isCheckboxField(props)) {
    return <input type="checkbox" checked={props.checked} onChange={props.onChange} />;
  }
  return <input type={props.type} value={props.value} onChange={props.onChange} />;
}
```

## Event Handler Patterns

### Typed Event Handlers

**Before:**
```typescript
// Untyped event handlers
function Button({ onClick }) {
  const handleClick = (event) => {
    console.log('Button clicked');
    onClick(event);
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

**After:**
```typescript
// Using typed event handlers
import { createClickHandler } from '../../utils/events';
import logger from '../../utils/logger';

function Button({ onClick }: { onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }) {
  const handleClick = createClickHandler(onClick, { component: 'Button' });
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### Event Handler Composition

**Before:**
```typescript
// Multiple untyped handlers
function Form({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
    onSubmit(event);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**After:**
```typescript
// Using handler composition
import { composeHandlers, preventDefault, createSubmitHandler } from '../../utils/events';
import logger from '../../utils/logger';

function Form({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const logSubmit = createSubmitHandler(
    (event) => {
      logger.info('Form submitted', { formId: 'example-form' });
      onSubmit(event);
    },
    { component: 'Form' }
  );
  
  const handleSubmit = composeHandlers(preventDefault, logSubmit);
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Logger Implementation Pattern

### Structured Logging

**Before:**
```typescript
// Console logging
function handleClick() {
  console.log('Button clicked');
  if (error) {
    console.error('Error:', error);
  }
}
```

**After:**
```typescript
// Structured logging with context
import logger from '../../utils/logger';

function handleClick() {
  logger.info('Button clicked', { component: 'Button', id: 'submit-button' });
  if (error) {
    logger.error('Error processing click', { 
      component: 'Button', 
      error: error.message,
      code: error.code
    });
  }
}
```

### Logged Event Handlers

**Before:**
```typescript
// Mixed logging and handling
function TextField({ onChange, id }) {
  const handleChange = (e) => {
    console.log('Text changed:', e.target.value);
    onChange(e);
  };
  
  return <input id={id} onChange={handleChange} />;
}
```

**After:**
```typescript
// Using typed logged handler
import { createChangeHandler } from '../../utils/events';

function TextField({ 
  onChange, 
  id 
}: { 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  id: string
}) {
  const handleChange = createChangeHandler(onChange, { 
    component: 'TextField',
    fieldId: id
  });
  
  return <input id={id} onChange={handleChange} />;
}
```

## Unused Variables Pattern

### Underscore Prefix

**Before:**
```typescript
// Unused variables
function Component({ propA, propB, propC }) {
  // Only using propA
  return <div>{propA}</div>;
}

try {
  await submitData();
} catch (error) {
  // Error not used
  displayError("Failed to submit");
}
```

**After:**
```typescript
// With underscore prefix
function Component({ propA, _propB, _propC }) {
  // Underscore indicates intentionally unused
  return <div>{propA}</div>;
}

try {
  await submitData();
} catch (_error) {
  // Underscore indicates intentionally unused
  displayError("Failed to submit");
}
```

## Applying These Patterns

To systematically implement these patterns:

1. **Type Definitions First**
   - Create type definitions in a dedicated `types` folder
   - Define base interfaces, specialized variants, and type guards
   - Document all interfaces with JSDoc comments

2. **Component Implementation**
   - Import and use the type definitions
   - Implement type guards for conditional rendering
   - Replace any event handlers with typed versions

3. **Logger Integration**
   - Import the logger utility
   - Replace console statements with structured logger calls
   - Add meaningful context to logger calls

4. **Automated Fixes**
   - Run the prefix-unused-vars.js script for quick fixes
   - Run the replace-console-with-logger.js script for logger conversion
   - Generate progress reports to track improvements

## Testing Patterns

When implementing these patterns, it's important to add appropriate tests:

```typescript
// Test for Button component type guards
describe('Button type guards', () => {
  test('isLinkButton correctly identifies link buttons', () => {
    const linkProps: ButtonProps = { href: 'https://example.com', children: 'Link' };
    const actionProps: ButtonProps = { onClick: jest.fn(), children: 'Button' };
    
    expect(isLinkButton(linkProps)).toBe(true);
    expect(isLinkButton(actionProps)).toBe(false);
  });
});
```

By following these patterns consistently, we can eliminate ESLint warnings while also improving the overall type safety and maintainability of our codebase. 