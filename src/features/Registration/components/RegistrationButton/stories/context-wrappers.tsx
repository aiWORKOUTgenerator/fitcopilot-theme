import React from 'react';
import './context-wrappers.scss';

/**
 * Context wrapper components for RegistrationButton stories
 * These components apply the same styling contexts as the real application
 */

// Pure context wrapper - shows component in complete isolation
export function PureContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="pure-context-wrapper">
      {children}
    </div>
  );
}

// Splash context wrapper - applies Splash page styling
export function SplashContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="splash-context-wrapper">
      <div className="splash-step">
        <div className="registration-entry-form">
          {children}
        </div>
      </div>
    </div>
  );
}

// Registration context wrapper - applies general Registration styling
export function RegistrationContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="registration-context-wrapper">
      <div className="registration">
        <div className="registration-step">
          {children}
        </div>
      </div>
    </div>
  );
}

// Journey context wrapper - applies Journey step styling
export function JourneyContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="journey-context-wrapper">
      <div className="registration-journey">
        <div className="journey-step">
          {children}
        </div>
      </div>
    </div>
  );
}

// Form context wrapper - applies general form styling
export function FormContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="form-context-wrapper">
      <div className="form">
        <div className="form-section">
          {children}
        </div>
      </div>
    </div>
  );
}

// Context comparison wrapper - shows multiple contexts side-by-side
export function ContextComparisonWrapper({ 
  contexts 
}: { 
  contexts: Array<{
    name: string;
    wrapper: React.ComponentType<{ children: React.ReactNode }>;
    component: React.ReactNode;
  }>;
}) {
  return (
    <div className="context-comparison-wrapper">
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${contexts.length}, 1fr)`, 
        gap: '2rem',
        padding: '2rem'
      }}>
        {contexts.map(({ name, wrapper: Wrapper, component }, index: number) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>{name}</h3>
            <Wrapper>{component}</Wrapper>
          </div>
        ))}
      </div>
    </div>
  );
} 