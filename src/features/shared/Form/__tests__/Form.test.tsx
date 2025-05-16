/**
 * Form Component Tests
 */

import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../../test/test-utils';
import Form from '../Form';

describe('Form Component', () => {
  it('renders children correctly', () => {
    renderWithProviders(
      <Form data-testid="test-form">
        <input type="text" placeholder="Username" />
        <button type="submit">Submit</button>
      </Form>
    );

    const form = screen.getByTestId('test-form');
    const input = screen.getByPlaceholderText('Username');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    expect(form).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('applies provided className', () => {
    renderWithProviders(
      <Form className="custom-form" data-testid="test-form">
        <input type="text" />
      </Form>
    );

    const form = screen.getByTestId('test-form');
    expect(form).toHaveClass('form');
    expect(form).toHaveClass('custom-form');
  });

  it('calls onSubmit when the form is submitted', async () => {
    const handleSubmit = jest.fn();

    const { user } = renderWithProviders(
      <Form onSubmit={handleSubmit} data-testid="test-form">
        <input type="text" placeholder="Username" />
        <button type="submit">Submit</button>
      </Form>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });

    // Submit the form
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('prevents default form submission behavior', async () => {
    const handleSubmit = jest.fn().mockImplementation((e) => {
      // Check if preventDefault was called
      expect(e.defaultPrevented).toBe(true);
    });

    const { user } = renderWithProviders(
      <Form onSubmit={handleSubmit} data-testid="test-form">
        <button type="submit">Submit</button>
      </Form>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });

    // Submit the form
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('sets correct form attributes', () => {
    renderWithProviders(
      <Form
        id="contact-form"
        action="/contact"
        method="get"
        encType="multipart/form-data"
        noValidate={false}
        autoComplete="off"
        ariaLabel="Contact form"
        data-testid="test-form"
      >
        <input type="text" />
      </Form>
    );

    const form = screen.getByTestId('test-form');

    expect(form).toHaveAttribute('id', 'contact-form');
    expect(form).toHaveAttribute('action', '/contact');
    expect(form).toHaveAttribute('method', 'get');
    expect(form).toHaveAttribute('enctype', 'multipart/form-data');
    expect(form).not.toHaveAttribute('novalidate');
    expect(form).toHaveAttribute('autocomplete', 'off');
    expect(form).toHaveAttribute('aria-label', 'Contact form');
  });

  it('has default form attributes when not specified', () => {
    renderWithProviders(
      <Form data-testid="test-form">
        <input type="text" />
      </Form>
    );

    const form = screen.getByTestId('test-form');

    expect(form).toHaveAttribute('novalidate');
    expect(form).toHaveAttribute('autocomplete', 'on');
    expect(form).toHaveAttribute('action', '#');
    expect(form).toHaveAttribute('method', 'post');
  });

  it('can be submitted using keyboard', async () => {
    const handleSubmit = jest.fn();

    const { user } = renderWithProviders(
      <Form onSubmit={handleSubmit} data-testid="test-form">
        <input type="text" placeholder="Username" />
        <button type="submit">Submit</button>
      </Form>
    );

    // Tab to the input
    await user.tab();
    expect(screen.getByPlaceholderText('Username')).toHaveFocus();

    // Tab to the submit button
    await user.tab();
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveFocus();

    // Press Enter to submit
    await user.keyboard('{Enter}');

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
}); 