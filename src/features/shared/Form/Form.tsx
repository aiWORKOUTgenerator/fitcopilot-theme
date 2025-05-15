/**
 * Form Component
 */

import React from 'react';
import './form.scss';
import { FormProps } from './types';

/**
 * Form component for handling form submissions and validation
 */
const Form: React.FC<FormProps> = ({
    onSubmit,
    children,
    className = '',
    id,
    noValidate = true,
    autoComplete = 'on',
    action = '#',
    method = 'post',
    encType,
    ariaLabel,
    'data-testid': dataTestId,
}) => {
    // Create the form event handler
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (onSubmit) {
            onSubmit(event);
        }
    };

    // Compose class names
    const classes = ['form', className].filter(Boolean).join(' ');

    return (
        <form
            id={id}
            className={classes}
            onSubmit={handleSubmit}
            noValidate={noValidate}
            autoComplete={autoComplete}
            action={action}
            method={method}
            encType={encType}
            aria-label={ariaLabel}
            data-testid={dataTestId}
        >
            {children}
        </form>
    );
};

export default Form; 