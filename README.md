# Midas Global Sales Ops Dashboard (AX-Powered)

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css) ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite) ![Python](https://img.shields.io/badge/Python_3.9-3776AB?style=for-the-badge&logo=python) ![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright)

**Midas Global Sales Ops Dashboard**는 전 세계 100대 고객사의 장애 리스크를 실시간으로 해석하여 **'설명 가능한 권고(Explainable Recommendation)'**를 제공하는 AX(AI Transformation) 의사결정 지원 플랫폼입니다.

---

## 🚀 Interactive Demo (Sales Ops Perspective)

영업 담당자가 100개 이상의 글로벌 고객사 사이트에서 어떻게 장애 리스크를 관리하고 의사결정을 내리는지 보여주는 시뮬레이션 데모입니다.

![Global Sales Ops 시연 데모](./assets/demo/global_sales_ops_demo.webp)

> [!TIP]
> **시연 하이라이트**: AECOM(글로벌 TOP 1) 장애 인지 시 AX 엔진이 즉시 'VIP 전용 비상 대응 가이드'를 도출하고 영업 담당자에게 즉시 보고 및 비상 서버 인스턴스 할당을 권고합니다.

---

## 🏗️ Core Architecture & Features

### 1. Global-Scale Observability (100+ Clients)
현대건설, 삼성물산, AECOM, Vinci 등 **글로벌 100대 건설/엔지니어링 사**의 실명 데이터셋과 시나리오를 통해 실제와 유사한 고부하 모니터링 환경을 완성했습니다.

### 2. AX Recommendation Logic (VIP Focus)
단순한 알람을 넘어 **비즈니스 임팩트**를 분석합니다:
- **영업.VIP_고객_영향도_분석**: 주요 고객사 별 계약 가치를 기준으로 리스크 스코어링.
- **Explainable Rationale**: "왜 이 대응이 최우선인가?"에 대한 정책 기반 근거 제시.
- **Sales Action Guide**: "CTO 즉시 보고", "비상 리소스 전용 할당" 등 비즈니스 연속성 확보를 위한 구체적 액션 제안.

### 3. Engineering Excellence (Enterprise Pro)
- **FastAPI Backend**: SQLAlchemy(Async) 기반의 고성능 비동기 API 구축.
- **Next.js Frontend**: 'Enterprise Pro' 수준의 고해상도 다크/라이트 테마 최적화.
- **Verification Proof**: `pytest` 통합 테스트를 통한 200개 이상 Incident 데이터 정합성 검증 완료.

---

## 🧪 Verification Results

```bash
# 통합 API 테스트 실행 결과 (100% Pass)
tests/test_api_v1.py::test_100_incidents_data_count ✅ Total Incidents: 200 PASSED
tests/test_api_v1.py::test_vip_recommendation_logic ✅ Found VIP Client: AECOM PASSED
tests/test_api_v1.py::test_api_list_incidents ✅ API Response (Incidents): 200 items PASSED
```

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