# Dependency Chain Analysis

This report identifies critical error dependency chains where errors in one component can affect multiple dependent components.

## Critical Error Chains

These components have errors that impact many other components:

| Component | Path | Errors | Dependents | Impact Score |
|-----------|------|--------|------------|-------------|
| FloatingIcon | features/Homepage/Features/components/FloatingIcon.tsx | 2 | 4 | 18.40 |
| media | types/media.ts | 1 | 10 | 14.00 |
| FeatureCard | features/Homepage/Features/components/FeatureCard.tsx | 2 | 5 | 10.00 |
| FormField | features/shared/FormField/FormField.tsx | 9 | 1 | 9.00 |
| VideoPlayer | components/UI/Media/VideoPlayer.tsx | 4 | 2 | 8.00 |
| MedicalCustomizationContext | features/Registration/Journey/CustomizedMedical/context/MedicalCustomizationContext.tsx | 7 | 1 | 7.00 |
| CustomizationContext | features/Registration/Journey/CustomizeExperience/context/CustomizationContext.tsx | 6 | 1 | 6.00 |
| FeatureCardDemos | features/Homepage/Features/components/FeatureCardDemos.tsx | 1 | 6 | 6.00 |
| YouTubePlayer | features/shared/Media/YouTubePlayer.tsx | 4 | 1 | 4.00 |
| AudioPlayer | components/UI/Media/AudioPlayer.tsx | 2 | 2 | 4.00 |

## Component Family Analysis

Error distribution by component family:

| Family | Components | Total Errors | External Impact |
|--------|------------|--------------|----------------|
| Homepage | 48 | 78 | 312.00 |
| Registration | 53 | 72 | 167.18 |
| Other | 15 | 28 | 106.61 |
| Common Components | 17 | 10 | 23.22 |
| Utilities | 11 | 32 | 0.00 |
| shared | 27 | 34 | 0.00 |
| Hooks | 5 | 2 | 0.00 |

## Error Propagation Patterns

### Ripple Effect Components

These components have errors that propagate widely throughout the codebase:

1. **FloatingIcon** (features/Homepage/Features/components/FloatingIcon.tsx)
   - Errors: 2
   - Dependents: 4
   - Impact Score: 18.40
   - Impacted Components: 8

2. **media** (types/media.ts)
   - Errors: 1
   - Dependents: 10
   - Impact Score: 14.00
   - Impacted Components: 14

### Error Hub Components

These components have both many errors and many dependents:

### Foundation Component Errors

These utility, context, or widely-used components have errors:

1. **useMedicalCustomizationState** (features/Registration/Journey/CustomizedMedical/hooks/useMedicalCustomizationState.ts)
   - Type: Hook
   - Errors: 12
   - Dependents: 0

2. **providers** (test/utils/providers.tsx)
   - Type: Utility
   - Errors: 11
   - Dependents: 0

3. **testIntegration** (features/Registration/tests/utils/testIntegration.ts)
   - Type: Utility
   - Errors: 7
   - Dependents: 0

4. **MedicalCustomizationContext** (features/Registration/Journey/CustomizedMedical/context/MedicalCustomizationContext.tsx)
   - Type: Context
   - Errors: 7
   - Dependents: 1

5. **testing-library** (test/context-utils/testing-library.tsx)
   - Type: Utility
   - Errors: 6
   - Dependents: 0

6. **CustomizationContext** (features/Registration/Journey/CustomizeExperience/context/CustomizationContext.tsx)
   - Type: Context
   - Errors: 6
   - Dependents: 1

7. **applyThemeTokens** (features/Homepage/Training/utils/applyThemeTokens.ts)
   - Type: Utility
   - Errors: 6
   - Dependents: 0

8. **logger** (utils/logger.ts)
   - Type: Utility
   - Errors: 5
   - Dependents: 0

9. **debug** (utils/debug.tsx)
   - Type: Utility
   - Errors: 4
   - Dependents: 0

10. **useCustomizationState** (features/Registration/Journey/CustomizeExperience/hooks/useCustomizationState.ts)
   - Type: Hook
   - Errors: 4
   - Dependents: 0

### Isolated Error Components

These components have errors but minimal propagation impact:

1. **useMedicalCustomizationState** (features/Registration/Journey/CustomizedMedical/hooks/useMedicalCustomizationState.ts)
   - Errors: 12
   - Propagation: None (no dependents)

2. **test-utils** (test/test-utils.tsx)
   - Errors: 11
   - Propagation: None (no dependents)

3. **providers** (test/utils/providers.tsx)
   - Errors: 11
   - Propagation: None (no dependents)

4. **FormExample** (features/shared/examples/FormExample.tsx)
   - Errors: 9
   - Propagation: None (no dependents)

5. **ButtonExample** (features/Homepage/Journey/examples/ButtonExample.tsx)
   - Errors: 9
   - Propagation: None (no dependents)

6. **Homepage** (features/Homepage/Homepage.tsx)
   - Errors: 8
   - Propagation: None (no dependents)

7. **App** (App.tsx)
   - Errors: 7
   - Propagation: None (no dependents)

8. **useForm** (features/shared/FormField/useForm.ts)
   - Errors: 7
   - Propagation: None (no dependents)

9. **testIntegration** (features/Registration/tests/utils/testIntegration.ts)
   - Errors: 7
   - Propagation: None (no dependents)

10. **testing-library** (test/context-utils/testing-library.tsx)
   - Errors: 6
   - Propagation: None (no dependents)

## Remediation Strategy Recommendations

### 1. Foundation First Approach

Fix errors in foundation components first, as they have the highest propagation impact:

- Utility functions
- Context providers
- Shared hooks
- Common UI components

### 2. Error Hub Targeting

After fixing foundation components, target error hubs to maximize impact:

- Components with both high error counts and many dependents
- Components at the root of critical error chains

### 3. Family-Based Approach

Fix related components together to maintain consistency:

- Group fixes by component family
- Create consistent type patterns within families

### 4. Isolated Error Cleanup

Finally, clean up isolated errors with minimal dependencies:

- These can be fixed independently without risk of breakage
- Good candidates for parallel work streams

