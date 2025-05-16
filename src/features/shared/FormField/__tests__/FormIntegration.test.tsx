/**
 * FormField Integration Tests
 * 
 * Test all FormField components working together in a form
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import {
  Checkbox,
  DateField,
  FileField,
  InputChangeHandler,
  RadioGroup,
  SelectChangeHandler,
  SelectField,
  Switch,
  TextAreaChangeHandler,
  TextareaField,
  TextField
} from '..';

// Test component that uses all field types
const TestForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    country: '',
    subscribe: false,
    notification: 'email',
    dateOfBirth: '',
    theme: 'light',
    file: null as File | null
  });

  // Handlers for different field types
  const handleTextChange: InputChangeHandler = (e) => {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTextAreaChange: TextAreaChangeHandler = (e) => {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange: SelectChangeHandler = (e) => {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormState(prev => ({
      ...prev,
      file
    }));
  };

  return (
    <form data-testid="test-form">
      <TextField
        fieldType="text"
        type="text"
        name="name"
        label="Name"
        value={formState.name}
        onChange={handleTextChange}
        required
      />

      <TextField
        fieldType="text"
        type="email"
        name="email"
        label="Email"
        value={formState.email}
        onChange={handleTextChange}
        required
      />

      <TextareaField
        fieldType="textarea"
        name="message"
        label="Message"
        value={formState.message}
        onChange={handleTextAreaChange}
        rows={4}
      />

      <SelectField
        fieldType="select"
        name="country"
        label="Country"
        value={formState.country}
        onChange={handleSelectChange}
        options={[
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'mx', label: 'Mexico' }
        ]}
        placeholder="Select a country"
      />

      <Checkbox
        fieldType="checkbox"
        name="subscribe"
        label="Subscribe to newsletter"
        checked={formState.subscribe}
        onChange={handleCheckboxChange}
      />

      <RadioGroup
        fieldType="radiogroup"
        name="notification"
        label="Notification Preference"
        value={formState.notification}
        onChange={handleCheckboxChange}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'push', label: 'Push Notification' }
        ]}
      />

      <DateField
        fieldType="date"
        name="dateOfBirth"
        label="Date of Birth"
        value={formState.dateOfBirth}
        onChange={handleTextChange}
      />

      <Switch
        fieldType="switch"
        name="theme"
        label="Theme"
        checked={formState.theme === 'dark'}
        onChange={(e) => {
          setFormState(prev => ({
            ...prev,
            theme: e.target.checked ? 'dark' : 'light'
          }));
        }}
        onLabel="Dark"
        offLabel="Light"
      />

      <FileField
        fieldType="file"
        name="file"
        label="Profile Picture"
        onChange={handleFileChange}
        accept="image/*"
      />
    </form>
  );
};

describe('FormField Integration', () => {
  it('renders all field types correctly', () => {
    render(<TestForm />);
    
    // Verify all fields are rendered
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Subscribe to newsletter')).toBeInTheDocument();
    expect(screen.getByText('Notification Preference')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile Picture')).toBeInTheDocument();
  });
  
  it('handles input changes correctly', () => {
    render(<TestForm />);
    
    // Test text field
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');
    
    // Test email field
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput).toHaveValue('john@example.com');
    
    // Test textarea
    const messageInput = screen.getByLabelText('Message');
    fireEvent.change(messageInput, { target: { value: 'Hello world' } });
    expect(messageInput).toHaveValue('Hello world');
    
    // Test select
    const countrySelect = screen.getByLabelText('Country');
    fireEvent.change(countrySelect, { target: { value: 'ca' } });
    expect(countrySelect).toHaveValue('ca');
    
    // Test checkbox
    const subscribeCheckbox = screen.getByLabelText('Subscribe to newsletter');
    fireEvent.click(subscribeCheckbox);
    expect(subscribeCheckbox).toBeChecked();
    
    // Test radio group
    const smsRadio = screen.getByLabelText('SMS');
    fireEvent.click(smsRadio);
    expect(smsRadio).toBeChecked();
    
    // Test date field
    const dateInput = screen.getByLabelText('Date of Birth');
    fireEvent.change(dateInput, { target: { value: '2000-01-01' } });
    expect(dateInput).toHaveValue('2000-01-01');
    
    // Test switch
    const themeSwitch = screen.getByLabelText('Theme');
    fireEvent.click(themeSwitch);
    expect(themeSwitch).toBeChecked();
  });
}); 