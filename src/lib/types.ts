export interface Prompt {
  id: string;
  type: 'question' | 'enhancement';
  original: string;
  result: string;
  timestamp: Date;
}
