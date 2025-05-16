/**
 * Available equipment options for user selection
 */
export const EQUIPMENT_OPTIONS = [
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

/**
 * Equipment grouped by category for more organized display
 */
export const EQUIPMENT_CATEGORIES = {
  freeWeights: {
    label: 'Free Weights',
    options: [
      'Dumbbells',
      'Kettlebells',
      'Barbell',
      'Medicine Ball',
      'Slam Ball',
      'Sand Bag'
    ]
  },
  bodyweight: {
    label: 'Bodyweight & Accessories',
    options: [
      'Bodyweight',
      'Pull-up Bar',
      'TRX / Suspension Trainer',
      'Resistance Bands',
      'Stability/Bosu Ball'
    ]
  },
  cardio: {
    label: 'Cardio Equipment',
    options: [
      'Cardio Equipment (Bike, Treadmill, Rower)',
      'Plyo Step Box'
    ]
  }
}; 