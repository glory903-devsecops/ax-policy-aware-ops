export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'open' | 'investigating' | 'resolved' | 'closed';

export interface BusinessContext {
  is_vip: boolean;
  is_poc: boolean;
  contract_value: number;
  recurring_count: number;
}

export interface Incident {
  id: string;
  system_name: string;
  title: string;
  severity: Severity;
  status: Status;
  summary?: string;
  detected_at: string;
  // Custom AX Fields for Table
  priority_score?: number;
  is_vip?: boolean;
  is_poc?: boolean;
  contract_value?: number;
}

export interface AnalysisResult {
  incident_id: string;
  client_name: string;
  priority_score: number;
  response_level: string;
  recommended_action: string;
  rationale: string;
  applied_rules: string[];
  business_context: BusinessContext;
}
