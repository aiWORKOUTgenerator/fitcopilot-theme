# HeroLogo Component

A reusable, responsive and accessible logo component for hero sections with support for multiple themes and fallback handling.

## Features

- **Responsive Design**: Automatically resizes based on screen size
- **Theme Variants**: Supports multiple design themes (default, sports, gym, wellness, mobile)
- **Fallback Support**: Gracefully handles image loading failures
- **Accessibility**: Proper alt text and ARIA attributes
- **Customization**: Configurable through props or a logoConfig object

## Usage

### Basic Usage

```tsx
import { HeroLogo } from './components/HeroLogo';

<HeroLogo 
  logoUrl="/path/to/logo.png" 
  altText="Company Logo" 
/>
```

### With Configuration Object

```tsx
import { HeroLogo } from './components/HeroLogo';

<HeroLogo 
  logoConfig={{
    url: "/path/to/logo.png",
    alt: "Company Logo",
    width: 200,
    maxWidth: "80%",
    className: "custom-logo-class"
  }}
  currentTheme="sports"
/>
```

### With Fallback

```tsx
<HeroLogo 
  logoUrl="/path/to/logo.png" 
  altText="Company Logo"
  showFallback={true}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `logoConfig` | `LogoConfig` | Configuration object for the logo |
| `logoUrl` | `string` | Direct URL to the logo image |
| `altText` | `string` | Alternative text for the logo |
| `currentTheme` | `string` | Theme variant (default, sports, gym, wellness, mobile) |
| `showFallback` | `boolean` | Whether to show fallback when image fails to load |
| `onClick` | `() => void` | Optional click handler |

The `LogoConfig` interface:

```tsx
interface LogoConfig {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  maxWidth?: string;
  className?: string;
}
```

## Accessibility

- Uses semantic HTML with proper alt text
- Supports reduced motion preferences
- Fallback text is properly styled and presented

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 supported with appropriate polyfills

## Dependencies

- React
- TypeScript
- SCSS for styling 

# Hero Components

This directory contains specialized components for the Homepage Hero section.

## Components

### HeroButton

The `HeroButton` component extends the shared Button component with hero-specific styling and theme integration.

```tsx
import { HeroButton } from '@features/Homepage/Hero/components';

<HeroButton 
  variant="primary" 
  leftIcon={<ArrowIcon />}
  size="large"
>
  Get Started
</HeroButton>
```

#### Features:
- Theme-aware styling with support for gym, sports, and wellness themes
- Icon positioning (left/right)
- Size variants (small, medium, large)
- Full width option
- ButtonGroup compatibility through .btn class

### ButtonGroup Integration

HeroButton is designed to work seamlessly with ButtonGroup:

```tsx
import { ButtonGroup } from '@features/shared/Button';
import { HeroButton } from '@features/Homepage/Hero/components';

<ButtonGroup direction="horizontal" spacing="medium" alignment="center">
  <HeroButton variant="primary">Primary</HeroButton>
  <HeroButton variant="secondary">Secondary</HeroButton>
</ButtonGroup>
```

HeroButton uses the standard .btn class to ensure proper spacing and layout within ButtonGroup.

### ThemeButtonTest

Utility component for testing button appearance across different themes.

```tsx
import { ThemeButtonTest } from '@features/Homepage/Hero/components';

<ThemeButtonTest />
```

This component demonstrates:
- Theme switching
- Button variants
- HeroButton variants
- Size variants
- ButtonGroup integration

## Theming

Hero components support theming through the data-theme attribute:

```html
<div data-theme="gym">
  <HeroButton variant="primary">Gym Theme</HeroButton>
</div>
```

### Available Themes:
- default (no theme attribute)
- gym
- sports
- wellness 