# UI Component Testing Guide

This guide outlines best practices for testing UI components in our React application, with a focus on accessibility and user-centric testing.

## General Testing Principles

1. **Test Behavior, Not Implementation**
   - Focus on what components do, not how they're built
   - Use role-based selectors instead of implementation details
   - Write tests that are resilient to implementation changes

2. **Follow User-Centric Testing Patterns**
   - Test from a user's perspective
   - Use queries that mirror how users interact with UI
   - Prioritize accessible interactions

3. **Test Edge Cases**
   - Test both happy paths and error states
   - Verify behavior with different prop combinations
   - Test loading, empty, and error states

## Testing Tools

1. **Testing Library API**
   - Use `screen.getByRole()` as the primary query
   - Prefer `getByRole`, `getByLabelText`, `getByText` over `getByTestId`
   - Use `findBy*` for async operations
   - Use `queryBy*` when testing that something is not present

2. **User Interactions**
   - Use `userEvent` instead of `fireEvent` for more realistic interactions
   - Test keyboard interactions using `user.tab()`, `user.keyboard('{Enter}')`
   - Simulate different devices and input methods

3. **Accessibility Testing**
   - Test ARIA attributes and roles
   - Verify focus management in interactive components
   - Ensure keyboard navigation works correctly

## Component-Specific Testing Patterns

### Modal Components

```typescript
// Modal Component Test Examples

// 1. Test that modal renders when open
it('renders the modal when isOpen is true', () => {
  renderWithProviders(
    <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
      <p>Modal content</p>
    </Modal>
  );

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Modal content')).toBeInTheDocument();
});

// 2. Test focus management
it('focuses the close button by default when opened', async () => {
  renderWithProviders(
    <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
      <p>Modal content</p>
    </Modal>
  );

  const closeButton = screen.getByRole('button', { name: /close modal/i });
  await waitFor(() => {
    expect(closeButton).toHaveFocus();
  });
});

// 3. Test keyboard interactions
it('traps focus within the modal', async () => {
  const { user } = renderWithProviders(
    <Modal isOpen={true} onClose={jest.fn()} title="Focus Trap Test">
      <button>First Button</button>
      <input placeholder="Middle Input" />
      <button>Last Button</button>
    </Modal>
  );

  // Tab through focusable elements
  await user.tab();
  expect(screen.getByRole('button', { name: /first button/i })).toHaveFocus();
  
  await user.tab();
  expect(screen.getByPlaceholderText('Middle Input')).toHaveFocus();
  
  await user.tab();
  expect(screen.getByRole('button', { name: /last button/i })).toHaveFocus();
  
  // Tab should loop back to first focusable element
  await user.tab();
  expect(screen.getByRole('button', { name: /close modal/i })).toHaveFocus();
});
```

### Form Components

```typescript
// Form Component Test Examples

// 1. Test form submission
it('calls onSubmit when the form is submitted', async () => {
  const handleSubmit = jest.fn();
  
  const { user } = renderWithProviders(
    <Form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" />
      <button type="submit">Submit</button>
    </Form>
  );

  const submitButton = screen.getByRole('button', { name: 'Submit' });
  await user.click(submitButton);
  
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

// 2. Test keyboard submission
it('can be submitted using keyboard', async () => {
  const handleSubmit = jest.fn();
  
  const { user } = renderWithProviders(
    <Form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" />
      <button type="submit">Submit</button>
    </Form>
  );

  // Tab to the input
  await user.tab();
  expect(screen.getByPlaceholderText('Username')).toHaveFocus();
  
  // Tab to the submit button
  await user.tab();
  expect(screen.getByRole('button', { name: 'Submit' })).toHaveFocus();
  
  // Press Enter to submit
  await user.keyboard('{Enter}');
  
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

// 3. Test field validation and error states
it('renders error message when provided', () => {
  renderWithProviders(
    <TextField
      label="Password"
      value="pass"
      error="Password must be at least 8 characters"
    />
  );

  const errorMessage = screen.getByText('Password must be at least 8 characters');
  expect(errorMessage).toBeInTheDocument();

  const input = screen.getByLabelText('Password');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription(/Password must be at least 8 characters/i);
});
```

## Common Pitfalls to Avoid

1. **Brittle Selectors**
   - Avoid `data-testid` as the primary selector
   - Don't rely on class names or tag names
   - Don't test implementation details

2. **Poor Async Handling**
   - Use `findBy` or `waitFor` for async operations
   - Handle loading states and transitions
   - Ensure proper cleanup after tests

3. **Missed Accessibility**
   - Don't forget to test keyboard navigation
   - Test with screen readers in mind
   - Verify ARIA attributes and roles

## Test Setup Best Practices

1. **Provider Wrappers**
   - Use `renderWithProviders` for consistent test environment
   - Mock contexts and providers at the right level
   - Reset state between tests

2. **Mock Service Implementations**
   - Mock external dependencies
   - Return realistic mock data
   - Test error states

3. **Clear Test Organization**
   - Group related tests with `describe` blocks
   - Use clear test names
   - Follow the Arrange-Act-Assert pattern

## Conclusion

By following these testing patterns, we can build a test suite that:
- Ensures components behave correctly
- Remains resilient to implementation changes
- Verifies accessibility for all users
- Catches edge cases before users encounter them

This approach helps us build a more robust, accessible, and maintainable UI component library. 