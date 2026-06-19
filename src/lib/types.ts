export interface Milestone {
  title: string;
  duration: string;
  description: string;
  inputs: string[];
  firstStep: string;
  completionGate: string;
}

export interface ScoreBreakdown {
  technical: number;
  market: number;
  competition: number;
  monetization: number;
  distribution: number;
}

export interface CompetitorSegment {
  direct: string[];
  indirect: string[];
  alternatives: string[];
}

export interface FeasibilityResult {
  score: number;
  scoreBreakdown?: ScoreBreakdown;
  advice: string;
  competitors: string[] | CompetitorSegment;
  painPoints: string[];
  roadmap: Milestone[];
  devilAdvocate: string[];
  recommendation?: 'Proceed' | 'Validate More' | 'Do Not Proceed';
}

export interface FileAttachment {
  name: string;
  mimeType: string;
  data: string; // base64 string or plain text
  isBinary: boolean;
}
