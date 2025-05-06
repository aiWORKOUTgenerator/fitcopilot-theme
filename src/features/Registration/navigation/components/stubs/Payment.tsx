import React, { useEffect, useState } from 'react';
import { useNavigation } from '../../context';
import { RegistrationStepId } from '../../types';
import RegistrationButton from '../RegistrationButton';

/**
 * Stub component for the Payment step
 */
const Payment: React.FC = () => {
    const { isCurrentStep, markStepValid, markStepCompleted } = useNavigation();
    const isActive = isCurrentStep(RegistrationStepId.PAYMENT);

    // Simple form state for the stub
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
    });

    const [formValid, setFormValid] = useState(false);

    // Simple form validation
    useEffect(() => {
        const { cardNumber, expiryDate, cvv, nameOnCard } = formData;
        const isValid = cardNumber.length > 0 && expiryDate.length > 0 && cvv.length > 0 && nameOnCard.length > 0;
        setFormValid(isValid);
    }, [formData]);

    // Update step validity
    useEffect(() => {
        if (isActive) {
            markStepValid(RegistrationStepId.PAYMENT, formValid);

            if (formValid) {
                markStepCompleted(RegistrationStepId.PAYMENT, true);
            }
        }
    }, [isActive, formValid, markStepValid, markStepCompleted]);

    // This will be replaced with the actual Payment component later
    if (!isActive) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="registration-step payment-step">
            <h1>Payment Information</h1>
            <p>Enter your payment details to complete your registration</p>

            <div className="step-content">
                <div className="payment-form">
                    <div className="form-row">
                        <label htmlFor="nameOnCard">Name on Card</label>
                        <input
                            type="text"
                            id="nameOnCard"
                            name="nameOnCard"
                            value={formData.nameOnCard}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>

                    <div className="form-row form-row-split">
                        <div className="form-col">
                            <label htmlFor="expiryDate">Expiry Date</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                            />
                        </div>

                        <div className="form-col">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="step-controls">
                <RegistrationButton type="back" />
                <RegistrationButton type="next" disabled={!formValid} />
            </div>
        </div>
    );
};

export default Payment; 