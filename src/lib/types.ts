export interface Prompt {
  id: string;
  type: 'question' | 'enhancement' | 'generation';
  original: string;
  result: string;
  timestamp: Date;
  imageDataUri?: string;
}
