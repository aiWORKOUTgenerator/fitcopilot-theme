# CSS Selector Optimization Guide

## Overview

This guide outlines our approach to CSS selector optimization as part of the FitCopilot Performance Optimization Plan. Following these guidelines will help reduce CSS bundle size, improve rendering performance, and maintain a consistent styling architecture across the theme.

## Key Principles

### 1. Reduce Nesting Depth

- **Maximum 3 Levels Deep**: Keep nesting to a maximum of 3 levels.
- **Before**:
```scss
.hero {
  .content {
    .card {
      .title {
        .highlight {
          span {
            color: red;
          }
        }
      }
    }
  }
}
```

- **After**:
```scss
.hero {
  .content {
    .card-title-highlight {
      color: red;
    }
  }
}
```

### 2. Use Direct Child Selectors

- **Be Specific**: Use `>` for direct children to prevent cascade issues.
- **Before**:
```scss
.navbar .menu .item {
  // Styles
}
```

- **After**:
```scss
.navbar > .menu > .item {
  // Styles
}
```

### 3. Avoid Universal Selectors

- **Be Targeted**: Avoid `*` selector when possible.
- **Before**:
```scss
.container * {
  margin: 0;
}
```

- **After**:
```scss
.container > .item {
  margin: 0;
}
```

### 4. Minimize Complex Selectors

- **Simplify Chains**: Avoid long selector chains.
- **Before**:
```scss
.sidebar .widget .widget-title h4 span.icon {
  // Styles
}
```

- **After**:
```scss
.widget-title-icon {
  // Styles
}
```

### 5. Prefer Classes Over Element Selectors

- **Be Specific**: Use classes for better specificity control.
- **Before**:
```scss
header nav ul li a {
  // Styles
}
```

- **After**:
```scss
.nav-link {
  // Styles
}
```

## CSS Module Structure

When implementing CSS Modules, follow this structure:

```scss
// Component class
.component {
  // Base properties
  
  // Direct child elements
  &__element {
    // Element properties
  }
  
  // Element states
  &__element--state {
    // State properties
  }
}

// Theme variants using data attributes
[data-theme="variant"] .component {
  // Variant-specific overrides
}
```

## Performance Tips

1. **Group Related Selectors**: Consolidate related selectors to reduce repetition.
2. **Avoid @extend**: Prefer mixins or direct class application over @extend.
3. **Use :is() and :where()**: For modern browsers, use these to simplify selectors.
4. **Minimize Redundant Properties**: Look for repeated properties that can be combined.
5. **Use Shorthand Properties**: Prefer `margin: 0 1rem;` over separate properties.

## Optimization Examples from FitCopilot

### Example 1: Hero Component

**Before:**
```scss
.hero {
  .hero-content {
    .hero-headline {
      .hero-headline-text {
        color: var(--hero-headline-color);
      }
    }
  }
}
```

**After:**
```scss
.hero {
  &__content {
    // Content styles
  }
  
  &__headline {
    color: var(--hero-headline-color);
  }
}
```

### Example 2: Navigation Menu

**Before:**
```scss
.nav {
  .nav-menu {
    .nav-item {
      .nav-link {
        // Link styles
      }
      
      .nav-link:hover {
        // Hover styles
      }
    }
  }
}
```

**After:**
```scss
.nav {
  &__menu {
    // Menu styles
  }
  
  &__link {
    // Link styles
    
    &:hover {
      // Hover styles
    }
  }
}
```

## Implementation Checklist

When optimizing component SCSS files:

1. [ ] Reduce nesting to maximum 3 levels
2. [ ] Replace descendant selectors with direct child selectors where appropriate
3. [ ] Remove unused selectors and properties
4. [ ] Consolidate duplicate properties
5. [ ] Use shorthand properties where possible
6. [ ] Apply theme variant overrides using data attributes
7. [ ] Test across all supported browsers

## Tools

- **Stylelint**: Our configuration enforces many of these rules automatically
- **Webpack Bundle Analyzer**: Helps identify large CSS chunks
- **PurgeCSS**: Removes unused CSS from our production builds 