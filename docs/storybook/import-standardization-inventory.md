# Story Import Path Standardization Inventory

## Component Categories

Based on our codebase analysis, we've identified three main component directory structures:

- **Type A**: Component in root directory (`/ComponentName/ComponentName.tsx`)
- **Type B**: Component in components subdirectory (`/ComponentName/components/ComponentName.tsx`) 
- **Type C**: Component inside feature directory (`/Feature/components/ComponentName/ComponentName.tsx`)
- **Type D**: Component directly in components directory (`/Feature/components/ComponentName.tsx`)

## Current Import Patterns

| Story File | Component Type | Current Import Pattern | Target Pattern | Status |
|------------|---------------|------------------------|---------------|--------|
| Button.stories.tsx | Type B | `import { Button } from '../components';` | `import { Button } from '../components';` | ✅ Correct |
| Card.stories.tsx | Type B | `import { Card } from '../components';` | `import { Card } from '../components';` | ✅ Correct |
| FormField.stories.tsx | Type A | `import { FormField } from '../';` | `import { FormField } from '../';` or `import { FormField } from '../FormField';` | ⚠️ Review |
| Modal.stories.tsx | Type A | `import { Modal } from '../Modal';` | `import { Modal } from '../Modal';` | ✅ Correct - Type A confirmed |
| HeroButton.stories.tsx | Type C | `import { HeroButton } from '../HeroButton';` | `import { HeroButton } from '../HeroButton';` | ✅ Correct |
| JourneyButton.stories.tsx | Type C | `import { JourneyButton } from '../JourneyButton';` | `import { JourneyButton } from '../JourneyButton';` | ✅ Correct |
| JourneyStep.stories.tsx | Type D | `import JourneyStep from '../../JourneyStep';` | `import { JourneyStep } from '../../JourneyStep';` | ❌ Update |

## Type Imports

| Story File | Current Type Import | Target Import | Status |
|------------|-------------------|---------------|--------|
| Card.stories.tsx | `import { CardProps } from '../types';` | `import { CardProps } from '../types';` | ✅ Correct |
| Modal.stories.tsx | `import { ModalSize } from '../types';` | `import { ModalSize } from '../types';` | ✅ Correct |
| JourneyStep.stories.tsx | `import { DetailedFeature, JourneyStepProps, JourneyStep as JourneyStepType } from '../../../types';` | `import { DetailedFeature, JourneyStepProps } from '../../../types';` | ⚠️ Avoid re-importing JourneyStep as type |

## React Imports

| Story File | Has React Import | Theme Variants Pattern | Status |
|------------|-------------------|------------------------|--------|
| Button.stories.tsx | No | N/A | ✅ No theme variants |
| Card.stories.tsx | No (via JSX) | JSX | ✅ Correct |
| FormField.stories.tsx | No (via JSX) | JSX | ✅ Correct |
| Modal.stories.tsx | Yes | JSX | ✅ Correct |
| HeroButton.stories.tsx | Yes | createElement | ❌ Update to JSX |
| JourneyButton.stories.tsx | Yes | createElement | ❌ Update to JSX |
| JourneyStep.stories.tsx | Yes | JSX | ✅ Correct |

## Standardization Plan

1. **Highest Priority**:
   - Update JourneyStep.stories.tsx import path to use named import format
   - Convert HeroButton and JourneyButton ThemeVariants to use JSX pattern for consistency

2. **Secondary Priority**:
   - Standardize FormField import to explicit pattern (`import { FormField } from '../FormField';`)
   - Fix JourneyStep.stories.tsx to avoid re-importing JourneyStep as JourneyStepType

3. **Documentation**:
   - Add import pattern rules to the story standards doc:
     - Type A: `import { ComponentName } from '../ComponentName';`
     - Type B: `import { ComponentName } from '../components';`
     - Type C: `import { ComponentName } from '../ComponentName';`
     - Type D: `import { ComponentName } from '../../ComponentName';`
   - Standardize theme variants to always use JSX pattern 