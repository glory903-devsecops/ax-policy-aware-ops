import axios from 'axios';
import { Incident, AnalysisResult } from '../types';

const IS_PRODUCTION = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
const API_BASE_URL = IS_PRODUCTION ? '/ax-policy-aware-ops/api/v1' : 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Enhanced Mock Data for Live Demo (Sales Scenarios) ---

const MOCK_INCIDENTS: Incident[] = [
  { id: 'hd-1', client_name: '현대건설 (Hyundai E&C)', incident_type: 'MIDAS CI (NFX) - 전사적 로그인 장애', severity: 'critical', vip: true, poc: true, value: 5000000000, status: 'open', created_at: new Date().toISOString() },
  { id: 'ss-1', client_name: '삼성물산 (Samsung C&T)', incident_type: 'MIDAS CI - 서버 응답 지연 (P1)', severity: 'high', vip: true, poc: false, value: 1200000000, status: 'open', created_at: new Date().toISOString() },
  { id: 'ae-1', client_name: 'AECOM (Global)', incident_type: 'MIDAS NFX (Simulation) - 해석 엔진 오류', severity: 'critical', vip: true, poc: true, value: 2000000000, status: 'open', created_at: new Date().toISOString() },
  { id: 'gs-1', client_name: 'GS건설 (GS E&C)', incident_type: 'MIDAS CI - 신규 라이선스 및 PO 견적 문의', severity: 'medium', vip: false, poc: false, value: 500000000, status: 'open', created_at: new Date().toISOString() },
  { id: 'ar-1', client_name: 'ARUP (UK)', incident_type: 'MIDAS CI - 보안 취약점 패치 적용 실패', severity: 'high', vip: true, poc: true, value: 900000000, status: 'open', created_at: new Date().toISOString() }
];

const MOCK_ANALYSIS: Record<string, AnalysisResult> = {
  'hd-1': {
    score: 95,
    priority: 'critical',
    rationale: '현대건설은 마이다스아이티의 최상위 VIP 고객이며, 현재 50억 규모의 PoC가 연계되어 있어 장애 방치가 불가능합니다. 즉시 본사 기술지원팀의 개입을 권장합니다.',
    applied_policies: ['VIP 고객 고심각 장애 대응 정책 (+40)', 'PoC 리스크 방어 정책 (+30)', '대형 계약 고객 리스크 관리 정책 (50.0억) (+20)']
  },
  'ss-1': {
    score: 80,
    priority: 'high',
    rationale: '삼성물산은 주요 고객사로 서버 지연 발생 시 비즈니스 연속성에 큰 타격이 예상됩니다. VIP 전담 채널을 통한 1차 대응이 필요합니다.',
    applied_policies: ['VIP 정책 (+40)', '서버 가용성 보장 정책 (+20)', '계약 가중치 정책 (12.0억) (+20)']
  },
  'ae-1': {
    score: 90,
    priority: 'critical',
    rationale: 'AECOM 글로벌 전략 파트너십과 연계된 20억 규모 PoC입니다. 해석 엔진 오류는 솔루션 신뢰도에 치명적이므로 최우선 순위로 배포 패치를 검토하십시오.',
    applied_policies: ['글로벌 전략 고객 우대 정책 (+45)', '해석 엔진 리스크 관리 정책 (+25)', 'PoC 리스크 방어 정책 (+20)']
  }
};

const MOCK_INQUIRIES = [
  { id: 'inq-1', raw_text: '현대건설 VIP, 50억 PoC 연계 건 장애 보고. 로그인 불가.', status: 'processed', extracted_client: '현대건설', extracted_value: 5000000000, extracted_severity: 'critical', extracted_vip: true },
  { id: 'inq-2', raw_text: '삼성물산 NFX 라이선스 서버 응답이 너무 느려요. 12억 프로젝트 진행중.', status: 'processed', extracted_client: '삼성물산', extracted_value: 1200000000, extracted_severity: 'high', extracted_vip: true },
  { id: 'inq-3', raw_text: 'AECOM 글로벌 파트너사 해석 엔진 오류 리포트. 예상 규모 20억.', status: 'processed', extracted_client: 'AECOM', extracted_value: 2000000000, extracted_severity: 'critical', extracted_vip: true }
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
      console.warn("Using AX Session Intelligence due to connectivity.");
      return sessionIncidents;
    }
  },
  
  getAnalysisResult: async (incidentId: string): Promise<AnalysisResult> => {
    try {
      const response = await apiClient.get(`/recommendations/${incidentId}`);
      return response.data;
    } catch (error) {
      if (MOCK_ANALYSIS[incidentId]) return MOCK_ANALYSIS[incidentId];
      // Default fallback for new session items
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
       const predictedValue = text.includes('대형') ? 2500000000 : (text.includes('소형') ? 200000000 : 500000000);
       const extractedVal = text.includes('억') ? parseInt(text.match(/(\d+)억/)?.[1] || '0') * 100000000 : 0;

       const newInquiry = { 
         id: `sim-${Date.now()}`, 
         raw_text: text, 
         status: 'processed', // AX-First: Default to Processed
         extracted_client: text.includes('현대') ? '현대건설' : (text.includes('삼성') ? '삼성물산' : 'Extracted Client'),
         extracted_value: extractedVal,
         predicted_value: predictedValue,
         extracted_severity: text.includes('장애') || text.includes('로그인') || text.includes('오류') ? 'critical' : 'high',
         extracted_vip: isVip
       };
       sessionInquiries = [newInquiry, ...sessionInquiries];

       // AX-First: Immediately add to incidents for dashboard
       const newIncident: Incident = {
          id: `inc-${newInquiry.id}`,
          client_name: newInquiry.extracted_client,
          incident_type: `[AI추출] ${newInquiry.raw_text.substring(0, 30)}...`,
          severity: newInquiry.extracted_severity as any,
          vip: newInquiry.extracted_vip,
          poc: text.includes('PoC'),
          value: extractedVal || predictedValue,
          status: 'open',
          created_at: new Date().toISOString()
       };
       sessionIncidents = [newIncident, ...sessionIncidents];

       return newInquiry;
    }
  },

  // AX-First Opt-out Action
  excludeFromDashboard: async (inquiryId: string): Promise<any> => {
    try {
      // In a real API, this might be a DELETE or a status update
      await apiClient.delete(`/inquiries/${inquiryId}`);
    } catch (error) {
      // Simulation: Mark the inquiry as excluded and remove from incidents
      const inq = sessionInquiries.find(i => i.id === inquiryId);
      if (inq) {
        inq.status = 'excluded';
        sessionIncidents = sessionIncidents.filter(inc => inc.id !== `inc-${inquiryId}`);
      }
      return { success: true };
    }
  },

  processInquiry: async (id: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/inquiries/${id}/process`);
      return response.data;
    } catch (error) {
      // Fallback: This is now handled by auto-registration in createInquiry
      return { success: true };
    }
  }
};
