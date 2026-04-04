'use client';

import React from 'react';
import { Search, History, CheckCircle, ArrowUpRight, TrendingUp, Briefcase } from 'lucide-react';

const cases = [
  {
    id: 'CASE-2024-001',
    client: '현대건설 (글로벌 본부)',
    issue: '동남아시아 스마트 시티 PoC 중 서버 다운',
    strategy: 'AX 엔진 실시간 감지 -> CTO급 리소스 즉시 투입 -> 2시간 내 복구 -> 신뢰도 상승으로 400억 본계약 체결',
    outcome: 'Success ( 본계약 전환 )',
    score: 95
  },
  {
    id: 'CASE-2024-002',
    client: '삼성물산 (건축 사업부)',
    issue: 'VIP 전용 기능 패치 도중 성능 저하 보고',
    strategy: 'P2에서 P1으로 정책 가중치 자동 보정 -> 프리미엄 기술지원팀 지정 대응 -> 고객 불만 Zero',
    outcome: 'Retained ( 유지보수 연장 )',
    score: 88
  },
  {
    id: 'CASE-2023-089',
    client: 'LH 한국토지주택공사',
    issue: '공공 클라우드 전환 중 데이터 동기화 지연',
    strategy: '긴급 시스템 백업본 즉시 가동 -> 중단 없는 서비스 제공 -> 우수 파트너사 선정',
    outcome: 'Expansion ( 추가 구매 )',
    score: 92
  }
];

export default function SimilarCases() {
  return (
    <div className="flex-1 flex flex-col items-center p-8 bg-white rounded-[2.5rem] border border-midas-grey-border shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-midas-blue opacity-50" />
      
      <div className="max-w-4xl w-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-midas-blue/10 rounded-3xl flex items-center justify-center text-midas-blue">
            <Search size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-midas-black tracking-tight">전략적 유사 사례 분석 (Intelligence)</h2>
            <p className="text-midas-grey-text font-bold">과거 유사 리스크 발생 시의 성공적인 대응 전략과 비즈니스 결과를 분석합니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {cases.map((c) => (
            <div key={c.id} className="group bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:border-midas-blue/20 transition-all cursor-pointer">
              <div className="flex items-start gap-8">
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-midas-blue shadow-sm mb-2 group-hover:scale-105 transition-transform">
                       <Briefcase size={28} />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{c.id}</span>
                 </div>

                 <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-midas-black">{c.client}</h3>
                          <span className="bg-green-100 text-green-600 px-3 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                             <CheckCircle size={12} />
                             {c.outcome}
                          </span>
                       </div>
                       <div className="flex items-center gap-2 text-midas-blue">
                          <TrendingUp size={16} />
                          <span className="text-lg font-black">{c.score}점</span>
                       </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-4 group-hover:border-midas-blue/10 transition-all">
                       <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">Issue Context</p>
                       <p className="text-xs font-bold text-midas-grey-text">{c.issue}</p>
                    </div>

                    <div className="flex items-start gap-3">
                       <div className="mt-1">
                          <ArrowUpRight size={16} className="text-midas-blue" />
                       </div>
                       <p className="text-sm font-bold text-midas-black leading-relaxed italic">"{c.strategy}"</p>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] opacity-50 hover:opacity-100 hover:border-midas-blue/30 transition-all cursor-pointer group">
           <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-3xl mx-auto mb-4 group-hover:bg-midas-blue/5 transition-all">
              <History size={24} className="text-slate-300 group-hover:text-midas-blue transition-all" />
           </div>
           <p className="text-sm font-black text-slate-400">데이터를 더 불러오는 중 (Historical Archive Scanning...)</p>
        </div>
      </div>
    </div>
  );
}
