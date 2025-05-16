/**
 * Accessibility utility functions
 */

/**
 * Announces a message to screen readers using an ARIA live region
 * 
 * @param message Message to announce
 * @param politeness Level of interruption (polite or assertive)
 */
export const announceToScreenReader = (
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void => {
  // Create or get the announcer element
  let announcer = document.getElementById('a11y-announcer');

  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('role', 'status');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  }

  // Set the politeness level (in case it was changed)
  announcer.setAttribute('aria-live', politeness);

  // Clear and set in two steps to ensure announcement
  announcer.textContent = '';

  // Use setTimeout to ensure the announcement is made
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 50);
};

/**
 * Focus the first tabbable element within a container
 * 
 * @param container The container element to search within
 * @returns Whether a tabbable element was found and focused
 */
export const focusFirstTabbableElement = (container: HTMLElement | null): boolean => {
  if (!container) return false;

  // Selector for potentially tabbable elements
  const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const tabbableElements = container.querySelectorAll<HTMLElement>(selector);

  for (let i = 0; i < tabbableElements.length; i++) {
    const element = tabbableElements[i];

    // Check if element is visible and enabled
    const style = window.getComputedStyle(element);
    const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
    const isEnabled = !element.hasAttribute('disabled');

    if (isVisible && isEnabled) {
      element.focus();
      return true;
    }
  }

  return false;
}; 