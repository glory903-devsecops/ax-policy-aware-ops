'use client';

import React, { useState, useEffect } from 'react';
import { Table, CheckCircle, Clock, Zap, FileSpreadsheet, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface ClassificationViewProps {
  onSuccess: () => void;
}

export default function ClassificationView({ onSuccess }: ClassificationViewProps) {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleProcess = async (id: string) => {
    setProcessingId(id);
    try {
      await api.processInquiry(id);
      await fetchInquiries(); // Refresh list
      onSuccess(); // Navigate to Dashboard
    } catch (error) {
      console.error("Failed to process inquiry:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-midas-grey-border shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-midas-grey-border bg-slate-50/50 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-midas-blue" />
            <span className="text-[10px] font-black uppercase tracking-widest text-midas-blue">RPA Data Pipeline</span>
          </div>
          <h2 className="text-2xl font-black text-midas-black tracking-tight flex items-center gap-3">
            고객 문의 사항 분류 (Excel Mode)
            <FileSpreadsheet size={24} className="text-green-600" />
          </h2>
        </div>
        <div className="flex items-center gap-4">
           <button 
            onClick={fetchInquiries}
            className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
           >
              <RefreshCw size={18} className={loading ? "animate-spin text-midas-blue" : "text-slate-400"} />
           </button>
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              자동화 엔진 가동 중
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-0">
        <table className="w-full text-left border-collapse font-mono text-[13px]">
          <thead className="sticky top-0 bg-slate-100 z-10 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
              <th className="px-6 py-4 border-r border-slate-200 w-64">접수 내용 (Raw Text)</th>
              <th className="px-6 py-4 border-r border-slate-200 w-48 bg-green-50/30">추출 고객사 (System)</th>
              <th className="px-6 py-4 border-r border-slate-200 w-24 text-center bg-green-50/30">VIP 여부</th>
              <th className="px-6 py-4 border-r border-slate-200 w-32 text-center bg-green-50/30">계약 가치</th>
              <th className="px-6 py-4 border-r border-slate-200 w-24 text-center">심각도</th>
              <th className="px-6 py-4 border-r border-slate-200 w-32 text-center">상태</th>
              <th className="px-6 py-4">액션</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {inquiries.map((inquiry, index) => (
                <motion.tr 
                  key={inquiry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-all group"
                >
                  <td className="px-6 py-4 border-r border-slate-100 text-center text-slate-300 font-bold">{index + 1}</td>
                  <td className="px-6 py-4 border-r border-slate-100 font-sans text-xs font-bold text-midas-black">
                    {inquiry.raw_text.length > 40 ? inquiry.raw_text.substring(0, 40) + '...' : inquiry.raw_text}
                  </td>
                  <td className="px-6 py-4 border-r border-slate-100 font-sans font-black text-midas-blue uppercase">
                     {inquiry.extracted_client || '-'}
                  </td>
                  <td className="px-6 py-4 border-r border-slate-100 text-center">
                    {inquiry.extracted_vip ? (
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">VIP</span>
                    ) : <span className="opacity-20 text-slate-300 font-black">N</span>}
                  </td>
                  <td className="px-6 py-4 border-r border-slate-100 text-center font-black">
                    {(inquiry.extracted_value || 0) / 100000000}억
                  </td>
                  <td className="px-6 py-4 border-r border-slate-100 text-center uppercase tracking-tighter font-black">
                    <span className={inquiry.extracted_severity === 'critical' ? 'text-red-500' : 'text-slate-400'}>
                      {inquiry.extracted_severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-slate-100 text-center uppercase tracking-tighter font-black">
                    {inquiry.status === 'processed' ? (
                      <span className="flex items-center justify-center gap-1.5 text-green-600">
                        <CheckCircle size={12} />
                        REGISTERED
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5 text-amber-500">
                        <Clock size={12} />
                        PENDING
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {inquiry.status === 'pending' ? (
                       <button 
                        onClick={() => handleProcess(inquiry.id)}
                        disabled={!!processingId}
                        className="bg-midas-blue text-white px-4 py-1.5 rounded-lg text-[10px] font-black shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                      >
                        {processingId === inquiry.id ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                        대시보드 등록
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 cursor-default">Committed</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            
            {inquiries.length === 0 && !loading && (
               <tr>
                <td colSpan={8} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center gap-4 text-slate-300 italic">
                      <Table size={48} className="opacity-10" />
                      표시할 데이터가 없습니다. 문의를 먼저 접수해주세요.
                   </div>
                </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
