# Form Integration with Button Components

## Overview

This document details how to integrate button components with forms in the FitCopilot theme, with a focus on handling loading states, error states, and using different button types within the same form.

## Button States in Forms

### Loading State

When a form is being submitted, buttons should reflect this state to prevent multiple submissions and provide feedback to the user.

```tsx
import { useFormContext } from '../../shared/FormField/FormContext';

const SubmitButton = () => {
  const { isSubmitting } = useFormContext();
  
  return (
    <Button 
      type="submit" 
      variant="primary" 
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  );
};
```

With HeroButton:

```tsx
<HeroButton 
  type="submit" 
  variant="primary" 
  disabled={isSubmitting}
  leftIcon={isSubmitting ? <Spinner size="small" /> : null}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</HeroButton>
```

### Error State

Buttons can also reflect error states in forms:

```tsx
const SubmitButton = () => {
  const { isValid, errors } = useFormContext();
  const hasErrors = !isValid && Object.keys(errors).length > 0;
  
  return (
    <Button 
      type="submit" 
      variant={hasErrors ? 'error' : 'primary'}
      disabled={!isValid}
    >
      Submit
    </Button>
  );
};
```

## Form Submission with Different Button Types

### Basic Form Layout

A typical form might include multiple button types for different actions:

```tsx
import { FormProvider } from '../../shared/FormField/FormContext';
import { Button } from '../../shared/Button';
import { HeroButton } from '../Hero/components/HeroButton';

const MyForm = () => {
  const handleSubmit = (values) => {
    // Submit form data
  };
  
  return (
    <FormProvider onSubmit={handleSubmit}>
      <form>
        {/* Form fields */}
        <ButtonGroup 
          direction="horizontal"
          responsiveStacking
          spacing="medium"
        >
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <HeroButton 
            type="submit" 
            variant="primary"
          >
            Submit
          </HeroButton>
        </ButtonGroup>
      </form>
    </FormProvider>
  );
};
```

### Multi-Step Forms

For multi-step forms, you might use different button combinations:

```tsx
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const { isSubmitting, isValid } = useFormContext();
  
  return (
    <form>
      {/* Step content here */}
      
      <ButtonGroup direction="horizontal" responsiveStacking>
        {step > 1 && (
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        )}
        
        {step < totalSteps ? (
          <Button 
            type="button" 
            variant="primary"
            onClick={() => setStep(step + 1)}
            disabled={!isValid}
          >
            Continue
          </Button>
        ) : (
          <HeroButton 
            type="submit" 
            variant="primary"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </HeroButton>
        )}
      </ButtonGroup>
    </form>
  );
};
```

## Async Form Submission Pattern

When handling asynchronous form submissions, use this pattern:

```tsx
const MyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Form submission logic
      await submitFormData();
      // Handle success
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      {submitError && (
        <div className="form-error">{submitError}</div>
      )}
      
      <ButtonGroup>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </ButtonGroup>
    </form>
  );
};
```

## Integration with FormContext

The FormContext provides a range of useful form state properties:

```tsx
const FormControls = () => {
  const { 
    isSubmitting, 
    isValid, 
    isDirty, 
    errors, 
    reset, 
    validate 
  } = useFormContext();
  
  return (
    <ButtonGroup spacing="medium">
      <Button 
        type="button" 
        variant="secondary"
        onClick={reset}
        disabled={isSubmitting || !isDirty}
      >
        Reset
      </Button>
      
      <Button 
        type="button" 
        variant="secondary"
        onClick={validate}
        disabled={isSubmitting}
      >
        Validate
      </Button>
      
      <HeroButton 
        type="submit" 
        variant="primary"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </HeroButton>
    </ButtonGroup>
  );
};
```

## Mobile Responsiveness

Forms with buttons should be responsive on mobile devices:

```tsx
<ButtonGroup 
  direction="horizontal" 
  responsiveStacking 
  spacing="medium"
  alignment="center"
>
  <Button variant="secondary">Cancel</Button>
  <HeroButton variant="primary">Submit</HeroButton>
</ButtonGroup>
```

On mobile devices (< 768px), this will stack the buttons vertically.

## Accessibility Considerations

When integrating buttons in forms, ensure:

1. **Proper button types**: Use `type="submit"` for submission, `type="button"` for other actions
2. **Keyboard accessibility**: All buttons must be keyboard navigable
3. **Focus management**: Focus should move to error messages when validation fails
4. **Disabled state**: Use `aria-disabled` along with disabled to ensure proper screen reader communication

```tsx
<Button 
  type="submit" 
  disabled={isSubmitting}
  aria-disabled={isSubmitting}
>
  Submit
</Button>
```

## Best Practices

1. **Form submission pattern**:
   - Always disable the submit button during submission
   - Show loading states clearly
   - Handle errors gracefully

2. **Button hierarchy**:
   - Primary action: Use `HeroButton` or `Button` with `primary` variant
   - Secondary actions: Use `Button` with `secondary` variant
   - Destructive actions: Use `Button` with `danger` variant

3. **Form layout**:
   - Place primary action last in left-to-right layouts
   - Stack buttons vertically on mobile
   - Use consistent spacing

4. **Error states**:
   - Show clear error messages
   - Focus on errors using `aria-live` regions
   - Disable submission on critical errors

## Complete Example

```tsx
import React, { useState } from 'react';
import { Button } from '../../shared/Button';
import { HeroButton } from '../Hero/components/HeroButton';
import { ButtonGroup } from '../../shared/Button/components/ButtonGroup';
import { FormProvider, useFormContext } from '../../shared/FormField/FormContext';
import { TextField } from '../../shared/FormField/fields/TextField';

const ContactForm = () => {
  const handleSubmit = async (values) => {
    // API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', values);
  };
  
  const handleError = (errors) => {
    console.error('Form has errors:', errors);
  };
  
  return (
    <FormProvider onSubmit={handleSubmit} onError={handleError}>
      <form className="contact-form">
        <TextField 
          name="name" 
          label="Name" 
          validators={[{ required: true }]}
        />
        
        <TextField 
          name="email" 
          label="Email" 
          validators={[{ required: true, email: true }]}
        />
        
        <FormControls />
      </form>
    </FormProvider>
  );
};

const FormControls = () => {
  const { isSubmitting, isValid, reset } = useFormContext();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  return (
    <div className="form-controls">
      {showConfirmReset ? (
        <ButtonGroup 
          direction="horizontal" 
          responsiveStacking 
          spacing="small"
        >
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => setShowConfirmReset(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="danger"
            onClick={() => {
              reset();
              setShowConfirmReset(false);
            }}
          >
            Confirm Reset
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup 
          direction="horizontal" 
          responsiveStacking 
          spacing="medium"
        >
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => setShowConfirmReset(true)}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <HeroButton 
            type="submit" 
            variant="primary"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </HeroButton>
        </ButtonGroup>
      )}
    </div>
  );
};

export default ContactForm;
```

This pattern provides a complete form with proper button integration, loading states, validation, and a reset confirmation flow. 