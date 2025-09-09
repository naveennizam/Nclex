export type Question =
  | {
      id: number;
      type: 'single';
      question: string;
      options: string[];
      answer: string[];
      rationale: string;
    }
  | {
      id: number;
      type: 'multiple';
      question: string;
      options: string[];
      answer: string[];
      rationale: string;
    }
  | {
      id: number;
      type: 'drag';
      question: string;
      options: string[];
      answer: string[];
      rationale: string;
    }
  | {
      id: number;
      type: 'highlight';
      text: string;
      question: string;
      answer: string[];
      rationale: string;
    };
