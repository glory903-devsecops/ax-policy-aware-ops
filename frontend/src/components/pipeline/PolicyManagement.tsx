'use client';

import React, { useState } from 'react';
import { ShieldCheck, Zap, Target, Star, AlertTriangle, Users, Search, X, Edit3, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_POLICIES = [
  {
    id: 'POL-01',
    title: 'VIP 고객 최우선 대응 정책',
    desc: 'VIP 태그가 부착된 고객사의 모든 이슈에 +40점 이상의 고정 가중치를 할당하여 대기열 최상단 배치를 강제합니다.',
    impact: 'High',
    weight: '+40pt',
    condition: 'Client.VIP == True',
    icon: Star,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    id: 'POL-02',
    title: '대형 계약(PoC) 보호 정책',
    desc: '현재 PoC 진행 중인 고객사는 계약 성공 확률을 극대화하기 위해 장애 발생 시 기술지원 리소스를 우선 배정합니다.',
    impact: 'High',
    weight: '+30pt',
    condition: 'Client.PoC == True && Status == Error',
    icon: Target,
    color: 'text-amber-600',
    bg: 'bg-amber-100'
  },
  {
    id: 'POL-03',
    title: '고계약 가치 가중치 정책',
    desc: '10억 이상의 잠재적/현재 계약 가치를 보유한 고객사는 리스크 점수의 20%를 추가 보정합니다.',
    impact: 'Medium',
    weight: '+20%',
    condition: 'Contract.Value >= 1,000,000,000',
    icon: Zap,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    id: 'POL-04',
    title: '반복 장애 누적 패널티 정책',
    desc: '최근 7일 이내 동일 장비/모듈에서 반복적으로 장애가 보고될 경우, 리스크 점수에 가산점을 부여하여 근본 해결을 유도합니다.',
    impact: 'Medium',
    weight: '+15pt',
    condition: 'History.Frequency(7d) > 1',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
  {
    id: 'POL-05',
    title: '글로벌 전략 고객 정책',
    desc: '국내외 랜드마크 프로젝트를 수행 중인 전략 고객사는 일반 큐와 별도로 에스컬레이션 경로를 확보합니다.',
    impact: 'Low',
    weight: '+45pt',
    condition: 'Client.Strategy == Global',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-100'
  }
];

export default function PolicyManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const [policies, setPolicies] = useState(INITIAL_POLICIES);

  const filteredPolicies = policies.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-midas-grey-border shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-midas-blue" />
      
      <div className="flex-1 flex flex-col p-8">
        <div className="flex flex-col gap-8 mb-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-midas-blue/10 rounded-3xl flex items-center justify-center text-midas-blue shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-midas-black tracking-tight">운영 규칙 관리 (AI Logic)</h2>
                <p className="text-midas-grey-text font-bold">AX 정책 엔진(`AXPolicyEngine`)이 실시간으로 참조하는 비즈니스 의사결정 룰 세트입니다.</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-midas-blue transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="정책 명칭 또는 설명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-midas-black focus:outline-none focus:ring-4 focus:ring-midas-blue/10 focus:bg-white focus:border-midas-blue/30 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-auto custom-scrollbar pr-2">
          <AnimatePresence mode='popLayout'>
            {filteredPolicies.map((p) => (
              <motion.div 
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedPolicy(p)}
                className="group bg-white border border-slate-100 p-6 rounded-3xl hover:shadow-2xl hover:border-midas-blue/30 transition-all cursor-pointer flex items-center gap-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-midas-blue/5 transition-colors" />
                
                <div className={`w-14 h-14 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                  <p.icon size={24} />
                </div>
                
                <div className="flex-1 z-10">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-midas-black tracking-tight group-hover:text-midas-blue transition-colors">{p.title}</h3>
                    <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tighter ${p.impact === 'High' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 text-slate-400'}`}>
                       {p.impact}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-midas-grey-text leading-snug line-clamp-1">{p.desc}</p>
                </div>

                <div className="text-right shrink-0 z-10 group-hover:translate-x-[-8px] transition-transform">
                  <div className="text-xs font-black text-midas-blue mb-1 uppercase tracking-widest">{p.weight}</div>
                  <div className="text-[10px] font-mono text-slate-300">ID: {p.id}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPolicies.length === 0 && (
            <div className="py-20 text-center text-slate-300 italic flex flex-col items-center gap-4">
              <ShieldCheck size={48} className="opacity-10" />
              검색 결과가 없습니다.
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] border border-white/10 flex items-center justify-between shadow-2xl">
           <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
              <div>
                <span className="text-[11px] font-black text-white uppercase tracking-widest block leading-none">Security Policy Engine Engaged</span>
                <span className="text-[9px] font-bold text-slate-400 mt-1 block tracking-tight">Last optimized via AI on 4/6/2026</span>
              </div>
           </div>
           <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl text-[11px] font-black hover:bg-midas-blue hover:text-white hover:scale-105 transition-all active:scale-95 shadow-xl">
             신규 정책 제안
           </button>
        </div>
      </div>

      {/* Policy Detail Modal */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 relative"
            >
              <div className="p-10">
                <button 
                  onClick={() => setSelectedPolicy(null)}
                  className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"
                >
                  <X size={24} />
                </button>

                <div className="flex items-start gap-8 mt-4">
                  <div className={`w-20 h-20 ${selectedPolicy.bg} ${selectedPolicy.color} rounded-[2rem] flex items-center justify-center shadow-lg`}>
                    <selectedPolicy.icon size={40} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-3xl font-black text-midas-black tracking-tight">{selectedPolicy.title}</h3>
                       <span className="bg-midas-blue/10 text-midas-blue px-3 py-1 rounded-full text-[10px] font-black">ACTIVE</span>
                    </div>
                    <div className="text-slate-400 text-xs font-mono mb-6 uppercase tracking-widest">Global Policy Identification: {selectedPolicy.id}</div>
                  </div>
                </div>

                <div className="space-y-8 mt-10">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Description</label>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-sm font-bold text-midas-black leading-relaxed">
                      {selectedPolicy.desc}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <Zap size={12} className="text-midas-blue" />
                        Scoring Weight
                      </label>
                      <input 
                        type="text" 
                        defaultValue={selectedPolicy.weight}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-black text-midas-blue focus:outline-none focus:ring-4 focus:ring-midas-blue/10 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <Settings2 size={12} className="text-amber-500" />
                        Priority Level
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-black text-midas-black focus:outline-none">
                        <option selected={selectedPolicy.impact === 'High'}>Critical/High</option>
                        <option selected={selectedPolicy.impact === 'Medium'}>Standard/Medium</option>
                        <option selected={selectedPolicy.impact === 'Low'}>Tactical/Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                      <Edit3 size={12} className="text-purple-500" />
                      Logical Condition (`IF`)
                    </label>
                    <div className="bg-slate-900 p-6 rounded-3xl font-mono text-xs text-blue-400 shadow-inner">
                      <span className="text-purple-400">match</span> (context) &#123; <br />
                      &nbsp;&nbsp;<span className="text-green-400">condition</span>: "{selectedPolicy.condition}",<br />
                      &nbsp;&nbsp;<span className="text-green-400">action</span>: "ApplyWeight({selectedPolicy.weight})"<br />
                      &#125;
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-12">
                  <button 
                    onClick={() => setSelectedPolicy(null)}
                    className="flex-1 bg-midas-blue text-white py-5 rounded-[1.5rem] font-black text-sm hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all"
                  >
                    설정 사항 저장 및 배포
                  </button>
                  <button 
                    onClick={() => setSelectedPolicy(null)}
                    className="px-10 bg-slate-100 text-slate-400 py-5 rounded-[1.5rem] font-black text-sm hover:bg-slate-200 transition-all"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
