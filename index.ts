/**
 * Button Component System Export
 */

// Re-export components
export * from './components';

// Re-export types
export * from './types';
export { Button, ButtonGroup, LinkButton, ToggleButton };

// For compatibility with existing code during migration
import { Button, ButtonGroup, LinkButton, ToggleButton } from './components';

// Type guard exports (for backwards compatibility)
  export {
    isActionButton, isFloatingActionButton, isIconButton, isLinkButton, isPrimaryButton,
    isSecondaryButton,
    isTextButton, isToggleButton, isWorkoutButton
  } from './types/buttonTypes';

