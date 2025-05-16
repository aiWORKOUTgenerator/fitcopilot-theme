import {
  ButtonProps,
  IconButtonProps,
  LinkButtonProps,
  ThemeButtonProps
} from '../../types/button';
import {
  isButtonSize,
  isDangerButton,
  isDisabledButton,
  isIconButton,
  isLinkButton,
  isLoadingButton,
  isPrimaryButton,
  isSecondaryButton,
  isTextButton,
  isThemeButton
} from '../buttonTypeGuards';

describe('Button Type Guards', () => {
  // Basic button props for testing
  const baseButtonProps: ButtonProps = {
    children: 'Test Button',
    className: 'test-class',
    disabled: false
  };

  describe('Button variant guards', () => {
    it('should identify primary buttons', () => {
      const primaryButton: ButtonProps = {
        ...baseButtonProps,
        variant: 'primary'
      };

      expect(isPrimaryButton(primaryButton)).toBe(true);
      expect(isPrimaryButton({ ...primaryButton, variant: 'secondary' })).toBe(false);
    });

    it('should identify secondary buttons', () => {
      const secondaryButton: ButtonProps = {
        ...baseButtonProps,
        variant: 'secondary'
      };

      expect(isSecondaryButton(secondaryButton)).toBe(true);
      expect(isSecondaryButton({ ...secondaryButton, variant: 'primary' })).toBe(false);
    });

    it('should identify text buttons', () => {
      const textButton: ButtonProps = {
        ...baseButtonProps,
        variant: 'text'
      };

      expect(isTextButton(textButton)).toBe(true);
      expect(isTextButton({ ...textButton, variant: 'primary' })).toBe(false);
    });

    it('should identify danger buttons', () => {
      const dangerButton: ButtonProps = {
        ...baseButtonProps,
        variant: 'danger'
      };

      expect(isDangerButton(dangerButton)).toBe(true);
      expect(isDangerButton({ ...dangerButton, variant: 'primary' })).toBe(false);
    });
  });

  describe('Button size guard', () => {
    it('should identify button sizes correctly', () => {
      const button: ButtonProps = {
        ...baseButtonProps,
        size: 'small'
      };

      expect(isButtonSize(button, 'small')).toBe(true);
      expect(isButtonSize(button, 'medium')).toBe(false);
      expect(isButtonSize(button, 'large')).toBe(false);
    });
  });

  describe('Button type guards', () => {
    it('should identify icon buttons', () => {
      const iconButton: IconButtonProps = {
        ...baseButtonProps,
        // Using a mock element instead of JSX in tests
        icon: 'IconComponent',
        ariaLabel: 'Icon Button'
      };

      expect(isIconButton(iconButton)).toBe(true);
      expect(isIconButton(baseButtonProps)).toBe(false);
    });

    it('should identify link buttons', () => {
      const linkButton: LinkButtonProps = {
        ...baseButtonProps,
        href: 'https://example.com'
      };

      expect(isLinkButton(linkButton)).toBe(true);
      expect(isLinkButton(baseButtonProps)).toBe(false);
    });

    it('should identify theme buttons', () => {
      const themeButton: ThemeButtonProps = {
        ...baseButtonProps,
        themeVariant: 'gym'
      };

      expect(isThemeButton(themeButton)).toBe(true);
      expect(isThemeButton(baseButtonProps)).toBe(false);
    });
  });

  describe('Button state guards', () => {
    it('should identify loading buttons', () => {
      const loadingButton: ButtonProps = {
        ...baseButtonProps,
        isLoading: true
      };

      expect(isLoadingButton(loadingButton)).toBe(true);
      expect(isLoadingButton(baseButtonProps)).toBe(false);
    });

    it('should identify disabled buttons', () => {
      const disabledButton: ButtonProps = {
        ...baseButtonProps,
        disabled: true
      };

      expect(isDisabledButton(disabledButton)).toBe(true);
      expect(isDisabledButton({ ...baseButtonProps, disabled: false })).toBe(false);
    });
  });
}); 