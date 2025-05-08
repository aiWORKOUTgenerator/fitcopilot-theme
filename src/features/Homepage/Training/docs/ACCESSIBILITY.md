# Training Component Accessibility Guidelines

This document outlines the accessibility features implemented in the Training component to ensure compliance with WCAG 2.1 AA standards.

## Implemented Features

### 1. ARIA Attributes

The Training component implements proper ARIA attributes to ensure screen reader compatibility:

- `aria-labelledby`: Associates content with their labels
- `aria-expanded`: Indicates expandable/collapsible states
- `aria-controls`: Associates controls with the content they manage
- `aria-hidden`: Hides decorative elements from screen readers
- `role` attributes: Defines semantic roles for elements

Example implementation:

```tsx
<div 
  role="button"
  aria-expanded={isActive} 
  aria-controls={contentId}
  tabIndex={0}
>
  {/* Content */}
</div>

<div 
  id={contentId} 
  aria-labelledby={titleId}
>
  {/* Expanded content */}
</div>
```

### 2. Keyboard Navigation

All interactive elements are accessible via keyboard:

- `tabIndex={0}`: Makes non-interactive elements focusable
- `onKeyDown`: Handles keyboard events for Enter and Space
- Proper focus management for expanded content
- Focus indicators for all interactive elements

The component uses the `createKeyboardHandler` utility to standardize keyboard event handling.

### 3. Reduced Motion

The component respects the user's motion preferences:

- Uses the `prefers-reduced-motion` media query in CSS
- Implements the `useReducedMotion` React hook to detect preferences
- Provides non-animated alternatives for all animations
- Maintains visual feedback without motion where appropriate

```scss
@media (prefers-reduced-motion: reduce) {
  .training-card {
    transition-property: border-color, box-shadow;
    
    &:hover {
      transform: none;
    }
  }
}
```

### 4. Focus Management

The component includes enhanced focus styles:

- High contrast focus indicators
- Focus visible styles that adapt to theme variants
- Properly sized focus outlines (2px thickness with offset)
- Focus states for all interactive elements

## Testing Checklist

Use this checklist when testing the component for accessibility:

- [ ] Verify all interactive elements can be accessed via keyboard Tab navigation
- [ ] Test Enter and Space keys to activate interactive elements
- [ ] Confirm screen readers announce proper content and state changes
- [ ] Ensure all animations are disabled when reduced motion is preferred
- [ ] Validate focus is visually apparent on all interactive elements
- [ ] Confirm proper heading structure and semantic HTML

## Screen Reader Testing

The component has been tested with:

- VoiceOver on macOS/iOS
- NVDA on Windows
- TalkBack on Android

## Additional Resources

- [WCAG 2.1 Checklist](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Keyboard Accessibility Guide](https://webaim.org/techniques/keyboard/)

## Implementation Details

### ARIA IDs System

The component uses a structured ARIA ID system to create relationships between elements:

```typescript
const ariaIds = generateProgramAriaIds(index, programType);
// Results in:
// {
//   cardId: 'program-0-strength-card',
//   titleId: 'program-0-strength-title',
//   contentId: 'program-0-strength-content',
//   benefitsId: 'program-0-strength-benefits'
// }
```

These IDs are used to connect related elements using `aria-labelledby` and `aria-controls` relationships.

### Reduced Motion Hook Usage

```tsx
import { useReducedMotion } from '../../hooks/useReducedMotion';

const YourComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={prefersReducedMotion ? 'reduced-motion' : ''}>
      {/* Component content */}
    </div>
  );
};
```

By following these guidelines, the Training component ensures an accessible experience for all users, including those using assistive technologies or with motion sensitivities. 