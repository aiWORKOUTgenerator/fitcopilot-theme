# Feature Card Visibility Fix

## Issue Description
After implementing the centralized animation system, the feature cards within expanded Journey steps were not displaying because they were set to `opacity: 0` by the `.animate-on-scroll` class but were not getting properly triggered to become visible.

## Root Cause
The centralized animation system was setting `opacity: 0` on elements with the `animate-on-scroll` class, but dynamically added content (like expanded feature cards) wasn't being processed by the animation system's mutation observer quickly enough.

## Solution Applied

### 1. Removed Problematic Animation Classes
**Before:**
```jsx
<div
  className="animate-on-scroll"
  data-animation="fade-up"
  data-delay={(featureIndex * 50).toString()}
>
  <JourneyFeatureCard feature={feature} variant={variant} />
</div>
```

**After:**
```jsx
<div
  className="journey-feature-card"
  style={{ 
    opacity: prefersReducedMotion ? 1 : 0,
    transform: prefersReducedMotion ? 'none' : 'translateY(10px)'
  }}
>
  <JourneyFeatureCard feature={feature} variant={variant} />
</div>
```

### 2. Manual Animation Triggering
Added explicit animation handling when content expands:

```typescript
setTimeout(() => {
  const featureCards = element.querySelectorAll('.journey-feature-card');
  featureCards.forEach((card, index) => {
    if (!prefersReducedMotion) {
      (card as HTMLElement).style.animation = `fadeIn 300ms ease-out forwards`;
      (card as HTMLElement).style.animationDelay = `${index * 50}ms`;
    } else {
      (card as HTMLElement).style.opacity = '1';
      (card as HTMLElement).style.transform = 'none';
    }
  });
}, 100);
```

### 3. CSS Fallback Protection
Added CSS rules to ensure feature cards are always visible:

```scss
/* Fallback for feature cards to ensure they're always visible */
[id^="step-content-"] .journey-feature-card {
    opacity: 1 !important;
    transform: none !important;
    
    /* Allow manual animation override */
    &[style*="opacity: 0"] {
        opacity: 0 !important;
    }
}
```

### 4. Reduced Motion Support
Ensured immediate visibility for users who prefer reduced motion:

```typescript
style={{ 
  opacity: prefersReducedMotion ? 1 : 0,
  transform: prefersReducedMotion ? 'none' : 'translateY(10px)'
}}
```

## Benefits of This Approach

1. **✅ Immediate Visibility**: Feature cards are visible regardless of animation system state
2. **✅ Smooth Animations**: Cards still animate nicely when enabled
3. **✅ Accessibility**: Proper reduced motion support
4. **✅ Fallback Protection**: CSS ensures content is never permanently hidden
5. **✅ Performance**: Direct DOM manipulation avoids animation system overhead for dynamic content

## Testing

To verify the fix works:

1. **Expand a Journey step** - Feature cards should be immediately visible
2. **Check reduced motion** - Cards should appear instantly without animation
3. **Check normal motion** - Cards should fade in with staggered delays
4. **Collapse and re-expand** - Animation should work consistently

## Alternative Approaches Considered

1. **Wait for animation system processing** - Too slow and unreliable
2. **Force animation system refresh** - Performance overhead
3. **Use only CSS animations** - Less control over timing and states

The implemented solution provides the best balance of reliability, performance, and user experience.

## Files Modified

- `src/features/Homepage/Journey/components/JourneyStep.tsx` - Main fix
- `src/features/Homepage/Journey/journey-animations.scss` - CSS fallback
- `src/features/Homepage/Journey/FEATURE-CARD-FIX.md` - This documentation 