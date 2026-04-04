'use client';

import React from 'react';
import { ShieldCheck, Zap, Target, Star, AlertTriangle, Users } from 'lucide-react';

const policies = [
  {
    id: 'POL-01',
    title: 'VIP 고객 최우선 대응 정책',
    desc: 'VIP 태그가 부착된 고객사의 모든 이슈에 +40점 이상의 고정 가중치를 할당하여 대기열 최상단 배치를 강제합니다.',
    impact: 'High',
    icon: Star,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    id: 'POL-02',
    title: '대형 계약(PoC) 보호 정책',
    desc: '현재 PoC 진행 중인 고객사는 계약 성공 확률을 극대화하기 위해 장애 발생 시 기술지원 리소스를 우선 배정합니다.',
    impact: 'High',
    icon: Target,
    color: 'text-amber-600',
    bg: 'bg-amber-100'
  },
  {
    id: 'POL-03',
    title: '고계약 가치 가중치 정책',
    desc: '100억 이상의 잠재적/현재 계약 가치를 보유한 고객사는 리스크 점수의 20%를 추가 보정합니다.',
    impact: 'Medium',
    icon: Zap,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    id: 'POL-04',
    title: '반복 장애 누적 패널티 정책',
    desc: '최근 7일 이내 동일 장비/모듈에서 반복적으로 장애가 보고될 경우, 리스크 점수에 가산점을 부여하여 근본 해결을 유도합니다.',
    impact: 'Medium',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
  {
    id: 'POL-05',
    title: '글로벌 전략 고객 정책',
    desc: '국내외 랜드마크 프로젝트를 수행 중인 전략 고객사는 일반 큐와 별도로 에스컬레이션 경로를 확보합니다.',
    impact: 'Low',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-100'
  }
];

export default function PolicyManagement() {
  return (
    <div className="flex-1 flex flex-col items-center p-8 bg-white rounded-[2.5rem] border border-midas-grey-border shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-midas-blue" />
      
      <div className="max-w-4xl w-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-midas-blue/10 rounded-3xl flex items-center justify-center text-midas-blue">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-midas-black tracking-tight">세일즈 정책 관리 (AI Logic)</h2>
            <p className="text-midas-grey-text font-bold">AX 정책 엔진(`AXPolicyEngine`)이 실시간으로 참조하는 비즈니스 의사결정 룰 세트입니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {policies.map((p) => (
            <div key={p.id} className="group bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:border-midas-blue/20 transition-all cursor-default">
              <div className="flex items-start gap-6">
                <div className={`w-14 h-14 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <p.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-black text-midas-black">{p.title}</h3>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${p.impact === 'High' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-200 text-slate-500'}`}>
                       Priority: {p.impact}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-midas-grey-text leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-midas-blue/5 rounded-[2rem] border border-midas-blue/10 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-black text-midas-blue uppercase tracking-widest">Active System Policy Engaged</span>
           </div>
           <button className="bg-midas-blue text-white px-6 py-2 rounded-xl text-[11px] font-black hover:shadow-lg transition-all active:scale-95">신규 정책 제안</button>
        </div>
      </div>
    </div>
  );
}
