import { Incident, AnalysisResult } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: "INC-2026-001",
    system_name: "billing-api",
    title: "5xx Error Spike Detected",
    severity: "critical",
    status: "investigating",
    detected_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    summary: "HTTP 500 errors exceeded 5% threshold in production cluster."
  },
  {
    id: "INC-2026-002",
    system_name: "auth-service",
    title: "Latancy increase in Login flow",
    severity: "high",
    status: "investigating",
    detected_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: "INC-2026-003",
    system_name: "payment-gateway",
    title: "Database connection timeout",
    severity: "medium",
    status: "open",
    detected_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  }
];

export const mockAnalysisResults: Record<string, AnalysisResult> = {
  "INC-2026-001": {
    incident_id: "INC-2026-001",
    correlation_score: 0.84,
    related_changes: [
      {
        id: "CHG-2026-901",
        system_name: "billing-api",
        change_type: "config",
        changed_by: "dev_ops_user",
        approved: false,
        changed_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        description: "Updated timeout and retry values for upstream dependency."
      }
    ],
    evaluations: [
      {
        policy_code: "sla.escalation_required",
        result: "violation_risk",
        score: 0.95,
        rationale: "Critical billing system with High severity incident requires immediate escalation to L3."
      },
      {
        policy_code: "change.unapproved_risk",
        result: "violation_risk",
        score: 0.88,
        rationale: "Unapproved change detected within 5 minutes of incident onset. Highly likely to be the root cause."
      },
      {
        policy_code: "security.audit_safe",
        result: "safe",
        score: 0.12,
        rationale: "No suspicious access or credential leakage detected during this incident."
      }
    ],
    recommendations: [
      {
        type: "rollback",
        action_text: "최근 미승인 변경사항(CHG-2026-901)을 즉시 롤백하세요.",
        confidence_score: 0.92,
        rationale: "변경 시점과 장애 발생 시점이 5분 이내로 매우 밀접하며, 미승인 설정 변경이 원인일 확률이 매우 높습니다."
      },
      {
        type: "escalation",
        action_text: "빌링 서비스 담당자 및 인프라 팀에 긴급 호출을 전파하세요.",
        confidence_score: 0.85,
        rationale: "SLA 기준에 따라 크리티컬 서비스의 장애 수습 골든타임(15분)이 임박했습니다."
      }
    ]
  }
};
