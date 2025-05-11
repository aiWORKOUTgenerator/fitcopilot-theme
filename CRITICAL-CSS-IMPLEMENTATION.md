# Critical CSS Implementation

## Overview
This document describes the implementation of critical CSS extraction and inlining for the FitCopilot WordPress theme.

## What is Critical CSS?
Critical CSS is the minimum CSS required to render the above-the-fold content of a webpage. By inlining this CSS directly in the HTML `<head>`, we can significantly improve the perceived load time of the page and key performance metrics like First Contentful Paint (FCP).

## Implementation Details

### 1. Critical CSS Files
We've created dedicated critical CSS files for above-the-fold components:

- **`src/styles/critical.scss`**: Main critical CSS entry point that imports all component-specific critical styles
- **`src/features/Homepage/Hero/critical.scss`**: Critical styles for the Hero component
- **`src/components/Layout/Header/critical.scss`**: Critical styles for the Header/Navigation component

These files contain only the essential styles needed for initial rendering, keeping the critical CSS bundle as small as possible.

### 2. Webpack Configuration
The webpack configuration already had the necessary setup for extracting CSS:

```javascript
// Webpack entry points including critical CSS
entry: {
  'critical': './src/styles/critical.scss',
  'homepage': ['./src/index.tsx', './src/styles/homepage.scss'],
  'debug': './src/debug.js'
},

// MiniCssExtractPlugin for CSS extraction
new MiniCssExtractPlugin({
  filename: '[name].[contenthash].css'
})
```

This configuration extracts the critical CSS into a separate file with cache busting.

### 3. PHP Implementation
We've created a dedicated PHP module (`inc/critical-css.php`) that:

- Reads the compiled critical CSS file from the dist directory
- Performs basic minification
- Inlines the CSS directly in the document head
- Adds preload tags for non-critical CSS files
- Dequeues the external critical CSS file to prevent duplicate loading

### 4. Template Modifications
The `homepage-template.php` file was updated to:

- Add our critical CSS output function to the `wp_head` action
- Load React synchronously in the head for faster initialization
- Implement preloading for JavaScript chunks
- Add asynchronous loading for non-critical CSS using `onload` handlers
- Include performance monitoring code to track metrics

## Performance Improvements

- **Critical CSS Size**: ~30KB (reduced from 190KB+ for the full CSS)
- **Render-Blocking Resources**: Reduced by moving non-critical CSS to async loading
- **First Contentful Paint**: Improved by eliminating render-blocking CSS

## Usage

The critical CSS implementation is automatically applied to pages using React-based templates through the WordPress template system. No additional configuration is needed.

## Monitoring

Performance monitoring has been added to track key metrics:

```javascript
// Performance metrics tracking
window.performance && window.performance.mark && window.performance.mark("critical-css-loaded");
window.performance.measure("critical-render-time", "navigationStart", "critical-css-loaded");
```

These metrics are logged to the console and can be used for further analysis.

## Next Steps

1. Further optimize the critical CSS size (currently ~30KB, target <20KB)
2. Implement more granular critical CSS extraction for additional components
3. Add automated testing for performance regressions
4. Integrate with Core Web Vitals monitoring

## References

- [Web.dev: Extract Critical CSS](https://web.dev/articles/extract-critical-css)
- [Google Developers: Render-Blocking Resources](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css)
- [WordPress Developer: Enqueuing Scripts and Styles](https://developer.wordpress.org/themes/basics/including-css-javascript/) 