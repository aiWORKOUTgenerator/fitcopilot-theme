# Registration Button Design Tokens Mapping

> **Task**: 3.1 - Create Registration-Specific Design Tokens  
> **Status**: ✅ **IMPLEMENTED**  
> **Location**: `src/styles/design-system/button-tokens.scss`

## 🎯 **Token Strategy**

This document maps the new design tokens to the protected visual specifications from Task 2.2, ensuring the RegistrationButton's green gradient theme is preserved while improving maintainability through design system integration.

---

## 🔗 **Token-to-Specification Mapping**

### **🎨 Primary Button Gradient - PROTECTED**

| **Protected Specification** | **Design Token** | **Value** | **Usage** |
|----------------------------|------------------|-----------|-----------|
| Gradient Start Color `#4ade80` | `--registration-button-primary-gradient-from` | `#4ade80` | Background gradient start |
| Gradient End Color `#059669` | `--registration-button-primary-gradient-to` | `#059669` | Background gradient end |
| Gradient Direction `to right` | `--registration-button-primary-gradient-direction` | `to right` | Linear gradient direction |
| Text Color `white` | `--registration-button-primary-text-color` | `#ffffff` | Primary button text |

### **✨ Hover Effects - PROTECTED**

| **Protected Specification** | **Design Token** | **Value** | **Usage** |
|----------------------------|------------------|-----------|-----------|
| Transform Scale `1.02` | `--registration-button-hover-scale` | `1.02` | 2% scale on hover |
| Transition `all 0.2s ease` | `--registration-button-transition` | `all 0.2s ease` | Smooth transitions |
| Drop Shadow | `--registration-button-primary-shadow-base` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Base shadow |
| Glow Border (30%) | `--registration-button-primary-glow-border` | `0 0 0 1px rgba(74, 222, 128, 0.3)` | Thin border effect |
| Outer Glow (20%) | `--registration-button-primary-glow-outer` | `0 0 8px 2px rgba(74, 222, 128, 0.2)` | Outer glow effect |

### **🔲 Secondary Button - PROTECTED**

| **Protected Specification** | **Design Token** | **Value** | **Usage** |
|----------------------------|------------------|-----------|-----------|
| Border Color `#4ade80` | `--registration-button-secondary-border-color` | `#4ade80` | Green border |
| Text Color `#4ade80` | `--registration-button-secondary-text-color` | `#4ade80` | Green text |
| Hover BG (10%) | `--registration-button-secondary-bg-hover` | `rgba(74, 222, 128, 0.1)` | Hover background |
| Enhanced Border (50%) | `--registration-button-secondary-border-hover` | `0 0 0 1px rgba(74, 222, 128, 0.5)` | Enhanced border effect |
| Subtle Glow (15%) | `--registration-button-secondary-glow-hover` | `0 0 6px 1px rgba(74, 222, 128, 0.15)` | Subtle glow |

### **⚪ Tertiary Button - PROTECTED**

| **Protected Specification** | **Design Token** | **Value** | **Usage** |
|----------------------------|------------------|-----------|-----------|
| Text Color `#4ade80` | `--registration-button-tertiary-text-color` | `#4ade80` | Green text |
| Hover BG (5%) | `--registration-button-tertiary-bg-hover` | `rgba(74, 222, 128, 0.05)` | Subtle hover background |
| Very Subtle Glow (10%) | `--registration-button-tertiary-glow-hover` | `0 0 6px 1px rgba(74, 222, 128, 0.1)` | Very subtle glow |

---

## 📏 **Sizing Token Mapping**

### **Size Specifications from Task 2.1**

| **Size** | **Padding Token** | **Font Size Token** | **Padding Value** | **Font Size Value** |
|----------|-------------------|-------------------|-------------------|-------------------|
| **Small** | `--registration-button-small-padding-x/y` | `--registration-button-small-font-size` | `0.5rem 1rem` | `0.875rem` (14px) |
| **Medium** | `--registration-button-medium-padding-x/y` | `--registration-button-medium-font-size` | `0.75rem 1.5rem` | `1rem` (16px) |
| **Large** | `--registration-button-large-padding-x/y` | `--registration-button-large-font-size` | `1rem 2rem` | `1.125rem` (18px) |

---

## 🎬 **Animation Token Mapping**

### **Loading Animations - PROTECTED**

| **Protected Specification** | **Design Token** | **Value** | **Usage** |
|----------------------------|------------------|-----------|-----------|
| Pulse Duration `2s` | `--registration-button-loading-pulse-duration` | `2s` | Text pulse animation |
| Pulse Timing `cubic-bezier(0.4, 0, 0.6, 1)` | `--registration-button-loading-pulse-timing` | `cubic-bezier(0.4, 0, 0.6, 1)` | Pulse timing function |
| Dots Duration `1.5s` | `--registration-button-loading-dots-duration` | `1.5s` | Dots cycle animation |
| Dots Timing `steps(5, end)` | `--registration-button-loading-dots-timing` | `steps(5, end)` | Discrete steps |
| Pulse Opacity Range | `--registration-button-loading-pulse-opacity-min/max` | `0.7` / `1` | 70%-100% opacity |

---

## 🔧 **Core Design Token Mapping**

### **Fundamental Properties - PROTECTED**

| **Protected Specification** | **Design Token** | **Value** | **Critical Level** |
|----------------------------|------------------|-----------|------------------|
| Border Radius `9999px` | `--registration-button-border-radius` | `9999px` | 🔒 **CRITICAL** |
| Font Weight `600` | `--registration-button-font-weight` | `600` | 🔒 **CRITICAL** |
| Transition `all 0.2s ease` | `--registration-button-transition` | `all 0.2s ease` | 🔒 **CRITICAL** |
| Hover Scale `1.02` | `--registration-button-hover-scale` | `1.02` | 🔒 **CRITICAL** |

---

## 🎪 **State Token Mapping**

### **Interactive States - PROTECTED**

| **State** | **Design Token** | **Value** | **Usage** |
|-----------|------------------|-----------|-----------|
| **Disabled Opacity** | `--registration-button-disabled-opacity` | `0.7` | 30% transparency |
| **Disabled Cursor** | `--registration-button-disabled-cursor` | `not-allowed` | Cursor state |
| **Loading Cursor** | `--registration-button-loading-cursor` | `wait` | Loading state cursor |
| **Focus Outline** | `--registration-button-focus-outline-width` | `2px` | Accessibility outline |
| **Focus Color** | `--registration-button-focus-outline-color` | `var(--color-primary, #4ade80)` | Outline color |

---

## 🏗️ **Token Architecture**

### **Naming Convention**
```
--registration-button-{category}-{property}-{modifier}
```

**Examples**:
- `--registration-button-primary-gradient-from` (variant-specific)
- `--registration-button-loading-pulse-duration` (state-specific)
- `--registration-button-small-padding-x` (size-specific)

### **Token Categories**
- **Base**: Core properties (border-radius, font-weight, etc.)
- **Primary**: Primary variant colors and effects
- **Secondary**: Secondary variant styling
- **Tertiary**: Tertiary variant styling
- **Sizing**: Size-specific padding and font-size
- **Loading**: Animation timing and properties
- **States**: Interactive state styling
- **Icons**: Icon spacing and layout

---

## 📊 **Critical Color Reference**

### **All Protected RGBA Values**

| **Color Usage** | **Token** | **RGBA Value** | **Protection Level** |
|-----------------|-----------|----------------|---------------------|
| Primary Glow Border | `--registration-button-primary-glow-border` | `rgba(74, 222, 128, 0.3)` | 🔒 **CRITICAL** |
| Primary Outer Glow | `--registration-button-primary-glow-outer` | `rgba(74, 222, 128, 0.2)` | 🔒 **CRITICAL** |
| Secondary Hover BG | `--registration-button-secondary-bg-hover` | `rgba(74, 222, 128, 0.1)` | 🔒 **CRITICAL** |
| Secondary Border Glow | `--registration-button-secondary-border-hover` | `rgba(74, 222, 128, 0.5)` | 🔒 **CRITICAL** |
| Secondary Subtle Glow | `--registration-button-secondary-glow-hover` | `rgba(74, 222, 128, 0.15)` | 🔒 **CRITICAL** |
| Tertiary Hover BG | `--registration-button-tertiary-bg-hover` | `rgba(74, 222, 128, 0.05)` | 🔒 **CRITICAL** |
| Tertiary Glow | `--registration-button-tertiary-glow-hover` | `rgba(74, 222, 128, 0.1)` | 🔒 **CRITICAL** |

---

## 🛡️ **Token Protection Rules**

### **🚨 NEVER CHANGE - CRITICAL TOKENS**
```scss
--registration-button-primary-gradient-from: #4ade80;
--registration-button-primary-gradient-to: #059669;
--registration-button-hover-scale: 1.02;
--registration-button-transition: all 0.2s ease;
--registration-button-border-radius: 9999px;
--registration-button-font-weight: 600;
```

### **🚨 NEVER CHANGE - CRITICAL RGBA VALUES**
```scss
--registration-button-primary-glow-border: 0 0 0 1px rgba(74, 222, 128, 0.3);
--registration-button-primary-glow-outer: 0 0 8px 2px rgba(74, 222, 128, 0.2);
--registration-button-secondary-bg-hover: rgba(74, 222, 128, 0.1);
--registration-button-secondary-border-hover: 0 0 0 1px rgba(74, 222, 128, 0.5);
--registration-button-secondary-glow-hover: 0 0 6px 1px rgba(74, 222, 128, 0.15);
--registration-button-tertiary-bg-hover: rgba(74, 222, 128, 0.05);
--registration-button-tertiary-glow-hover: 0 0 6px 1px rgba(74, 222, 128, 0.1);
```

### **🚨 NEVER CHANGE - CRITICAL ANIMATIONS**
```scss
--registration-button-loading-pulse-duration: 2s;
--registration-button-loading-pulse-timing: cubic-bezier(0.4, 0, 0.6, 1);
--registration-button-loading-dots-duration: 1.5s;
--registration-button-loading-dots-timing: steps(5, end);
```

---

## ✅ **Implementation Usage Examples**

### **In RegistrationButton.scss (Next Task - 3.2)**
```scss
.registration-button {
  border-radius: var(--registration-button-border-radius);
  font-weight: var(--registration-button-font-weight);
  transition: var(--registration-button-transition);
  
  &--primary {
    background: linear-gradient(
      var(--registration-button-primary-gradient-direction),
      var(--registration-button-primary-gradient-from),
      var(--registration-button-primary-gradient-to)
    );
    color: var(--registration-button-primary-text-color);
    
    &:hover:not(:disabled) {
      transform: scale(var(--registration-button-hover-scale));
      box-shadow: var(--registration-button-primary-shadow-hover);
    }
  }
}
```

---

## 🎯 **Task 3.1 Completion Checklist**

✅ **All Requirements Met**:
- [x] Added registration theme tokens to `button-tokens.scss`
- [x] Mapped current hardcoded colors to CSS custom properties
- [x] Maintained exact same visual output through token values
- [x] Preserved all protected specifications from Task 2.2
- [x] Created comprehensive documentation and validation tests
- [x] Followed established token naming conventions
- [x] Included all variants (primary, secondary, tertiary)
- [x] Covered all states (hover, loading, disabled, focus)
- [x] Documented critical protection rules

---

**Status**: ✅ **COMPLETE**  
**Next Task**: 3.2 - Update RegistrationButton Styles to use these tokens  
**Protection Level**: All Task 2.2 specifications preserved through design tokens 