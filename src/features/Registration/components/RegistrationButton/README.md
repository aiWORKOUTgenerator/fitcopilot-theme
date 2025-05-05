# RegistrationButton Component

A customizable button component for the Registration feature with support for various states and styles.

## Usage

```tsx
import RegistrationButton from '../components/RegistrationButton';
import { ArrowRight } from 'lucide-react';

// Basic usage
<RegistrationButton onClick={handleClick}>
  Click Me
</RegistrationButton>

// With loading state
<RegistrationButton isLoading>
  Save Changes
</RegistrationButton>

// With icon
<RegistrationButton rightIcon={<ArrowRight />}>
  Continue
</RegistrationButton>

// Different variants
<RegistrationButton variant="secondary">
  Cancel
</RegistrationButton>

// Different sizes
<RegistrationButton size="small">
  Small Button
</RegistrationButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Button content |
| onClick | function | - | Click handler |
| type | 'button' \| 'submit' \| 'reset' | 'button' | Button type attribute |
| variant | 'primary' \| 'secondary' \| 'tertiary' | 'primary' | Button style variant |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Button size |
| isLoading | boolean | false | Whether button is in loading state |
| disabled | boolean | false | Whether button is disabled |
| rightIcon | ReactNode | - | Icon to display after text |
| leftIcon | ReactNode | - | Icon to display before text |
| className | string | - | Additional class names |
| fullWidth | boolean | false | Whether button takes full width |

## Design Decisions

This component was extracted from the Splash page's CTA button to standardize button styling and behavior across the Registration feature. It follows these architectural principles:

1. **Single Responsibility**: Focuses solely on button presentation and states
2. **Open/Closed**: Extendable through props rather than modifying implementation
3. **Feature-Specific**: Scoped to the Registration feature flow
4. **Composable**: Can be combined with other components while maintaining consistent styling

## Accessibility

The component includes:
- Proper focus states
- Disabled attribute management
- Icon + text combinations for better comprehension
- Loading state indication 