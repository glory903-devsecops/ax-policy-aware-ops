# Development Roadmap - ax-decision-fabric

이 문서는 **ax-decision-fabric**의 단계별 개발 우선순위와 로드맵을 정의합니다.

## 1. 개발 전략 (Development Strategy)

본 프로젝트는 AI 기술을 크게 도입하기 전에 **정책 기반 AX(AI Transformation) 의사결정 시스템**으로서의 정체성을 선명하게 구축하는 것을 최우선으로 합니다. 인접 단계의 성과를 바탕으로 점진적으로 AI 컨텍스트를 확장합니다.

---

## 2. 4단계 로드맵 (4-Phase Roadmap)

### **1단계: 핵심 도메인 및 API 구축 (Phase 1: Core Domain & API)**
- **역할**: 프로젝트의 뼈대를 형성하고 기초 데이터를 수집합니다.
- **주요 작업**:
    - ERD(Entity Relationship Diagram) 반영 및 DB 스키마 구축.
    - Incident, ChangeEvent, Recommendation 핵심 도메인 모델 생성.
    - 기초 API 구현:
        - `POST /incidents`: 장애 등록.
        - `POST /incidents/{id}/recommendations`: 기본 권고 생성 요청.

### **2단계: 정책 평가 엔진 연동 (Phase 2: Policy Evaluation)**
- **역할**: 장애 상황을 정책적으로 해석하는 두뇌 역할을 구현합니다.
- **주요 작업**:
    - OPA(Open Policy Agent) 엔진 연동.
    - 주요 정책 구현 및 검증:
        - `sla.rego`: SLA 기반 에스컬레이션 정책.
        - `change_risk.rego`: 미승인 변경 연관 위험 탐지 정책.

### **3단계: MCP 기반 운영 컨텍스트 확장 (Phase 3: MCP Context Extension)**
- **역할**: AI 보조 도구가 판단에 필요한 충분한 맥락을 확보하도록 합니다.
- **주요 작업**:
    - MCP(Model Context Protocol) 서버 통합.
    - 핵심 인터페이스 공급:
        - `change://recent/{system_name}`: 실시간 변경 이력 리소스.
        - `search_similar_incidents`: 과거 사례 검색 도구.

### **4단계: 통합 모니터링 대시보드 (Phase 4: Integrated AX Dashboard)**
- **역할**: 분석 결과와 근거를 사용자에게 시각적으로 전달하여 의사결정을 완성합니다.
- **주요 작업**:
    - 장애 상세 화면 구현.
    - 통합 뷰 제공: **변경 이력 + 정책 판정 결과 + 권고 액션 + 판단 근거**를 한 화면에 통합.
    - 의사결정 추적성(Traceability) 강화.
