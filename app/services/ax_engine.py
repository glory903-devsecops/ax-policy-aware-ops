from typing import Dict, Any, List
from src.infrastructure.db.models import Incident, System

class AXPolicyEngine:
    """
    AX Prototype Policy Engine for Sales Decision Intelligence.
    Interprets incident data based on business context (VIP, Contract Value, PoC).
    """

    @staticmethod
    def evaluate(incident: Incident, system: System, recurring_count: int = 0) -> Dict[str, Any]:
        score = 0
        applied_rules = []
        
        # Rule 1: VIP + High/Critical Severity
        if system.is_vip and incident.severity in ["critical", "high"]:
            score += 40
            applied_rules.append("VIP 고객 고심각 장애 대응 정책 (+40)")

        # Rule 2: Large Contract (>= 500,000,000)
        if system.contract_value >= 500000000:
            score += 20
            applied_rules.append(f"대형 계약 고객 리스크 관리 정책 ({system.contract_value/100000000:,.1f}억) (+20)")

        # Rule 3: PoC in Progress
        if system.is_poc:
            score += 15
            applied_rules.append("PoC 진행 고객 보호 정책 (+15)")

        # Rule 4: Recurring Incidents (>= 2)
        if recurring_count >= 2:
            score += 15
            applied_rules.append(f"반복 장애 가중치 정책 ({recurring_count}회) (+15)")

        # Rule 5: Regular + Low Severity
        if not system.is_vip and incident.severity == "low":
            score += 5
            applied_rules.append("일반 고객 저심각 장애 관리 정책 (+5)")

        # Determine Response Level
        if score >= 70:
            level = "즉시 대응"
            action = "글로벌 CTO 즉시 보고 및 비상 대응팀(War-room) 소집"
        elif score >= 40:
            level = "우선 대응"
            action = "전담 기술 이사(DA) 배정 및 고객 대면 브리핑 준비"
        elif score >= 20:
            level = "일반 대응"
            action = "기술지원팀 1차 분석 및 가이드 발송"
        else:
            level = "모니터링"
            action = "상태 모니터링 및 자동 복구 프로세스 확인"

        # Generate Rationale
        rationale_parts = []
        if system.is_vip:
            rationale_parts.append(f"{system.name}사는 마이다스의 VIP 고객이며")
        if system.is_poc:
            rationale_parts.append("현재 PoC 진행 중으로 계약 전환 리스크가 높습니다.")
        
        if score >= 70:
            rationale_msg = f"{system.name}사는 {' '.join(rationale_parts)} 현재 {incident.severity} 등급 장애가 발생하여 최우선 대응 대상으로 분류됨."
        elif system.is_poc:
            rationale_msg = f"{system.name}사는 PoC 진행 중이며 장애 발생 시 신뢰도 저하 및 계약 실패 리스크가 높아 기술지원 우선 배정 필요."
        else:
            rationale_msg = f"계약 규모와 장애 심각도를 종합 고려한 정책 평가 결과 {level} 등급으로 분류됨."

        return {
            "score": score,
            "level": level,
            "action": action,
            "rationale": rationale_msg,
            "applied_rules": applied_rules
        }
