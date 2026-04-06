import axios from 'axios';
import { Incident, AnalysisResult } from '../types';

const IS_PRODUCTION = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';
const API_BASE_URL = IS_PRODUCTION ? '/ax-policy-aware-ops/api/v1' : 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Enhanced Mock Data for World-Class Demo (Sales & Strategic Scenarios) ---

const MOCK_INCIDENTS: Incident[] = [
  { id: 'hd-1', client_name: '현대건설 (Hyundai E&C)', incident_type: 'CIVIL NX - 대형 교량 해석 엔진 이상 리포트', severity: 'critical', vip: true, poc: true, value: 5000000000, score: 98, status: 'open', created_at: new Date().toISOString() },
  { id: 'ss-1', client_name: '삼성물산 (Samsung C&T)', incident_type: 'GEN NX - 신규 빌딩 설계 라이선스 인증 장애', severity: 'high', vip: true, poc: false, value: 1200000000, score: 85, status: 'open', created_at: new Date().toISOString() },
  { id: 'ae-1', client_name: 'AECOM (Global Strategic)', incident_type: 'NFX - 글로벌 시뮬레이션 서버 응답 지연', severity: 'critical', vip: true, poc: true, value: 2500000000, score: 92, status: 'open', created_at: new Date().toISOString() },
  { id: 'gs-1', client_name: 'GS건설 (GS E&C)', incident_type: 'CIVIL NX - 통합 DB 연동 동기화 실패', severity: 'medium', vip: false, poc: false, value: 500000000, score: 65, status: 'open', created_at: new Date().toISOString() },
  { id: 'ar-1', client_name: 'ARUP (UK)', incident_type: 'FEA Engine - 핵심 보안 패치 적용 누락', severity: 'high', vip: true, poc: true, value: 900000000, score: 78, status: 'open', created_at: new Date().toISOString() }
];

const MOCK_ANALYSIS: Record<string, AnalysisResult> = {
  'hd-1': {
    score: 98,
    priority: 'critical',
    rationale: '현대건설은 마이다스아이티의 최상위 전략 파트너이며, 현재 50억 규모의 차세대 교량 설계 PoC가 진행 중입니다. 해석 엔진 이상은 PoC 수주 실패로 이어질 수 있으므로 본사 기술지원팀의 즉각적인 현장 파견을 권장합니다.',
    applied_policies: ['VIP 고객 고심각 장애 대응 정책 (+40)', 'PoC 리스크 방어 정책 (+30)', '대형 계약 (50.0억) 가중치 정책 (+20)', '전략적 신규 기술 도입 보호 (+8)']
  },
  'ss-1': {
    score: 85,
    priority: 'high',
    rationale: '삼성물산은 안정적인 매출 기여를 유지하는 주요 고객사입니다. 라이선스 인증 장애는 설계 실무의 생산성을 즉각 저하시키므로 원격 지원팀을 통한 빠른 복구가 필요합니다.',
    applied_policies: ['주요 고객사 가용성 보장 정책 (+40)', '라이선스 긴급 복구 정책 (+25)', '계약 규모 (12.0억) 자동 보정 (+20)']
  },
  'ae-1': {
    score: 92,
    priority: 'critical',
    rationale: 'AECOM은 글로벌 시장 확대를 위한 핵심 고객입니다. 시뮬레이션 서버 지연은 글로벌 동시 협업 환경에 치명적이므로 클라우드 리소스 임시 증설 및 서버 최적화를 즉시 검토하십시오.',
    applied_policies: ['글로벌 전략 고객 우대 정책 (+45)', '서버 가용성 품질 정책 (+25)', '글로벌 협업 리스크 제어 (+22)']
  }
};

const MOCK_INQUIRIES = [
  { id: 'inq-1', raw_text: '현대건설 VIP, 50억 PoC 연계 건 장애 보고. 교량 해석 엔진 로그인 불가.', status: 'processed', extracted_client: '현대건설', extracted_value: 5000000000, extracted_severity: 'critical', extracted_vip: true, predicted_value: 5000000000 },
  { id: 'inq-2', raw_text: '삼성물산 신규 빌딩 설계 라이선스 인증 오류 발생. 프로젝트 지연 우려 (12억 규모).', status: 'processed', extracted_client: '삼성물산', extracted_value: 1200000000, extracted_severity: 'high', extracted_vip: true, predicted_value: 1200000000 },
  { id: 'inq-3', raw_text: 'AECOM 글로벌 전략 파트너사 시뮬레이션 서버 레이턴시 급증. 25억 규모 협상 중.', status: 'processed', extracted_client: 'AECOM', extracted_value: 2500000000, extracted_severity: 'critical', extracted_vip: true, predicted_value: 2500000000 }
];

// --- In-Memory Simulation Storage ---
let sessionInquiries: any[] = [...MOCK_INQUIRIES];
let sessionIncidents: Incident[] = [...MOCK_INCIDENTS];

export const api = {
  getIncidents: async (): Promise<Incident[]> => {
    try {
      const response = await apiClient.get('/incidents');
      return response.data;
    } catch (error) {
      console.warn("Using AX Session Intelligence for high-fidelity demo.");
      return sessionIncidents;
    }
  },
  
  getAnalysisResult: async (incidentId: string): Promise<AnalysisResult> => {
    try {
      const response = await apiClient.get(`/recommendations/${incidentId}`);
      return response.data;
    } catch (error) {
      if (MOCK_ANALYSIS[incidentId]) return MOCK_ANALYSIS[incidentId];
      return {
        score: 75,
        priority: 'high',
        rationale: '새로운 시스템 문의에 대해 AI가 비즈니스 맥락을 분석했습니다. 계약 규모 및 VIP 여부를 고려하여 우선순위가 높게 책정되었습니다.',
        applied_policies: ['신규 리스크 탐지 정책 (+20)', '잠재적 영업 기회 보호 정책 (+15)']
      };
    }
  },

  getInquiries: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/inquiries');
      return response.data;
    } catch (error) {
      return sessionInquiries;
    }
  },

  createInquiry: async (text: string): Promise<any> => {
    try {
      const response = await apiClient.post('/inquiries', { raw_text: text });
      return response.data;
    } catch (error) {
       const isVip = text.includes('VIP') || text.includes('현대') || text.includes('삼성');
       const extractedVal = text.includes('억') ? parseInt(text.match(/(\d+)억/)?.[1] || '0') * 100000000 : 0;
       // Intelligent Prediction Logic
       const predictedValue = extractedVal || (text.includes('대형') ? 2500000000 : (text.includes('소형') ? 200000000 : 500000000));

       const newInquiry = { 
         id: `sim-${Date.now()}`, 
         raw_text: text, 
         status: 'processed',
         extracted_client: text.includes('현대') ? '현대건설' : (text.includes('삼성') ? '삼성물산' : 'Extracted Client'),
         extracted_value: extractedVal,
         predicted_value: predictedValue,
         extracted_severity: text.includes('장애') || text.includes('오류') ? 'critical' : 'high',
         extracted_vip: isVip
       };
       sessionInquiries = [newInquiry, ...sessionInquiries];

       // AX-First: Immediately push to dashboard
       const newIncident: Incident = {
          id: `inc-${newInquiry.id}`,
          client_name: newInquiry.extracted_client,
          incident_type: `[AI 추출] ${newInquiry.raw_text.substring(0, 30)}...`,
          severity: newInquiry.extracted_severity as any,
          vip: newInquiry.extracted_vip,
          poc: text.includes('PoC'),
          value: predictedValue,
          score: Math.floor(Math.random() * 20) + 70, // Simulated AI Score
          status: 'open',
          created_at: new Date().toISOString()
       };
       sessionIncidents = [newIncident, ...sessionIncidents];

       return newInquiry;
    }
  },

  excludeFromDashboard: async (inquiryId: string): Promise<any> => {
    try {
      await apiClient.delete(`/inquiries/${inquiryId}`);
    } catch (error) {
      const inq = sessionInquiries.find(i => i.id === inquiryId);
      if (inq) {
        inq.status = 'excluded';
        sessionIncidents = sessionIncidents.filter(inc => inc.id !== `inc-${inquiryId}` && inc.id !== inquiryId);
      }
      return { success: true };
    }
  },

  processInquiry: async (id: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/inquiries/${id}/process`);
      return response.data;
    } catch (error) {
      // Re-inclusion logic
      const inq = sessionInquiries.find(i => i.id === id);
      if (inq) {
        inq.status = 'processed';
        // Add back if missing
        if (!sessionIncidents.find(inc => inc.id === `inc-${id}`)) {
           sessionIncidents.push({
             id: `inc-${id}`,
             client_name: inq.extracted_client,
             incident_type: `[AI 재등록] ${inq.raw_text.substring(0, 30)}...`,
             severity: inq.extracted_severity,
             vip: inq.extracted_vip,
             value: inq.extracted_value || inq.predicted_value,
             score: 75,
             status: 'open',
             created_at: new Date().toISOString()
           });
        }
      }
      return { success: true };
    }
  }
};
