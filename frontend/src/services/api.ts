import axios from 'axios';
import { Incident, AnalysisResult } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getIncidents: async (): Promise<Incident[]> => {
    const response = await apiClient.get('/incidents');
    return response.data;
  },
  
  getAnalysisResult: async (incidentId: string): Promise<AnalysisResult> => {
    const response = await apiClient.get(`/recommendations/${incidentId}`);
    return response.data;
  },

  // Inquiry/RPA Flow
  getInquiries: async (): Promise<any[]> => {
    const response = await apiClient.get('/inquiries');
    return response.data;
  },

  createInquiry: async (text: string): Promise<any> => {
    const response = await apiClient.post('/inquiries', { raw_text: text });
    return response.data;
  },

  processInquiry: async (id: string): Promise<any> => {
    const response = await apiClient.post(`/inquiries/${id}/process`);
    return response.data;
  }
};
