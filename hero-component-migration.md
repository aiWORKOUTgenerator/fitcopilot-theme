# Hero Component Sass Migration Implementation

This document outlines the step-by-step process for modernizing the Sass implementation in the Hero component, serving as a template for other component migrations.

## Current Files Structure

```
src/features/Homepage/Hero/
├── Hero.tsx                  // Main component 
├── Hero.scss                 // Main styles
├── hero-theme-variables.scss // Theme-specific variables
├── components/
│   ├── FloatingIcons/
│   │   └── FloatingIcons.scss
│   └── VideoPlayer.scss
└── variants/
    └── sports/
        └── sports-hero.scss
```

## Step 1: Update Main Component Style File

### Before (Hero.scss)
```scss
@import './hero-theme-variables.scss';
@import '../../../components/UI/Button/hero/Button.scss';
@import '../../../components/UI/Tooltip/variants/hero/Tooltip.scss';

.hero-section {
  // Existing styles
}
```

### After (Hero.scss)
```scss
// Canonical design system import - MUST BE FIRST
@use '../../../styles/design-system' as ds;

// Component-specific variables and dependencies
@use './hero-theme-variables' as hero;
@use '../../../components/UI/Button/hero/Button' as heroButton;
@use '../../../components/UI/Tooltip/variants/hero/Tooltip' as heroTooltip;

.hero-section {
  position: relative;
  overflow: hidden;
  
  // Replace direct values with design system tokens
  padding: ds.$spacing-xl 0;
  
  // Rest of the existing styles, using namespaced variables where applicable
  
  // Example of using namespaced variable
  .hero-cta {
    background: hero.$hero-cta-background;
  }
}
```

## Step 2: Update Theme Variables File

### Before (hero-theme-variables.scss)
```scss
// Hero theme variables
:root {
  --hero-title-color: #ffffff;
  --hero-subtitle-color: #cccccc;
  // Other variables
}

[data-theme="gym"] {
  --hero-title-color: #ff5722;
  // Other variables
}
```

### After (hero-theme-variables.scss)
```scss
// Hero theme variables
@use '../../../styles/design-system' as ds;

// Define variables that can be used in other files
$hero-title-color: var(--hero-title-color);
$hero-subtitle-color: var(--hero-subtitle-color);
$hero-cta-background: var(--hero-cta-background);

:root {
  --hero-title-color: #ffffff;
  --hero-subtitle-color: #cccccc;
  --hero-cta-background: ds.$color-primary;
  // Other variables
}

[data-theme="gym"] {
  --hero-title-color: #ff5722;
  --hero-cta-background: #ff8a65;
  // Other variables
}
```

## Step 3: Update Component-specific Styles

### Before (FloatingIcons.scss)
```scss
@import '../../hero-theme-variables.scss';

.floating-icons {
  // Existing styles
}
```

### After (FloatingIcons.scss)
```scss
// Canonical design system import - MUST BE FIRST
@use '../../../../../styles/design-system' as ds;
@use '../../hero-theme-variables' as hero;

.floating-icons {
  // Existing styles updated to use namespaced variables
  .icon {
    color: hero.$hero-title-color;
    margin: ds.$spacing-sm;
  }
}
```

### Before (VideoPlayer.scss)
```scss
@import '../../../../styles/design-system/index';

.hero-video-player {
  // Existing styles
}
```

### After (VideoPlayer.scss)
```scss
// Canonical design system import - MUST BE FIRST
@use '../../../../styles/design-system' as ds;

.hero-video-player {
  // Update styles to use namespaced variables
  border-radius: ds.$border-radius-lg;
  box-shadow: ds.$shadow-lg;
  
  // Rest of the existing styles
}
```

## Step 4: Update Variant-specific Styles

### Before (sports-hero.scss)
```scss
@import '../../../../../styles/design-system/index';

.sports-hero {
  // Existing styles
}
```

### After (sports-hero.scss)
```scss
// Canonical design system import - MUST BE FIRST
@use '../../../../../styles/design-system' as ds;
@use '../../../hero-theme-variables' as hero;

.sports-hero {
  // Update styles to use namespaced variables
  background: var(--sport-gradient-primary);
  
  .hero-title {
    font-size: ds.$font-size-4xl;
  }
  
  // Rest of the existing styles
}
```

## Step 5: Testing Process

1. **Visual Verification**:
   - Check all Hero component variants render correctly
   - Verify theme switching functionality works as expected
   - Test responsive behavior at all breakpoints

2. **Build Verification**:
   - Confirm no Sass warnings during build
   - Check output CSS for correctness

3. **Integration Testing**:
   - Ensure Hero component integrates properly with other homepage sections
   - Verify no unintended side effects

## Benefits

1. **Improved Maintainability**:
   - Clear namespacing makes variable origins identifiable
   - Modular file organization prevents global namespace pollution

2. **Better Performance**:
   - `@use` is more efficient than `@import` as it only includes files once
   - More explicit dependency graph

3. **Future-proofing**:
   - Compliant with modern Sass standards
   - Eliminates deprecation warnings

## Notes

- When updating variables that affect multiple components, coordinate changes carefully
- Test theme variants thoroughly as namespace changes might affect variable resolution
- Update component documentation to reflect the new import pattern 