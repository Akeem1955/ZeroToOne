export interface Milestone {
  title: string;
  duration: string;
  description: string;
  inputs: string[];
  firstStep: string;
  completionGate: string;
}

export interface FeasibilityResult {
  score: number;
  advice: string;
  competitors: string[];
  painPoints: string[];
  roadmap: Milestone[];
  devilAdvocate: string[];
}

export interface FileAttachment {
  name: string;
  mimeType: string;
  data: string; // base64 string or plain text
  isBinary: boolean;
}
