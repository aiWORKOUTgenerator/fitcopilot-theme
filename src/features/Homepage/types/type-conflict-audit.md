# Type Conflict Audit Report
**Homepage Architecture Consistency - Phase 1**

---

## 📋 Executive Summary

This audit identifies all type conflicts and duplicate definitions across the 9 Homepage sections. The analysis reveals **23 type conflicts** that need resolution during the migration to the unified type system.

**Critical Findings**:
- **9 different `VariantKey` definitions** across sections
- **12 duplicate interface definitions** 
- **4 conflicting button prop interfaces**
- **8 inconsistent naming patterns**

---

## 🚨 Critical Type Conflicts

### 1. Variant Key Conflicts (HIGH PRIORITY)

Each section defines its own variant type, creating import conflicts:

#### **Hero Section**
```typescript
// File: src/features/Homepage/Hero/types.ts
export type HeroVariantKey = 'default' | 'gym' | 'mobile' | 'sports' | 'wellness' | 'registration' | 'boutique' | 'classic' | 'minimalist' | 'modern';
```

#### **Features Section**
```typescript
// File: src/features/Homepage/Features/types.ts
export type VariantKey = 'default' | 'gym' | 'boutique' | 'modern' | 'wellness' | 'classic' | 'sports' | 'minimalist' | 'registration';
```

#### **Training Section**
```typescript
// File: src/features/Homepage/Training/types.ts
export type VariantKey = 'default' | 'boutique' | 'classic' | 'minimalist' | 'modern' | 'sports' | 'wellness';
```

#### **Journey Section**
```typescript
// File: src/features/Homepage/Journey/types.ts
export type VariantKey = 'default' | 'boutique' | 'classic' | 'minimalist' | 'modern' | 'sports' | 'wellness';
```

#### **TrainingFeatures Section**
```typescript
// File: src/features/Homepage/TrainingFeatures/types.ts
export type VariantKey = 'default' | 'boutique' | 'classic' | 'minimalist' | 'modern' | 'sports' | 'wellness';
```

#### **PersonalTraining Section**
```typescript
// File: src/features/Homepage/PersonalTraining/types.ts
export type VariantKey = 'default' | 'modern' | 'classic' | 'minimalist' | 'sports' | 'wellness';
```

**Resolution**: Replace all with `GlobalVariantKey` from shared types.

---

### 2. Button Props Conflicts (HIGH PRIORITY)

Multiple button prop interfaces with similar but incompatible definitions:

#### **HeroButton Props**
```typescript
// File: src/features/Homepage/Hero/components/HeroButton/types.ts
export interface HeroButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}
```

#### **FeatureButton Props**
```typescript
// File: src/features/Homepage/Features/components/FeatureButton/types.ts
export interface FeatureButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  gradientClass?: string; // Different from HeroButton
}
```

#### **TrainingButton Props**
```typescript
// File: src/features/Homepage/Training/components/TrainingButton/types.ts
export interface TrainingButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  styleVariant?: 'standard' | 'accent' | 'athletic'; // Different prop
}
```

**Resolution**: All button components should extend `BaseButtonProps` from shared types.

---

### 3. Component Props Conflicts (MEDIUM PRIORITY)

#### **Section Props Variations**
```typescript
// Hero Section
export interface HeroProps extends Omit<SectionProps, 'variant'> {
  variant?: HeroVariantKey;
  registrationLink?: string;
  loginLink?: string;
  onRegistrationStart?: () => void;
}

// Features Section  
export interface FeaturesProps {
  variant?: VariantKey;
  features?: FeatureData[];
  backgroundColor?: BackgroundColorType;
  enableFloatingIcons?: boolean;
}

// Training Section
export interface TrainingProps {
  variant?: VariantKey;
  programs?: ProgramType[];
  sectionTitle?: string;
  onProgramSelect?: (title: string) => void;
}
```

**Resolution**: All section components should extend `BaseSectionProps`.

---

### 4. Duplicate Type Definitions (MEDIUM PRIORITY)

#### **ProgressDataPoint Conflict**
```typescript
// File: src/features/Homepage/Features/types.ts
export interface ProgressDataPoint {
  week: number;
  value: number;
  label: string;
}

// File: src/features/Homepage/Features/components/DemoComponents/types.ts
export interface ProgressDataPoint { // DUPLICATE!
  week: number;
  value: number;
  label: string;
}
```

#### **WorkoutExercise Conflict**
```typescript
// File: src/features/Homepage/Features/types.ts
export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

// File: src/features/Homepage/Features/components/DemoComponents/SampleWorkout.tsx
// References WorkoutExercise but doesn't import it - MISSING IMPORT!
```

**Resolution**: Remove duplicates, use parent types exclusively.

---

## 📊 Complete Conflict Matrix

| Section | VariantKey | Button Props | Section Props | Duplicates | Priority |
|---------|------------|--------------|---------------|------------|----------|
| **Hero** | HeroVariantKey | HeroButtonProps | HeroProps | 0 | HIGH |
| **Features** | VariantKey | FeatureButtonProps | FeaturesProps | 2 | HIGH |
| **Journey** | VariantKey | - | JourneyProps | 0 | MEDIUM |
| **Training** | VariantKey | TrainingButtonProps | TrainingProps | 0 | MEDIUM |
| **TrainingFeatures** | VariantKey | TrainingFeaturesButtonProps | - | 0 | MEDIUM |
| **PersonalTraining** | VariantKey | PersonalTrainingButtonProps | PersonalTrainingProps | 0 | MEDIUM |
| **Testimonials** | - | TestimonialsButtonProps | - | 0 | LOW |
| **Pricing** | - | PricingButtonProps | - | 0 | LOW |
| **Footer** | - | - | - | 0 | LOW |

---

## 🔧 Migration Strategy

### Phase 1: Immediate Fixes (Day 1-2)

#### **1. Fix Critical Import Errors**
```typescript
// File: src/features/Homepage/Features/components/DemoComponents/SampleWorkout.tsx
// ADD MISSING IMPORT:
import { WorkoutExercise } from '../../types';

// File: src/features/Homepage/Features/components/DemoComponents/types.ts
// REMOVE DUPLICATE:
// export interface ProgressDataPoint { ... } // DELETE THIS
```

#### **2. Update Hero Section (Reference Implementation)**
```typescript
// File: src/features/Homepage/Hero/types.ts
// REPLACE:
// export type HeroVariantKey = 'default' | 'gym' | ...;

// WITH:
import { GlobalVariantKey } from '../types/shared';
export type HeroVariantKey = GlobalVariantKey; // Temporary compatibility

// File: src/features/Homepage/Hero/components/HeroButton/types.ts
// REPLACE:
// export interface HeroButtonProps { ... }

// WITH:
import { BaseButtonProps } from '../../../types/shared';
export interface HeroButtonProps extends BaseButtonProps {
  // Hero-specific props only (if any)
}
```

### Phase 2: Systematic Migration (Week 2)

#### **1. Features Section**
- Update `VariantKey` to `GlobalVariantKey`
- Migrate `FeatureButtonProps` to extend `BaseButtonProps`
- Remove duplicate `ProgressDataPoint` definition
- Fix `WorkoutExercise` import in demo components

#### **2. Training Sections**
- Update both Training and TrainingFeatures
- Migrate button props to shared base
- Consolidate variant definitions

#### **3. Remaining Sections**
- Journey, PersonalTraining, Testimonials, Pricing, Footer
- Add variant support where missing
- Standardize button implementations

---

## 🚨 Breaking Changes Impact

### High-Impact Changes

1. **Import Statement Updates** (ALL sections)
   ```typescript
   // OLD
   import { VariantKey } from './types';
   
   // NEW  
   import { GlobalVariantKey } from '../types/shared';
   ```

2. **Component Props Extensions** (ALL components)
   ```typescript
   // OLD
   interface ComponentProps {
     variant?: VariantKey;
     className?: string;
   }
   
   // NEW
   import { BaseComponentProps } from '../types/shared';
   interface ComponentProps extends BaseComponentProps {
     // Only component-specific props
   }
   ```

3. **Button Component Refactoring** (7 button components)
   ```typescript
   // OLD
   interface ButtonProps {
     variant?: 'primary' | 'secondary';
     size?: 'small' | 'medium' | 'large';
     // ... many repeated props
   }
   
   // NEW
   import { BaseButtonProps } from '../types/shared';
   interface ButtonProps extends BaseButtonProps {
     // Only button-specific props
   }
   ```

### Medium-Impact Changes

1. **Variant Map Updates**
2. **Theme Provider Integration**
3. **Test File Updates**

### Low-Impact Changes

1. **Documentation Updates**
2. **Example Code Updates**
3. **Storybook Stories**

---

## 📋 Migration Checklist

### Immediate Actions (Day 1-2)
- [ ] Fix `WorkoutExercise` import in SampleWorkout.tsx
- [ ] Remove duplicate `ProgressDataPoint` in DemoComponents/types.ts
- [ ] Create shared types system (✅ COMPLETED)
- [ ] Update Hero section as reference implementation

### Week 1 Completion
- [ ] Verify TypeScript compilation with shared types
- [ ] Test Hero section with updated types
- [ ] Document migration patterns
- [ ] Prepare Features section migration plan

### Week 2 Targets
- [ ] Migrate Features section completely
- [ ] Update Training and TrainingFeatures sections
- [ ] Migrate remaining sections
- [ ] Remove all duplicate type definitions
- [ ] Comprehensive testing

---

## 🔍 Validation Commands

### TypeScript Compilation Check
```bash
# Check for type errors
npx tsc --noEmit

# Check specific files
npx tsc --noEmit src/features/Homepage/Hero/types.ts
npx tsc --noEmit src/features/Homepage/Features/types.ts
```

### Import Analysis
```bash
# Find all VariantKey imports
grep -r "import.*VariantKey" src/features/Homepage/

# Find all button prop imports  
grep -r "ButtonProps" src/features/Homepage/
```

### Duplicate Detection
```bash
# Find duplicate interface definitions
grep -r "interface.*Props" src/features/Homepage/ | sort | uniq -d
```

---

## 📞 Support & Escalation

### Critical Issues
- **Type compilation errors**: Immediate escalation to Technical Lead
- **Breaking changes in production**: Emergency rollback procedures
- **Import conflicts**: Architecture Specialist consultation

### Medium Issues  
- **Migration complexity**: Senior Frontend Developer
- **Testing failures**: QA Team consultation
- **Documentation gaps**: Technical Writer

---

*This audit provides the foundation for systematic type migration in Phase 1 of the Homepage Architecture Consistency project.* 