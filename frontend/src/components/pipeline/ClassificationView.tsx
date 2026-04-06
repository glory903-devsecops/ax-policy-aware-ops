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
  ChevronRight,
  MinusCircle, 
  PlusCircle, 
  Info,
  Download,
  X,
  User,
  DollarSign,
  AlertTriangle,
  History,
  FileText,
  Target
} from 'lucide-react';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface ClassificationViewProps {
  onSuccess: () => void;
}

export default function ClassificationView({ onSuccess }: ClassificationViewProps) {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  
  // Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleExclude = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening modal
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

  const handleInclude = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening modal
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

  const openDetail = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
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
    <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-midas-grey-border shadow-2xl overflow-hidden relative">
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
                  onClick={() => openDetail(inquiry)}
                  className={`border-b border-slate-100 hover:bg-midas-blue/[0.03] cursor-pointer transition-all group ${inquiry.status === 'excluded' ? 'bg-slate-50/50 grayscale-[0.8] blur-[0.3px]' : ''}`}
                >
                  <td className="px-6 py-4 border-r border-slate-100 text-center text-slate-300 font-bold">{index + 1}</td>
                  <td className="px-6 py-4 border-r border-slate-100 font-sans text-xs font-bold text-midas-black">
                    <div className="flex items-center gap-2">
                       <FileText size={12} className="text-slate-300" />
                       <span className="line-clamp-1">{inquiry.raw_text}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-slate-100 font-sans font-black text-midas-blue uppercase flex items-center justify-between">
                     <span>{inquiry.extracted_client || '-'}</span>
                     <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-midas-blue translate-x-1" />
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
                      <div className="flex items-center justify-center gap-1.5 text-green-600">
                        <CheckCircle size={12} />
                        REGISTERED
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
                          onClick={(e) => handleExclude(e, inquiry.id)}
                          disabled={!!actionId}
                          className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[10px] font-black border border-red-200 transition-all active:scale-95 flex items-center gap-1.5 group-hover:shadow-md"
                        >
                          {actionId === inquiry.id ? <Loader2 size={12} className="animate-spin" /> : <MinusCircle size={12} />}
                          제외
                        </button>
                      ) : inquiry.status === 'excluded' ? (
                        <button 
                          onClick={(e) => handleInclude(e, inquiry.id)}
                          disabled={!!actionId}
                          className="bg-midas-blue text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          {actionId === inquiry.id ? <Loader2 size={12} className="animate-spin" /> : <PlusCircle size={12} />}
                          재등록
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

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedInquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-midas-blue/10 rounded-2xl flex items-center justify-center text-midas-blue">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-midas-black tracking-tight uppercase">
                      {selectedInquiry.extracted_client || 'Extracted Client'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={clsx(
                        "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                        selectedInquiry.extracted_severity === 'critical' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'
                      )}>
                        {selectedInquiry.extracted_severity || 'HIGH'} SEVERITY
                      </span>
                      {selectedInquiry.extracted_vip && (
                        <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                          VIP ACCOUNT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto custom-scrollbar p-8 space-y-8">
                {/* Section: Raw Inquiry */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <FileText size={16} />
                    <h4 className="text-xs font-black uppercase tracking-widest">Inquiry Message (Original)</h4>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-sm font-bold text-slate-600 leading-relaxed italic">
                    "{selectedInquiry.raw_text}"
                  </div>
                </section>

                {/* Section: Strategic Metadata */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                       <DollarSign size={14} />
                       <span className="text-[10px] font-black uppercase tracking-wider">계약 가치 (추출)</span>
                    </div>
                    <p className="text-xl font-black text-midas-black">
                      {selectedInquiry.extracted_value ? `${(selectedInquiry.extracted_value / 100000000).toLocaleString()}억` : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-midas-blue/20 shadow-sm shadow-blue-500/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-midas-blue mb-1">
                       <Zap size={14} />
                       <span className="text-[10px] font-black uppercase tracking-wider">AI 예상 가치</span>
                    </div>
                    <p className="text-xl font-black text-midas-blue">
                      {(selectedInquiry.predicted_value / 100000000).toLocaleString()}억+
                    </p>
                  </div>
                </div>

                {/* Section: AX Analysis Report */}
                <section className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Target size={120} />
                   </div>
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 rounded-full bg-midas-blue animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-widest opacity-60">AI Strategic Analysis Report</h4>
                   </div>
                   
                   <div className="space-y-6 relative z-10">
                      <div>
                        <p className="text-xs font-bold opacity-40 mb-2 uppercase">Analysis Rationale</p>
                        <p className="text-sm font-bold leading-relaxed">
                           해당 건은 고객사의 비즈니스 임계치가 높고, 마이다스아이티의 핵심 솔루션인 {selectedInquiry.raw_text.includes('NFX') ? 'NFX' : 'Civil'}과 직접적으로 연계되어 있습니다.
                           VIP 고객 특유의 기대 수준을 충족하기 위해 최우선 순위로 할당되었습니다.
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Risk Score</span>
                            <span className="text-2xl font-black text-midas-blue">92.5 <span className="text-xs opacity-60 text-white">/ 100</span></span>
                         </div>
                         <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Primary Policy</span>
                            <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-full border border-white/20 uppercase">VIP Crisis Management</span>
                         </div>
                      </div>
                   </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-100 transition-all border border-slate-200"
                >
                  닫기
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 rounded-2xl bg-midas-blue text-white text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  분석 결과 승인
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
