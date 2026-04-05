'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  CheckCircle, 
  Clock, 
  Zap, 
  FileSpreadsheet, 
  Loader2, 
  RefreshCw, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  MinusCircle, 
  PlusCircle, 
  Info,
  Download
} from 'lucide-react';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface ClassificationViewProps {
  onSuccess: () => void;
}

export default function ClassificationView({ onSuccess }: ClassificationViewProps) {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  
  // Advanced Features State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'desc' });

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

  const handleExclude = async (id: string) => {
    setActionId(id);
    try {
      await api.excludeFromDashboard(id);
      await fetchInquiries(); // Refresh list to see 'EXCLUDED' status
    } catch (error) {
      console.error("Failed to exclude inquiry:", error);
    } finally {
      setActionId(null);
    }
  };

  const handleInclude = async (id: string) => {
    setActionId(id);
    try {
      // Logic for re-inclusion (similar to process)
      await api.processInquiry(id);
      await fetchInquiries();
    } catch (error) {
      console.error("Failed to include inquiry:", error);
    } finally {
      setActionId(null);
    }
  };

  // --- Filtering & Sorting Logic ---
  const processedInquiries = useMemo(() => {
    let result = [...inquiries];
    
    // Search Filter
    if (searchTerm) {
      const lowTerm = searchTerm.toLowerCase();
      result = result.filter(q => 
        (q.extracted_client?.toLowerCase().includes(lowTerm)) ||
        (q.raw_text?.toLowerCase().includes(lowTerm))
      );
    }

    // Sort Logic
    if (sortConfig) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key] ?? '';
        let bVal = b[sortConfig.key] ?? '';

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [inquiries, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.key !== column) return <ChevronUp size={14} className="opacity-10 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-midas-blue" /> : <ChevronDown size={14} className="text-midas-blue" />;
  };

  const handleDownloadCSV = () => {
    if (processedInquiries.length === 0) return;
    
    const headers = ['#', 'Raw Text', 'Client', 'VIP', 'Value (KRW)', 'Severity', 'Status'];
    const csvRows = [
      headers.join(','),
      ...processedInquiries.map((inq, idx) => [
        idx + 1,
        `"${inq.raw_text.replace(/"/g, '""')}"`,
        `"${inq.extracted_client || ''}"`,
        inq.extracted_vip ? 'Y' : 'N',
        inq.extracted_value || inq.predicted_value || 0,
        inq.extracted_severity,
        inq.status
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ax_inquiry_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-midas-grey-border shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-midas-grey-border bg-slate-50/50 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-midas-blue" />
              <span className="text-[10px] font-black uppercase tracking-widest text-midas-blue">AX Automated Strategy</span>
            </div>
            <h2 className="text-2xl font-black text-midas-black tracking-tight flex items-center gap-3">
              문의사항 리스트
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
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                지능형 시뮬레이션 가동 중
             </div>
          </div>
        </div>

        {/* Search & Action Row */}
        <div className="flex justify-end items-center gap-4">
           <button 
             onClick={handleDownloadCSV}
             className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 hover:bg-slate-50 hover:text-midas-blue transition-all shadow-sm"
           >
              <Download size={14} />
              CSV 내보내기
           </button>
           <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="고객사 또는 내용 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-midas-black focus:outline-none focus:ring-4 focus:ring-midas-blue/10 transition-all placeholder:text-slate-300 shadow-inner"
              />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-0">
        <table className="w-full text-left border-collapse font-mono text-[13px]">
          <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-md z-10 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4 border-r border-slate-200 w-12 text-center text-slate-400 font-sans">#</th>
              
              <th 
                className="px-6 py-4 border-r border-slate-200 w-64 cursor-pointer group hover:bg-slate-200 transition-colors"
                onClick={() => requestSort('raw_text')}
              >
                <div className="flex items-center justify-between">
                  <span>접수 내용 (Raw Text)</span>
                  <SortIcon column="raw_text" />
                </div>
              </th>

              <th 
                className="px-6 py-4 border-r border-slate-200 w-48 bg-green-50/10 cursor-pointer group hover:bg-green-100/20 transition-colors"
                onClick={() => requestSort('extracted_client')}
              >
                <div className="flex items-center justify-between">
                  <span>추출 고객사 (System)</span>
                  <SortIcon column="extracted_client" />
                </div>
              </th>

              <th 
                className="px-6 py-4 border-r border-slate-200 w-24 text-center cursor-pointer group hover:bg-slate-200 transition-colors"
                onClick={() => requestSort('extracted_vip')}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>VIP 여부</span>
                  <SortIcon column="extracted_vip" />
                </div>
              </th>

              <th 
                className="px-6 py-4 border-r border-slate-200 w-32 text-center cursor-pointer group hover:bg-slate-200 transition-colors"
                onClick={() => requestSort('extracted_value')}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>계약 가치</span>
                  <SortIcon column="extracted_value" />
                </div>
              </th>

              <th 
                className="px-6 py-4 border-r border-slate-200 w-24 text-center cursor-pointer group hover:bg-slate-200 transition-colors"
                onClick={() => requestSort('extracted_severity')}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>심각도</span>
                  <SortIcon column="extracted_severity" />
                </div>
              </th>

              <th 
                className="px-6 py-4 border-r border-slate-200 w-32 text-center cursor-pointer group hover:bg-slate-200 transition-colors"
                onClick={() => requestSort('status')}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>상태</span>
                  <SortIcon column="status" />
                </div>
              </th>

              <th className="px-6 py-4 text-center font-sans uppercase text-[10px] tracking-widest text-slate-400">Action Control</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {processedInquiries.map((inquiry, index) => (
                <motion.tr 
                  key={inquiry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-slate-100 hover:bg-slate-50/50 transition-all group ${inquiry.status === 'excluded' ? 'bg-slate-50/50 grayscale-[0.8] blur-[0.3px]' : ''}`}
                >
                  <td className="px-6 py-4 border-r border-slate-100 text-center text-slate-300 font-bold">{index + 1}</td>
                  <td className="px-6 py-4 border-r border-slate-100 font-sans text-xs font-bold text-midas-black">
                    {inquiry.raw_text.length > 40 ? inquiry.raw_text.substring(0, 40) + '...' : inquiry.raw_text}
                  </td>
                  <td className="px-6 py-4 border-r border-slate-100 font-sans font-black text-midas-blue uppercase">
                     {inquiry.extracted_client || '-'}
                  </td>
                  <td className="px-6 py-4 border-r border-slate-100 text-center">
                    {inquiry.extracted_vip || (inquiry.raw_text && inquiry.raw_text.includes('VIP')) ? (
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">VIP</span>
                    ) : <span className="opacity-10 text-slate-300 font-black italic">N/A</span>}
                  </td>
                  
                  <td className="px-6 py-4 border-r border-slate-100 text-center font-black">
                    {inquiry.extracted_value && inquiry.extracted_value > 0 ? (
                      <span className="text-midas-black">{(inquiry.extracted_value / 100000000).toLocaleString()}억</span>
                    ) : (
                      <div className="flex flex-col items-center group/p relative cursor-help">
                        <span className="text-midas-blue/60 text-[9px] italic flex items-center gap-1">
                          AI 예측 <Info size={8} />
                        </span>
                        <span className="text-midas-blue tracking-tighter">{(inquiry.predicted_value / 100000000).toLocaleString()}억+</span>
                        <div className="absolute hidden group-hover/p:block bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[9px] px-3 py-2 rounded-xl w-48 shadow-2xl z-20 pointer-events-none font-sans normal-case text-left leading-normal">
                           본문 내 맥락(고객사 규모, 서비스 범위)을 분석하여 예상 계약 가치를 산정했습니다.
                        </div>
                      </div>
                    )}
                   </td>

                  <td className="px-6 py-4 border-r border-slate-100 text-center uppercase tracking-tighter font-black">
                    <span className={inquiry.extracted_severity === 'critical' ? 'bg-red-500 text-white px-2 py-0.5 rounded text-[10px]' : 'text-slate-400'}>
                      {inquiry.extracted_severity || 'HIGH'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 border-r border-slate-100 text-center uppercase tracking-tighter font-black">
                    {inquiry.status === 'processed' ? (
                      <div className="flex flex-col items-center group/s relative cursor-help">
                        <span className="flex items-center justify-center gap-1.5 text-green-600">
                          <CheckCircle size={12} />
                          REGISTERED
                        </span>
                        <div className="absolute hidden group-hover/s:block bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[9px] px-3 py-2 rounded-xl w-48 shadow-2xl z-20 pointer-events-none font-sans normal-case text-center">
                           AI에 의해 대시보드 및 정책 엔진에 실시간 반영된 상태입니다.
                        </div>
                      </div>
                    ) : inquiry.status === 'excluded' ? (
                      <span className="flex items-center justify-center gap-1.5 text-slate-400 italic">
                        <MinusCircle size={12} />
                        EXCLUDED
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5 text-amber-500">
                        <Loader2 size={12} className="animate-spin" />
                        PROCESSING
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {inquiry.status === 'processed' ? (
                        <button 
                          onClick={() => handleExclude(inquiry.id)}
                          disabled={!!actionId}
                          className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[10px] font-black border border-red-200 transition-all active:scale-95 flex items-center gap-1.5 group-hover:shadow-md"
                        >
                          {actionId === inquiry.id ? <Loader2 size={12} className="animate-spin" /> : <MinusCircle size={12} />}
                          대시보드에서 제외
                        </button>
                      ) : inquiry.status === 'excluded' ? (
                        <button 
                          onClick={() => handleInclude(inquiry.id)}
                          disabled={!!actionId}
                          className="bg-midas-blue text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          {actionId === inquiry.id ? <Loader2 size={12} className="animate-spin" /> : <PlusCircle size={12} />}
                          대시보드에 재등록
                        </button>
                      ) : null}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            
            {processedInquiries.length === 0 && !loading && (
               <tr>
                <td colSpan={8} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center gap-4 text-slate-300 italic font-sans font-bold">
                      <Table size={48} className="opacity-10" />
                      {searchTerm ? "해당 조건의 문의를 찾을 수 없습니다." : "표시할 데이터가 없습니다. 문의를 먼저 접수해주세요."}
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
