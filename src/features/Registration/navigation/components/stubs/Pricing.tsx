import React, { useEffect, useState } from 'react';
import { useNavigation } from '../../context';
import { RegistrationStepId } from '../../types';
import RegistrationButton from '../RegistrationButton';

/**
 * Stub component for the Pricing step
 */
const Pricing: React.FC = () => {
    const { isCurrentStep, markStepValid, markStepCompleted } = useNavigation();
    const isActive = isCurrentStep(RegistrationStepId.PRICING);

    // Simple state for the stub
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    // Update validity when selection changes
    useEffect(() => {
        if (isActive) {
            const isValid = selectedPlan !== null;
            markStepValid(RegistrationStepId.PRICING, isValid);

            // Mark as completed when valid
            if (isValid) {
                markStepCompleted(RegistrationStepId.PRICING, true);
            }
        }
    }, [isActive, selectedPlan, markStepValid, markStepCompleted]);

    // This will be replaced with the actual Pricing component later
    if (!isActive) {
        return null;
    }

    const plans = [
        {
            id: 'monthly',
            name: 'Monthly',
            price: '$19.99',
            period: 'month',
            features: [
                'Full Access to AI Workout Generator',
                'Personalized Workout Plans',
                'Progress Tracking',
            ],
        },
        {
            id: 'yearly',
            name: 'Yearly',
            price: '$199.99',
            period: 'year',
            features: [
                'All Monthly Features',
                '2 Months Free',
                'Premium Support',
            ],
        },
    ];

    return (
        <div className="registration-step pricing-step">
            <h1>Choose Your Plan</h1>
            <p>Select the plan that works best for you</p>

            <div className="step-content">
                <div className="pricing-plans">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`pricing-plan ${selectedPlan === plan.id ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            <h3>{plan.name}</h3>
                            <div className="price">
                                <span className="amount">{plan.price}</span>
                                <span className="period">/{plan.period}</span>
                            </div>
                            <ul className="features">
                                {plan.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="step-controls">
                <RegistrationButton type="back" />
                <RegistrationButton type="next" disabled={!selectedPlan} />
            </div>
        </div>
    );
};

export default Pricing; 