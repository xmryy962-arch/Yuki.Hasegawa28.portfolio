'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UNIVERSE_STAGES, UniverseStage } from '../types';
import { soundManager } from '../utils/sound';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Camera, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Orbit, 
  HelpCircle,
  RotateCcw,
  FastForward
} from 'lucide-react';

interface UniverseStatsProps {
  completedCount: number;
  totalExp: number;
  currentStage: UniverseStage;
  nextStage: UniverseStage | null;
  zenMode: boolean;
  onToggleZenMode: () => void;
  onCaptureScreenshot: () => void;
  onResetData: () => void;
  onFastForwardDemo: () => void;
}

export default function UniverseStats({
  completedCount,
  totalExp,
  currentStage,
  nextStage,
  zenMode,
  onToggleZenMode,
  onCaptureScreenshot,
  onResetData,
  onFastForwardDemo,
}: UniverseStatsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    setIsMuted(soundManager.getMuted());
  }, []);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // 進捗率の計算
  let progressPercent = 100;
  let tasksNeededForNext = 0;
  if (nextStage) {
    const prevMin = currentStage.minTasks;
    const nextMin = nextStage.minTasks;
    const diff = nextMin - prevMin;
    const currentDiff = completedCount - prevMin;
    progressPercent = Math.min(100, Math.max(0, (currentDiff / diff) * 100));
    tasksNeededForNext = nextMin - completedCount;
  }

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-40 p-4 pointer-events-none flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent">
        {/* 左側: ポートフォリオ戻る ＆ アプリタイトル */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 hover:text-slate-950 text-xs font-semibold border border-slate-200/90 backdrop-blur-md transition-all shadow-md group"
            title="ポートフォリオトップに戻る"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-slate-700" />
            <span>ポートフォリオへ</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 md:bg-white/90 border border-slate-200/90 backdrop-blur-xl shadow-md">
            <div className="p-1 rounded-lg bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
              <Orbit className="w-4 h-4 text-cyan-600 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-900 tracking-wide flex items-center gap-1.5">
                CosmoDo <span className="text-[10px] text-cyan-600 font-mono font-bold">v1.0</span>
              </h1>
              <p className="text-[9px] text-slate-500 hidden sm:block">タスクで育てる、私だけの小宇宙</p>
            </div>
          </div>
        </div>

        {/* 中央: 宇宙ステータスインジケーター */}
        <div className="pointer-events-auto w-full md:w-auto flex items-center justify-between md:justify-center gap-4 px-4 py-2 rounded-2xl bg-white/95 md:bg-white/90 border border-slate-200/90 backdrop-blur-xl shadow-lg shadow-slate-950/10">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {currentStage.name}
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  {currentStage.subtitle}
                </span>
              </div>
              
              {/* プログレスバー */}
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 sm:w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-medium">
                  {nextStage ? `次まであと${tasksNeededForNext}星` : 'MAX LEVEL'}
                </span>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

            {/* スター＆EXPバッジ */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-cyan-700" title="誕生した天体の数">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span className="font-bold font-mono text-slate-900">{completedCount}</span>
                <span className="text-[10px] text-slate-500 font-medium">Stars</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                {totalExp} EXP
              </div>
            </div>
          </div>
        </div>

        {/* 右側: ツールボタン群 */}
        <div className="pointer-events-auto flex items-center gap-1.5 self-end md:self-auto">
          {/* デモ用高速シミュレーションボタン */}
          <button
            onClick={onFastForwardDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-white/90 text-indigo-950 text-xs font-semibold backdrop-blur-md transition-all shadow-md"
            title="【審査・デモ用】クリックするごとにタスク達成数を増やし、宇宙の各成長段階を即座にシミュレーションします"
          >
            <FastForward className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">進化シミュレート</span>
          </button>

          {/* 宇宙スクショ保存ボタン */}
          <button
            onClick={onCaptureScreenshot}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-white/90 text-slate-800 hover:text-slate-950 backdrop-blur-md transition-all shadow-md"
            title="現在の宇宙を画像（PNG）として保存"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* サウンド切り替え */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-white/90 text-slate-800 hover:text-slate-950 backdrop-blur-md transition-all shadow-md"
            title={isMuted ? 'サウンドをONにする' : 'サウンドをミュート'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-cyan-600" />}
          </button>

          {/* Zen Mode / 全画面鑑賞モード */}
          <button
            onClick={onToggleZenMode}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all shadow-md ${
              zenMode
                ? 'bg-cyan-100 border-cyan-400 text-cyan-900 ring-2 ring-cyan-400/40'
                : 'bg-white hover:bg-slate-100 border-white/90 text-slate-800 hover:text-slate-950'
            }`}
            title={zenMode ? 'タスク画面を表示' : 'Zen Mode（宇宙鑑賞に没入）'}
          >
            {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* ガイド・情報モーダル */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-white/90 text-slate-800 hover:text-slate-950 backdrop-blur-md transition-all shadow-md"
            title="宇宙の進化ルールと使い方"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* リセット */}
          <button
            onClick={onResetData}
            className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-white/90 text-rose-600 hover:text-rose-700 backdrop-blur-md transition-all shadow-md"
            title="データを初期化（宇宙をリセット）"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 宇宙の進化ルール・ヘルプモーダル */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                宇宙の進化ガイド (Evolution Guide)
              </h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all"
              >
                ✕ 閉じる
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              CosmoDoは、毎日のタスク達成の積み重ねが「あなただけの広大な宇宙」へと具現化するToDoアプリです。タスクをこなすことで宇宙は以下の段階を経て成長していきます。
            </p>

            <div className="space-y-3 pt-1">
              {UNIVERSE_STAGES.map((stg) => (
                <div
                  key={stg.level}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    stg.level === currentStage.level
                      ? 'bg-cyan-50/80 border-cyan-300 text-cyan-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-slate-900">{stg.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-medium">
                      必要達成: {stg.minTasks}星〜
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-2">{stg.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {stg.unlockedFeatures.map((feat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-700 font-medium shadow-xs"
                      >
                        ✦ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">💡 宇宙を美しく育てるヒント</p>
              <p>・重要タスク（高優先度）を完了すると、大きな惑星や超巨星が誕生します。</p>
              <p>・カテゴリ（創作、開発、学習など）に応じて、宇宙に浮かぶ星やガスの色が変化します。</p>
              <p>・浮かんでいる星をクリックすると、その星が生まれた時のタスクの記録を確認できます。</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
