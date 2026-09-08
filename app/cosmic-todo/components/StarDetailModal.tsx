'use client';

import React from 'react';
import { CelestialBody, CATEGORY_CONFIG, PRIORITY_CONFIG } from '../types';
import { Sparkles, Calendar, Orbit, X, CheckCircle2, Bookmark } from 'lucide-react';

interface StarDetailModalProps {
  celestial: CelestialBody | null;
  onClose: () => void;
}

export default function StarDetailModal({
  celestial,
  onClose,
}: StarDetailModalProps) {
  if (!celestial) return null;

  const catConfig = CATEGORY_CONFIG[celestial.category];
  const priConfig = PRIORITY_CONFIG[celestial.priority];

  const getCelestialTypeName = (type: CelestialBody['type'], hasRing?: boolean) => {
    switch (type) {
      case 'planet':
        return hasRing ? '環を持つ惑星 (Ringed Planet)' : '軌道惑星 (Orbital Planet)';
      case 'giant':
        return '輝く超巨星 (Supergiant Star)';
      case 'star':
        return '主系列恒星 (Main Sequence Star)';
      case 'satellite':
        return 'きらめく小天体 (Dwarf Star / Satellite)';
      default:
        return '天体';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900/95 border border-slate-700/80 p-5 shadow-2xl space-y-4">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg"
            style={{
              backgroundColor: `${celestial.color}22`,
              borderColor: `${celestial.color}66`,
              boxShadow: `0 0 16px ${celestial.glowColor}`,
            }}
          >
            {celestial.type === 'planet' ? (
              <Orbit className="w-5 h-5" style={{ color: celestial.color }} />
            ) : (
              <Sparkles className="w-5 h-5" style={{ color: celestial.color }} />
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              {getCelestialTypeName(celestial.type, celestial.hasRing)}
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              {celestial.taskTitle}
            </h3>
          </div>
        </div>

        {/* メタ情報リスト */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> 属性カテゴリ
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium border ${catConfig.bg} ${catConfig.border}`}
            >
              {catConfig.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5" /> 獲得エネルギー
            </span>
            <span className="text-amber-300 font-mono font-bold">
              +{priConfig.exp} EXP
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> 誕生・達成日時
            </span>
            <span className="text-slate-200 font-mono text-[11px]">
              {new Date(celestial.completedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>あなたの行動によって宇宙に灯った恒久の光です</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors"
        >
          宇宙の観測を続ける
        </button>
      </div>
    </div>
  );
}
