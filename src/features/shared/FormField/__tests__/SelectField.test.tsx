/**
 * SelectField component tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectField from '../fields/SelectField';

describe('SelectField', () => {
  const defaultProps = {
    name: 'test-select',
    value: '',
    onChange: jest.fn(),
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' }
    ],
    fieldType: 'select' as const
  };

  it('renders with minimal props', () => {
    render(<SelectField {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('name', 'test-select');
  });
  
  it('renders options correctly', () => {
    render(<SelectField {...defaultProps} />);
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Option 1');
    expect(options[1]).toHaveTextContent('Option 2');
    expect(options[2]).toHaveTextContent('Option 3');
  });
  
  it('renders placeholder option when provided', () => {
    render(<SelectField {...defaultProps} placeholder="Select an option" />);
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Select an option');
    expect(options[0]).toHaveAttribute('disabled');
  });
  
  it('calls onChange when selection changes', () => {
    render(<SelectField {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });
  
  it('renders label when provided', () => {
    render(<SelectField {...defaultProps} label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });
  
  it('shows error message when error is provided', () => {
    const errorMessage = 'This is an error message';
    render(<SelectField {...defaultProps} error={errorMessage} />);
    
    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute('role', 'alert');
  });
  
  it('shows helper text when helperText is provided and no error', () => {
    const helperText = 'This is helper text';
    render(<SelectField {...defaultProps} helperText={helperText} />);
    
    const helper = screen.getByText(helperText);
    expect(helper).toBeInTheDocument();
  });
  
  it('prioritizes error over helper text', () => {
    const errorMessage = 'This is an error message';
    const helperText = 'This is helper text';
    render(
      <SelectField
        {...defaultProps}
        error={errorMessage}
        helperText={helperText}
      />
    );
    
    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
  });
  
  it('applies disabled state correctly', () => {
    render(<SelectField {...defaultProps} disabled />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
  
  it('handles required attribute correctly', () => {
    render(<SelectField {...defaultProps} required />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('required');
  });
}); 