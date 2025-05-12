# Button Component Migration Guide

This guide demonstrates how to migrate Button components with `any` types to use our strongly-typed system.

## Before and After Examples

### Example 1: Basic Button with any Event Handler

**Before:**

```tsx
// Before: Using 'any' for event handler
const ActionButton = ({ onClick, label }) => {
  const handleClick = (event: any) => {
    console.log('Button clicked');
    onClick(event);
  };

  return (
    <button 
      className="action-button" 
      onClick={handleClick}
    >
      {label}
    </button>
  );
};
```

**After:**

```tsx
// After: Using strongly-typed event handlers
import { ButtonClickHandler } from '../../../types/events';
import { BaseButtonProps } from './types';
import { createLoggedEventHandler } from '../../../utils/logger';

interface ActionButtonProps extends BaseButtonProps {
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  label,
  className = '',
  ...rest
}) => {
  // Properly typed event handler
  const handleClick: ButtonClickHandler = (event) => {
    // No need for console, using logger
    onClick?.(event);
  };

  // Logger integration
  const loggedHandleClick = createLoggedEventHandler(
    'ActionButton',
    'click',
    handleClick
  );

  return (
    <button 
      className={`action-button ${className}`.trim()} 
      onClick={loggedHandleClick}
      {...rest}
    >
      {label}
    </button>
  );
};
```

### Example 2: Button with Generic Any Types

**Before:**

```tsx
// Before: Using 'any' for props and state
class GenericButton extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  }

  handleClick = (e: any) => {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    const buttonClass = this.state.isHovered 
      ? 'generic-button hover' 
      : 'generic-button';

    return (
      <button 
        className={buttonClass}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children}
      </button>
    );
  }
}
```

**After:**

```tsx
// After: Using discriminated unions and proper typing
import React, { useState } from 'react';
import { ButtonClickHandler, MouseEventHandler } from '../../../types/events';
import { BaseButtonProps } from './types';
import { createLoggedEventHandler } from '../../../utils/logger';

// Proper interface definition
interface GenericButtonProps extends BaseButtonProps {
  variant?: 'default' | 'hover';
}

// Convert to functional component with proper types
const GenericButton: React.FC<GenericButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'default',
  ...rest
}) => {
  // Properly typed state
  const [isHovered, setIsHovered] = useState(false);

  // Properly typed event handlers
  const handleMouseEnter: MouseEventHandler<HTMLButtonElement> = () => {
    setIsHovered(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLButtonElement> = () => {
    setIsHovered(false);
  };

  const handleClick: ButtonClickHandler = (event) => {
    onClick?.(event);
  };

  // Logger integration
  const loggedHandleClick = createLoggedEventHandler(
    'GenericButton',
    'click',
    handleClick
  );

  // Compute class names
  const buttonClass = [
    'generic-button',
    isHovered ? 'hover' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClass}
      onClick={loggedHandleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </button>
  );
};
```

## Migration Steps

1. **Identify Button Component Types**
   - Determine which button variant the component represents
   - Map component props to available ButtonProps interfaces
   - Create a new interface extending the appropriate base if needed

2. **Replace Event Handlers**
   - Import appropriate event handler types from `types/events.ts`
   - Replace `any` event types with proper typed handlers
   - Use `createLoggedEventHandler` for consistent logging

3. **Implement Proper Props Handling**
   - Ensure all props are properly typed
   - Use interface props with defaults
   - Implement proper rest props spreading

4. **Update Class Components**
   - Consider converting to functional components with hooks
   - Use proper state typing with useState/useReducer
   - Apply proper type guards for conditional rendering

5. **Test Type Safety**
   - Validate props with TypeScript compiler
   - Ensure event handlers receive proper event objects
   - Verify logger integration works correctly

## Common Patterns to Replace

| Before | After |
|--------|-------|
| `(event: any) => void` | `ButtonClickHandler` |
| `onClick?: (e: any) => any` | `onClick?: ButtonClickHandler` |
| `React.Component<any, any>` | `React.FC<SpecificProps>` |
| `this.props.onClick?.(e)` | `onClick?.(event)` |
| `console.log('clicked')` | `createLoggedEventHandler('Component', 'click', handler)` |
| `const [state, setState] = useState<any>({})` | `const [state, setState] = useState<SpecificType>({})` |

By following these patterns, we can systematically eliminate `any` types from our Button components while improving code quality, type safety, and logging consistency. 