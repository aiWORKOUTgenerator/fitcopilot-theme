# Type Guard Migration Map

## Overview

This document maps the migration of type guards from their original locations to the new centralized structure under `/utils/typeGuards/`. 

## Migration Pattern

The project has adopted a new pattern for type guards:

1. **Type Definitions**: Located in `/types/[component].ts`
2. **Type Guard Implementations**: Moved to `/utils/typeGuards/[component]TypeGuards.ts`
3. **Naming Convention**: Functions follow `is[Variant][Component]` pattern (e.g., `isContentCard`)

## Type Guard Function Mapping

| Function Name | Old Location | New Location | Interface Type Guarded | Import Changes Required |
|---------------|--------------|--------------|------------------------|-------------------------|
| `isImageMedia` | `src/features/shared/Media/types.ts` | `src/utils/typeGuards/mediaTypeGuards.ts` | `ImageMediaProps` | Change from `import { isImageMedia } from '../types'` to `import { isImageMedia } from '../../../utils/typeGuards/mediaTypeGuards'` |
| `isVideoMedia` | `src/features/shared/Media/types.ts` | `src/utils/typeGuards/mediaTypeGuards.ts` | `VideoMediaProps` | Change from `import { isVideoMedia } from '../types'` to `import { isVideoMedia } from '../../../utils/typeGuards/mediaTypeGuards'` |
| `isAudioMedia` | `src/features/shared/Media/types.ts` | `src/utils/typeGuards/mediaTypeGuards.ts` | `AudioMediaProps` | Change from `import { isAudioMedia } from '../types'` to `import { isAudioMedia } from '../../../utils/typeGuards/mediaTypeGuards'` |
| `isYouTubeMedia` | `src/features/shared/Media/types.ts` | `src/utils/typeGuards/mediaTypeGuards.ts` | `YouTubeMediaProps` | Change from `import { isYouTubeMedia } from '../types'` to `import { isYouTubeMedia } from '../../../utils/typeGuards/mediaTypeGuards'` |
| `isImageGallery` | `src/features/shared/Media/types.ts` | `src/utils/typeGuards/mediaTypeGuards.ts` | `ImageGalleryProps` | Change from `import { isImageGallery } from '../types'` to `import { isImageGallery } from '../../../utils/typeGuards/mediaTypeGuards'` |
| `isMediaCarousel` | `src/features/shared/Media/types.ts` | `src/utils/typeGuards/mediaTypeGuards.ts` | `MediaCarouselProps` | Change from `import { isMediaCarousel } from '../types'` to `import { isMediaCarousel } from '../../../utils/typeGuards/mediaTypeGuards'` |
| `isLinkButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `LinkButtonProps` | Change from `import { isLinkButton } from './types'` to `import { isLinkButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isActionButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `ActionButtonProps` | Change from `import { isActionButton } from './types'` to `import { isActionButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isPrimaryButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `PrimaryButtonProps` | Change from `import { isPrimaryButton } from './types'` to `import { isPrimaryButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isSecondaryButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `SecondaryButtonProps` | Change from `import { isSecondaryButton } from './types'` to `import { isSecondaryButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isTextButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `TextButtonProps` | Change from `import { isTextButton } from './types'` to `import { isTextButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isIconButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `IconButtonProps` | Change from `import { isIconButton } from './types'` to `import { isIconButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isToggleButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `ToggleButtonProps` | Change from `import { isToggleButton } from './types'` to `import { isToggleButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isFloatingActionButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `FloatingActionButtonProps` | Change from `import { isFloatingActionButton } from './types'` to `import { isFloatingActionButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isWorkoutButton` | `src/features/shared/Button/types.ts` | `src/utils/typeGuards/buttonTypeGuards.ts` | `WorkoutButtonProps` | Change from `import { isWorkoutButton } from './types'` to `import { isWorkoutButton } from '../../../utils/typeGuards/buttonTypeGuards'` |
| `isContentCard` | `src/features/shared/Card/types.ts` | `src/utils/typeGuards/cardTypeGuards.ts` | `ContentCardProps` | Change from `import { isContentCard } from '../types'` to `import { isContentCard } from '../../../utils/typeGuards/cardTypeGuards'` |
| `isProfileCard` | `src/features/shared/Card/types.ts` | `src/utils/typeGuards/cardTypeGuards.ts` | `ProfileCardProps` | Change from `import { isProfileCard } from '../types'` to `import { isProfileCard } from '../../../utils/typeGuards/cardTypeGuards'` |
| `isWorkoutCard` | `src/features/shared/Card/types.ts` | `src/utils/typeGuards/cardTypeGuards.ts` | `WorkoutCardProps` | Change from `import { isWorkoutCard } from '../types'` to `import { isWorkoutCard } from '../../../utils/typeGuards/cardTypeGuards'` |
| `isProgramCard` | `src/features/shared/Card/types.ts` | `src/utils/typeGuards/cardTypeGuards.ts` | `ProgramCardProps` | Change from `import { isProgramCard } from '../types'` to `import { isProgramCard } from '../../../utils/typeGuards/cardTypeGuards'` |
| `isPricingCard` | `src/features/shared/Card/types.ts` | `src/utils/typeGuards/cardTypeGuards.ts` | `PricingCardProps` | Change from `import { isPricingCard } from '../types'` to `import { isPricingCard } from '../../../utils/typeGuards/cardTypeGuards'` |

## Discriminator Property Pattern

The project uses two distinct discriminator property patterns:

1. **`type` discriminator**: Used when components represent fundamentally different HTML elements
   - Example: Media components use `type` because "image" vs "video" are different base HTML elements

2. **`variant` discriminator**: Used when components are styling variations of the same base element
   - Example: Button components use `variant` because all buttons share the same base element

## Notable Migration Changes

### Media Type Guards

- **Old pattern**: Type guards were part of the component's types file
- **New pattern**: Type guards are in a dedicated file under utils
- **Key change**: The discriminator property name has changed from `variant` to `type` in some cases

### Button Type Guards

- **Old approach**: Most type guards were defined in the component type file
- **New approach**: Centralized in buttonTypeGuards.ts
- **Additional guards**: New utility guards like `isDisabled` and `isLoading` were added

### Card Type Guards

- **Pattern**: Consistent with other components, moved to cardTypeGuards.ts
- **Additional utils**: Additional utility guards like `hasMedia` and `hasError` were added

## Affected Test Files

Tests that need to be updated with new import paths include:

1. `src/features/shared/Media/__tests__/Media.type-guards.test.ts`
2. `src/features/shared/Media/__tests__/typeGuards.test.ts`
3. `src/features/shared/Button/Button.test.tsx`
4. `src/utils/__tests__/cardTypeGuards.test.ts`

## Import Fix Script Example

```javascript
// Example script to automatically update imports in test files
const fs = require('fs');
const path = require('path');

const importMappings = {
  // Media mappings
  "import { isImageMedia } from '../types'": "import { isImageMedia } from '../../../utils/typeGuards/mediaTypeGuards'",
  "import { isVideoMedia } from '../types'": "import { isVideoMedia } from '../../../utils/typeGuards/mediaTypeGuards'",
  // Button mappings
  "import { isActionButton } from './types'": "import { isActionButton } from '../../../utils/typeGuards/buttonTypeGuards'",
  "import { isLinkButton } from './types'": "import { isLinkButton } from '../../../utils/typeGuards/buttonTypeGuards'",
  // Add more mappings as needed
};

function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [oldImport, newImport] of Object.entries(importMappings)) {
    if (content.includes(oldImport)) {
      content = content.replace(oldImport, newImport);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
}

// Example usage
updateImports('src/features/shared/Media/__tests__/Media.type-guards.test.ts');
``` 