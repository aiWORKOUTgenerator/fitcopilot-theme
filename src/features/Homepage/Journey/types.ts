export interface JourneyStep {
  id: number;
  title: string;
  description: string;
  number: number;
}

export interface JourneyProps {
  journey?: JourneyStep[];
} 