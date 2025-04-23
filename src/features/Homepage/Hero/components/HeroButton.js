import { jsx as _jsx } from "react/jsx-runtime";
import Button from '../../../../components/UI/Button';
/**
 * Button component for the Hero section
 */
export const HeroButton = ({ href, children, variant = 'primary', icon }) => {
    // Map local variants to shared Button variants
    const buttonVariant = variant === 'primary' ? 'hero-primary' : 'hero-secondary';
    return (_jsx(Button, { href: href, variant: buttonVariant, size: "lg", rounded: "full", icon: icon, children: children }));
};
