# OPA Policy Specification (Rego) - ax-decision-fabric

이 문서는 **ax-decision-fabric**에서 의사결정의 핵심 로직을 담당하는 **Open Policy Agent (OPA) 정책** 정의와 활용 예시를 담고 있습니다.

## 1. 정책 설계 철학 (Policy Design Philosophy)

- **Context-aware**: 단순한 규칙이 아니라 시스템의 중요도, 장애의 심각도 등 컨텍스트를 결합하여 판단합니다.
- **Explainable**: 판단 결과(true/false)뿐만 아니라 그 근거(`rationale`)를 함께 생성하여 운영자에게 제공합니다.
- **Atomic**: 각 정책은 독립적인 파일과 패키지로 관리되어 필요에 따라 조합해서 사용할 수 있습니다.

---

## 2. 정책 샘플 상세 (Policy Samples)

### 2.1 SLA 에스컬레이션 정책
시스템 중요도와 장애 심각도를 기반으로 즉각적인 보고가 필요한지 판단합니다.

- **파일 위치**: `policies/sla.rego`
- **로직 요약**: 
    - 중점 시스템(Critical) + 심각한 장애(High)인 경우 즉시 에스컬레이션.
    - 중점 시스템(Critical) + 중간 장애(Medium)이면서 30분 이상 지속된 경우 에스컬레이션.

#### [입력 및 기대 결과 예시]
**Input:**
```json
{
  "system": { "name": "billing-api", "criticality": "critical" },
  "incident": { "severity": "high", "open_minutes": 12 }
}
```
**Output:**
```json
{
  "escalation_required": true,
  "rationale": "Critical system with elevated incident severity requires immediate escalation"
}
```

---

### 2.2 미승인 변경-장애 연관 위험 정책
장애 발생 직전(60분 이내)에 동일 시스템에서 발생한 미승인 변경 사항이 있는지 탐지합니다.

- **파일 위치**: `policies/change_risk.rego`
- **로직 요약**: 
    - 장애 시스템과 동일한 시스템에서 최근 60분 이내에 발생한 변경 사항 중 `approved: false`인 건을 탐지.

#### [입력 및 기대 결과 예시]
**Input:**
```json
{
  "incident": { "system_name": "billing-api", "detected_at": "2026-04-02T10:00:00Z" },
  "changes": [
    { "system_name": "billing-api", "approved": false, "changed_at": "2026-04-02T09:20:00Z" }
  ]
}
```
**Output:**
```json
{
  "risky_change_detected": true,
  "rationale": "Recent unapproved change detected within 60 minutes before incident"
}
```
