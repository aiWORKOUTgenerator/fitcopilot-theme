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
/* These imports use dynamic loading to support theming */
const DefaultButton = React.lazy(() => import('./default/Button'));
const GymButton = React.lazy(() => import('./gym/Button'));
const HeroButton = React.lazy(() => import('./hero/Button'));
const SportsButton = React.lazy(() => import('./sports/Button'));
const WellnessButton = React.lazy(() => import('./wellness/Button'));
const ModernButton = React.lazy(() => import('./modern/Button'));
const ClassicButton = React.lazy(() => import('./classic/Button'));
const MinimalistButton = React.lazy(() => import('./minimalist/Button'));

/**
 * Main Button component that selects the appropriate theme variant
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({
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
            {/* Using 'as any' for ref compatibility with button variants */}
            {theme === 'gym' ? (
                <GymButton ref={ref as any} {...props} />
            ) : theme === 'hero' ? (
                <HeroButton ref={ref as any} {...props} />
            ) : theme === 'sports' ? (
                <SportsButton ref={ref as any} {...props} />
            ) : theme === 'wellness' ? (
                <WellnessButton ref={ref as any} {...props} />
            ) : theme === 'modern' ? (
                <ModernButton ref={ref as any} {...props} />
            ) : theme === 'classic' ? (
                <ClassicButton ref={ref as any} {...props} />
            ) : theme === 'minimalist' ? (
                <MinimalistButton ref={ref as any} {...props} />
            ) : (
                <DefaultButton ref={ref as any} {...props} />
            )}
        </React.Suspense>
    );
});

Button.displayName = 'Button';

export default Button; 