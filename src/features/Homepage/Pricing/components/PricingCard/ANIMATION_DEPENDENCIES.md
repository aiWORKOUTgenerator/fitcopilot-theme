# Pricing Card Animation Dependencies Analysis

## Overview
This document maps all animation logic currently in the main Pricing component that needs to be extracted during the migration phases.

## Animation Systems Identified

### 1. Pro Plan Price Animation Sequence
**Location**: Lines 136-178 in Pricing.tsx  
**State Management**: `animationState` useState hook  
**Dependencies**:
- `createAnimationSequence` function
- `timeoutsRef` for cleanup
- `clearAllTimeouts` function
- `ANIMATION_TIMINGS` constants

**Animation Flow**:
```
normal → exploding → transitioning → betaPrice → normal (loop)
```

**Timing**:
- Explode: 2000ms
- Transition: 3000ms  
- Beta Price: 3500ms
- Reset: 8500ms

**JSX Elements Affected**:
- Price display with gradients
- Explosion particles rendering
- Beta badge appearance
- Price text transitions

### 2. Basic Plan Price Animation Sequence
**Location**: Lines 180-200 in Pricing.tsx  
**State Management**: `basicAnimationState` useState hook  
**Dependencies**:
- Same `createAnimationSequence` function (reused)
- `basicTimeoutsRef` for cleanup
- `clearAllBasicTimeouts` function
- `ANIMATION_TIMINGS` constants (different values)

**Animation Flow**:
```
normal → exploding → transitioning → betaPrice → normal (loop)
```

**Timing**:
- Explode: 3000ms
- Transition: 4000ms
- Beta Price: 4500ms  
- Reset: 9500ms

### 3. Hover State Animations
**Location**: Lines 202-250 in Pricing.tsx  
**State Management**: `tooltipStates` useState hook  
**Dependencies**:
- `handleCardMouseEnter` callback
- `handleCardMouseLeave` callback
- Tooltip visibility logic
- Animation pause/resume logic

**Hover Effects**:
- Pro plan: Shows beta tooltip, maintains animation
- Basic plan: Pauses animation, shows beta price immediately
- Elite plan: Shows trainer tooltip

### 4. Feature Expansion Animations
**Location**: Lines 630-660 in Pricing.tsx  
**State Management**: `expandedFeatures` useState hook  
**Dependencies**:
- `toggleFeatures` callback
- CSS animation classes (`animate-fade-in`)
- Feature list slice logic

**Animation Details**:
- Fade-in animation for newly revealed features
- Smooth height transitions
- Staggered animations for multiple features

### 5. Explosion Particle System
**Location**: Lines 350-400 in Pricing.tsx  
**Dependencies**:
- `renderExplosionParticles` memoized function
- `PARTICLE_CONFIG` constants
- CSS particle animations
- Random positioning calculations

**Particle Details**:
- 10 particles per explosion
- Random angles and distances
- Size variation (2-6px)
- CSS custom properties for animation

### 6. Tooltip Show/Hide Animations
**Location**: Lines 670-720 in Pricing.tsx  
**Dependencies**:
- Tooltip visibility state
- CSS transition classes
- Positioning logic (above CTA button)
- ARIA accessibility attributes

**Tooltip Types**:
- Pro plan: Beta pricing information
- Elite plan: Trainer certification details
- Basic plan: Free access messaging

## CSS Animation Dependencies

### 1. Price Animation Classes
**File**: Pricing.scss  
**Classes**:
- `.price-shake` - Shake animation during explosion
- `.price-flash` - Flash effect during explosion
- `.price-fade-out` - Fade out during transition
- `.price-fade-in` - Fade in for new price
- `.price-zoom-in` - Zoom in effect for beta price

### 2. Particle Animation Classes
**File**: Pricing.scss  
**Classes**:
- `.price-particle` - Base particle styles
- `.animate-particle-explode` - Explosion animation
- `@keyframes particleExplode` - Particle movement

### 3. Tooltip Animation Classes
**File**: Pricing.scss  
**Classes**:
- `.plan-tooltip-cta` - Tooltip container
- `.tooltip-fade-in-up` - Entrance animation
- `.tooltip-fade-out-down` - Exit animation

### 4. Feature Animation Classes
**File**: Pricing.scss  
**Classes**:
- `.animate-fade-in` - Feature reveal animation
- `@keyframes fade-in` - Fade and slide up effect

## State Dependencies Map

### Animation State Variables
```typescript
const [animationState, setAnimationState] = useState<AnimationState>('normal');
const [basicAnimationState, setBasicAnimationState] = useState<AnimationState>('normal');
const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
const [tooltipStates, setTooltipStates] = useState({
  showBetaTooltip: boolean;
  showEliteTooltip: boolean;
  isBasicCardHovered: boolean;
  isProCardHovered: boolean;
});
```

### Refs for Cleanup
```typescript
const timeoutsRef = useRef<number[]>([]);
const basicTimeoutsRef = useRef<number[]>([]);
```

### Callback Dependencies
```typescript
const clearAllTimeouts = useCallback(/* ... */);
const clearAllBasicTimeouts = useCallback(/* ... */);
const createAnimationSequence = useCallback(/* ... */);
const handleCardMouseEnter = useCallback(/* ... */);
const handleCardMouseLeave = useCallback(/* ... */);
const toggleFeatures = useCallback(/* ... */);
```

## useEffect Dependencies

### 1. Pro Plan Animation Loop
```typescript
useEffect(() => {
  if (!enablePriceAnimation) return;
  const cleanup = createAnimationSequence(setAnimationState, timeoutsRef, ANIMATION_TIMINGS);
  return cleanup;
}, [createAnimationSequence, clearAllTimeouts, enablePriceAnimation]);
```

### 2. Basic Plan Animation Loop
```typescript
useEffect(() => {
  if (!enablePriceAnimation) return;
  const cleanup = createAnimationSequence(setBasicAnimationState, basicTimeoutsRef, BASIC_ANIMATION_TIMINGS);
  return cleanup;
}, [createAnimationSequence, clearAllBasicTimeouts, enablePriceAnimation]);
```

## Extraction Strategy

### Phase 2: Price Component
- Extract `renderExplosionParticles` to PricingCardPrice
- Move price animation JSX logic to PricingCardPrice
- Create `usePricingCardAnimations` hook for state management

### Phase 3: Features Component  
- Extract feature expansion logic to PricingCardFeatures
- Move `toggleFeatures` callback to features component
- Maintain fade-in animations for expanded features

### Phase 4: Tooltip Integration
- Extract tooltip logic to PricingCardTooltip
- Move hover state management to individual components
- Maintain tooltip positioning and accessibility

### Phase 5: Integration
- Connect all sub-components through main PricingCard
- Ensure animation synchronization between components
- Verify all interactions work identically

## Critical Integration Points

### 1. Animation State Coordination
- Pro and Basic animations run independently
- Hover states can interrupt/resume animations
- Feature expansion is independent of price animations

### 2. Performance Considerations
- useCallback for all animation functions
- useMemo for particle rendering
- Proper cleanup of timeouts on unmount

### 3. Accessibility Requirements
- ARIA live regions for price changes
- Screen reader announcements for animations
- Reduced motion support for all animations

## Risk Areas

### 1. High Risk
- Animation timing synchronization across components
- State management coupling between price and hover states
- CSS specificity when moving styles to component files

### 2. Medium Risk
- Particle rendering performance
- Tooltip positioning when extracted
- Feature expansion smooth transitions

### 3. Low Risk
- Basic JSX structure extraction
- Type definitions and prop passing
- Static styling and layout 