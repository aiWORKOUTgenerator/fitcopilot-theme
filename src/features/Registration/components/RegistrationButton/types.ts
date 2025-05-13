import { ButtonProps } from '../../../../features/shared/Button/types';

type BaseRegistrationButtonProps = Omit<ButtonProps, 'variant'> & {
    /**
     * Button size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Whether the button is in loading state
     * @default false
     */
    isLoading?: boolean;

    /**
     * Optional icon to display after text
     */
    rightIcon?: React.ReactNode;

    /**
     * Optional icon to display before text
     */
    leftIcon?: React.ReactNode;

    /**
     * Make button take full width of container
     * @default false
     */
    fullWidth?: boolean;
};

type PrimaryRegistrationButtonProps = BaseRegistrationButtonProps & {
    variant: 'primary';
};

type SecondaryRegistrationButtonProps = BaseRegistrationButtonProps & {
    variant: 'secondary';
};

type LinkRegistrationButtonProps = BaseRegistrationButtonProps & {
    variant: 'link';
    href: string;
    openInNewTab?: boolean;
};

export type RegistrationButtonProps =
    | PrimaryRegistrationButtonProps
    | SecondaryRegistrationButtonProps
    | LinkRegistrationButtonProps; 