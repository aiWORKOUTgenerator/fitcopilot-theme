export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface RegistrationButtonProps {
    /**
     * Button label text or content
     */
    children: React.ReactNode;

    /**
     * Optional click handler
     */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

    /**
     * Button type attribute
     * @default 'button'
     */
    type?: 'button' | 'submit' | 'reset';

    /**
     * Visual style variant
     * @default 'primary'
     */
    variant?: ButtonVariant;

    /**
     * Button size
     * @default 'medium'
     */
    size?: ButtonSize;

    /**
     * Whether the button is in loading state
     * @default false
     */
    isLoading?: boolean;

    /**
     * Whether the button is disabled
     * @default false
     */
    disabled?: boolean;

    /**
     * Optional icon to display after text
     */
    rightIcon?: React.ReactNode;

    /**
     * Optional icon to display before text
     */
    leftIcon?: React.ReactNode;

    /**
     * Optional additional class names
     */
    className?: string;

    /**
     * Make button take full width of container
     * @default false
     */
    fullWidth?: boolean;
} 