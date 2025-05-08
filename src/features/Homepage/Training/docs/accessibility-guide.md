# Accessibility Implementation Guide

## Overview

Accessibility is a core principle of the FitCopilot theme. This guide outlines the implementation details, utilities, and best practices to ensure our components are accessible to all users, regardless of abilities or assistive technologies used.

## Core Accessibility Features

The Training component section implements these accessibility features:

1. **Keyboard Navigation**: All interactive elements are navigable using a keyboard
2. **Screen Reader Support**: Semantic HTML and ARIA attributes for assistive technologies
3. **Reduced Motion**: Alternative animations for users who prefer reduced motion
4. **Focus Management**: Clear visual indicators for focused elements
5. **Color Contrast**: Text meets WCAG AA contrast requirements (4.5:1 for normal text)
6. **Responsive Design**: Accessible on all device sizes and orientations

## Accessibility Utilities

### `accessibilityHelpers.ts`

This file provides the core utilities for implementing accessibility:

#### ARIA ID Generation

```typescript
// Create a unique ID for ARIA attributes
const cardId = createAriaId('program', 'strength-building');
// Result: "program-strength-building"

// Generate complete set of IDs for a program
const ariaIds = generateProgramAriaIds(0, 'strength');
// Result: { cardId, titleId, contentId, benefitsId, ... }
```

#### Keyboard Interaction

```typescript
// Handle keyboard events (Enter and Space)
const handleKeyDown = createKeyboardHandler(() => toggleDetails());

// Usage in component
<div onKeyDown={handleKeyDown} tabIndex={0}>
```

#### ARIA Properties

```typescript
// Generate ARIA attributes for interactive elements
const ariaProps = createAriaProps({
  isInteractive: true,
  isExpanded: isOpen,
  controlsId: 'content-section',
  labelledById: 'title-element'
});

// Apply to component
<div {...ariaProps}>
```

#### Focus Management

```typescript
// Manage focus when expanding/collapsing sections
const contentRef = useRef<HTMLDivElement>(null);
manageFocus(isExpanded, contentRef);

// Usage in component
<div ref={contentRef}>
```

#### Live Regions

```typescript
// Create live region for dynamic content
const liveProps = createLiveRegionProps(true, 'polite', true);

// Apply to component
<div {...liveProps}>Content that updates</div>
```

#### List Accessibility

```typescript
// Create accessible list
const listProps = createListProps(programs.length, 'Training Programs');

// Create list item props
const itemProps = createListItemProps(index, programs.length);

// Usage
<ul {...listProps}>
  <li {...itemProps}>Program 1</li>
</ul>
```

#### Screen Reader Announcements

```typescript
// Announce changes to screen readers
{isLoading && screenReaderAnnouncement('Loading programs...', 'polite')}
```

## Reduced Motion Support

### `useReducedMotion` Hook

This custom hook detects the user's preference for reduced motion:

```typescript
// In component
const prefersReducedMotion = useReducedMotion();

// Apply conditional styling
<div className={prefersReducedMotion ? 'reduced-motion' : ''}>
```

### CSS Implementation

```scss
// Base animation
.card {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

// Reduced motion alternative
@media (prefers-reduced-motion: reduce) {
  .card, .card:hover {
    transition: none;
    transform: none;
  }
}

// Class-based override (for JS detection)
.reduced-motion {
  .card, .card:hover {
    transition: none;
    transform: none;
  }
}
```

## Implementation Examples

### Accessible Toggle Button

```tsx
function ProgramCard({ program, isActive, onToggle, ariaIds }) {
  const handleKeyDown = createKeyboardHandler(onToggle);
  
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-controls={ariaIds.contentId}
      id={ariaIds.cardId}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
    >
      <h3 id={ariaIds.titleId}>{program.title}</h3>
      <p id={ariaIds.descriptionId}>{program.description}</p>
    </div>
  );
}
```

### Accessible Expandable Content

```tsx
function ExpandedContent({ program, isVisible, ariaIds }) {
  const contentRef = useRef(null);
  
  // Focus management
  useEffect(() => {
    if (isVisible) {
      manageFocus(isVisible, contentRef);
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div
      ref={contentRef}
      id={ariaIds.contentId}
      aria-labelledby={ariaIds.titleId}
      tabIndex={-1} // Focusable but not in tab order
    >
      <h4 id={`${ariaIds.benefitsId}-heading`}>Benefits</h4>
      <ul
        id={ariaIds.benefitsId}
        aria-labelledby={`${ariaIds.benefitsId}-heading`}
      >
        {program.benefits.map((benefit, i) => (
          <li key={i}>{benefit}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Testing Accessibility

All Training components should be tested for:

1. **Keyboard Navigation**: Test tab order, focus trapping, and keyboard interactions
2. **Screen Reader Testing**: Test with VoiceOver (Mac), NVDA or JAWS (Windows)
3. **Reduced Motion**: Test with `prefers-reduced-motion` media query emulation
4. **Contrast Checking**: Verify with tools like axe DevTools or WAVE
5. **Responsive Testing**: Test across device sizes and orientations
6. **Zoom Testing**: Test with browser zoom at 200%

## WCAG Compliance Checklist

Training components should meet these WCAG 2.1 AA criteria:

- [ ] 1.3.1 Info and Relationships: Semantic HTML and ARIA
- [ ] 1.3.2 Meaningful Sequence: Logical reading order
- [ ] 1.4.3 Contrast: Text has sufficient contrast (4.5:1)
- [ ] 1.4.4 Resize Text: Works when zoomed to 200%
- [ ] 1.4.10 Reflow: No horizontal scrolling at 320px width
- [ ] 1.4.11 Non-text Contrast: UI elements have sufficient contrast
- [ ] 2.1.1 Keyboard: All functionality available via keyboard
- [ ] 2.4.3 Focus Order: Focus moves in a logical sequence
- [ ] 2.4.7 Focus Visible: Keyboard focus is visually apparent
- [ ] 2.5.3 Label in Name: Visual labels match accessible names
- [ ] 3.2.4 Consistent Identification: Components with same function have consistent names
- [ ] 4.1.2 Name, Role, Value: All UI components properly identified to assistive tech

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/) 