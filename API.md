# API Specification - ax-decision-fabric

이 문서는 **ax-decision-fabric** 프로젝트의 핵심 기능을 제공하는 **4대 핵심 API 축**에 대한 명세 초안입니다.

## 1. 설계 원칙 (Design Principles)

- **핵심 가치**: 데이터 조회보다는 **상황 해석과 의사결정 보조**에 집중합니다.
- **구조**: 장애(Incident)를 중심으로 모든 상관관계 분석과 정책 평가가 이루어집니다.
- **초기 단계**: 복잡한 전체 명세보다는 필수적인 4개 핵심 기능에 집중하여 정의합니다.

---

## 2. API 명세 상세 (API Details)

### A. Incident API
장애 이벤트를 등록하고 조회하는 기본 인터페이스입니다.

#### 등록 (Register Incident)
- **POST** `/api/v1/incidents`

**요청 (Request)**
```json
{
  "system_name": "billing-api",
  "severity": "high",
  "title": "5xx error spike detected",
  "summary": "Error rate exceeded threshold"
}
```

**응답 (Response)**
```json
{
  "incident_id": "inc-001",
  "status": "open"
}
```

#### 조회 (Get Incident)
- **GET** `/api/v1/incidents/{incident_id}`
- **GET** `/api/v1/incidents`

---

### B. Change Correlation API
발생한 장애와 최근 시스템 변경 이력 간의 연관성을 분석합니다.

#### 변경 연관 분석 (Analyze Change Correlation)
- **POST** `/api/v1/incidents/{incident_id}/correlate-changes`

**응답 (Response)**
```json
{
  "incident_id": "inc-001",
  "related_changes": [
    {
      "change_id": "chg-009",
      "system_name": "billing-api",
      "changed_at": "2026-04-02T09:30:00Z",
      "changed_by": "ops_admin",
      "description": "Updated timeout config"
    }
  ],
  "correlation_score": 0.84
}
```

---

### C. Policy Evaluation API
SLA, 운영 정책 등을 기준으로 장애의 심각도와 리스크를 평가합니다.

#### 정책 평가 (Evaluate Policies)
- **POST** `/api/v1/incidents/{incident_id}/evaluate-policies`

**응답 (Response)**
```json
{
  "incident_id": "inc-001",
  "evaluations": [
    {
      "policy_code": "SLA_ESCALATION",
      "result": "violation_risk",
      "score": 0.92,
      "rationale": "Critical system with high severity incident"
    },
    {
      "policy_code": "UNAPPROVED_CHANGE_RISK",
      "result": "matched",
      "score": 0.88,
      "rationale": "Recent unapproved change exists"
    }
  ]
}
```

---

### D. Recommendation API
분석된 정보를 바탕으로 운영자가 취해야 할 조치와 그 근거를 제시합니다.

#### 권고 생성 (Generate Recommendations)
- **POST** `/api/v1/incidents/{incident_id}/recommendations`
- **GET** `/api/v1/incidents/{incident_id}/recommendations`

**응답 (Response)**
```json
{
  "incident_id": "inc-001",
  "recommendations": [
    {
      "type": "rollback_review",
      "action_text": "최근 변경사항 롤백 가능성을 우선 검토하세요.",
      "confidence_score": 0.87,
      "rationale": "장애 직전 미승인 설정 변경이 탐지되었습니다."
    },
    {
      "type": "sla_escalation",
      "action_text": "즉시 운영 책임자에게 에스컬레이션 하세요.",
      "confidence_score": 0.91,
      "rationale": "고위험/핵심 시스템 장애이며 SLA 위반 위험이 높습니다."
    }
  ]
}
```
