/**
 * Button Component
 * 
 * A reusable button component that supports different variants, sizes,
 * loading states, and accessibility features. 
 * This is a wrapper component that loads the appropriate theme variant.
 * 
 * @example
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click Me
 * </Button>
 */

import React from 'react';
import { getButtonThemeContext } from './context';
import { ButtonProps } from './types';

// Dynamically import button theme variants
const DefaultButton = React.lazy(() => import('./default/Button'));
const GymButton = React.lazy(() => import('./gym/Button'));
const HeroButton = React.lazy(() => import('./hero/Button'));

/**
 * Main Button component that selects the appropriate theme variant
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    themeContext = 'default',
    ...props
}, ref) => {
    const theme = getButtonThemeContext(themeContext);

    // Use React.Suspense to handle the dynamic import
    return (
        <React.Suspense fallback={
            <button
                className="button button--loading"
                disabled
                aria-busy="true"
            >
                <span className="button__spinner" aria-hidden="true" />
                <span className="button__text">{props.children}</span>
            </button>
        }>
            {theme === 'gym' ? (
                <GymButton ref={ref} {...props} />
            ) : theme === 'hero' ? (
                <HeroButton ref={ref} {...props} />
            ) : (
                <DefaultButton ref={ref} {...props} />
            )}
        </React.Suspense>
    );
});

Button.displayName = 'Button';

export default Button; 