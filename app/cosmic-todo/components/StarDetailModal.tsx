'use client';

import React from 'react';
import { CelestialBody, PRIORITY_CONFIG, CategoryInfo, getCategoryInfo, hexToRgba } from '../types';
import { Sparkles, Calendar, Orbit, X, CheckCircle2, Bookmark } from 'lucide-react';

interface StarDetailModalProps {
  celestial: CelestialBody | null;
  categories?: Record<string, CategoryInfo>;
  onClose: () => void;
}

export default function StarDetailModal({
  celestial,
  categories,
  onClose,
}: StarDetailModalProps) {
  if (!celestial) return null;

  const catConfig = getCategoryInfo(categories, celestial.category);
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
      <div className="relative w-full max-w-sm rounded-2xl bg-white/95 border border-slate-200 p-5 shadow-2xl space-y-4 text-slate-800">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 shadow-xs transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md"
            style={{
              backgroundColor: `${celestial.color}18`,
              borderColor: `${celestial.color}55`,
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
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-medium">
              {getCelestialTypeName(celestial.type, celestial.hasRing)}
            </span>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {celestial.taskTitle}
            </h3>
          </div>
        </div>

        {/* メタ情報リスト */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-slate-400" /> 属性カテゴリ
            </span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1"
              style={{
                backgroundColor: hexToRgba(catConfig.color, 0.12),
                borderColor: hexToRgba(catConfig.color, 0.4),
                color: catConfig.color,
                boxShadow: `0 0 6px ${hexToRgba(catConfig.color, 0.15)}`
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catConfig.color }} />
              {catConfig.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Orbit className="w-3.5 h-3.5 text-slate-400" /> 獲得エネルギー
            </span>
            <span className="text-amber-600 font-mono font-bold">
              +{priConfig.exp} EXP
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> 誕生・達成日時
            </span>
            <span className="text-slate-700 font-mono text-[11px]">
              {new Date(celestial.completedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
          <span>あなたの行動によって宇宙に灯った恒久の光です</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md"
        >
          宇宙の観測を続ける
        </button>
      </div>
    </div>
  );
}
