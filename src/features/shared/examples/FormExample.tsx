/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Form Example Component
 * Demonstrates integration of typed form components with useForm hook
 */

import React from 'react';
import logger from '../../../utils/logger';
import { Button, ButtonGroup } from '../Button';
import FormField from '../FormField';
import { useForm } from '../FormField/useForm';
import { validateEmail, validateMinLength, validateRequired } from '../FormField/validators';

/**
 * Form data interface
 */
interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    preference: string;
    subscribe: boolean;
}

/**
 * Form Example Component
 */
export const FormExample: React.FC = () => {
    // Initialize form with useForm hook
    const {
        _values,
        register,
        handleSubmit,
        formState,
        isValid,
        isSubmitting,
        resetForm
    } = useForm<ContactFormData>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            message: '',
            preference: '',
            subscribe: false
        },
        validators: {
            firstName: [validateRequired('First name is required')],
            lastName: [validateRequired('Last name is required')],
            email: [validateRequired('Email is required'), validateEmail('Please enter a valid email address')],
            message: [validateRequired('Message is required'), validateMinLength(10, 'Message must be at least 10 characters')]
        },
        onSubmit: async (data) => {
            // Simulate API call
            logger.info('Form submitted with data:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Form submitted successfully!');
        }
    });

    // Create typed form fields using register
    const firstNameProps = register('firstName');
    const lastNameProps = register('lastName');
    const emailProps = register('email');
    const messageProps = register('message');
    const preferenceProps = register('preference');
    const subscribeProps = register('subscribe');

    return (
        <div className="form-example">
            <h2>Contact Form</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                    <FormField
                        fieldType="text"
                        label="First Name"
                        name={firstNameProps.name}
                        value={firstNameProps.value as string}
                        onChange={firstNameProps.onChange}
                        onBlur={firstNameProps.onBlur}
                        type="text"
                        error={firstNameProps.error || undefined}
                        required
                    />

                    <FormField
                        fieldType="text"
                        label="Last Name"
                        name={lastNameProps.name}
                        value={lastNameProps.value as string}
                        onChange={lastNameProps.onChange}
                        onBlur={lastNameProps.onBlur}
                        type="text"
                        error={lastNameProps.error || undefined}
                        required
                    />
                </div>

                <FormField
                    fieldType="text"
                    label="Email"
                    name={emailProps.name}
                    value={emailProps.value as string}
                    onChange={emailProps.onChange}
                    onBlur={emailProps.onBlur}
                    type="email"
                    error={emailProps.error || undefined}
                    required
                />

                <FormField
                    fieldType="select"
                    label="Preferred Contact Method"
                    name={preferenceProps.name}
                    value={preferenceProps.value as string}
                    onChange={preferenceProps.onChange as any}
                    onBlur={preferenceProps.onBlur as any}
                    options={[
                        { value: '', label: 'Please select...' },
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Phone' },
                        { value: 'text', label: 'Text Message' }
                    ]}
                />

                <FormField
                    fieldType="textarea"
                    label="Message"
                    name={messageProps.name}
                    value={messageProps.value as string}
                    onChange={messageProps.onChange}
                    onBlur={messageProps.onBlur as any}
                    error={messageProps.error || undefined}
                    required
                    rows={4}
                />

                <FormField
                    fieldType="checkbox"
                    label="Subscribe to newsletter"
                    name={subscribeProps.name}
                    checked={subscribeProps.value as boolean}
                    onChange={subscribeProps.onChange}
                />

                {formState.error && (
                    <div className="form-error">{formState.error}</div>
                )}

                <ButtonGroup spacing="medium" alignment="end">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => resetForm()}
                    >
                        Reset
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Submit
                    </Button>
                </ButtonGroup>
            </form>
        </div>
    );
};

export default FormExample; 