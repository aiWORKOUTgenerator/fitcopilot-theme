import React from 'react';
import './card.scss';
import {
    CardProps,
    isContentCard,
    isProfileCard,
    isProgramCard,
    isWorkoutCard
} from './types';

const getCardClassName = (props: CardProps) => {
    const baseClass = `card card--${props.variant}`;
    const themeClass = props.theme ? `theme-${props.theme}` : '';
    const sizeClass = props.size ? `card--size-${props.size}` : '';
    const layoutClass = props.layout ? `card--layout-${props.layout}` : '';
    const loadingClass = props.isLoading ? 'is-loading' : '';
    const customClass = props.className || '';

    return [baseClass, themeClass, sizeClass, layoutClass, loadingClass, customClass]
        .filter(Boolean)
        .join(' ');
};

const ContentCard: React.FC<CardProps> = (props) => (
    <div
        className={getCardClassName(props)}
        data-theme={props.theme}
        data-loading={props.isLoading}
        data-testid={props['data-testid']}
        style={props.style}
    >
        {props.media && <div className="card-media">{props.media}</div>}
        <h2>{props.title}</h2>
        {props.description && <p>{props.description}</p>}
        {props.children}
    </div>
);

const ProfileCard: React.FC<CardProps> = (props) => (
    <div
        className={getCardClassName(props)}
        data-theme={props.theme}
        data-loading={props.isLoading}
        data-testid={props['data-testid']}
        style={props.style}
    >
        {props.media && <div className="card-media">{props.media}</div>}
        {props.avatarUrl && <img src={props.avatarUrl} alt={props.name} className="card-avatar" />}
        <h2>{props.name}</h2>
        {props.bio && <p>{props.bio}</p>}
        {props.children}
    </div>
);

const WorkoutCard: React.FC<CardProps> = (props) => (
    <div
        className={getCardClassName(props)}
        data-theme={props.theme}
        data-loading={props.isLoading}
        data-testid={props['data-testid']}
        style={props.style}
    >
        {props.media && <div className="card-media">{props.media}</div>}
        <h2>{props.workoutName}</h2>
        {props.difficulty && <span className="card-difficulty">{props.difficulty}</span>}
        {props.duration && <span className="card-duration">{props.duration} min</span>}
        {props.isBookmarked !== undefined && (
            <button onClick={() => props.onBookmark?.(props.id || '', !props.isBookmarked)}>
                {props.isBookmarked ? 'Unbookmark' : 'Bookmark'}
            </button>
        )}
        {props.children}
    </div>
);

const ProgramCard: React.FC<CardProps> = (props) => (
    <div
        className={getCardClassName(props)}
        data-theme={props.theme}
        data-loading={props.isLoading}
        data-testid={props['data-testid']}
        style={props.style}
    >
        {props.media && <div className="card-media">{props.media}</div>}
        <h2>{props.programName}</h2>
        {props.level && <span className="card-level">{props.level}</span>}
        {props.summary && <p>{props.summary}</p>}
        {props.children}
    </div>
);

export const Card: React.FC<CardProps> = (props) => {
    if (isContentCard(props)) return <ContentCard {...props} />;
    if (isProfileCard(props)) return <ProfileCard {...props} />;
    if (isWorkoutCard(props)) return <WorkoutCard {...props} />;
    if (isProgramCard(props)) return <ProgramCard {...props} />;
    return null;
};

export default Card; 