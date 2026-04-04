import asyncio
import uuid
import sys
import os
import random
from datetime import datetime, timedelta
from sqlalchemy import delete

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.infrastructure.db.database import init_db, AsyncSessionLocal
from src.infrastructure.db.models import System, Incident, ChangeEvent, Base

# Strategic AX Prototype Scenarios
SCENARIOS = [
    {
        "client": "A건설",
        "solution": "MIDAS Civil (NFX)",
        "incident_title": "로그인 장애 및 해석 서버 타임아웃",
        "severity": "critical",
        "is_vip": True,
        "is_poc": True,
        "contract_value": 800000000.0, # 8억
        "recurring_count": 2,
        "summary": "핵심 프로젝트(영종대교 유지보수) 설계 중 해석 엔진 로그인 불가로 작업 중단됨."
    },
    {
        "client": "B엔지니어링",
        "solution": "MIDAS Gen",
        "incident_title": "보고서 생성 지연 (PDF Export Error)",
        "severity": "medium",
        "is_vip": False,
        "is_poc": False,
        "contract_value": 300000000.0, # 3억
        "recurring_count": 1,
        "summary": "납품용 성과품 출력 중 폰트 깨짐 및 생성 속도 저하 현상 발생."
    },
    {
        "client": "C플랜트",
        "solution": "MIDAS CIM",
        "incident_title": "서버 응답 지연 및 데이터 싱크 오류",
        "severity": "high",
        "is_vip": True,
        "is_poc": False,
        "contract_value": 1200000000.0, # 12억
        "recurring_count": 3,
        "summary": "플랜트 통합 설계 모델 동기화 중 데이터 충돌로 서버 응답 지연."
    },
    {
        "client": "D설계",
        "solution": "MIDAS Geo",
        "incident_title": "파일 업로드/다운로드 오류 (Access Denied)",
        "severity": "low",
        "is_vip": False,
        "is_poc": True,
        "contract_value": 100000000.0, # 1억
        "recurring_count": 0,
        "summary": "지반 해석 데이터 업로드 중 권한 오류로 협업 지연."
    },
    {
        "client": "현대건설",
        "solution": "MIDAS Civil (Global Edition)",
        "incident_title": "해외 라이선스 서버 연결 실패",
        "severity": "high",
        "is_vip": True,
        "is_poc": False,
        "contract_value": 500000000.0, # 5억
        "recurring_count": 0,
        "summary": "사우디 현장 본부에서 국내 라이선스 서버 접근 시 SSL 핸드쉐이크 오류 발생."
    },
    {
        "client": "AECOM",
        "solution": "MIDAS NFX (Simulation)",
        "incident_title": "해석 코어 커널 크래시 (Memory Dump)",
        "severity": "critical",
        "is_vip": True,
        "is_poc": True,
        "contract_value": 2000000000.0, # 20억
        "recurring_count": 4,
        "summary": "글로벌 프로젝트 협업 중 대용량 유동 해석 모듈 커널 패닉 발생."
    },
    {
        "client": "삼성물산",
        "solution": "MIDAS Gen (Build)",
        "incident_title": "빌딩 자동 설계 모듈 연동 실패",
        "severity": "medium",
        "is_vip": True,
        "is_poc": False,
        "contract_value": 700000000.0, # 7억
        "recurring_count": 1,
        "summary": "초고층 빌딩 자동화 설계 스크립트 실행 중 API 응답 지연."
    },
    {
        "client": "Vinci",
        "solution": "MIDAS CIM",
        "incident_title": "공동 클라우드 저장소 접근 불가",
        "severity": "medium",
        "is_vip": False,
        "is_poc": True,
        "contract_value": 450000000.0, # 4.5억
        "recurring_count": 2,
        "summary": "프랑스 본사 통합 모델링 클라우드 스택 오버플로우 발생."
    },
    {
        "client": "Obayashi",
        "solution": "MIDAS Geo",
        "incident_title": "내진 설계 기준 데이터 라이브러리 손상",
        "severity": "high",
        "is_vip": True,
        "is_poc": False,
        "contract_value": 600000000.0, # 6억
        "recurring_count": 1,
        "summary": "일본 내진 기준(JIS) 반영 라이브러리 로드 중 정합성 오류 발생."
    },
    {
        "client": "Stantec",
        "solution": "MIDAS Civil",
        "incident_title": "그래픽 가속기 연동 불일치 (UI Lag)",
        "severity": "low",
        "is_vip": False,
        "is_poc": False,
        "contract_value": 150000000.0, # 1.5억
        "recurring_count": 0,
        "summary": "워크스테이션 그래픽 드라이버 업데이트 후 모델 뷰 지연 현상."
    },
    {
        "client": "Ferrovial",
        "solution": "MIDAS Gen",
        "incident_title": "분산 처리 노드 통신 오류",
        "severity": "medium",
        "is_vip": False,
        "is_poc": False,
        "contract_value": 250000000.0, # 2.5억
        "recurring_count": 3,
        "summary": "HPC 클러스터를 활용한 분산 해석 중 워커 노드 3대 이탈."
    },
    {
        "client": "ARUP",
        "solution": "MIDAS CIM",
        "incident_title": "애플리케이션 게이트웨이 보안 인증 오류",
        "severity": "high",
        "is_vip": True,
        "is_poc": True,
        "contract_value": 900000000.0, # 9억
        "recurring_count": 2,
        "summary": "BIM 통합 인증 연동(SSO) 모듈 장애로 사용자 50명 접근 불가."
    }
]

async def setup_ax_prototype_data():
    print(f"🚀 AX 세일즈 의사결정 전략적 프로토타입 데이터 구축 시작...")
    await init_db()
    
    async with AsyncSessionLocal() as session:
        # Clear existing data for clean demo
        print("🗑️ 기존 데이터를 삭제하고 12개의 전략적 시나리오를 자동 생성합니다...")
        await session.execute(delete(ChangeEvent))
        await session.execute(delete(Incident))
        await session.execute(delete(System))
        await session.commit()

        for idx, sc in enumerate(SCENARIOS):
            system_name = sc["client"]
            
            # 1. Create System
            system = System(
                id=uuid.uuid4(),
                name=system_name,
                environment="production",
                owner_team="글로벌_기술지원팀",
                criticality=sc["severity"],
                is_vip=sc["is_vip"],
                is_poc=sc["is_poc"],
                contract_value=sc["contract_value"]
            )
            session.add(system)
            await session.flush()
            
            # 2. Inject Incident
            incident = Incident(
                id=uuid.uuid4(),
                system_id=system.id,
                title=f"{sc['solution']} - {sc['incident_title']}",
                severity=sc["severity"],
                status="open",
                detected_at=datetime.utcnow() - timedelta(minutes=random.randint(20, 300)),
                summary=sc["summary"]
            )
            session.add(incident)
            
            # 3. Add some random history for 'recurring_count' context (as changes/logs)
            if sc["recurring_count"] > 0:
                for i in range(sc["recurring_count"]):
                    change = ChangeEvent(
                        id=uuid.uuid4(),
                        system_id=system.id,
                        change_type="긴급 패치",
                        changed_by="tech_support",
                        approved=True,
                        changed_at=datetime.utcnow() - timedelta(days=i+1),
                        description=f"{sc['client']} 반복 장애 대응 히스토리 {i+1}회차"
                    )
                    session.add(change)

        await session.commit()
        print(f"✅ 12개 전략 고객사의 시스템 및 장애 데이터 적재 완료.")

if __name__ == "__main__":
    asyncio.run(setup_ax_prototype_data())
