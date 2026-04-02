# MCP (Model Context Protocol) Guide - ax-decision-fabric

이 문서는 **ax-decision-fabric**에서 **MCP**를 단순한 데이터 조회가 아닌, **운영 컨텍스트 공급 인터페이스(Operational Context Provider)**로 활용하는 방법과 예시를 설명합니다.

## 1. 개요 (Overview)

MCP는 AI 비서가 특정 애플리케이션의 데이터와 기능을 안전하고 구조화된 방식으로 사용할 수 있게 해주는 프로토콜입니다. 본 프로젝트에서는 MCP를 통해 다음을 수행합니다:
- **리소스(Resources)**: 최근 변경 이력, 티켓 상태 등 실시간 운영 맥락 제공.
- **도구(Tools)**: 유사 장애 검색, 시스템 상태 체크 등 동적 기능 실행.
- **프롬프트(Prompts)**: AI 모델에 상황별로 최적화된 분석 템플릿 제공.

---

## 2. 주요 구성 요소 (Components)

### 2.1 리소스 (Resources)
운영 판단에 필요한 정적/반정적 데이터를 AI에게 노출합니다.
- **URI 패턴**: `change://recent/{system_name}`
- **역할**: 판단 시점의 최근 변경 사항을 컨텍스트로 주입하여 "왜?"에 대한 답을 찾도록 돕습니다.

### 2.2 도구 (Tools)
AI가 분석 과정에서 직접 호출하여 추가 정보를 얻거나 액션을 수행합니다.
- **함수**: `search_similar_incidents(system_name, keyword)`
- **역할**: 과거의 해결 사례를 검색하여 현재 장애의 대응 방안(Resolution) 도출에 기여합니다.

### 2.3 프롬프트 (Prompts)
특정 상황(예: 장애 분석)에 가장 적합한 AI 분석 템플릿을 제공합니다.
- **함수**: `incident_analysis_prompt(system_name, severity, title)`
- **역할**: 운영 전문가의 분석 관점이 반영된 프롬프트를 통해 분석 결과의 품질을 상향 평준화합니다.

---

## 3. 샘플 코드 위치
- **위치**: `app/mcp_server/server.py`
- **실행**: `python app/mcp_server/server.py` (FastMCP 기반으로 stdio 또는 HTTP 전송 지원 예정)

---

## 4. 향후 확장 계획
향후 다음과 같은 다양한 리소스 프로토콜을 추가하여 컨텍스트를 확장할 예정입니다:
- `ticket://{id}`: 특정 장애와 연관된 티켓 상세 정보.
- `runbook://{system_name}/{type}`: 시스템별 표준 운영 절차서.
- `cmdb://{system_name}`: 시스템 자산 및 토폴로지 정보.
- `policy://{policy_code}`: 현재 적용 중인 정책의 상세 내용.
