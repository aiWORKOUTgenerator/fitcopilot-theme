import React from 'react';
import { CardProps } from '../../../../types/card';
import { CardButtonClickHandler, CardClickHandler } from '../../../../types/events';
import logger from '../../../../utils/logger';
import {
  isContentCard,
  isPricingCard,
  isProfileCard,
  isProgramCard,
  isWorkoutCard
} from '../../../../utils/typeGuards/cardTypeGuards';
import '../card.scss';

const getCardClassName = (props: CardProps) => {
  const baseClass = `card card--${props.variant}`;
  const themeClass = props.theme ? `theme-${props.theme}` : '';
  const sizeClass = props.size ? `card--size-${props.size}` : '';
  const layoutClass = props.layout ? `card--layout-${props.layout}` : '';
  const loadingClass = props.isLoading ? 'is-loading' : '';
  const interactiveClass = props.onClick ? 'card--interactive' : '';
  const customClass = props.className || '';

  return [baseClass, themeClass, sizeClass, layoutClass, loadingClass, interactiveClass, customClass]
    .filter(Boolean)
    .join(' ');
};

const handleKeyDown = (e: React.KeyboardEvent, onClick?: CardClickHandler) => {
  if (onClick && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    onClick(e);
  }
};

const ContentCard: React.FC<CardProps> = (props) => {
  if (!isContentCard(props)) return null;

  const isInteractive = Boolean(props.onClick);

  return (
    <div
      className={getCardClassName(props)}
      data-theme={props.theme}
      data-loading={props.isLoading}
      data-testid={props['data-testid']}
      style={props.style}
      onClick={props.onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => handleKeyDown(e, props.onClick) : undefined}
      aria-pressed={isInteractive ? 'false' : undefined}
    >
      {props.media && <div className="card-media" onClick={(e) => e.stopPropagation()}>{props.media}</div>}
      <h2>{props.title}</h2>
      {props.description && <p>{props.description}</p>}
      {props.children}
      {props.footer && <div className="card-footer">{props.footer}</div>}
    </div>
  );
};

const ProfileCard: React.FC<CardProps> = (props) => {
  if (!isProfileCard(props)) return null;

  const isInteractive = Boolean(props.onClick);

  return (
    <div
      className={getCardClassName(props)}
      data-theme={props.theme}
      data-loading={props.isLoading}
      data-testid={props['data-testid']}
      style={props.style}
      onClick={props.onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => handleKeyDown(e, props.onClick) : undefined}
      aria-pressed={isInteractive ? 'false' : undefined}
    >
      {props.media && <div className="card-media" onClick={(e) => e.stopPropagation()}>{props.media}</div>}
      {props.avatarUrl && <img src={props.avatarUrl} alt={props.name} className="card-avatar" />}
      <h2>{props.name}</h2>
      {props.role && <div className="card-role">{props.role}</div>}
      {props.bio && <p>{props.bio}</p>}
      {props.children}
    </div>
  );
};

const WorkoutCard: React.FC<CardProps> = (props) => {
  if (!isWorkoutCard(props)) return null;

  const isInteractive = Boolean(props.onClick);

  return (
    <div
      className={getCardClassName(props)}
      data-theme={props.theme}
      data-loading={props.isLoading}
      data-testid={props['data-testid']}
      style={props.style}
      onClick={props.onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => handleKeyDown(e, props.onClick) : undefined}
      aria-pressed={isInteractive ? 'false' : undefined}
    >
      {props.media && <div className="card-media" onClick={(e) => e.stopPropagation()}>{props.media}</div>}
      <h2>{props.workoutName}</h2>
      {props.difficulty && <span className="card-difficulty">{props.difficulty}</span>}
      {props.duration && <span className="card-duration">{props.duration} min</span>}
      {props.calories && <span className="card-calories">{props.calories} cal</span>}
      {props.targets && props.targets.length > 0 && (
        <div className="card-targets">
          {props.targets.map((target, index) => (
            <span key={index} className="card-target">{target}</span>
          ))}
        </div>
      )}
      {props.isBookmarked !== undefined && (
        <button
          className="card-bookmark"
          onClick={(e) => {
            e.stopPropagation();
            props.onBookmark?.(props.id || '', !props.isBookmarked);
          }}
        >
          {props.isBookmarked ? 'Unbookmark' : 'Bookmark'}
        </button>
      )}
      {props.children}
    </div>
  );
};

const ProgramCard: React.FC<CardProps> = (props) => {
  if (!isProgramCard(props)) return null;

  const isInteractive = Boolean(props.onClick);

  return (
    <div
      className={getCardClassName(props)}
      data-theme={props.theme}
      data-loading={props.isLoading}
      data-testid={props['data-testid']}
      style={props.style}
      onClick={props.onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => handleKeyDown(e, props.onClick) : undefined}
      aria-pressed={isInteractive ? 'false' : undefined}
    >
      {props.media && <div className="card-media" onClick={(e) => e.stopPropagation()}>{props.media}</div>}
      <h2>{props.programName}</h2>
      {props.level && <span className="card-level">{props.level}</span>}
      {props.summary && <p>{props.summary}</p>}
      {props.workoutCount && (
        <span className="card-workout-count">{props.workoutCount} workouts</span>
      )}
      {props.completionPercentage !== undefined && (
        <div className="card-progress">
          <div
            className="card-progress-bar"
            style={{ width: `${props.completionPercentage}%` }}
          />
        </div>
      )}
      {props.children}
    </div>
  );
};

const PricingCard: React.FC<CardProps> = (props) => {
  if (!isPricingCard(props)) return null;

  const isInteractive = Boolean(props.onClick);

  const handleCtaClick: CardButtonClickHandler = (e) => {
    e.stopPropagation();
    props.onCtaClick?.(e);
  };

  return (
    <div
      className={getCardClassName(props)}
      data-theme={props.theme}
      data-loading={props.isLoading}
      data-testid={props['data-testid']}
      style={props.style}
      onClick={props.onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => handleKeyDown(e, props.onClick) : undefined}
      aria-pressed={isInteractive ? 'false' : undefined}
    >
      {props.popular && <div className="card-popular-badge">Most Popular</div>}
      <h2>{props.planName}</h2>
      <div className="card-pricing">
        <span className="card-price">{props.price}</span>
        {props.period && <span className="card-period">/{props.period}</span>}
        {props.discount && <span className="card-discount">Save {props.discount}</span>}
      </div>
      <ul className="card-features">
        {props.features.map((feature, index) => (
          <li key={index} className="card-feature-item">{feature}</li>
        ))}
      </ul>
      {props.children}
      <button className="card-cta" onClick={handleCtaClick}>
        {props.ctaText}
      </button>
    </div>
  );
};

export const Card: React.FC<CardProps> = (props) => {
  if (isContentCard(props)) return <ContentCard {...props} />;
  if (isProfileCard(props)) return <ProfileCard {...props} />;
  if (isWorkoutCard(props)) return <WorkoutCard {...props} />;
  if (isProgramCard(props)) return <ProgramCard {...props} />;
  if (isPricingCard(props)) return <PricingCard {...props} />;

  // Handle unsupported card variants
  logger.error(`Unsupported card variant: ${props.variant}`);
  return null;
};

export default Card; 