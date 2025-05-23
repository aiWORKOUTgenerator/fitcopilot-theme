# RegistrationButton Visual Test Baseline

> **Created**: Task 2.1 Implementation  
> **Purpose**: Visual regression test reference  
> **Status**: Baseline established

## 🎯 **Test Scenarios Matrix**

### **Primary Button Tests**

#### **Scenario 1: Primary Default State**
```tsx
<RegistrationButton variant="primary" size="medium">
  Get Started
</RegistrationButton>
```
**Expected Visual**:
- Green gradient background (`#4ade80` → `#059669`)
- White text, weight 600
- Perfect round corners (`border-radius: 9999px`)
- No glow effects

#### **Scenario 2: Primary Hover State**
```tsx
<RegistrationButton variant="primary" size="medium">
  Get Started
</RegistrationButton>
```
**Expected Visual** (on hover):
- Same gradient background
- Scale transform: `scale(1.02)`
- Complex shadow with glow:
  - Drop shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
  - Secondary shadow: `0 4px 6px -2px rgba(0, 0, 0, 0.05)`
  - Border glow: `0 0 0 1px rgba(74, 222, 128, 0.3)`
  - Outer glow: `0 0 8px 2px rgba(74, 222, 128, 0.2)`

#### **Scenario 3: Primary Loading State**
```tsx
<RegistrationButton variant="primary" size="medium" isLoading={true}>
  Get Started
</RegistrationButton>
```
**Expected Visual**:
- Same gradient background
- "Processing" text with pulse animation (2s cycle, 70%-100% opacity)
- Animated dots cycling: `.`, `..`, `...`, `` (1.5s cycle)
- Button disabled (no hover effects)
- Cursor: `wait`

#### **Scenario 4: Primary Disabled State**
```tsx
<RegistrationButton variant="primary" size="medium" disabled={true}>
  Get Started
</RegistrationButton>
```
**Expected Visual**:
- Same gradient background at 70% opacity
- White text at 70% opacity
- Cursor: `not-allowed`
- No hover transform effects

### **Secondary Button Tests**

#### **Scenario 5: Secondary Default State**
```tsx
<RegistrationButton variant="secondary" size="medium">
  Go Back
</RegistrationButton>
```
**Expected Visual**:
- Transparent background
- Green border: `1px solid #4ade80`
- Green text: `#4ade80`
- Font weight 600

#### **Scenario 6: Secondary Hover State**
```tsx
<RegistrationButton variant="secondary" size="medium">
  Go Back
</RegistrationButton>
```
**Expected Visual** (on hover):
- Background: `rgba(74, 222, 128, 0.1)` (10% green overlay)
- Enhanced border glow: `rgba(74, 222, 128, 0.5)`
- Subtle outer glow: `0 0 6px 1px rgba(74, 222, 128, 0.15)`

### **Tertiary Button Tests**

#### **Scenario 7: Tertiary Default State**
```tsx
<RegistrationButton variant="tertiary" size="medium">
  Cancel
</RegistrationButton>
```
**Expected Visual**:
- Transparent background
- No border
- Green text: `#4ade80`

#### **Scenario 8: Tertiary Hover State**
```tsx
<RegistrationButton variant="tertiary" size="medium">
  Cancel
</RegistrationButton>
```
**Expected Visual** (on hover):
- Background: `rgba(74, 222, 128, 0.05)` (5% green overlay)
- Very subtle glow: `0 0 6px 1px rgba(74, 222, 128, 0.1)`

### **Size Variant Tests**

#### **Scenario 9: All Sizes Comparison**
```tsx
<RegistrationButton variant="primary" size="small">Small</RegistrationButton>
<RegistrationButton variant="primary" size="medium">Medium</RegistrationButton>
<RegistrationButton variant="primary" size="large">Large</RegistrationButton>
```
**Expected Visual**:
- **Small**: `0.5rem 1rem` padding, `0.875rem` font-size
- **Medium**: `0.75rem 1.5rem` padding, `1rem` font-size
- **Large**: `1rem 2rem` padding, `1.125rem` font-size

### **Icon Tests**

#### **Scenario 10: Left Icon**
```tsx
<RegistrationButton variant="primary" leftIcon={<ArrowLeft />}>
  Back
</RegistrationButton>
```
**Expected Visual**:
- Icon with `margin-right: 0.5rem` from text
- Icon vertically centered

#### **Scenario 11: Right Icon**
```tsx
<RegistrationButton variant="primary" rightIcon={<ArrowRight />}>
  Next
</RegistrationButton>
```
**Expected Visual**:
- Icon with `margin-left: 0.5rem` from text
- Icon vertically centered

#### **Scenario 12: Both Icons**
```tsx
<RegistrationButton variant="primary" leftIcon={<User />} rightIcon={<ArrowRight />}>
  Continue
</RegistrationButton>
```
**Expected Visual**:
- Left icon: `margin-right: 0.5rem`
- Right icon: `margin-left: 0.5rem`
- Text centered between icons

### **Full Width Test**

#### **Scenario 13: Full Width Button**
```tsx
<div style={{ width: '300px' }}>
  <RegistrationButton variant="primary" fullWidth>
    Full Width Button
  </RegistrationButton>
</div>
```
**Expected Visual**:
- Button spans entire container width (300px)
- Text remains centered

### **Focus State Test**

#### **Scenario 14: Focus Visible**
```tsx
<RegistrationButton variant="primary">
  Focus Me
</RegistrationButton>
```
**Expected Visual** (on keyboard focus):
- 2px outline using `--color-primary`
- 2px offset from button edge
- Outline should not affect button positioning

## 🎨 **Animation Test Cases**

### **Animation 1: Hover Transition**
**Test**: Hover over primary button
**Expected**:
- `0.2s ease` transition for all properties
- Smooth scale to `1.02`
- Smooth shadow appearance

### **Animation 2: Loading Pulse**
**Test**: Set `isLoading={true}` on primary button
**Expected**:
- "Processing" text pulses 100% → 70% → 100% opacity
- Duration: exactly 2 seconds
- Timing: `cubic-bezier(0.4, 0, 0.6, 1)`

### **Animation 3: Loading Dots**
**Test**: Observe dots in loading state
**Expected**:
- Cycle: `.` → `..` → `...` → `` (empty)
- Duration: exactly 1.5 seconds
- Timing: `steps(5, end)` (discrete steps)

## 📊 **Color Validation Matrix**

| Element | Color Value | CSS Variable | Test Method |
|---------|-------------|--------------|-------------|
| Primary Gradient Start | `#4ade80` | `--color-green-400` | Background computation |
| Primary Gradient End | `#059669` | `--color-emerald-600` | Background computation |
| Primary Hover Glow | `rgba(74, 222, 128, 0.3)` | N/A | Box-shadow computation |
| Secondary Border | `#4ade80` | `--color-green-400` | Border computation |
| Secondary Hover BG | `rgba(74, 222, 128, 0.1)` | N/A | Background computation |
| Tertiary Hover BG | `rgba(74, 222, 128, 0.05)` | N/A | Background computation |

## 🧪 **Automated Test Code**

### **Jest Test for Visual Properties**
```javascript
describe('RegistrationButton Visual Properties', () => {
  it('should have correct primary gradient', () => {
    const { container } = render(
      <RegistrationButton variant="primary">Test</RegistrationButton>
    );
    const button = container.querySelector('.registration-button');
    const styles = getComputedStyle(button);
    
    expect(styles.background).toContain('#4ade80');
    expect(styles.background).toContain('#059669');
    expect(styles.borderRadius).toBe('9999px');
    expect(styles.fontWeight).toBe('600');
  });

  it('should scale on hover', async () => {
    const { container } = render(
      <RegistrationButton variant="primary">Test</RegistrationButton>
    );
    const button = container.querySelector('.registration-button');
    
    fireEvent.mouseEnter(button);
    await waitFor(() => {
      const styles = getComputedStyle(button);
      expect(styles.transform).toBe('scale(1.02)');
    });
  });
});
```

### **Storybook Visual Testing**
```javascript
// RegistrationButton.stories.js
export const VisualBaseline = {
  render: () => (
    <div className="visual-test-grid">
      <RegistrationButton variant="primary">Primary</RegistrationButton>
      <RegistrationButton variant="secondary">Secondary</RegistrationButton>
      <RegistrationButton variant="tertiary">Tertiary</RegistrationButton>
      <RegistrationButton variant="primary" isLoading>Loading</RegistrationButton>
      <RegistrationButton variant="primary" disabled>Disabled</RegistrationButton>
    </div>
  ),
  parameters: {
    chromatic: { 
      viewports: [320, 768, 1200],
      modes: {
        'hover-primary': { hover: '.registration-button:first-child' },
        'focus-primary': { focus: '.registration-button:first-child' }
      }
    }
  }
};
```

## ✅ **Acceptance Criteria Checklist**

- ✅ **Gradient Colors Documented**: `#4ade80` → `#059669`
- ✅ **Hover Effects Documented**: Scale (1.02x) + Complex shadow
- ✅ **Animation Timings Documented**: 
  - Base transition: `0.2s ease`
  - Loading pulse: `2s cubic-bezier(0.4, 0, 0.6, 1)`
  - Loading dots: `1.5s steps(5, end)`
- ✅ **Visual Regression Test Baseline Created**: 14 scenarios documented
- ✅ **Color Reference Chart**: All RGBA values with exact opacity
- ✅ **Animation Test Cases**: 3 specific animation behaviors
- ✅ **Automated Test Examples**: Jest + Storybook configurations

---

**Status**: ✅ **COMPLETE**  
**Baseline Established**: All visual specifications documented  
**Next Task**: 2.2 - Maintain Green Gradient Theme 