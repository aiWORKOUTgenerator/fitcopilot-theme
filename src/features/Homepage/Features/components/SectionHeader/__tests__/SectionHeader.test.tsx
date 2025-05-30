import { render, screen } from '@testing-library/react';
import { SectionHeader } from '../SectionHeader';
import { SectionHeaderProps } from '../types';

// Mock the animations hook
jest.mock('../../../hooks', () => ({
  useAnimations: () => ({
    shouldAnimate: jest.fn(() => true),
    getAnimationStyle: jest.fn(() => ({}))
  })
}));

describe('SectionHeader', () => {
  const defaultProps: SectionHeaderProps = {
    title: 'Test Title',
    headingId: 'test-heading'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the title correctly', () => {
      render(<SectionHeader {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Title');
      expect(heading).toHaveAttribute('id', 'test-heading');
    });

    it('renders with custom heading level', () => {
      render(<SectionHeader {...defaultProps} headingLevel={1} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(<SectionHeader {...defaultProps} className="custom-class" />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).toHaveClass('section-header');
      expect(container).toHaveClass('text-center');
      expect(container).toHaveClass('mb-16');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Label Rendering', () => {
    it('renders label when provided', () => {
      render(<SectionHeader {...defaultProps} label="Test Label" />);
      
      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('section-header-label');
    });

    it('does not render label when not provided', () => {
      render(<SectionHeader {...defaultProps} />);
      
      const label = screen.queryByText('Test Label');
      expect(label).not.toBeInTheDocument();
    });
  });

  describe('Highlighted Text', () => {
    it('renders highlighted text when provided', () => {
      render(
        <SectionHeader 
          {...defaultProps} 
          highlightedText="Highlighted Text" 
        />
      );
      
      const highlight = screen.getByText('Highlighted Text');
      expect(highlight).toBeInTheDocument();
      expect(highlight).toHaveClass('section-header-highlight');
      expect(highlight).toHaveAttribute('data-text', 'Highlighted Text');
    });

    it('applies custom gradient to highlighted text', () => {
      render(
        <SectionHeader 
          {...defaultProps} 
          highlightedText="Highlighted Text"
          highlightGradient="from-blue-500 to-purple-500"
        />
      );
      
      const highlight = screen.getByText('Highlighted Text');
      expect(highlight).toHaveClass('from-blue-500');
      expect(highlight).toHaveClass('to-purple-500');
    });

    it('does not render highlighted text when not provided', () => {
      render(<SectionHeader {...defaultProps} />);
      
      const highlight = screen.queryByText('Highlighted Text');
      expect(highlight).not.toBeInTheDocument();
    });
  });

  describe('Subtitle', () => {
    it('renders subtitle when provided', () => {
      render(<SectionHeader {...defaultProps} subtitle="Test Subtitle" />);
      
      const subtitle = screen.getByText('Test Subtitle');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass('section-header-subtitle');
    });

    it('does not render subtitle when not provided', () => {
      render(<SectionHeader {...defaultProps} />);
      
      const subtitle = screen.queryByText('Test Subtitle');
      expect(subtitle).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies variant data attribute', () => {
      render(<SectionHeader {...defaultProps} variant="gym" />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).toHaveAttribute('data-variant', 'gym');
    });

    it('defaults to default variant', () => {
      render(<SectionHeader {...defaultProps} />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).toHaveAttribute('data-variant', 'default');
    });
  });

  describe('Alignment', () => {
    it('centers text by default', () => {
      render(<SectionHeader {...defaultProps} />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).toHaveClass('text-center');
    });

    it('applies left alignment when centered is false', () => {
      render(<SectionHeader {...defaultProps} centered={false} />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).not.toHaveClass('text-center');
    });
  });

  describe('Spacing', () => {
    it('applies default bottom spacing', () => {
      render(<SectionHeader {...defaultProps} />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).toHaveClass('mb-16');
    });

    it('applies custom bottom spacing', () => {
      render(<SectionHeader {...defaultProps} bottomSpacing="xl" />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).toHaveClass('mb-20');
    });

    it('applies no spacing when set to none', () => {
      render(<SectionHeader {...defaultProps} bottomSpacing="none" />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).not.toHaveClass('mb-16');
      expect(container).not.toHaveClass('mb-20');
      expect(container).not.toHaveClass('mb-12');
      expect(container).not.toHaveClass('mb-8');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<SectionHeader {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('supports custom heading ID for aria-labelledby', () => {
      render(<SectionHeader {...defaultProps} headingId="custom-id" />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveAttribute('id', 'custom-id');
    });

    it('provides data-text attribute for screen readers', () => {
      render(
        <SectionHeader 
          {...defaultProps} 
          highlightedText="Screen Reader Text" 
        />
      );
      
      const highlight = screen.getByText('Screen Reader Text');
      expect(highlight).toHaveAttribute('data-text', 'Screen Reader Text');
    });
  });

  describe('Custom Styles', () => {
    it('applies custom inline styles', () => {
      const customStyle = { backgroundColor: 'red' };
      render(<SectionHeader {...defaultProps} style={customStyle} />);
      
      const container = screen.getByRole('heading').parentElement;
      expect(container).toHaveStyle('background-color: red');
    });
  });

  describe('Complete Example', () => {
    it('renders all elements together correctly', () => {
      render(
        <SectionHeader
          title="Main Title"
          highlightedText="Highlighted"
          label="Label Text"
          subtitle="Subtitle Text"
          variant="gym"
          headingId="complete-heading"
          headingLevel={1}
          className="custom-header"
        />
      );

      // Check all elements are present
      expect(screen.getByText('Label Text')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Main Title')).toBeInTheDocument();
      expect(screen.getByText('Highlighted')).toBeInTheDocument();
      expect(screen.getByText('Subtitle Text')).toBeInTheDocument();

      // Check structure
      const heading = screen.getByRole('heading');
      expect(heading).toHaveAttribute('id', 'complete-heading');
      
      const container = heading.parentElement;
      expect(container).toHaveClass('custom-header');
      expect(container).toHaveAttribute('data-variant', 'gym');
    });
  });
}); 