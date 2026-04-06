export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'open' | 'investigating' | 'resolved' | 'closed';

export interface BusinessContext {
  contract_value: number;
  recurring_count: number;
}

export interface Incident {
  id: string;
  client_name: string; // Unified with simulation data
  incident_type: string;
  severity: Severity;
  status: Status;
  summary?: string;
  created_at: string;
  // Custom AX Fields for Dashboard
  score?: number;
  priority?: string;
  rationale?: string;
  applied_policies?: string[];
  vip?: boolean;
  poc?: boolean;
  value?: number;
}

export interface AnalysisResult {
  score: number;
  priority: string;
  rationale: string;
  applied_policies: string[];
  // Extended fields for rich UI (AnalysisPanel)
  response_level?: string;
  applied_rules?: string[];
  business_context?: BusinessContext;
  recommended_action?: string;
}
