# Critical Code Patterns For Theme Stability

This document outlines critical patterns that **must be followed** to ensure the theme renders properly.

## 1. React Mount Point

The React application has a single mount point that is defined in the WordPress template and referenced in the React code.

### PHP Template (homepage-template.php)
```php
<!-- React application root element -->
<div id="athlete-dashboard-root" style="display: block; width: 100%; min-height: 500px;"></div>
```

### React Bootstrap (src/index.tsx)
```tsx
// The one and only place that should call createRoot
const rootElementId = 'athlete-dashboard-root';
const el = document.getElementById(rootElementId);
```

**⚠️ CRITICAL: Never change this ID or create alternative mount points.**

If this ID is changed in either location (or if they don't match), the entire React application will silently fail to mount with no console errors.

## 2. SCSS Design System Imports

Every SCSS file in the `src/features` directory **must** begin with the canonical design system import:

```scss
// Canonical design system import - MUST BE FIRST
@import '../../../styles/design-system/index';
```

For files in subdirectories, adjust the path accordingly:

```scss
// In a subdirectory (e.g. components folder)
@import '../../../../styles/design-system/index';
```

**⚠️ CRITICAL: If this import is missing or incorrect**, all CSS rules in that file (and many that follow in the bundle) will be silently dropped, resulting in a "blank" page with only the global background color showing.

## 3. CSS Variable (Token) References

When using CSS variables (tokens) in your SCSS:

1. Ensure the token is actually defined in one of the design system files:
   - `src/styles/design-system/_component-tokens.scss`
   - `src/styles/design-system/_typography.scss`
   - etc.

2. Use the correct token name with exact spelling and casing:
   ```scss
   // Correct
   color: var(--color-background);
   
   // Incorrect (token doesn't exist)
   color: var(--color-bg); 
   ```

**⚠️ CRITICAL: If a token doesn't exist**, the entire CSS rule where it's used will be silently dropped.

## 4. Verification Tools

We've added verification tools to help catch these issues:

```bash
# Check mount point consistency
npm run verify:mount

# Check for missing SCSS imports
npm run verify:scss

# Run all verifications
npm run verify:all
```

These checks also run automatically:
- As a pre-build step (`npm run build`)
- In the pre-commit hook (if you have Husky installed)

## 5. When Adding New Components

1. Start with the canonical imports in your SCSS file
2. Copy tokens from existing components or add new ones to `_component-tokens.scss`
3. Verify with `npm run verify:all` before committing

By following these critical patterns, you'll avoid the silent rendering failures that can occur when these patterns are broken. 