/**
 * Props for the MainCTA component
 */
export interface MainCTAProps {
    /**
     * Function called when the CTA button is clicked
     */
    onNavigate: (title: string) => void;

    /**
     * Visual variant
     * @default 'default'
     */
    variant?: string;

    /**
     * Additional CSS class names
     */
    className?: string;
} 