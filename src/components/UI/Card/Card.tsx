import React from 'react';
import './Card.scss';

export interface CardProps {
    /** Card content */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
    <div className={`card ${className || ''}`}>{children}</div>
);

export default Card; 