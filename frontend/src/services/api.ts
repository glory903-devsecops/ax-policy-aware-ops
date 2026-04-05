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

// High-fidelity Mock Data for Live Demo Fallback
const MOCK_INCIDENTS: Incident[] = [
  { id: '1', client_name: 'A건설', incident_type: 'MIDAS CI (NFX) - 로그인 지연', severity: 'critical', vip: true, poc: true, value: 800000000, status: 'open', created_at: new Date().toISOString() },
  { id: '2', client_name: 'AECOM', incident_type: 'MIDAS NFX (Simulation) - 해석 파일 전송 오류', severity: 'critical', vip: true, poc: true, value: 2000000000, status: 'open', created_at: new Date().toISOString() },
  { id: '3', client_name: 'ARUP', incident_type: 'MIDAS CI - 애플리케이션 보안 취약점', severity: 'high', vip: true, poc: true, value: 900000000, status: 'open', created_at: new Date().toISOString() }
];

const MOCK_ANALYSIS: Record<string, AnalysisResult> = {
  '1': {
    score: 90,
    priority: 'critical',
    rationale: 'A건설은 마이다스의 VIP 고객이며 현재 PoC 진행 중으로 계약 전환 리스크가 높습니다. 현재 critical 등급 장애가 발생하여 최우선 대응 대상으로 분류됨.',
    applied_policies: ['VIP 고객 고심각 장애 대응 정책 (+40)', '대형 계약 고객 리스크 관리 정책 (8.0억) (+20)', 'PoC 진행 고객 보호 정책 (+15)', '반복 장애 가중치 정책 (2회) (+15)']
  },
  '2': {
    score: 95,
    priority: 'critical',
    rationale: 'AECOM은 글로벌 전략 파트너사이며 20억 규모의 PoC가 연계되어 있습니다. 해석 엔진 오류는 비즈니스 연속성에 치명적이므로 즉시 개입이 필요함.',
    applied_policies: ['글로벌 전략 고객 우대 정책 (+45)', '초저지연 대응 보장 정책 (+20)', 'PoC 리스크 방어 정책 (+30)']
  }
};

export const api = {
  getIncidents: async (): Promise<Incident[]> => {
    try {
      const response = await apiClient.get('/incidents');
      return response.data;
    } catch (error) {
      console.warn("Using AX Mock Intelligence due to connectivity.");
      return MOCK_INCIDENTS;
    }
  },
  
  getAnalysisResult: async (incidentId: string): Promise<AnalysisResult> => {
    try {
      const response = await apiClient.get(`/recommendations/${incidentId}`);
      return response.data;
    } catch (error) {
      return MOCK_ANALYSIS[incidentId] || MOCK_ANALYSIS['1'];
    }
  },

  getInquiries: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/inquiries');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  createInquiry: async (text: string): Promise<any> => {
    try {
      const response = await apiClient.post('/inquiries', { raw_text: text });
      return response.data;
    } catch (error) {
       return { id: 'mock-id', raw_text: text, status: 'pending' };
    }
  },

  processInquiry: async (id: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/inquiries/${id}/process`);
      return response.data;
    } catch (error) {
      return { success: true };
    }
  }
};
