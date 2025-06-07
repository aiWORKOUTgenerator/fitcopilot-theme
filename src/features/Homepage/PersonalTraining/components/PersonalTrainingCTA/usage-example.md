# PersonalTrainingCTA Usage Examples

## Basic Usage

```tsx
import { PersonalTrainingCTA } from './components/PersonalTrainingCTA';

// Basic CTA for scheduling sessions
<PersonalTrainingCTA
  text="Schedule Session"
  href="https://aigymengine.com/schedule"
  coachType="strength"
/>
```

## Coach-Specific Styling

```tsx
// Strength trainer CTA (violet gradient)
<PersonalTrainingCTA
  text="Start Strength Training"
  coachType="strength"
  buttonSize="large"
/>

// Nutrition coach CTA (emerald gradient)
<PersonalTrainingCTA
  text="Get Nutrition Plan"
  coachType="nutrition"
  buttonSize="medium"
/>

// Performance coach CTA (amber gradient)
<PersonalTrainingCTA
  text="BOOST PERFORMANCE"
  coachType="performance"
  buttonSize="large"
/>

// Recovery specialist CTA (lime gradient)
<PersonalTrainingCTA
  text="Recovery Sessions"
  coachType="recovery"
  buttonSize="medium"
/>
```

## Integration into PersonalTraining.tsx

Replace existing UniversalButton calls with PersonalTrainingCTA:

```tsx
// Before (old implementation)
<UniversalButton
  sectionContext="personal-training"
  buttonVariant="primary"
  variant={mapVariantToGlobal(variant)}
  size="medium"
  contextType={getCoachType(trainer.specialty)}
  rightIcon={<ArrowRight size={16} className="ml-2" />}
  data-section="personalTraining"
  data-context="trainer"
>
  Schedule Session
</UniversalButton>

// After (with PersonalTrainingCTA)
<PersonalTrainingCTA
  text="Schedule Session"
  coachType={getCoachType(trainer.specialty)}
  buttonSize="medium"
  variant={variant}
  data-context="trainer"
/>
```

## Team CTA Section

```tsx
// Replace the team CTA button
<PersonalTrainingCTA
  text="Meet Our Team"
  buttonVariant="secondary"
  variant="gym"
  buttonSize="large"
  coachType="strength"
  data-context="team-cta"
/>
```

## Variant-Specific Styling

```tsx
// Gym theme with custom gradient
<PersonalTrainingCTA
  text="Book Now"
  variant="gym"
  gradientColor="violet"
  ovalShape={true}
  coachType="strength"
/>

// Sports theme with performance styling
<PersonalTrainingCTA
  text="TRAIN LIKE A PRO"
  variant="sports"
  coachType="performance"
  buttonSize="large"
/>

// Wellness theme with recovery focus
<PersonalTrainingCTA
  text="Start Recovery Journey"
  variant="wellness"
  coachType="recovery"
  buttonSize="medium"
/>
```

## Custom Icons and Content

```tsx
import { Calendar, Play } from 'lucide-react';

// Custom icon
<PersonalTrainingCTA
  text="Book Consultation"
  icon={<Calendar size={18} />}
  coachType="nutrition"
/>

// No icon
<PersonalTrainingCTA
  text="Learn More"
  showIcon={false}
  buttonVariant="secondary"
  coachType="strength"
/>
```

## Migration Strategy

1. **Phase 1**: Import PersonalTrainingCTA component
2. **Phase 2**: Replace individual trainer CTAs
3. **Phase 3**: Replace team CTA section
4. **Phase 4**: Remove deprecated PersonalTrainingButton if no longer needed
5. **Phase 5**: Test across all theme variants

## Benefits over Current Implementation

- ✅ **Consistent API** - Follows FeatureCTA pattern
- ✅ **Coach-Specific Theming** - Automatic gradient selection based on coach type
- ✅ **Simplified Integration** - Less props needed than UniversalButton
- ✅ **Better Semantics** - Clear section context and data attributes
- ✅ **Enhanced Styling** - Oval shape and coach-specific animations
- ✅ **Accessibility** - Proper ARIA labels and reduced motion support 