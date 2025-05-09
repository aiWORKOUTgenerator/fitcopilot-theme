/**
 * Type declarations for Button variants
 */

declare module './sports/Button' {
  import { ButtonProps } from './types';
  const SportsButton: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;
  export default SportsButton;
}

declare module './wellness/Button' {
  import { ButtonProps } from './types';
  const WellnessButton: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;
  export default WellnessButton;
}

declare module './modern/Button' {
  import { ButtonProps } from './types';
  const ModernButton: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;
  export default ModernButton;
}

declare module './classic/Button' {
  import { ButtonProps } from './types';
  const ClassicButton: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;
  export default ClassicButton;
}

declare module './minimalist/Button' {
  import { ButtonProps } from './types';
  const MinimalistButton: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;
  export default MinimalistButton;
} 