import { Incident, AnalysisResult } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: "INC-2026-MIDAS-01",
    client_name: "구조해석 시뮬레이션 클러스터",
    incident_type: "해석 노드 응답 속도 저하 감지",
    severity: "critical",
    status: "investigating",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    summary: "병렬 구조 해석(Parallel Solving) 프로세스 중 특정 노드의 연산 지연이 발생하여 전체 워크플로우에 영향."
  },
  {
    id: "INC-2026-MIDAS-02",
    client_name: "CIM 클라우드 서비스",
    incident_type: "설계 데이터 동기화 오류",
    severity: "high",
    status: "investigating",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "INC-2026-MIDAS-03",
    client_name: "라이선스 인증 서버",
    incident_type: "글로벌 라이선스 트래픽 과부하",
    severity: "medium",
    status: "open",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  }
];

export const mockAnalysisResults: Record<string, AnalysisResult> = {
  "INC-2026-MIDAS-01": {
    score: 95,
    priority: "critical",
    rationale: "핵심 공학 해석 엔진의 장애 수습 골든타임(15분)이 임박하여 L3 엔지니어 긴급 호출이 필요합니다. 장애 직전(5분 전) 승인되지 않은 바이너리 교체가 확인되었습니다.",
    applied_policies: [
      "운영.긴급_에스컬레이션_기준 (+40)",
      "보안.미승인_변경_리스크 (+30)",
      "컴플라이언스.정상 (+5)"
    ],
    response_level: "IMMEDIATE",
    applied_rules: ["ENGINE-CRITICAL", "UNAUTHORIZED-CHANGE"],
    business_context: { contract_value: 2000000000, recurring_count: 2 },
    recommended_action: "해석 엔진 코어를 이전 안정 버전으로 즉시 롤백하고 담당 리더에게 상황 전파"
  }
};
