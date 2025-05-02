import { Check, Dumbbell } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from './AccordionSection';
import ConfirmSectionButton from './ConfirmSectionButton';
import { useJourney } from './JourneyContext';

interface EquipmentSelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
}

const EQUIPMENT_OPTIONS = [
    'Dumbbells',
    'Kettlebells',
    'Resistance Bands',
    'Barbell',
    'Pull-up Bar',
    'TRX / Suspension Trainer',
    'Cardio Equipment (Bike, Treadmill, Rower)',
    'Bodyweight',
    'Plyo Step Box',
    'Medicine Ball',
    'Slam Ball',
    'Sand Bag',
    'Stability/Bosu Ball'
];

const EquipmentSelector = forwardRef<AccordionSectionRef, EquipmentSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
        registrationData.equipmentList || []
    );
    const [otherEquipment, setOtherEquipment] = useState<string>(
        registrationData.otherEquipment || ''
    );
    const [isValid, setIsValid] = useState(false);

    // Update validation status whenever selections change
    useEffect(() => {
        const valid = selectedEquipment.length > 0 || otherEquipment.trim().length > 0;
        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            equipmentList: selectedEquipment,
            otherEquipment
        });
    }, [selectedEquipment, otherEquipment, onValidChange, updateRegistrationData]);

    const toggleEquipment = (equipment: string) => {
        setSelectedEquipment(prev => {
            if (prev.includes(equipment)) {
                return prev.filter(e => e !== equipment);
            }
            return [...prev, equipment];
        });
    };

    // Prepare title with completion indicator
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
            <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-3">
                    Select the equipment you have access to for your workouts
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EQUIPMENT_OPTIONS.map((equipment, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`equipment-${index}`}
                                className="w-4 h-4 text-cyan-400 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2 bg-gray-700"
                                checked={selectedEquipment.includes(equipment)}
                                onChange={() => toggleEquipment(equipment)}
                            />
                            <label
                                htmlFor={`equipment-${index}`}
                                className="ml-2 text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                            >
                                {equipment}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <label htmlFor="other-equipment" className="block text-sm font-medium text-gray-300 mb-1">
                        Other equipment not listed
                    </label>
                    <textarea
                        id="other-equipment"
                        className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        placeholder="Please list any other equipment you have"
                        rows={2}
                        value={otherEquipment}
                        onChange={(e) => setOtherEquipment(e.target.value)}
                    />
                </div>

                {selectedEquipment.length > 0 && (
                    <div className="pt-2">
                        <div className="text-sm text-cyan-300">
                            {selectedEquipment.length} {selectedEquipment.length === 1 ? 'item' : 'items'} selected
                        </div>
                    </div>
                )}

                <ConfirmSectionButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    sectionName="equipment"
                />
            </div>
        </AccordionSection>
    );
});

EquipmentSelector.displayName = 'EquipmentSelector';

export default EquipmentSelector; 