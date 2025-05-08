import React from 'react';

/**
 * TokenExample Component
 * 
 * This component demonstrates the standardized background color tokens in the Training component.
 * It shows how the component inherits from global design system tokens.
 */
const TokenExample: React.FC = () => {
    return (
        <div className="token-example">
            <h2 className="token-example__title">Training Component Token System</h2>

            <div className="token-example__section">
                <h3>Background Color Inheritance</h3>
                <div className="token-example__row">
                    <div className="token-example__token token-example__token--global">
                        <code>--color-background-primary</code>
                        <span className="token-example__description">Global token</span>
                    </div>
                    <div className="token-example__arrow">➡️</div>
                    <div className="token-example__token token-example__token--component">
                        <code>--training-bg</code>
                        <span className="token-example__description">Component token</span>
                    </div>
                </div>
            </div>

            <div className="token-example__section">
                <h3>Theme Variant Examples</h3>
                <div className="token-example__themes">
                    <div className="token-example__theme token-example__theme--default">
                        <h4>Default</h4>
                        <div className="token-example__color-block">
                            <code>var(--color-background-primary)</code>
                        </div>
                    </div>
                    <div className="token-example__theme token-example__theme--sports">
                        <h4>Sports</h4>
                        <div className="token-example__color-block">
                            <code>var(--color-background-primary)</code>
                        </div>
                    </div>
                    <div className="token-example__theme token-example__theme--wellness">
                        <h4>Wellness</h4>
                        <div className="token-example__color-block">
                            <code>var(--color-background-primary)</code>
                        </div>
                    </div>
                </div>
            </div>

            <div className="token-example__section">
                <h3>Component Inheritance</h3>
                <pre className="token-example__code">
                    {`.training-section {
  background-color: var(--training-bg, var(--color-background-primary));
}

/* Theme inheritance */
.training-section[data-theme],
body[data-theme] .training-section {
  background-color: var(--training-bg);
}

/* Section component compatibility */
.training-section.section-component {
  background-color: var(--color-background-primary);
}`}
                </pre>
            </div>
        </div>
    );
};

export default TokenExample; 