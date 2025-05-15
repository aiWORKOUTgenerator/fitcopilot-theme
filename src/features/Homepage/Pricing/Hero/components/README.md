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