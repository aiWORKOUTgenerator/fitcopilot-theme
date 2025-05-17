/**
 * ButtonGroup Component Tests
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';

describe('ButtonGroup Component', () => {
  it('renders children correctly', () => {
    render(
      <ButtonGroup data-testid="btn-group">
        <Button variant="primary" data-testid="btn-1">Button 1</Button>
        <Button variant="primary" data-testid="btn-2">Button 2</Button>
        <Button variant="primary" data-testid="btn-3">Button 3</Button>
      </ButtonGroup>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup.children.length).toBe(3);

    const button1 = screen.getByTestId('btn-1');
    const button2 = screen.getByTestId('btn-2');
    const button3 = screen.getByTestId('btn-3');

    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
    expect(button3).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(
      <ButtonGroup data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass(
      'button-group',
      'button-group--horizontal',
      'button-group--spacing-medium',
      'button-group--align-start'
    );
  });

  it('applies horizontal direction class', () => {
    render(
      <ButtonGroup direction="horizontal" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--horizontal');
  });

  it('applies vertical direction class', () => {
    render(
      <ButtonGroup direction="vertical" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--vertical');
  });

  it('applies different spacing classes', () => {
    const { rerender } = render(
      <ButtonGroup spacing="small" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    let buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--spacing-small');

    rerender(
      <ButtonGroup spacing="large" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--spacing-large');

    rerender(
      <ButtonGroup spacing="none" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--spacing-none');
  });

  it('applies different alignment classes', () => {
    const { rerender } = render(
      <ButtonGroup alignment="center" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    let buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--align-center');

    rerender(
      <ButtonGroup alignment="end" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--align-end');

    rerender(
      <ButtonGroup alignment="stretch" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--align-stretch');
  });

  it('applies equal width class when equalWidth is true', () => {
    render(
      <ButtonGroup equalWidth={true} data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--equal-width');
  });

  it('applies custom className', () => {
    render(
      <ButtonGroup className="custom-group" data-testid="btn-group">
        <Button variant="primary">Button 1</Button>
        <Button variant="primary">Button 2</Button>
      </ButtonGroup>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('custom-group');
  });

  it('sets ARIA attributes correctly', () => {
    render(
      <ButtonGroup aria-label="Navigation buttons" data-testid="btn-group">
        <Button variant="primary">Previous</Button>
        <Button variant="primary">Next</Button>
      </ButtonGroup>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveAttribute('role', 'group');
    expect(buttonGroup).toHaveAttribute('aria-label', 'Navigation buttons');
  });

  it('renders with all props combined', () => {
    render(
      <ButtonGroup
        direction="vertical"
        spacing="large"
        alignment="center"
        equalWidth={true}
        className="custom-group"
        aria-label="Action buttons"
        data-testid="btn-group"
      >
        <Button variant="primary">Save</Button>
        <Button variant="primary">Cancel</Button>
        <Button variant="primary">Delete</Button>
      </ButtonGroup>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass(
      'button-group',
      'button-group--vertical',
      'button-group--spacing-large',
      'button-group--align-center',
      'button-group--equal-width',
      'custom-group'
    );
    expect(buttonGroup).toHaveAttribute('aria-label', 'Action buttons');
    expect(buttonGroup.children.length).toBe(3);
  });
}); 