# FormField Component System

A flexible, type-safe form field component system with consistent styling, accessibility, and validation.

## Features

- 🧩 **Consistent Field Layout** - All fields share a common wrapper with consistent styling and accessibility
- 🔍 **Type Safety** - Fully typed components with discriminated union pattern for field types
- ♿ **Accessibility** - ARIA attributes, proper labeling, and keyboard navigation support
- 🔄 **Validation** - Built-in validation system with customizable validators
- 🏗️ **Composable** - Components can be used individually or through the main FormField

## Installation

The FormField component system is a fully integrated part of the application and doesn't require additional installation steps.

## Usage

### Basic Usage

```tsx
import { FormField } from '@app/features/shared/FormField';

// Text field
<FormField
  fieldType="text"
  name="firstName"
  label="First Name"
  value={firstName}
  onChange={handleChange}
  type="text"
  required
/>

// Textarea field
<FormField
  fieldType="textarea"
  name="message"
  label="Message"
  value={message}
  onChange={handleChange}
  rows={4}
/>

// Select field
<FormField
  fieldType="select"
  name="country"
  label="Country"
  value={country}
  onChange={handleChange}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' }
  ]}
/>
```

### Direct Component Usage

You can also import and use specific field components directly:

```tsx
import { TextField, SelectField, Checkbox } from 'features/shared/FormField';

// Text field
<TextField
  fieldType="text"
  name="firstName"
  label="First Name"
  value={firstName}
  onChange={handleChange}
  type="text"
  required
/>

// Select field
<SelectField
  fieldType="select"
  name="country"
  label="Country"
  value={country}
  onChange={handleChange}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' }
  ]}
/>

// Checkbox
<Checkbox
  fieldType="checkbox"
  name="subscribe"
  label="Subscribe to newsletter"
  checked={subscribe}
  onChange={handleChange}
/>
```

## Available Components

### TextField

A text input field with various input types.

```tsx
<TextField
  fieldType="text"
  name="username"
  label="Username"
  value={username}
  onChange={handleChange}
  type="text"
  required
  placeholder="Enter your username"
  helperText="Your username must be unique"
/>
```

### TextareaField

A multiline text input field.

```tsx
<TextareaField
  fieldType="textarea"
  name="bio"
  label="Biography"
  value={bio}
  onChange={handleChange}
  rows={4}
  resizable={true}
  maxLength={500}
/>
```

### SelectField

A dropdown selection field.

```tsx
<SelectField
  fieldType="select"
  name="country"
  label="Country"
  value={country}
  onChange={handleChange}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' }
  ]}
  placeholder="Select a country"
/>
```

### Checkbox

A checkbox field.

```tsx
<Checkbox
  fieldType="checkbox"
  name="subscribe"
  label="Subscribe to newsletter"
  checked={subscribe}
  onChange={handleChange}
  labelPosition="right"
/>
```

### RadioGroup

A group of radio buttons.

```tsx
<RadioGroup
  fieldType="radiogroup"
  name="gender"
  label="Gender"
  value={gender}
  onChange={handleChange}
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ]}
  direction="vertical"
/>
```

### Switch

A toggle switch.

```tsx
<Switch
  fieldType="switch"
  name="darkMode"
  label="Dark Mode"
  checked={darkMode}
  onChange={handleChange}
  onLabel="On"
  offLabel="Off"
/>
```

### DateField

A date input field.

```tsx
<DateField
  fieldType="date"
  name="birthDate"
  label="Birth Date"
  value={birthDate}
  onChange={handleChange}
  min="1900-01-01"
  max="2023-12-31"
/>
```

### FileField

A file upload field.

```tsx
<FileField
  fieldType="file"
  name="profilePicture"
  label="Profile Picture"
  onChange={handleFileChange}
  accept="image/*"
  buttonText="Choose Image"
/>
```

## Props Common to All Fields

All form field components accept these common props:

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name, used for form state |
| `label` | `string` | Label text |
| `disabled` | `boolean` | Whether the field is disabled |
| `required` | `boolean` | Whether the field is required |
| `error` | `string` | Error message to display |
| `helperText` | `string` | Helper text to display when no error |
| `className` | `string` | Additional CSS class |
| `id` | `string` | Field ID (defaults to generated ID) |
| `data-testid` | `string` | Test ID for testing |
| `isLoading` | `boolean` | Whether to show loading state |

## Field-Specific Props

Each field type has specific props relevant to its functionality. Refer to the type definitions in `types.ts` for the complete list of props for each field type.

## Validation

The FormField system supports validation through the `validators` prop, which accepts an array of validator functions.

```tsx
import { TextField, validateRequired, validateEmail } from 'features/shared/FormField';

<TextField
  fieldType="text"
  type="email"
  name="email"
  label="Email"
  value={email}
  onChange={handleChange}
  validators={[
    validateRequired('Email is required'),
    validateEmail('Please enter a valid email')
  ]}
/>
```

## Accessibility Features

All FormField components include these accessibility features:

- Proper label association with form controls
- ARIA attributes for error states
- Keyboard navigation support
- Required field indicators
- Error announcements via ARIA live regions

## Migration from Legacy Form Fields

When migrating from legacy form field implementations:

1. Replace direct HTML inputs with FormField components
2. Ensure you're using the correct event handlers (e.g., `InputChangeHandler` instead of generic `React.ChangeEvent`)
3. Add the appropriate `fieldType` discriminator to each component
4. Use the standardized props for error handling and validation

Before:
```tsx
<input 
  type="text"
  name="firstName"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
/>
```

After:
```tsx
<TextField
  fieldType="text"
  type="text"
  name="firstName"
  label="First Name"
  value={firstName}
  onChange={handleTextChange}
/>
```

## Testing

All FormField components come with comprehensive unit tests. When testing forms:

- Use the `data-testid` prop to target specific fields
- Access field values directly through the rendered elements
- Use the `fireEvent` utility from React Testing Library to simulate user interactions 

## Validation System

The FormField system includes a comprehensive validation system with both synchronous and asynchronous validation support.

### Basic Validators

```tsx
import { 
  required,
  minLength,
  maxLength,
  email,
  numeric,
  pattern 
} from '@app/features/shared/FormField/validators';

<FormField
  fieldType="text"
  name="email"
  label="Email Address"
  value={email}
  onChange={handleChange}
  validators={[
    required('Email is required'),
    email('Please enter a valid email address')
  ]}
/>
```

### Cross-Field Validation

The validation system supports cross-field validation for scenarios like password confirmation:

```tsx
import { required, minLength, fieldsMatch } from '@app/features/shared/FormField/validators';

<FormField
  fieldType="text"
  type="password"
  name="password"
  label="Password"
  value={password}
  onChange={handlePasswordChange}
  validators={[
    required('Password is required'),
    minLength(8, 'Password must be at least 8 characters')
  ]}
/>

<FormField
  fieldType="text"
  type="password"
  name="confirmPassword"
  label="Confirm Password"
  value={confirmPassword}
  onChange={handleConfirmPasswordChange}
  validators={[
    required('Please confirm your password'),
    fieldsMatch('password', 'Passwords must match')
  ]}
/>
```

### Async Validation

For scenarios where validation requires server-side checks (like checking if a username is available):

```tsx
import { required, validateAsync } from '@app/features/shared/FormField/validators';

const checkUsernameAvailability = async (username: string) => {
  try {
    const response = await fetch(`/api/check-username?username=${username}`);
    const data = await response.json();
    return data.available ? null : 'Username is already taken';
  } catch (error) {
    return 'Error checking username availability';
  }
};

<FormField
  fieldType="text"
  name="username"
  label="Username"
  value={username}
  onChange={handleChange}
  validators={[
    required('Username is required'),
    validateAsync(checkUsernameAvailability, 'Checking availability...')
  ]}
/>
```

### Conditional Validation

Apply validation only when certain conditions are met:

```tsx
import { required, validateIf } from '@app/features/shared/FormField/validators';

<FormField
  fieldType="text"
  name="companyName"
  label="Company Name"
  value={companyName}
  onChange={handleChange}
  validators={[
    validateIf(
      // Only require company name if user is a business
      (_, allValues) => allValues?.userType === 'business',
      required('Company name is required for business accounts')
    )
  ]}
/>
```

### Composed Validators

Combine multiple validators into a single function:

```tsx
import { required, minLength, pattern, composeValidators } from '@app/features/shared/FormField/validators';

const passwordValidator = composeValidators([
  required('Password is required'),
  minLength(8, 'Password must be at least 8 characters'),
  pattern(/[A-Z]/, 'Password must contain at least one uppercase letter'),
  pattern(/[0-9]/, 'Password must contain at least one number')
]);

<FormField
  fieldType="text"
  type="password"
  name="password"
  label="Password"
  value={password}
  onChange={handleChange}
  validators={[passwordValidator]}
/>
```

## Form Context

The FormField system includes a form context for centralized form state management:

```tsx
import { FormProvider, useFormField } from '@app/features/shared/FormField';

const LoginForm = () => {
  const handleSubmit = (values) => {
    // Handle form submission
    console.log('Form values:', values);
  };
  
  return (
    <FormProvider onSubmit={handleSubmit} validateOnSubmit>
      <LoginFormFields />
      <button type="submit">Log In</button>
    </FormProvider>
  );
};

const LoginFormFields = () => {
  const emailField = useFormField('email', {
    validators: [required('Email is required'), email()]
  });
  
  const passwordField = useFormField('password', {
    validators: [required('Password is required')]
  });
  
  return (
    <>
      <FormField
        fieldType="text"
        type="email"
        label="Email Address"
        {...emailField}
      />
      
      <FormField
        fieldType="text"
        type="password"
        label="Password"
        {...passwordField}
      />
    </>
  );
};
```

## Accessibility

All FormField components are built with accessibility in mind:

- Proper label associations with `for` attributes
- ARIA attributes for validation states
- Keyboard navigation support
- Focus management
- Screen reader announcements for validation errors
- High contrast mode support

## Performance Optimization

The FormField components are optimized for performance:

- React.memo for all field components
- useCallback for all event handlers
- Proper dependency arrays for hooks
- Minimal re-renders

## Browser Support

The FormField system supports all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- IE11 with polyfills (limited support)

## Contributing

To contribute to the FormField system, please follow these guidelines:

1. Follow the existing pattern for new field types
2. Include comprehensive tests
3. Ensure accessibility compliance
4. Optimize for performance
5. Document any new features

## License

The FormField component system is part of the application and is subject to the same license terms. 