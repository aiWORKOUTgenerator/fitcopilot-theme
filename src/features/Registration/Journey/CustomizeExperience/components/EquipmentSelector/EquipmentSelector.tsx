import { Check, Dumbbell } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../../../components/AccordionSection';
import { useJourney } from '../../../components/JourneyContext';
import { EQUIPMENT_CATEGORIES } from '../../constants/equipmentOptions';
import { EquipmentSelectorProps } from '../../types';
import { updateCustomizationSection } from '../../utils/customizationStorage';
import ConfirmButton from '../shared/ConfirmButton';
import './EquipmentSelector.scss';

/**
 * Enhanced equipment selector with categorized options and animations
 */
const EquipmentSelector = forwardRef<AccordionSectionRef, EquipmentSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Initialize state from saved data
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
        registrationData.equipmentList || []
    );

    const [otherEquipment, setOtherEquipment] = useState<string>(
        registrationData.otherEquipment || ''
    );

    const [isValid, setIsValid] = useState(false);

    // Update validation status when selections change
    useEffect(() => {
        const valid = selectedEquipment.length > 0 || otherEquipment.trim().length > 0;
        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            equipmentList: selectedEquipment,
            otherEquipment
        });

        // Persist to local storage
        updateCustomizationSection('equipment', {
            equipment: selectedEquipment,
            otherEquipment
        });
    }, [selectedEquipment, otherEquipment, onValidChange, updateRegistrationData]);

    // Toggle equipment selection
    const toggleEquipment = (equipment: string) => {
        setSelectedEquipment(prev => {
            if (prev.includes(equipment)) {
                return prev.filter(e => e !== equipment);
            }
            return [...prev, equipment];
        });
    };

    // Prepare accordion title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Equipment Selection
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Equipment Selection';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<Dumbbell size={18} className={isCompleted ? 'text-emerald-400' : 'text-cyan-300'} />}
            defaultOpen={false}
        >
            <div className="equipment-selector">
                <p className="section-description">
                    Select the equipment you have access to for your workouts
                </p>

                {/* Equipment selection by category */}
                <div className="equipment-categories">
                    {Object.entries(EQUIPMENT_CATEGORIES).map(([categoryKey, category]) => (
                        <div key={categoryKey} className="equipment-category">
                            <h4 className="category-title">{category.label}</h4>

                            <div className="category-options">
                                {category.options.map((equipment, index) => (
                                    <div
                                        key={index}
                                        className={`equipment-option ${selectedEquipment.includes(equipment) ? 'selected' : ''}`}
                                        onClick={() => toggleEquipment(equipment)}
                                        role="checkbox"
                                        aria-checked={selectedEquipment.includes(equipment)}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                toggleEquipment(equipment);
                                            }
                                        }}
                                    >
                                        <div className="option-checkbox">
                                            {selectedEquipment.includes(equipment) && <Check size={14} />}
                                        </div>
                                        <span className="option-label">{equipment}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Other equipment input */}
                <div className="other-equipment">
                    <label htmlFor="other-equipment" className="other-label">
                        Other equipment not listed
                    </label>
                    <textarea
                        id="other-equipment"
                        className="other-input"
                        placeholder="Please list any other equipment you have"
                        rows={2}
                        value={otherEquipment}
                        onChange={(e) => setOtherEquipment(e.target.value)}
                    />
                </div>

                {/* Selection summary */}
                {selectedEquipment.length > 0 && (
                    <div className="selection-summary">
                        <div className="summary-text">
                            {selectedEquipment.length} {selectedEquipment.length === 1 ? 'item' : 'items'} selected
                        </div>
                    </div>
                )}

                {/* Confirm button */}
                <ConfirmButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    validationMessage="Please select at least one equipment item or specify other equipment"
                />
            </div>
        </AccordionSection>
    );
});

EquipmentSelector.displayName = 'EquipmentSelector';

export default EquipmentSelector; 