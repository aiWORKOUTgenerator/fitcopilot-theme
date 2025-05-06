import { ArrowRight, CheckCircle, ChevronLeft, CreditCard, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useRegistrationData } from '../hooks';
import { RegistrationStepId } from '../types';
import './Payment.scss';

/**
 * Payment component for the registration flow
 * 
 * This component handles collecting and validating payment information
 * before proceeding to the confirmation step.
 */
const Payment: React.FC = () => {
    // Get navigation context
    const {
        state,
        nextStep,
        previousStep,
        dispatch
    } = useNavigation();

    // Check if this step is active
    const isActive = state.currentStep === RegistrationStepId.PAYMENT;

    // Get registration data
    const { data, updateData } = useRegistrationData();

    // Form data state
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        billingAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
    });

    // Form validation state
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formValid, setFormValid] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Formatting helpers
    const formatCardNumber = (value: string) => {
        // Remove non-digits
        const digits = value.replace(/\D/g, '');

        // Format as xxxx xxxx xxxx xxxx
        const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');

        // Limit to 19 characters (16 digits + 3 spaces)
        return formatted.substring(0, 19);
    };

    const formatExpiryDate = (value: string) => {
        // Remove non-digits
        const digits = value.replace(/\D/g, '');

        // Format as MM/YY
        if (digits.length > 2) {
            return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
        }

        return digits;
    };

    const formatCVV = (value: string) => {
        // Remove non-digits and limit to 4 (some cards have 4-digit CVV)
        return value.replace(/\D/g, '').substring(0, 4);
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Apply formatting based on field
        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
        } else if (name === 'cvv') {
            formattedValue = formatCVV(value);
        }

        setFormData({
            ...formData,
            [name]: formattedValue,
        });

        // Clear error for this field when user edits
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    // Validate form fields
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Card number validation (16 digits)
        const cardDigits = formData.cardNumber.replace(/\D/g, '');
        if (!cardDigits || cardDigits.length !== 16) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }

        // Expiry date validation (MM/YY format)
        const expiryParts = formData.expiryDate.split('/');
        if (expiryParts.length !== 2 ||
            !expiryParts[0] ||
            !expiryParts[1] ||
            parseInt(expiryParts[0]) < 1 ||
            parseInt(expiryParts[0]) > 12) {
            newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        } else {
            // Check if card is expired
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
            const currentMonth = currentDate.getMonth() + 1; // 1-12

            const expiryMonth = parseInt(expiryParts[0]);
            const expiryYear = parseInt(expiryParts[1]);

            if (expiryYear < currentYear ||
                (expiryYear === currentYear && expiryMonth < currentMonth)) {
                newErrors.expiryDate = 'Card is expired';
            }
        }

        // CVV validation (3-4 digits)
        const cvvDigits = formData.cvv.replace(/\D/g, '');
        if (!cvvDigits || cvvDigits.length < 3 || cvvDigits.length > 4) {
            newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
        }

        // Name validation
        if (!formData.nameOnCard.trim()) {
            newErrors.nameOnCard = 'Please enter the name on the card';
        }

        // Address validation
        if (!formData.billingAddress.trim()) {
            newErrors.billingAddress = 'Please enter your billing address';
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = 'Please enter your city';
        }

        // State/Province validation
        if (!formData.state.trim()) {
            newErrors.state = 'Please enter your state/province';
        }

        // Zip/Postal code validation
        if (!formData.zipCode.trim()) {
            newErrors.zipCode = 'Please enter your ZIP/postal code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if the form is valid whenever form data changes
    useEffect(() => {
        // Simple check if all required fields have values
        const requiredFields = [
            'cardNumber',
            'expiryDate',
            'cvv',
            'nameOnCard',
            'billingAddress',
            'city',
            'state',
            'zipCode'
        ];

        const hasAllFields = requiredFields.every(field => !!formData[field as keyof typeof formData]);
        setFormValid(hasAllFields && Object.keys(errors).length === 0);
    }, [formData, errors]);

    // Process payment and move to next step
    const handleProcessPayment = () => {
        if (!validateForm()) {
            return;
        }

        setProcessingPayment(true);

        // Simulate payment processing
        setTimeout(() => {
            setProcessingPayment(false);
            setPaymentSuccess(true);

            // Update registration data with payment info (masked for security)
            updateData({
                ...data,
                paymentDetails: {
                    ...data.paymentDetails,
                    cardLast4: formData.cardNumber.replace(/\D/g, '').slice(-4),
                    cardType: getCardType(formData.cardNumber),
                    nameOnCard: formData.nameOnCard,
                    billingAddress: {
                        address: formData.billingAddress,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country
                    },
                    paymentCompleted: true,
                    paymentDate: new Date().toISOString()
                }
            });

            // Mark step as completed
            dispatch({ type: 'COMPLETE_STEP', payload: { stepId: RegistrationStepId.PAYMENT } });

            // Move to confirmation step after a short delay
            setTimeout(() => {
                nextStep();
            }, 1000);
        }, 2000);
    };

    // Determine card type based on first digits
    const getCardType = (cardNumber: string): string => {
        const number = cardNumber.replace(/\D/g, '');

        // Very basic detection
        if (number.startsWith('4')) {
            return 'Visa';
        } else if (/^5[1-5]/.test(number)) {
            return 'Mastercard';
        } else if (/^3[47]/.test(number)) {
            return 'American Express';
        } else if (/^6(?:011|5)/.test(number)) {
            return 'Discover';
        }

        return 'Credit Card';
    };

    // Go back to previous step
    const handleBack = () => {
        previousStep();
    };

    // Check if the Pricing step is marked as completed
    useEffect(() => {
        if (isActive) {
            // Ensure Pricing step is marked as completed
            const isPricingCompleted = state.completedSteps.has(RegistrationStepId.PRICING);

            // If Pricing step is not marked as completed yet, mark it
            if (!isPricingCompleted) {
                console.log('Marking Pricing step as completed from Payment');
                dispatch({ type: 'COMPLETE_STEP', payload: { stepId: RegistrationStepId.PRICING } });
            }
        }
    }, [isActive, state.completedSteps, dispatch]);

    // Early return if not active
    if (!isActive) {
        return null;
    }

    return (
        <div className="payment-container">
            <h1 className="payment-title">
                Complete Your Payment
            </h1>
            <p className="payment-subtitle">
                Enter your payment details to finalize your registration.
            </p>

            <div className="payment-summary">
                <h3>Order Summary</h3>
                <div className="payment-plan">
                    <div className="plan-name">{data.selectedPlan || 'Premium'} Plan</div>
                    <div className="plan-price">
                        {data.paymentDetails?.type === 'free'
                            ? 'Free'
                            : `$${data.paymentDetails?.amount || '9.99'}/${data.paymentDetails?.plan || 'month'}`}
                    </div>
                </div>
                <div className="payment-total">
                    <div className="total-label">Total</div>
                    <div className="total-amount">
                        {data.paymentDetails?.type === 'free'
                            ? 'Free'
                            : `$${data.paymentDetails?.amount || '9.99'}`}
                    </div>
                </div>
            </div>

            <div className="payment-form">
                <div className="form-header">
                    <CreditCard className="form-icon" />
                    <span>Payment Information</span>
                </div>

                <div className="form-group">
                    <label htmlFor="nameOnCard">Name on Card</label>
                    <input
                        type="text"
                        id="nameOnCard"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={errors.nameOnCard ? 'error' : ''}
                    />
                    {errors.nameOnCard && <div className="error-message">{errors.nameOnCard}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <div className="card-input-wrapper">
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className={errors.cardNumber ? 'error' : ''}
                        />
                        <span className="card-type">{getCardType(formData.cardNumber)}</span>
                    </div>
                    {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className={errors.expiryDate ? 'error' : ''}
                        />
                        {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                    </div>

                    <div className="form-group half">
                        <label htmlFor="cvv">CVV</label>
                        <div className="cvv-input-wrapper">
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                className={errors.cvv ? 'error' : ''}
                            />
                            <Info className="cvv-info" size={16} />
                        </div>
                        {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                    </div>
                </div>

                <div className="form-header billing-header">
                    <span>Billing Address</span>
                </div>

                <div className="form-group">
                    <label htmlFor="billingAddress">Street Address</label>
                    <input
                        type="text"
                        id="billingAddress"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                        className={errors.billingAddress ? 'error' : ''}
                    />
                    {errors.billingAddress && <div className="error-message">{errors.billingAddress}</div>}
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className={errors.city ? 'error' : ''}
                        />
                        {errors.city && <div className="error-message">{errors.city}</div>}
                    </div>

                    <div className="form-group half">
                        <label htmlFor="state">State/Province</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="NY"
                            className={errors.state ? 'error' : ''}
                        />
                        {errors.state && <div className="error-message">{errors.state}</div>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label htmlFor="zipCode">ZIP/Postal Code</label>
                        <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className={errors.zipCode ? 'error' : ''}
                        />
                        {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                    </div>

                    <div className="form-group half">
                        <label htmlFor="country">Country</label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                        >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="back-button"
                        onClick={handleBack}
                    >
                        <ChevronLeft size={18} />
                        Back
                    </button>

                    <button
                        type="button"
                        className={`submit-button ${processingPayment ? 'processing' : ''} ${paymentSuccess ? 'success' : ''}`}
                        onClick={handleProcessPayment}
                        disabled={!formValid || processingPayment || paymentSuccess}
                    >
                        {processingPayment ? (
                            <>Processing...</>
                        ) : paymentSuccess ? (
                            <>
                                <CheckCircle size={18} />
                                Payment Complete
                            </>
                        ) : (
                            <>
                                Complete Payment
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>

                <div className="security-note">
                    <div className="security-icon">🔒</div>
                    <p>
                        Your payment information is secure and encrypted.
                        We do not store your full card details on our servers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment; 