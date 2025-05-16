export interface BaseCardProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    isLoading?: boolean;
    error?: string;
    'data-testid'?: string;
    children?: React.ReactNode;
    // Theme and responsive props
    theme?: 'default' | 'gym' | 'sports' | 'wellness';
    size?: 'sm' | 'md' | 'lg';
    layout?: 'vertical' | 'horizontal';
}

export interface ContentCardProps extends BaseCardProps {
    variant: 'content';
    title: string;
    description?: string;
    media?: React.ReactNode;
}

export interface ProfileCardProps extends BaseCardProps {
    variant: 'profile';
    name: string;
    avatarUrl?: string;
    bio?: string;
    media?: React.ReactNode;
}

export interface WorkoutCardProps extends BaseCardProps {
    variant: 'workout';
    workoutName: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    duration?: number;
    isBookmarked?: boolean;
    onBookmark?: (id: string, isBookmarked: boolean) => void;
    media?: React.ReactNode;
}

export interface ProgramCardProps extends BaseCardProps {
    variant: 'program';
    programName: string;
    level?: string;
    summary?: string;
    media?: React.ReactNode;
}

export type CardProps =
    | ContentCardProps
    | ProfileCardProps
    | WorkoutCardProps
    | ProgramCardProps;

export const isContentCard = (props: CardProps): props is ContentCardProps =>
  props.variant === 'content';
export const isProfileCard = (props: CardProps): props is ProfileCardProps =>
  props.variant === 'profile';
export const isWorkoutCard = (props: CardProps): props is WorkoutCardProps =>
  props.variant === 'workout';
export const isProgramCard = (props: CardProps): props is ProgramCardProps =>
  props.variant === 'program'; 