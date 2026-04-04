# AX Sales Decision Intelligence Platform (v1.0) 🚀

마이다스아이티(Midas IT)의 영업 경쟁력을 극대화하기 위한 **'지능형 의사결정 지원 플랫폼'**입니다. 
현장의 비정형 자연어 데이터를 AI가 해석하고, RPA가 정형화하여, 정책 기반의 최우선 순위 대응 가이드를 실시간으로 제공합니다.

---

## 🎥 Full Pipeline Journey (Demo)

영업 담당자의 목소리가 어떻게 비즈니스 지능으로 변환되는지 확인해 보세요.
> [!TIP]
> **접수(Reception)** -> **분류(RPA)** -> **의사결정(Dashboard)**으로 이어지는 3단계 AX 여정이 핵심입니다.

![AX Full Pipeline Journey](file:///Users/glory1994/.gemini/antigravity/brain/81b7b75a-facc-46ca-9362-de1c01f2481d/midas_ax_platform_success_journey_v4_1775281814243_1775305609169.webp)

---

## 🚀 Quick Start (로컬 실행 방법)

본 프로젝트는 백엔드(FastAPI)와 프론트엔드(Next.js)로 구성되어 있습니다. 각 터미널에서 아래 명령어를 실행해 주세요.

### 1. 백엔드 서버 구동 (FastAPI)
```bash
# 프로젝트 루트 디렉토리에서 실행
# 의존성 설치 (필요시)
pip install -r requirements.txt

# DB 초기화 및 서버 실행
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- **API 문서**: http://localhost:8000/docs

### 2. 프론트엔드 구동 (Next.js)
```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치 (필요시)
npm install

# 서비스 실행
npm run dev
```
- **대시보드 접속**: [http://localhost:3000](http://localhost:3000)

---

## 📂 Core Features (v1.0 Stable)

- **의사결정 대시보드 (Decision)**: 정책 점수(점) 및 AI 대응 권고(Rationale) 확인.
- **고객 문의사항 분류 (RPA)**: 자연어 추출 데이터를 엑셀 그리드에 자동 기입 및 승인.
- **고객 문의사항 접수 (Reception)**: SNS/메시지 스타일의 비정형 데이터 입력창.
- **세일즈 정책 관리 (AI Logic)**: VIP 우선, PoC 보호 등 5대 비즈니스 룰 자동 적용.
- **전략적 유사 사례 (Intelligence)**: 과거 성공 대응 케이스 실시간 추천.

---

## 🛠️ Versioning & Backup (버전 관리 가이드)

본 프로젝트는 UX/UI의 지속적인 고도화를 위해 버전별 백업을 수행합니다. 
> [!IMPORTANT]
> **현재 안정 버전**: `v1.0-ax-sales-pipeline`

### 새 버전 백업 방법 (UI/UX 개선 직후)
기존 버전을 안전하게 보존하고 새로운 시점을 기록하려면 다음 명령어를 사용하세요.
```bash
# 1. 모든 변경사항 커밋
git add .
git commit -m "feat: UI/UX [기능명] 개선 및 [버전명] 업데이트"

# 2. 태그 생성 (스냅샷 백업)
git tag v1.1-uiux-enhanced

# 3. 깃허브 푸시
git push origin main --tags
```

---

## 📧 Contact & Support
- **Project**: AX Decision Fabric for Midas IT
- **Maintainer**: Glory Lee (@glory1994)