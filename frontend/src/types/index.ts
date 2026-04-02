export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'open' | 'investigating' | 'resolved' | 'closed';

export interface Incident {
  id: string;
  system_name: string;
  title: string;
  severity: Severity;
  status: Status;
  summary?: string;
  detected_at: string;
}

export interface ChangeEvent {
  id: string;
  system_name: string;
  change_type: string;
  changed_by: string;
  approved: boolean;
  changed_at: string;
  description: string;
}

export interface PolicyEvaluation {
  policy_code: string;
  result: 'matched' | 'violation_risk' | 'safe';
  score: number;
  rationale: string;
}

export interface Recommendation {
  type: string;
  action_text: string;
  confidence_score: number;
  rationale: string;
}

export interface AnalysisResult {
  incident_id: string;
  correlation_score: number;
  related_changes: ChangeEvent[];
  evaluations: PolicyEvaluation[];
  recommendations: Recommendation[];
}
