# RegistrationButton Visual Specifications

> **Version**: 1.0.0  
> **Date**: Current Implementation  
> **Purpose**: Complete visual baseline documentation for refactoring

## 📋 **Overview**

This document provides comprehensive visual specifications for the RegistrationButton component to ensure visual consistency during refactoring. These specifications represent the exact current implementation and must be preserved.

---

## 🎨 **Color Specifications**

### **Primary Variant**

#### **Background Colors**
- **Gradient**: `linear-gradient(to right, #4ade80, #059669)`
  - **Start Color**: `#4ade80` (CSS var: `--color-green-400, #4ade80`)
  - **End Color**: `#059669` (CSS var: `--color-emerald-600, #059669`)
  - **Direction**: `to right` (horizontal gradient)

#### **Text Color**
- **Default**: `white` (solid)

#### **Hover State Colors**
- **Glow Border**: `rgba(74, 222, 128, 0.3)` (1px border effect)
- **Outer Glow**: `rgba(74, 222, 128, 0.2)` (8px blur with 2px spread)

### **Secondary Variant**

#### **Background Colors**
- **Default**: `transparent`
- **Hover**: `rgba(74, 222, 128, 0.1)` (10% opacity green overlay)

#### **Border**
- **Default**: `1px solid #4ade80` (CSS var: `--color-green-400, #4ade80`)
- **Hover Enhancement**: `rgba(74, 222, 128, 0.5)` (1px enhanced border)

#### **Text Color**
- **Default**: `#4ade80` (CSS var: `--color-green-400, #4ade80`)

#### **Hover State Colors**
- **Enhanced Border**: `rgba(74, 222, 128, 0.5)` (0px offset, 1px border)
- **Subtle Glow**: `rgba(74, 222, 128, 0.15)` (6px blur with 1px spread)

### **Tertiary Variant**

#### **Background Colors**
- **Default**: `transparent`
- **Hover**: `rgba(74, 222, 128, 0.05)` (5% opacity green overlay)

#### **Text Color**
- **Default**: `#4ade80` (CSS var: `--color-green-400, #4ade80`)

#### **Hover State Colors**
- **Very Subtle Glow**: `rgba(74, 222, 128, 0.1)` (6px blur with 1px spread)

---

## 📐 **Layout & Sizing**

### **Base Layout**
```scss
.registration-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border-radius: 9999px; // Perfect circle rounded corners
    cursor: pointer;
    outline: none;
}
```

### **Size Variants**

#### **Small Size (`--small`)**
- **Padding**: `0.5rem 1rem` (8px vertical, 16px horizontal)
- **Font Size**: `0.875rem` (14px)

#### **Medium Size (`--medium`)** *(Default)*
- **Padding**: `0.75rem 1.5rem` (12px vertical, 24px horizontal)
- **Font Size**: `1rem` (16px)

#### **Large Size (`--large`)**
- **Padding**: `1rem 2rem` (16px vertical, 32px horizontal)
- **Font Size**: `1.125rem` (18px)

### **Full Width Variant**
- **Width**: `100%` (when `--full-width` modifier is applied)

---

## ✨ **Animation & Transitions**

### **Base Transition**
```scss
transition: all 0.2s ease;
```
- **Duration**: `0.2s` (200ms)
- **Timing Function**: `ease`
- **Properties**: `all` (covers transform, box-shadow, background, etc.)

### **Hover Transforms**

#### **Primary Button Hover**
- **Scale**: `scale(1.02)` (2% increase in size)
- **Trigger**: `:hover:not(:disabled)`

### **Box Shadow Animations**

#### **Primary Button Hover Shadow**
```scss
box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),     // Drop shadow
    0 4px 6px -2px rgba(0, 0, 0, 0.05),      // Secondary shadow
    0 0 0 1px rgba(74, 222, 128, 0.3),       // Thin border effect
    0 0 8px 2px rgba(74, 222, 128, 0.2);     // Outer glow
```

#### **Secondary Button Hover Shadow**
```scss
box-shadow:
    0 0 0 1px rgba(74, 222, 128, 0.5),       // Enhanced border
    0 0 6px 1px rgba(74, 222, 128, 0.15);    // Subtle glow
```

#### **Tertiary Button Hover Shadow**
```scss
box-shadow: 0 0 6px 1px rgba(74, 222, 128, 0.1); // Very subtle glow
```

---

## 🎭 **Loading State Animations**

### **Loading Container**
```scss
.registration-button__loading {
    display: flex;
    align-items: center;
    justify-content: center;
}
```

### **Loading Text Animation**
```scss
.registration-button__loading-text {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    margin-right: 0.5rem;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
```
- **Duration**: `2s`
- **Timing Function**: `cubic-bezier(0.4, 0, 0.6, 1)` (custom ease)
- **Iteration**: `infinite`
- **Effect**: Text fades from 100% to 70% opacity and back

### **Loading Dots Animation**
```scss
.registration-button__loading-dots::after {
    content: '.';
    animation: dots 1.5s steps(5, end) infinite;
}

@keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60% { content: '...'; }
    80%, 100% { content: ''; }
}
```
- **Duration**: `1.5s`
- **Timing Function**: `steps(5, end)` (discrete steps)
- **Iteration**: `infinite`
- **Effect**: Cycles through `.`, `..`, `...`, and empty state

### **Loading State Text**
- **Content**: `"Processing"` (hardcoded string)
- **Spacing**: `0.5rem` margin-right from dots

---

## 🧭 **Focus & Accessibility**

### **Focus Visible State**
```scss
&:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}
```
- **Outline Width**: `2px`
- **Outline Color**: `var(--color-primary)` (design system primary color)
- **Outline Offset**: `2px` (gap between button and outline)

---

## 🚫 **Disabled State**

### **Disabled Styling**
```scss
&:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
}
```
- **Opacity**: `0.7` (30% transparency)
- **Cursor**: `not-allowed`
- **Transform**: Disabled (`transform: none !important` overrides hover scale)

### **Loading State Cursor**
```scss
&--loading {
    cursor: wait;
}
```

---

## 🖼️ **Icon Specifications**

### **Icon Container**
```scss
.registration-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
```

### **Icon Spacing**
- **Left Icon**: `margin-right: 0.5rem` (8px gap to text)
- **Right Icon**: `margin-left: 0.5rem` (8px gap from text)

### **Text Container**
```scss
.registration-button__text {
    position: relative;
}
```

---

## 🎯 **Component Variants Summary**

| Variant | Background | Text Color | Border | Hover Effect |
|---------|-----------|------------|--------|--------------|
| `primary` | Green gradient (`#4ade80` → `#059669`) | `white` | None | Scale + Glow |
| `secondary` | `transparent` | `#4ade80` | `1px solid #4ade80` | Background + Enhanced glow |
| `tertiary` | `transparent` | `#4ade80` | None | Subtle background + Very subtle glow |

---

## 📊 **Color Reference Chart**

| Color Token | Hex Value | Usage | Alpha Variants |
|-------------|-----------|-------|----------------|
| `--color-green-400` | `#4ade80` | Primary gradient start, secondary border/text, tertiary text | N/A |
| `--color-emerald-600` | `#059669` | Primary gradient end | N/A |
| `rgba(74, 222, 128, 0.3)` | Green-400 30% | Primary hover border glow | 30% opacity |
| `rgba(74, 222, 128, 0.2)` | Green-400 20% | Primary hover outer glow | 20% opacity |
| `rgba(74, 222, 128, 0.5)` | Green-400 50% | Secondary hover enhanced border | 50% opacity |
| `rgba(74, 222, 128, 0.15)` | Green-400 15% | Secondary hover subtle glow | 15% opacity |
| `rgba(74, 222, 128, 0.1)` | Green-400 10% | Secondary hover background, tertiary glow | 10% opacity |
| `rgba(74, 222, 128, 0.05)` | Green-400 5% | Tertiary hover background | 5% opacity |

---

## 🎨 **Visual Regression Test Baseline**

### **Test Cases Required**
1. **Primary Button - Default State**
2. **Primary Button - Hover State** (with scale and glow effects)
3. **Primary Button - Loading State** (with pulse animation and dots)
4. **Primary Button - Disabled State**
5. **Secondary Button - Default State**
6. **Secondary Button - Hover State**
7. **Tertiary Button - Default State**
8. **Tertiary Button - Hover State**
9. **All sizes** (small, medium, large)
10. **Full-width variant**
11. **With icons** (left, right, both)
12. **Focus states** (keyboard navigation)

### **Animation Test Cases**
1. **Loading text pulse animation** (2s cycle)
2. **Loading dots animation** (1.5s cycle)
3. **Hover transition timing** (0.2s ease)
4. **Scale transform on hover** (1.02x)

---

## ⚠️ **Critical Preservation Requirements**

### **Must Not Change**
- ✅ Green gradient colors (`#4ade80` → `#059669`)
- ✅ Hover scale effect (`scale(1.02)`)
- ✅ Glow effects and shadow specifications
- ✅ Loading animation timings and behaviors
- ✅ Border radius (perfect circle: `9999px`)
- ✅ Typography weights and sizes
- ✅ Transition timing (`0.2s ease`)

### **Exact Values to Preserve**
- `border-radius: 9999px`
- `font-weight: 600`
- `transition: all 0.2s ease`
- `transform: scale(1.02)` on hover
- All RGBA color values with exact opacity percentages
- Loading animation durations (`2s` for pulse, `1.5s` for dots)

---

**Document Status**: ✅ Complete  
**Last Updated**: Task 2.1 Implementation  
**Next Step**: Task 2.2 - Maintain Green Gradient Theme 