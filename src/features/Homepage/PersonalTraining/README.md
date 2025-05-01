# PersonalTraining Component

This component displays the personal trainers section on the homepage with different theme variants.

## Component Structure

```
PersonalTraining/
├── variants/             # Component theme variants
│   ├── default/          # Default variant (re-exports root component)
│   ├── modern/           # Modern theme variant
│   ├── classic/          # Classic theme variant
│   ├── minimalist/       # Minimalist theme variant
│   ├── sports/           # Sports theme variant (previously gym)
│   └── wellness/         # Wellness theme variant
├── PersonalTraining.tsx  # Main component implementation
├── PersonalTraining.scss # Component styles
├── types.ts              # TypeScript interfaces and types
├── index.ts              # Exports with variant handling
└── README.md             # Documentation
```

## Usage

```tsx
import { PersonalTraining } from '../features/Homepage/PersonalTraining';

// Using with default variant
<PersonalTraining />

// Using with a specific variant
<PersonalTraining variant="sports" />

// Using with custom trainer data
<PersonalTraining 
  trainers={[...]} 
  variant="modern"
/>
```

## WordPress Integration

This component integrates with WordPress theme variants as defined in `theme-variants.php`. The variant is automatically selected based on the WordPress theme setting.

Available variants match what's defined in WordPress:
- default
- modern
- classic
- minimalist
- sports
- wellness

## Adding New Variants

To create a new variant:

1. Create a new directory under `variants/` with your variant name
2. Create a `PersonalTraining.tsx` file in that directory
3. Implement your custom variant (you can copy from an existing one)
4. Create an `index.ts` file that exports your component
5. Update the variant map in the root `index.ts` file if needed

## Migrating from Previous Structure

This component previously used a different variant structure with 'default', 'gym', and 'mobile' variants. 
The new structure aligns with the WordPress theme variants. The previous 'gym' variant has been migrated to 'sports'. 