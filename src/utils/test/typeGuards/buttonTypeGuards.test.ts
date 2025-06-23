import {
  ButtonProps,
  IconButtonProps,
  LinkButtonProps
} from '../../../types/button';
import {
  isActionButton,
  isDisabled,
  isIconButton,
  isLinkButton,
  isLoading
} from '../../typeGuards/buttonTypeGuards';

describe('Button Type Guards', () => {
  // Basic button props for testing
  const baseButtonProps: ButtonProps = {
    children: 'Test Button',
    className: 'test-class',
    disabled: false
  };

  describe('Button type guards', () => {
    it('should identify action buttons', () => {
      const actionButton: ButtonProps = {
        ...baseButtonProps,
        onClick: () => {}
      };

      expect(isActionButton(actionButton)).toBe(true);
      expect(isActionButton(baseButtonProps)).toBe(false);
    });

    it('should identify icon buttons', () => {
      const iconButton = {
        className: 'test-class',
        disabled: false,
        icon: 'IconComponent',
        ariaLabel: 'Icon Button'
      } as IconButtonProps;

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
  });

  describe('Button state guards', () => {
    it('should identify loading buttons', () => {
      const loadingButton: ButtonProps = {
        ...baseButtonProps,
        isLoading: true
      };

      expect(isLoading(loadingButton)).toBe(true);
      expect(isLoading(baseButtonProps)).toBe(false);
    });

    it('should identify disabled buttons', () => {
      const disabledButton: ButtonProps = {
        ...baseButtonProps,
        disabled: true
      };

      expect(isDisabled(disabledButton)).toBe(true);
      expect(isDisabled({ ...baseButtonProps, disabled: false })).toBe(false);
    });
  });
}); 