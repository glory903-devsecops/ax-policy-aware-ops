import { Incident, AnalysisResult } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: "INC-2026-MIDAS-01",
    system_name: "구조해석 시뮬레이션 클러스터",
    title: "해석 노드 응답 속도 저하 감지",
    severity: "critical",
    status: "investigating",
    detected_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    summary: "병렬 구조 해석(Parallel Solving) 프로세스 중 특정 노드의 연산 지연이 발생하여 전체 워크플로우에 영향."
  },
  {
    id: "INC-2026-MIDAS-02",
    system_name: "CIM 클라우드 서비스",
    title: "설계 데이터 동기화 오류",
    severity: "high",
    status: "investigating",
    detected_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "INC-2026-MIDAS-03",
    system_name: "라이선스 인증 서버",
    title: "글로벌 라이선스 트래픽 과부하",
    severity: "medium",
    status: "open",
    detected_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  }
];

export const mockAnalysisResults: Record<string, AnalysisResult> = {
  "INC-2026-MIDAS-01": {
    incident_id: "INC-2026-MIDAS-01",
    correlation_score: 0.88,
    related_changes: [
      {
        id: "CHG-MIDAS-102",
        system_name: "해석 엔진 코어",
        change_type: "라이브러리 업데이트",
        changed_by: "시스템_운영팀",
        approved: false,
        changed_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        description: "수치 해석 라이브러리(Solver Core) v5.4 패치 적용."
      }
    ],
    evaluations: [
      {
        policy_code: "운영.긴급_에스컬레이션_기준",
        result: "violation_risk",
        score: 0.95,
        rationale: "핵심 공학 해석 엔진의 장애 수습 골든타임(15분)이 임박하여 L3 엔지니어 긴급 호출이 필요합니다."
      },
      {
        policy_code: "보안.미승인_변경_리스크",
        result: "violation_risk",
        score: 0.92,
        rationale: "장애 직전(5분 전) 승인되지 않은 바이너리 교체가 확인되었습니다. 엔진 크래시의 직접적 원인으로 판단됩니다."
      },
      {
        policy_code: "컴플라이언스.정상",
        result: "safe",
        score: 0.05,
        rationale: "개인 정보 및 데이터 보안 정책에 상충되는 요소는 발견되지 않았습니다."
      }
    ],
    recommendations: [
      {
        type: "Rollback",
        action_text: "해석 엔진 코어(CHG-MIDAS-102)를 이전 안정 버전으로 즉시 롤백하십시오.",
        confidence_score: 0.94,
        rationale: "미승인 라이브러리 업데이트와 연산 오류 발생 시점이 완벽히 일치하며, 롤백 시 95% 확률로 정상 복구됩니다."
      },
      {
        type: "Notification",
        action_text: "마이다스 전사 기술지원팀에 해석 지연 공지 및 상황을 전파하십시오.",
        confidence_score: 0.88,
        rationale: "글로벌 사용자 대기의 최소화를 위해 현재 분석 상황 및 복구 예상 시간을 공지해야 합니다."
      }
    ]
  }
};
