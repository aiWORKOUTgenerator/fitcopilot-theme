import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/introduction">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function DocCategory({ title, description, icon, link }) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
        <Link
          className="button button--secondary button--sm"
          to={link}>
          Learn More
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Documentation for the FitCopilot React/TypeScript WordPress theme">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <DocCategory
                title="Getting Started"
                description="Installation guides, quick start tutorials, and basic usage information to help you get up and running with the FitCopilot theme."
                icon="🚀"
                link="/docs/getting-started/introduction"
              />
              <DocCategory
                title="Architecture"
                description="Learn about the feature-first architecture, component model, state management, and other architectural patterns used in the theme."
                icon="🏗️"
                link="/docs/architecture/overview"
              />
              <DocCategory
                title="Development"
                description="Development workflows, coding standards, testing guidelines, and other resources for contributing to the theme."
                icon="💻"
                link="/docs/development/workflow"
              />
            </div>
            <div className="row" style={{ marginTop: '2rem' }}>
              <DocCategory
                title="API Reference"
                description="Comprehensive reference documentation for components, hooks, WordPress integration points, and utilities."
                icon="📚"
                link="/api/overview"
              />
              <DocCategory
                title="Component Library"
                description="Interactive documentation of the UI components, feature components, and layout components in the theme."
                icon="🧩"
                link="/components/overview"
              />
              <DocCategory
                title="Quality Metrics"
                description="Performance metrics, accessibility reports, code quality statistics, and other quality indicators."
                icon="📊"
                link="/metrics/overview"
              />
            </div>
          </div>
        </section>
        <section className={styles.quickLinks}>
          <div className="container">
            <h2 className={styles.quickLinksTitle}>Quick Links</h2>
            <div className="row">
              <div className="col col--6">
                <div className={styles.quickLinksCard}>
                  <h3>Developer Resources</h3>
                  <ul>
                    <li><Link to="/docs/documentation-index">Complete Documentation Index</Link></li>
                    <li><Link to="/docs/development/workflow">Development Workflow</Link></li>
                    <li><Link to="/docs/architecture/feature-first-approach">Feature-First Architecture</Link></li>
                    <li><Link to="/api/components/ui-components">UI Components API</Link></li>
                    <li><Link to="/docs/development/adding-features">Adding New Features</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col col--6">
                <div className={styles.quickLinksCard}>
                  <h3>Community Resources</h3>
                  <ul>
                    <li><Link to="/docs/contributing/contributing">Contributing Guidelines</Link></li>
                    <li><Link to="/docs/contributing/documentation">Documentation Guidelines</Link></li>
                    <li><a href="https://github.com/fitcopilot/fitcopilot-theme">GitHub Repository</a></li>
                    <li><a href="https://github.com/fitcopilot/fitcopilot-theme/issues">Issue Tracker</a></li>
                    <li><a href="https://github.com/fitcopilot/fitcopilot-theme/pulls">Pull Requests</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
