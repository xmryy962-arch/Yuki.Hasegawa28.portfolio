'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Character {
  id: string;
  name: string;
  nameKana: string;
  catchphrase: string;
  role: string;
  age: string;
  gender: string;
  themeColor: string;
  personality: string;
  appearance: string;
  motifs: string[];
  likes: string;
  dislikes: string;
  quote: string;
  story: string;
}

const DEFAULT_CHARACTER: Character = {
  id: 'default',
  name: 'ルシア・シルフィード',
  nameKana: 'るしあ・しるふぃーど',
  catchphrase: '風を味方に、まだ見ぬ世界を描く旅人',
  role: '風の魔法使い / 見習い測量士',
  age: '17歳',
  gender: '女性',
  themeColor: '#0284c7',
  personality: '明るく好奇心旺盛。少しおっちょこちょいだが、一度決めたら曲げない芯の強さを持つ。',
  appearance: '透き通るような青髪のショートボブ。羽根のついたベレー帽とスケッチブックを携帯。',
  motifs: ['風', '羽根', 'スケッチブック', '青空'],
  likes: '高い場所からの景色、甘い焼き菓子、新しいインク',
  dislikes: 'じめじめした洞窟、約束を破ること',
  quote: '「迷ったら、風が吹く方へ進んでみようよ！」',
  story: '天空の街で生まれ育ち、地上に広がる未開の自然や生き物を記録するために旅に出た少女。手にしたペンで描いたものが風となって具現化する不思議な魔法を使う。'
};

const COLOR_PRESETS = [
  { name: 'スカイブルー', color: '#0284c7' },
  { name: 'ローズピンク', color: '#e11d48' },
  { name: 'エメラルド', color: '#059669' },
  { name: 'アンバーオレンジ', color: '#d97706' },
  { name: 'バイオレット', color: '#7c3aed' },
  { name: 'ミッドナイト', color: '#1e293b' },
];

export default function CharacterSheetPage() {
  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);
  const [newMotif, setNewMotif] = useState('');
  const [copied, setCopied] = useState(false);

  // LocalStorageから復元
  useEffect(() => {
    const saved = localStorage.getItem('saved_character_sheet');
    if (saved) {
      try {
        setCharacter(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved character', e);
      }
    }
  }, []);

  // 自動保存
  const updateCharacter = (fields: Partial<Character>) => {
    setCharacter((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('saved_character_sheet', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddMotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMotif.trim()) return;
    if (!character.motifs.includes(newMotif.trim())) {
      updateCharacter({ motifs: [...character.motifs, newMotif.trim()] });
    }
    setNewMotif('');
  };

  const handleRemoveMotif = (indexToRemove: number) => {
    updateCharacter({
      motifs: character.motifs.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleReset = () => {
    if (window.confirm('入力内容を初期サンプルに戻しますか？')) {
      setCharacter(DEFAULT_CHARACTER);
      localStorage.setItem('saved_character_sheet', JSON.stringify(DEFAULT_CHARACTER));
    }
  };

  const handleClear = () => {
    if (window.confirm('すべての項目をクリアして新しく作成しますか？')) {
      const emptyChar: Character = {
        id: Date.now().toString(),
        name: '',
        nameKana: '',
        catchphrase: '',
        role: '',
        age: '',
        gender: '',
        themeColor: '#0284c7',
        personality: '',
        appearance: '',
        motifs: [],
        likes: '',
        dislikes: '',
        quote: '',
        story: ''
      };
      setCharacter(emptyChar);
      localStorage.setItem('saved_character_sheet', JSON.stringify(emptyChar));
    }
  };

  const handleCopyText = () => {
    const text = `
【キャラクター設定シート】
■ 名前: ${character.name}（${character.nameKana}）
■ キャッチコピー: ${character.catchphrase}
■ 役割・肩書: ${character.role}
■ 年齢/性別: ${character.age} / ${character.gender}
■ モチーフ: ${character.motifs.join(', ')}
■ 外見特徴:
${character.appearance}
■ 性格・特徴:
${character.personality}
■ 好きなもの / 苦手なもの:
好き: ${character.likes} / 苦手: ${character.dislikes}
■ 代表セリフ:
${character.quote}
■ 背景設定・ストーリー:
${character.story}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ナビゲーション・ヘッダー */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <Link 
              href="/"
              className="text-xs text-blue-600 hover:underline font-medium inline-flex items-center gap-1 mb-1"
            >
              ← ポートフォリオトップへ戻る
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <span>🎭</span> キャラクター設定シート ジェネレーター
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              オリジナルキャラクターの設定や魅力を整理し、洗練されたカード形式で出力・保存できる創作支援ツール
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              サンプル読込
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
              新規クリア
            </button>
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1"
            >
              {copied ? '✓ コピー完了！' : '📋 テキストコピー'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              🖨️ 印刷 / PDF保存
            </button>
          </div>
        </header>

        {/* メインレイアウト: 入力フォーム (左) + リアルタイムプレビュー (右) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 左側: 入力フォーム (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto max-h-[85vh]">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span>✏️</span> 設定を入力する
            </h2>

            {/* テーマカラー */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">テーマカラー</label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => updateCharacter({ themeColor: p.color })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      character.themeColor === p.color ? 'scale-110 border-slate-900 ring-2 ring-slate-400' : 'border-white'
                    }`}
                    style={{ backgroundColor: p.color }}
                    title={p.name}
                  />
                ))}
                <div className="flex items-center gap-1.5 pl-2">
                  <input
                    type="color"
                    value={character.themeColor}
                    onChange={(e) => updateCharacter({ themeColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs text-slate-400 font-mono">{character.themeColor}</span>
                </div>
              </div>
            </div>

            {/* 基本情報 */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">キャラクター名 *</label>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => updateCharacter({ name: e.target.value })}
                  placeholder="例: ルシア・シルフィード"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ふりがな / ローマ字</label>
                <input
                  type="text"
                  value={character.nameKana}
                  onChange={(e) => updateCharacter({ nameKana: e.target.value })}
                  placeholder="例: るしあ・しるふぃーど"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">キャッチコピー / 一言</label>
                <input
                  type="text"
                  value={character.catchphrase}
                  onChange={(e) => updateCharacter({ catchphrase: e.target.value })}
                  placeholder="例: 風を味方に、まだ見ぬ世界を描く旅人"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">年齢</label>
                  <input
                    type="text"
                    value={character.age}
                    onChange={(e) => updateCharacter({ age: e.target.value })}
                    placeholder="例: 17歳"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">性別</label>
                  <input
                    type="text"
                    value={character.gender}
                    onChange={(e) => updateCharacter({ gender: e.target.value })}
                    placeholder="例: 女性"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">役割/肩書</label>
                  <input
                    type="text"
                    value={character.role}
                    onChange={(e) => updateCharacter({ role: e.target.value })}
                    placeholder="例: 魔法使い"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* モチーフ・タグ */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">モチーフ / 連想キーワード</label>
              <form onSubmit={handleAddMotif} className="flex gap-2">
                <input
                  type="text"
                  value={newMotif}
                  onChange={(e) => setNewMotif(e.target.value)}
                  placeholder="例: 羽根, 星, 鍵 (Enterで追加)"
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  追加
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {character.motifs.map((motif, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                  >
                    #{motif}
                    <button
                      type="button"
                      onClick={() => handleRemoveMotif(idx)}
                      className="text-slate-400 hover:text-red-500 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 外見・性格 */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">外見・ビジュアル特徴</label>
                <textarea
                  rows={2}
                  value={character.appearance}
                  onChange={(e) => updateCharacter({ appearance: e.target.value })}
                  placeholder="髪型、目の色、服装、持ち物などの特徴"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">性格・特徴</label>
                <textarea
                  rows={2}
                  value={character.personality}
                  onChange={(e) => updateCharacter({ personality: e.target.value })}
                  placeholder="性格の傾向、長所、短所、癖など"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">好きなもの</label>
                  <input
                    type="text"
                    value={character.likes}
                    onChange={(e) => updateCharacter({ likes: e.target.value })}
                    placeholder="例: 甘いお菓子、読書"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">苦手なもの</label>
                  <input
                    type="text"
                    value={character.dislikes}
                    onChange={(e) => updateCharacter({ dislikes: e.target.value })}
                    placeholder="例: 暗い場所、虫"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">代表セリフ / 口癖</label>
                <input
                  type="text"
                  value={character.quote}
                  onChange={(e) => updateCharacter({ quote: e.target.value })}
                  placeholder="例: 「迷ったら、風が吹く方へ進んでみようよ！」"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">生い立ち・背景ストーリー</label>
                <textarea
                  rows={3}
                  value={character.story}
                  onChange={(e) => updateCharacter({ story: e.target.value })}
                  placeholder="世界観における立ち位置、過去の出来事、目標や動機など"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

          {/* 右側: リアルタイムプレビュー (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="sticky top-6">
              
              {/* プレビューカード（印刷対象） */}
              <div 
                id="character-card"
                className="bg-white rounded-2xl border-2 shadow-md overflow-hidden transition-all duration-300"
                style={{ borderColor: character.themeColor || '#cbd5e1' }}
              >
                {/* カード上部バナー */}
                <div 
                  className="p-6 text-white relative overflow-hidden"
                  style={{ backgroundColor: character.themeColor || '#0284c7' }}
                >
                  <div className="relative z-10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-widest uppercase opacity-90">
                        Character Profile
                      </span>
                      {character.role && (
                        <span className="px-2.5 py-0.5 bg-black/20 backdrop-blur-sm rounded-full text-xs font-medium">
                          {character.role}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs opacity-90">{character.nameKana || 'ふりがな'}</p>
                      <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        {character.name || 'キャラクター名'}
                      </h3>
                    </div>
                    {character.catchphrase && (
                      <p className="text-xs md:text-sm font-medium opacity-95 pt-1 italic">
                        “ {character.catchphrase} ”
                      </p>
                    )}
                  </div>

                  {/* 背景装飾 */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                </div>

                {/* カード本文 */}
                <div className="p-6 md:p-8 space-y-6">

                  {/* 代表セリフ */}
                  {character.quote && (
                    <div 
                      className="p-4 rounded-xl border-l-4 bg-slate-50 italic font-serif text-slate-800 text-sm md:text-base leading-relaxed"
                      style={{ borderLeftColor: character.themeColor || '#0284c7' }}
                    >
                      {character.quote}
                    </div>
                  )}

                  {/* 基本スペック */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">年齢</span>
                      <span className="font-bold text-slate-700">{character.age || '未設定'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">性別</span>
                      <span className="font-bold text-slate-700">{character.gender || '未設定'}</span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-slate-400 block mb-0.5">テーマカラー</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <span 
                          className="w-3 h-3 rounded-full inline-block border border-slate-200" 
                          style={{ backgroundColor: character.themeColor }}
                        />
                        <span className="font-mono text-[11px]">{character.themeColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* モチーフ */}
                  {character.motifs.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Motifs & Elements
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {character.motifs.map((motif, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-xs font-medium rounded-md border"
                            style={{ 
                              backgroundColor: `${character.themeColor}15`, 
                              borderColor: `${character.themeColor}40`,
                              color: character.themeColor 
                            }}
                          >
                            #{motif}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 外見・ビジュアル */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Appearance
                    </h4>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
                      {character.appearance || '（外見の特徴がここに入ります）'}
                    </p>
                  </div>

                  {/* 性格・特徴 */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Personality
                    </h4>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
                      {character.personality || '（性格や特徴がここに入ります）'}
                    </p>
                  </div>

                  {/* 好き / 苦手 */}
                  {(character.likes || character.dislikes) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                        <span className="font-bold text-emerald-800 block mb-1">❤️ 好きなもの</span>
                        <p className="text-slate-600">{character.likes || '特になし'}</p>
                      </div>
                      <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg">
                        <span className="font-bold text-rose-800 block mb-1">💔 苦手なもの</span>
                        <p className="text-slate-600">{character.dislikes || '特になし'}</p>
                      </div>
                    </div>
                  )}

                  {/* 背景・ストーリー */}
                  {character.story && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Background Story
                      </h4>
                      <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {character.story}
                      </p>
                    </div>
                  )}

                </div>

                {/* カードフッター */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Created with Character Binder</span>
                  <span>Designed by Yuki Hasegawa</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
