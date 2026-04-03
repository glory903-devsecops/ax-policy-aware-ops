import asyncio
import uuid
import sys
import os
import random
from datetime import datetime, timedelta
from sqlalchemy import select

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.infrastructure.db.database import init_db, AsyncSessionLocal
from src.infrastructure.db.models import System, Incident, ChangeEvent

# 100 Major Midas IT Clients
DOMESTIC_CLIENTS = [
    "현대건설", "삼성물산", "대우건설", "포스코이앤씨", "GS건설", "DL이앤씨", "롯데건설", "SK에코플랜트", 
    "HDC현대산업개발", "한화건설", "계룡건설", "코오롱글로벌", "금호건설", "태영건설", "제일건설", "호반건설",
    "더샵", "자이", "푸르지오", "래미안", "힐스테이트", "이편한세상", # 주요 브랜드 포함
    "유신", "도화엔지니어링", "삼안", "건화", "한국종합기술", "태조엔지니어링", "수성엔지니어링", "동명기술공단",
    "경동엔지니어링", "평화엔지니어링", "서영엔지니어링", "다산컨설턴트", "제일엔지니어링", "선진엔지니어링",
    "한국도로공사", "국가철도공단", "LH공사", "서울교통공사", "한국수자원공사", "한전KPS", "한국전력기술",
    "에스알", "인천공항공사", "한국공항공사"
]

GLOBAL_CLIENTS = [
    "AECOM", "Vinci", "ARUP", "Bechtel", "Jacobs", "WSP", "Arcadis", "HDR", "Kajima Corp.", 
    "SNC-Lavalin", "Mott MacDonald", "Ramboll", "Stantec", "Parsons", "Balfour Beatty", "Turner Construction", 
    "Skanska", "Bouygues", "FCC", "Ferrovial", "Sacyr", "Acciona", "ACS", "Galliford Try", "Kier", 
    "VolkerWessels", "Royal BAM Group", "Strabag", "Hochtief", "Bilfinger", "Porr", "Implenia", 
    "Salini Impregilo", "Astaldi", "OHLA", "Dragados", "Fluor Corporation", "KBR", "Wood Group", 
    "Worley", "Tenet Healthcare", "China State Construction", "Obayashi Corp.", "Shimizu Corp.",
    "Taisei Corp.", "Takenaka Corp.", "L&T", "Tata Projects", "GMR Group", "Adani Group",
    "Hyundai Engineering", "Samsung E&A", "GS E&C (Global)", "DL E&C (Global)", "Lotte E&C (Global)",
    "Hualu Engineering", "Sinopec Engineering", "Technip Energies", "Saipem", "Petrofac", "McDermott",
    "Aker Solutions", "Subsea 7", "Woodside Energy", "Shell (Global Engineering)", "ExxonMobil (Projects)",
    "BP (Project Services)", "Chevron (Major Projects)", "TotalEnergies (Construction)", "Equinor (Engineering)",
    "John Wood Group", "Amec Foster Wheeler", "Kiewit", "Gilbane", "PCL Construction", "EllisDon"
]

# Total 100 clients
ALL_CLIENTS = list(set(DOMESTIC_CLIENTS + GLOBAL_CLIENTS))[:100]
SOLUTIONS = ["MIDAS Civil", "MIDAS Gen", "MIDAS CIM", "MIDAS Geo", "MIDAS NFX"]

async def generate_100_client_scenarios():
    print(f"🚀 마이다스 글로벌 100대 고객사 시나리오 데이터 구축 시작...")
    await init_db()
    
    # 0. Clean old test data (optional but recommended for a clean demo)
    async with AsyncSessionLocal() as session:
        await session.execute(select(Incident)) # Just checking connectivity
        print("💡 기존 데이터를 유지하며 100개 목표를 향해 신규 데이터를 추가합니다.")
        for idx, client in enumerate(ALL_CLIENTS):
            solution = random.choice(SOLUTIONS)
            system_name = f"{client} - {solution}"
            
            # 1. Create or Get System
            stmt = select(System).where(System.name == system_name)
            result = await session.execute(stmt)
            system = result.scalar_one_or_none()
            
            if not system:
                system = System(
                    id=uuid.uuid4(),
                    name=system_name,
                    environment="production",
                    owner_team="글로벌_기술지원팀",
                    criticality="high" if idx < 30 else "medium"
                )
                session.add(system)
                await session.flush() # Get the ID
            
            # 2. Inject Incident
            incident_id = uuid.uuid4()
            severity = random.choice(["critical", "high", "medium", "low"])
            
            incident = Incident(
                id=incident_id,
                system_id=system.id,
                title=f"{solution} 해석 코어 런타임 오류 및 지연",
                severity=severity,
                status="investigating" if idx < 20 else "open",
                detected_at=datetime.utcnow() - timedelta(minutes=random.randint(5, 500)),
                summary=f"{client}사의 핵심 프로젝트 설계 중 {solution} 엔진의 비정상 종료가 반복됨."
            )
            session.add(incident)
            
            # 3. Inject Change Event (as a cause in some cases)
            if random.random() > 0.4:
                change = ChangeEvent(
                    id=uuid.uuid4(),
                    system_id=system.id,
                    change_type="패치 업데이트" if random.random() > 0.5 else "DB 설정 변경",
                    changed_by="sys_admin",
                    approved=random.random() > 0.7,
                    changed_at=datetime.utcnow() - timedelta(minutes=random.randint(10, 600)),
                    description=f"{client} 전용 해석 서버 가속화 패치 적용 시도."
                )
                session.add(change)

        await session.commit()
        print(f"✅ 100개 고객사의 시스템 및 장애 데이터 적재 완료.")

if __name__ == "__main__":
    asyncio.run(generate_100_client_scenarios())
