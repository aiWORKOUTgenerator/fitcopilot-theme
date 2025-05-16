import React from 'react';
import { Button } from './UI/Button/Button';
import { Card } from './UI/Card';

/**
 * Design System Demo Component
 * 
 * Displays examples of the design system components
 */
const DesignSystemDemo: React.FC = () => {
  return (
    <div className="design-system-demo" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)', fontSize: 'var(--type-xl)', marginBottom: '2rem' }}>
        Design System Demo
      </h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)', fontSize: 'var(--type-lg)', marginBottom: '1rem' }}>
          Colors
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-primary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Primary</div>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-secondary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Secondary</div>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-background)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text)' }}>Background</div>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-surface)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text)', border: '1px solid #eee' }}>Surface</div>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)', fontSize: 'var(--type-lg)', marginBottom: '1rem' }}>
          Typography
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: 'var(--type-small)', fontFamily: 'var(--font-sans)' }}>Small text (--type-small)</p>
          <p style={{ fontSize: 'var(--type-base)', fontFamily: 'var(--font-sans)' }}>Base text (--type-base)</p>
          <p style={{ fontSize: 'var(--type-lg)', fontFamily: 'var(--font-sans)' }}>Large text (--type-lg)</p>
          <p style={{ fontSize: 'var(--type-xl)', fontFamily: 'var(--font-heading)' }}>Extra large text (--type-xl)</p>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)', fontSize: 'var(--type-lg)', marginBottom: '1rem' }}>
          Components
        </h2>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)', fontSize: 'var(--type-base)', marginBottom: '1rem' }}>
            Buttons
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn">Default Button</button>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="tertiary">Tertiary Button</Button>
          </div>
        </div>

        <div>
          <h3 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)', fontSize: 'var(--type-base)', marginBottom: '1rem' }}>
            Cards
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            <Card>
              <h4 style={{ marginBottom: '0.5rem' }}>Simple Card</h4>
              <p>This is a basic card component from our design system.</p>
            </Card>

            <Card>
              <h4 style={{ marginBottom: '0.5rem' }}>Card with Button</h4>
              <p style={{ marginBottom: '1rem' }}>Cards can contain other components.</p>
              <button className="btn">Click me</button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemDemo; 