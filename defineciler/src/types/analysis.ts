/**
 * Yapay zeka analiz sonucu. Worker'daki JSON şemasıyla (worker/src/schema.ts) birebir aynı olmalıdır.
 */
export type Verdict = 'artifact' | 'possible' | 'not_artifact' | 'unclear';

export type AuthenticityAssessment = 'likely_original' | 'suspicious' | 'likely_replica' | 'undetermined';

export interface AnalysisResult {
  verdict: Verdict;
  title: string;
  category: string;
  summary: string;
  period: string;
  civilization: string;
  dateRange: string;
  material: string;
  origin: string;
  description: string;
  features: string[];
  inscriptions: string;
  authenticity: {
    assessment: AuthenticityAssessment;
    notes: string[];
  };
  similarExamples: string[];
  preservationTips: string[];
  photoTips: string[];
  confidence: number;
}

export interface ScanRecord {
  id: string;
  createdAt: number;
  imageUri: string;
  note?: string;
  result: AnalysisResult;
}
