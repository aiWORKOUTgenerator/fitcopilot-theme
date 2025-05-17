# Button Component Test Suite

This directory contains comprehensive tests for the Button component system, focusing on functionality, theme awareness, accessibility, and integration.

## Test Files Overview

### 1. Component Tests

- **Button.test.tsx**: Core tests for the primary Button component
- **Button.fixtures.test.tsx**: Tests using complex fixtures for the Button component
- **LinkButton.test.tsx**: Tests for the LinkButton variant
- **ToggleButton.test.tsx**: Tests for the ToggleButton variant
- **ButtonGroup.test.tsx**: Tests for the ButtonGroup component
- **RegistrationButton.test.tsx**: Tests for the registration-specific button component

### 2. Integration Tests

- **ButtonGroup.integration.test.tsx**: Tests ButtonGroup with various button types and theme variants
  - Mixed button type rendering
  - Theme variant support
  - Layout combinations
  - Complex nesting scenarios

### 3. Accessibility Tests

- **Accessibility.test.tsx**: Tests focusing on accessibility features
  - Keyboard navigation
  - ARIA attributes
  - High contrast support
  - Touch target sizing
  - Theme accessibility

### 4. Utilities

- **ThemeTestUtils.tsx**: Helper components and functions for theme testing
  - `ThemeProvider`: Context provider for theme-based testing
  - `mockThemeStyles`: Functions to mock CSS variables for theme testing
  - `createComputedStyleMock`: Helper for computed style testing

## Test Coverage

The test suite provides coverage for:

1. **Core Functionality**
   - Rendering of all button variants and sizes
   - Event handling and callbacks
   - Disabled states
   - Props validation

2. **Theme System**
   - Default theme rendering
   - Gym theme styling
   - Sports theme styling
   - Wellness theme styling
   - Theme switching behavior

3. **Integration**
   - Button components within ButtonGroup
   - HeroButton integration with ButtonGroup
   - Equal width and alignment behavior
   - Spacing options

4. **Accessibility**
   - Keyboard focus management
   - ARIA attributes conformance
   - Touch target sizing compliance
   - High contrast testing
   - Screen reader support

## Testing Approach

### Theme Testing Strategy

Our theme testing approach uses a combination of techniques:

1. **ThemeProvider Component**: A lightweight context provider that adds the appropriate `data-theme` attribute to simulate theme context
2. **CSS Variable Mocking**: We mock `getComputedStyle` to return theme-specific CSS variables
3. **Theme Switching**: Tests dynamically change themes to verify proper application of styles

Example of theme testing:

```tsx
// Test with gym theme
const cleanup = mockThemeStyles('gym');

render(
  <ThemeProvider theme="gym">
    <Button variant="primary">Gym Theme Button</Button>
  </ThemeProvider>
);

// Check that theme is applied correctly
const button = screen.getByRole('button');
const styles = window.getComputedStyle(button);
expect(styles.getPropertyValue('--color-hero-gradient-from')).toBe('var(--color-gym-primary)');

// Clean up
cleanup();
```

### Accessibility Testing Approach

Our accessibility tests focus on:

1. **Keyboard Navigation**: Testing tab order and keyboard activation
2. **ARIA Attributes**: Verifying proper aria-* attributes
3. **Focus States**: Ensuring visible focus indicators
4. **Screen Reader Compatibility**: Testing screen reader announcements
5. **Touch Target Size**: Validating sufficient touch target dimensions

### Integration Testing Strategy

Integration tests ensure components work together correctly:

1. **Mixed Component Types**: Testing ButtonGroup with different button components
2. **Layout Options**: Testing all layout configurations
3. **Theme Inheritance**: Verifying theme propagation through component hierarchy

## Running Tests

```bash
# Run all button tests
npm test -- --testPathPattern=Button

# Run specific test files
npm test -- ButtonGroup.integration

# Run accessibility tests
npm test -- Accessibility

# Run with coverage report
npm test -- --coverage --testPathPattern=Button
```

## Adding New Tests

When adding new button variants or features:

1. Add component-specific tests in a file named `[ComponentName].test.tsx`
2. Add integration tests in `ButtonGroup.integration.test.tsx` if the component works with ButtonGroup
3. Add accessibility tests in `Accessibility.test.tsx` 
4. Update theme tests if the component has theme-specific styling

Ensure all tests follow these principles:

- Test behavior, not implementation
- Cover edge cases and error scenarios
- Include accessibility testing
- Test theme variants when applicable
- Validate ARIA attributes and keyboard interactions

## Test Utilities Reference

### ThemeProvider

```tsx
<ThemeProvider theme="sports">
  {/* Component under test */}
</ThemeProvider>
```

### mockThemeStyles

```tsx
const cleanup = mockThemeStyles('gym', {
  // Optional custom overrides
  '--color-primary': '#custom-value'
});

// Test code

cleanup(); // Important: always clean up
```

### Test Coverage Report

Our current coverage metrics:

| Component | Line Coverage | Function Coverage | Branch Coverage |
|-----------|--------------|-------------------|----------------|
| Button.tsx | 100% | 100% | 100% |
| ButtonGroup.tsx | 80% | 75% | 85% |
| LinkButton.tsx | 95% | 100% | 90% |
| ToggleButton.tsx | 90% | 85% | 85% |
| HeroButton.tsx | 100% | 100% | 100% |

## Best Practices

- Keep test files focused on a single aspect or component
- Use descriptive test names that explain the expected behavior
- Organize tests in logical groups with `describe` blocks
- Use test utilities to reduce duplication
- Clean up mocks and spies after tests
- Verify both positive and negative test cases
- Test accessibility features alongside functional features

## Visual Testing

For visual regression testing of Button components:

1. Use Storybook stories for visual documentation
2. Add screenshots in the documentation when needed 
3. Consider adding visual regression tests for theme variants

## Additional Notes

- Ensure all tests are runnable in isolation
- Use test utilities to reduce duplication
- Clean up mocks and spies after tests
- Verify both positive and negative test cases
- Test accessibility features alongside functional features 