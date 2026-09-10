'use client';

import React from 'react';
import { UniverseStage } from '../types';
import { Sparkles, Orbit, CheckCircle } from 'lucide-react';

interface LevelUpModalProps {
  stage: UniverseStage | null;
  onClose: () => void;
}

export default function LevelUpModal({
  stage,
  onClose,
}: LevelUpModalProps) {
  if (!stage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-cyan-500/40 p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-5">
        {/* アイコン */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-xl rotate-3">
            <Orbit className="w-9 h-9 animate-spin-slow" />
          </div>
        </div>

        {/* 見出し */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            ✦ UNIVERSE EVOLVED ✦
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {stage.name}
          </h2>
          <p className="text-xs text-indigo-300 font-medium">
            {stage.subtitle}
          </p>
        </div>

        {/* 説明文 */}
        <p className="text-xs text-slate-300 leading-relaxed px-2">
          {stage.description}
        </p>

        {/* 解放された機能 */}
        <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-left space-y-2">
          <p className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 新たに解放された宇宙現象
          </p>
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {stage.unlockedFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 了解ボタン */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white hover:bg-cyan-50 text-cyan-950 border-2 border-cyan-400 font-bold text-xs tracking-wide shadow-xl shadow-cyan-950/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          宇宙の進化を受け入れる ✦
        </button>
      </div>
    </div>
  );
}
