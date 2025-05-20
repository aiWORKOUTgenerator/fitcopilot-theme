# Storybook Troubleshooting Guide

This guide addresses common issues encountered when working with Storybook in the FitCopilot theme.

## Startup Issues

### Storybook Fails to Start

**Symptoms:**
- Terminal shows errors when running `npm run storybook`
- Process terminates unexpectedly
- Browser doesn't open automatically

**Solutions:**
1. **Kill lingering processes:**
   ```bash
   pkill -f storybook
   ```

2. **Clear Storybook cache:**
   ```bash
   rm -rf node_modules/.cache/storybook
   ```

3. **Use clean start script:**
   ```bash
   ./scripts/start-storybook-clean.sh
   ```

4. **Check for port conflicts:**
   - Verify port 6006 isn't in use by another application
   - Change port with `npm run storybook -- -p 6007`

### Webpack Compilation Errors

**Symptoms:**
- Terminal shows webpack errors
- Messages about missing modules or loaders

**Solutions:**
1. **Clear module cache:**
   ```bash
   rm -rf node_modules/.cache
   ```

2. **Reinstall dependencies:**
   ```bash
   npm ci
   ```

3. **Check for module resolution issues:**
   - Verify tsconfig.json paths
   - Check webpack aliases in .storybook/main.js

## Component Display Issues

### Components Not Rendering

**Symptoms:**
- Component shows as empty in Storybook
- Console shows React errors

**Solutions:**
1. **Check import paths:**
   - Verify component imports use correct relative paths
   - Use named imports with curly braces: `import { Component } from '../Component'`

2. **Check props:**
   - Ensure required props are provided in story args
   - Use mock data for complex props

3. **Check context providers:**
   - Verify component doesn't require context providers not in Storybook
   - Add missing providers to .storybook/preview.tsx

### Styling Issues

**Symptoms:**
- Components appear unstyled
- Layout looks broken compared to application

**Solutions:**
1. **Check CSS imports:**
   - Verify main.js includes proper SCSS/CSS loaders
   - Check for missing global styles

2. **Check theme support:**
   - Verify `data-theme` attribute is present
   - Check ThemeProvider wrapper in preview.tsx
   - Inspect CSS variables using browser DevTools

3. **Clear browser cache:**
   - Use Ctrl+Shift+R for hard refresh
   - Clear application cache in DevTools

## Theme-Specific Issues

### Theme Switching Not Working

**Symptoms:**
- Changing themes in toolbar has no effect
- Theme colors don't update

**Solutions:**
1. **Check global theme configuration:**
   - Verify preview.tsx includes theme configuration
   - Check for globalTypes definition with theme options

2. **Verify theme inheritance:**
   - Ensure HTML and body elements inherit theme attributes
   - Check for CSS specificity issues overriding theme variables

3. **Use theme test controls:**
   - Run theme tests using the built-in controls
   - Check console for detailed theme diagnostics

### Theme Variables Missing

**Symptoms:**
- Component uses default colors instead of theme colors
- CSS variables not resolving

**Solutions:**
1. **Verify CSS variable usage:**
   - Component should use variables like `var(--color-primary)`
   - Avoid hardcoded color values

2. **Check theme CSS:**
   - Verify theme CSS is loaded
   - Check variable definitions in DevTools

## Documentation Issues

### Autodocs Not Generating

**Symptoms:**
- Docs tab missing or empty
- Props table not showing

**Solutions:**
1. **Check meta configuration:**
   - Verify `tags: ['autodocs']` is included in meta
   - Check that component is properly exported

2. **Check TypeScript props:**
   - Ensure props interface is properly defined and exported
   - Add JSDoc comments to props for better documentation

3. **Update Storybook configuration:**
   - Verify TypeScript configurations in main.js
   - Check for proper docgen settings

## Performance Issues

### Storybook Loads Slowly

**Symptoms:**
- Long startup times
- Browser becomes unresponsive

**Solutions:**
1. **Optimize story loading:**
   - Use more specific globs in main.js
   - Consider code-splitting for large components

2. **Reduce addon overhead:**
   - Disable unnecessary addons in main.js
   - Use addon panels selectively

3. **Check for infinite loops:**
   - Verify no components are causing render loops
   - Check for side effects in stories

## Migration Issues

### Legacy Story Format Problems

**Symptoms:**
- Stories using older Component Story Format (CSF)
- Deprecation warnings in console

**Solutions:**
1. **Use migration script:**
   ```bash
   node scripts/migrate-stories.js
   ```

2. **Follow current story standards:**
   - Use the template in docs/templates/ComponentStory.template.tsx
   - Follow the structure in docs/storybook/story-standards.md

3. **Verify story location:**
   - Stories should be in component-adjacent folders
   - Update barrel exports if needed

## When All Else Fails

If you've tried the solutions above and still encounter issues:

1. **Complete reset:**
   ```bash
   rm -rf node_modules
   rm -rf storybook-static
   npm cache clean --force
   npm ci
   ```

2. **Diagnostic mode:**
   ```bash
   npm run storybook -- --debug-webpack
   ```

3. **Check logs:**
   - Examine build-storybook.log for detailed errors
   - Use browser DevTools console for runtime errors

4. **Isolate the problem:**
   - Create a minimal reproduction case
   - Test one component at a time

5. **Ask for help:**
   - Share error logs and reproduction steps
   - Reference this guide when describing attempted solutions 