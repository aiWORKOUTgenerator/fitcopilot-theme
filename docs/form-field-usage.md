# Form Field Usage Guide

This guide demonstrates how to use the strongly-typed form field components.

## Basic Form Field Usage

### Using FormField Component Directly

```tsx
import { FormField } from '../features/shared/FormField';
import { InputChangeHandler } from '../types/events';

// In a component
const [email, setEmail] = useState('');

const handleEmailChange: InputChangeHandler = (event) => {
  setEmail(event.target.value);
};

return (
  <FormField
    fieldType="text"
    name="email"
    type="email"
    label="Email Address"
    value={email}
    onChange={handleEmailChange}
    required
    helperText="We'll never share your email"
  />
);
```

### Using Specific Field Components

```tsx
import { TextField } from '../features/shared/FormField';
import { InputChangeHandler } from '../types/events';

// In a component
const [password, setPassword] = useState('');

const handlePasswordChange: InputChangeHandler = (event) => {
  setPassword(event.target.value);
};

return (
  <TextField
    fieldType="text"
    name="password"
    type="password"
    label="Password"
    value={password}
    onChange={handlePasswordChange}
    required
    minLength={8}
    helperText="Must be at least 8 characters"
  />
);
```

## Using Form Hook

The `useForm` hook provides a complete form management solution:

```tsx
import { useForm, FormField } from '../features/shared/FormField';
import { required, email, minLength } from '../features/shared/FormField/validation';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const {
    values,
    register,
    handleSubmit,
    isValid,
    isSubmitting,
    error
  } = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validators: {
      email: [required('Email is required'), email()],
      password: [required('Password is required'), minLength(8)]
    },
    onSubmit: async (formValues) => {
      try {
        // Call API to login
        await loginUser(formValues);
      } catch (error) {
        throw new Error('Login failed. Please check your credentials.');
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      
      <FormField
        fieldType="text"
        type="email"
        {...register('email')}
        label="Email Address"
      />
      
      <FormField
        fieldType="text"
        type="password"
        {...register('password')}
        label="Password"
      />
      
      <FormField
        fieldType="checkbox"
        {...register('rememberMe')}
        label="Remember me"
      />
      
      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};
```

## Creating Custom Form Fields

You can create custom form fields that work with our type system:

```tsx
import { BaseFormFieldProps, ValidatorFn } from '../features/shared/FormField/types';
import { useForm } from '../features/shared/FormField';

// Custom field props
interface RatingFieldProps extends BaseFormFieldProps {
  fieldType: 'rating';
  value: number;
  maxRating?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validators?: ValidatorFn<number>[];
}

// Custom rating field
const RatingField: React.FC<RatingFieldProps> = ({
  name,
  value,
  maxRating = 5,
  onChange,
  label,
  error,
  ...rest
}) => {
  // Implementation details...
  
  return (
    <div className="rating-field">
      <label>{label}</label>
      <div className="stars">
        {Array.from({ length: maxRating }).map((_, index) => (
          <Star
            key={index}
            filled={index < value}
            onClick={() => {
              // Create a synthetic event
              const syntheticEvent = {
                target: { name, value: index + 1 },
                currentTarget: { name, value: index + 1 }
              } as React.ChangeEvent<HTMLInputElement>;
              
              onChange(syntheticEvent);
            }}
          />
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

// Using custom field with useForm
const ReviewForm = () => {
  const { values, register, handleSubmit } = useForm({
    initialValues: {
      rating: 0,
      comment: ''
    },
    // ...
  });
  
  // Custom register function for rating
  const registerRating = (fieldName: string) => {
    const field = register(fieldName);
    return {
      ...field,
      fieldType: 'rating' as const,
    };
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <RatingField {...registerRating('rating')} label="Rate this product" />
      <FormField
        fieldType="textarea"
        {...register('comment')}
        label="Your review"
      />
      <button type="submit">Submit Review</button>
    </form>
  );
};
```

## Validation

Our form system includes built-in validators:

```tsx
import { required, email, minLength, maxLength, pattern, numeric } from '../features/shared/FormField/validation';

// Using multiple validators
const validators = {
  username: [
    required('Username is required'),
    minLength(3, 'Username must be at least 3 characters'),
    maxLength(20, 'Username cannot exceed 20 characters'),
    pattern(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
  ],
  email: [
    required('Email is required'),
    email('Please enter a valid email address')
  ],
  age: [
    required('Age is required'),
    numeric('Age must be a number'),
    min(18, 'You must be at least 18 years old')
  ]
};
```

## Benefits of Our Type System

1. **Type Safety**: The discriminated union pattern ensures components receive proper props
2. **Validation**: Built-in, type-safe validators
3. **Form State Management**: Complete form management with proper typing
4. **Consistent Event Handling**: All event handlers use our custom event types
5. **Error Handling**: Structured approach to validation and error display
6. **Accessibility**: Built-in ARIA attributes and proper labeling

By using our form components and hooks, you get a complete, type-safe form solution that integrates with our logging system and follows our architectural patterns. 