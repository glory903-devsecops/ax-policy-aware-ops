# AX Decision Fabric

AX Decision Fabric은 장애, 로그, 티켓, 변경이력을 정책 기반으로 해석하여  
설명 가능한 권고(Recommendation)와 실행 가능한 운영 워크플로우(Workflow)로 전환하는  
AX 기반 운영 의사결정 레이어입니다.

## 1. Background

기업의 IT 운영 현장에는 이미 많은 데이터가 존재합니다.

- 시스템 로그
- 장애 티켓
- 변경 이력
- 자산 정보
- 운영 정책
- 대응 가이드(Runbook)

하지만 실제 의사결정은 여전히 개인의 경험과 숙련도에 크게 의존합니다.  
그 결과 다음과 같은 문제가 반복됩니다.

- 동일 장애의 재발
- 운영 품질의 개인 편차
- SLA 리스크 조기 인지 실패
- 변경 후 장애의 책임 추적 어려움
- 대응 지식의 조직 자산화 실패

## 2. Problem Statement

기존 시스템은 데이터를 보여주지만, 다음 행동을 제안하지는 않습니다.

본 프로젝트는 다음 질문에 답하기 위해 설계되었습니다.

- 지금 이 장애는 어떤 정책 리스크를 가지는가?
- 최근 변경 이력과 어떤 연관성이 있는가?
- 우선적으로 어떤 대응 액션을 취해야 하는가?
- 이 판단의 근거는 무엇인가?
- 이 권고를 실제 워크플로우로 연결할 수 있는가?

## 3. Solution

AX Decision Fabric은 운영 데이터를 수집하고,
정책 기반 분석을 수행한 뒤,
설명 가능한 추천과 실행 가능한 운영 플로우를 생성합니다.

핵심 기능은 다음과 같습니다.

- Incident 분석
- Change correlation 분석
- Policy evaluation
- Recommendation 생성
- Workflow orchestration
- Context delivery via MCP

## 4. Core Capabilities

### 4.1 Incident Intelligence
장애 이벤트를 수집하고 중요도, 영향도, 관련 시스템을 분석합니다.

### 4.2 Change Correlation
최근 변경 이력과 장애 발생 간의 연관성을 탐지합니다.

### 4.3 Policy-aware Decision
SLA, 운영 정책, 변경 승인 정책을 기준으로 리스크를 평가합니다.

### 4.4 Explainable Recommendation
“무엇을 해야 하는가” 뿐 아니라 “왜 그렇게 판단했는가”를 함께 제공합니다.

### 4.5 Executable Workflow
권고를 알림, 승인, 조치 요청 등 실제 운영 워크플로우로 연결합니다.

## 5. Architecture

- FastAPI
- Clean Architecture
- Domain-driven design
- Open Policy Agent (OPA)
- Temporal Workflow
- MCP Server
- PostgreSQL

## 6. Domain Model

주요 도메인 객체는 다음과 같습니다.

- Incident
- Ticket
- ChangeEvent
- PolicyRule
- PolicyEvaluation
- Recommendation
- WorkflowExecution
- Evidence

## 7. Why This Project

이 프로젝트는 단순한 운영 대시보드가 아닙니다.  
운영 데이터를 정책과 맥락으로 해석하여,
사람의 경험에 의존하던 판단을 시스템 차원에서 보조하고 구조화하는 것을 목표로 합니다.

즉,
운영 자동화가 아니라
운영 의사결정 자동화에 초점을 둡니다.

## 8. Roadmap

본 프로젝트는 AI 기술 도입 전에 정책 기반 AX 의사결정 시스템으로서의 정체성을 선명하게 구축하는 것을 목표로 합니다.

### Phase 1: 핵심 도메인 및 API 구축
- ERD 반영 및 DB 스키마 구축
- Incident, ChangeEvent, Recommendation 도메인 모델 생성
- 기초 분석 및 권고 API 구현

### Phase 2: 정책 평가 엔진 연동
- OPA(Open Policy Agent) 엔진 통합
- SLA(`sla.rego`) 및 미승인 변경 리스크(`change_risk.rego`) 정책 구현

### Phase 3: MCP 기반 운영 컨텍스트 확장
- MCP 서버 통합을 통한 실시간 운영 맥락 공급
- 최근 변경 이력 리소스 및 유사 장애 검색 도구 제공

### Phase 4: 통합 AX 대시보드
- 변경 이력, 정책 판정, 권고 근거를 한눈에 보여주는 통합 뷰 구현
- 장애 상세 분석 및 의사결정 추적성 강화

## 9. Expected Impact

- 운영 의사결정 품질 표준화
- 장애 대응 시간 단축
- 정책 위반 리스크 조기 탐지
- 대응 지식의 조직 자산화
- 운영 책임성과 설명 가능성 강화

## 10. Future Extensions

- LLM 기반 사고 요약
- 유사 장애 검색
- 내부자 행위 이상 탐지
- Zero Trust 운영 의사결정 확장

## 11. Project Structure

```text
ax-decision-fabric/
├─ app/
│  ├─ main.py
│  └─ api/
│     └─ v1/
│        ├─ incidents.py
│        ├─ recommendations.py
│        └─ health.py
├─ src/
│  ├─ domain/
│  │  ├─ entities/
│  │  │  ├─ incident.py
│  │  │  ├─ change_event.py
│  │  │  ├─ recommendation.py
│  │  │  └─ policy_evaluation.py
│  │  ├─ repositories/
│  │  │  ├─ incident_repository.py
│  │  │  └─ change_repository.py
│  │  └─ services/
│  │     ├─ risk_scoring_service.py
│  │     ├─ recommendation_service.py
│  │     └─ accountability_service.py
│  ├─ application/
│  │  ├─ dto/
│  │  └─ use_cases/
│  │     ├─ analyze_incident.py
│  │     ├─ correlate_change.py
│  │     ├─ evaluate_policy.py
│  │     └─ generate_recommendation.py
│  ├─ infrastructure/
│  │  ├─ db/
│  │  ├─ repositories/
│  │  ├─ opa/
│  │  ├─ temporal/
│  │  └─ mcp/
│  └─ interfaces/
│     └─ schemas/
├─ policies/
│  ├─ sla.rego
│  └─ change_risk.rego
├─ workflows/
│  └─ incident_response.py
├─ tests/
├─ README.md
└─ pyproject.toml
```

## 12. Documentation

프로젝트의 상세 설계 및 가이드는 아래 문서들을 참조하세요.

- [**ERD.md**](file:///Users/glory1994/Library/CloudStorage/GoogleDrive-glory.lee903@gmail.com/내 드라이브/99.Develop/ax-policy-aware-ops/ERD.md): 데이터베이스 모델링 및 관계 정의
- [**API.md**](file:///Users/glory1994/Library/CloudStorage/GoogleDrive-glory.lee903@gmail.com/내 드라이브/99.Develop/ax-policy-aware-ops/API.md): 4대 핵심 축 기반 API 명세
- [**POLICIES.md**](file:///Users/glory1994/Library/CloudStorage/GoogleDrive-glory.lee903@gmail.com/내 드라이브/99.Develop/ax-policy-aware-ops/POLICIES.md): OPA 정책(Rego) 정의 및 예시
- [**MCP_GUIDE.md**](file:///Users/glory1994/Library/CloudStorage/GoogleDrive-glory.lee903@gmail.com/내 드라이브/99.Develop/ax-policy-aware-ops/MCP_GUIDE.md): 운영 컨텍스트 공급 인프라 활용 가이드
- [**ROADMAP.md**](file:///Users/glory1994/Library/CloudStorage/GoogleDrive-glory.lee903@gmail.com/내 드라이브/99.Develop/ax-policy-aware-ops/ROADMAP.md): 단계별 개발 우선순위 및 전략