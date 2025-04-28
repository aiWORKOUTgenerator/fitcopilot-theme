# Critical Code Patterns for FitCopilot Theme

## React Bootstrap Pattern

The **single most important pattern** in our codebase is the React bootstrap. We've had issues with React not mounting properly due to duplicate entry points or mismatched mount-point IDs.

### The Correct Pattern

1. **One and Only One Entry Point:** `src/index.tsx` 
   - ❗ **NEVER** point `webpack.config.js` at anything but `src/index.tsx`
   - This file contains your one‐and‐only `createRoot(…)` and `console.log("🚀 React bootstrap…")`
2. **One and Only One Mount Point:** `<div id="athlete-dashboard-root">` in PHP template
3. **One Root Element ID:** The constant `rootElementId = 'athlete-dashboard-root'` in `src/index.tsx`

### Webpack Configuration

In `webpack.config.js`, the entry MUST always point to `src/index.tsx`:

```js
module.exports = {
  entry: {
    'homepage': ['./src/index.tsx', './src/styles/homepage.scss']
  },
  // ...
};
```

### Template Pattern

In `homepage-template.php`:
```php
<!-- React application root element -->
<div id="athlete-dashboard-root" style="display: block; width: 100%; min-height: 500px;"></div>
```

### React Bootstrap Pattern

In `src/index.tsx`:
```tsx
// The one and only place that should call createRoot
console.log("🚀 React bootstrap running from src/index.tsx");
const rootElementId = 'athlete-dashboard-root';
const el = document.getElementById(rootElementId);

// Fail loudly if container is missing
if (!el) {
  throw new Error(
    `❌ Mount point #${rootElementId} not found in DOM—check your template!`
  );
}

// Mount the application
try {
  createRoot(el).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("✅ App successfully mounted to #" + rootElementId);
} catch (error) {
  console.error("❌ Mount error:", error);
  // Display fallback UI with helpful error message
  el.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Unable to load application</h2>
        <p>Something went wrong with the application. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
}
```

## What to NEVER Do

1. **NEVER create duplicate React bootstraps**
   - No `createRoot` anywhere except in `src/index.tsx`
   - No `ReactDOM.render` anywhere (legacy API)
   - No alternative mount elements

2. **NEVER silently fallback or create dynamic mount points**
   - Always fail loudly if the mount point is missing
   - Don't create DOM elements on the fly for bootstrapping

3. **NEVER have mismatched IDs**
   - PHP: `<div id="athlete-dashboard-root">`
   - JS: `getElementById('athlete-dashboard-root')`
   - Make sure these exact strings match

4. **NEVER load React/ReactDOM twice**
   - Only load React from one source (WP core OR CDN, not both)
   - Always externalize React, ReactDOM, and ReactDOM/client in webpack.config.js
   - Example: `externals: { 'react': 'React', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOM' }`

## How We Enforce This

1. **Pre-commit hooks** verify no stray React bootstraps are introduced
2. **CI pipelines** check mount point consistency
3. **E2E tests** verify successful mounting
4. **Runtime assertion** throws explicit error if mount container is missing

## Why This Matters

Violating these patterns has caused "blank page" issues:
1. Multiple React entry points can race or clobber each other
2. A bootstrap that runs before the mount exists silently fails
3. Mismatched IDs mean React never finds the container
4. **Loading React twice creates two separate instances** - when your bundle uses `createRoot` it's using a different ReactDOM than the global one, causing the mount to silently fail

Any time we make CSS/style refactors or token changes, we risk introducing one of these issues. When that happens, the app appears to be working in development but shows a blank page in production.

**When in doubt, run `./scripts/verify-mount-point.sh` to check your changes.**

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

# Verify bootstrap code is included in the build
npm run verify:bootstrap

# Run all verifications
npm run verify:all
```

These checks also run automatically:
- As a pre-build step (`npm run build`)
- In the pre-commit hook (via Husky)
- In CI/CD pipeline (GitHub Actions)

### Bootstrap Verification

The `verify:bootstrap` script ensures that your build output includes the essential bootstrap code. It checks:

1. That `dist/*.js` files contain the React bootstrap logging message
2. That the webpack entry point is correctly set to `src/index.tsx`

This prevents accidental changes that could lead to the React app not mounting.

### CI/CD Verification

Our GitHub Actions workflow includes additional checks that verify:
1. The built output contains the bootstrap code
2. The webpack configuration has the correct entry point
3. End-to-end tests confirm the app mounts properly

## 5. When Adding New Components

1. Start with the canonical imports in your SCSS file
2. Copy tokens from existing components or add new ones to `_component-tokens.scss`
3. Verify with `npm run verify:all` before committing

By following these critical patterns, you'll avoid the silent rendering failures that can occur when these patterns are broken. 