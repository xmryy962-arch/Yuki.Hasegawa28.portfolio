'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  // 相関図用座標
  x: number;
  y: number;
}

interface Relation {
  id: string;
  fromId: string;
  toId: string;
  fromLabel: string; // fromからtoへの感情/関係（例: 信頼・相棒）
  toLabel?: string;   // toからfromへの感情/関係（双方向の場合）
  type: 'bidirectional' | 'unidirectional'; // 双方向 or 一方向
  detail?: string;
  color?: string;
}

// サンプルデータ: 冒険ファンタジー
const SAMPLE_CHARACTERS: Character[] = [
  {
    id: 'char-1',
    name: 'ルシア・シルフィード',
    nameKana: 'るしあ・しるふぃーど',
    catchphrase: '風を味方に、まだ見ぬ世界を描く旅人',
    role: '風の魔法使い / 主人公',
    age: '17歳',
    gender: '女性',
    themeColor: '#0284c7', // スカイブルー
    personality: '明るく好奇心旺盛。少しおっちょこちょいだが、一度決めたら曲げない芯の強さを持つ。',
    appearance: '透き通るような青髪のショートボブ。羽根のついたベレー帽とスケッチブックを携帯。',
    motifs: ['風', '羽根', 'スケッチブック', '青空'],
    likes: '高い場所からの景色、甘い焼き菓子、新しいインク',
    dislikes: 'じめじめした洞窟、約束を破ること',
    quote: '「迷ったら、風が吹く方へ進んでみようよ！」',
    story: '天空の街で生まれ育ち、地上に広がる未開の自然や生き物を記録するために旅に出た少女。手にしたペンで描いたものが風となって具現化する不思議な魔法を使う。',
    x: 180,
    y: 180,
  },
  {
    id: 'char-2',
    name: 'レオン・ヴァルハイト',
    nameKana: 'れおん・ゔぁるはいと',
    catchphrase: '誇り高き剣で、仲間と誓いを守り抜く',
    role: '守護騎士 / 相棒',
    age: '19歳',
    gender: '男性',
    themeColor: '#dc2626', // レッド
    personality: '生真面目で義理堅い。口数は少ないが仲間思いで、危険な前線に真っ先に立つ。',
    appearance: '銀髪の短髪に琥珀色の瞳。歴戦の傷跡がある白銀の鎧を身にまとう。',
    motifs: ['剣', '盾', '獅子', '炎'],
    likes: '武具の手入れ、肉料理、静かな朝',
    dislikes: '不意打ち、甘えた態度',
    quote: '「お前の背中は俺が守る。前だけを見て走れ。」',
    story: '没落した名門騎士家の若き当主。ルシアの真っ直ぐな瞳に救われ、彼女の旅の護衛役兼相棒として同行している。',
    x: 520,
    y: 180,
  },
  {
    id: 'char-3',
    name: 'ノア・クローバー',
    nameKana: 'のあ・くろーばー',
    catchphrase: '万物の真理を解き明かす、毒舌な天才学者',
    role: '錬金術師 / 参謀',
    age: '16歳',
    gender: '男性',
    themeColor: '#059669', // エメラルド
    personality: '冷静沈着で理屈っぽい毒舌家。だが仲間がピンチの時は誰よりも素早く手を打つツンデレ。',
    appearance: '深緑の髪に丸メガネ。白衣と怪しげな薬品フラスコを腰に提げている。',
    motifs: ['四つ葉', '薬瓶', '歯車', '書物'],
    likes: '古代文献の解読、ブラックコーヒー、静寂',
    dislikes: '非論理的な行動、運動、騒がしい場所',
    quote: '「やれやれ、僕の計算外で勝手な無茶をしないでください。」',
    story: '最年少で王立アカデミーを卒業した天才研究者。ルシアの持つ不思議な魔法の正体を解き明かすという名目でパーティに加わる。',
    x: 350,
    y: 420,
  }
];

const SAMPLE_RELATIONS: Relation[] = [
  {
    id: 'rel-1',
    fromId: 'char-1',
    toId: 'char-2',
    fromLabel: '絶対的な信頼 / 相棒',
    toLabel: '守るべき存在 / 敬意',
    type: 'bidirectional',
    detail: '旅の最初期に出会い、幾多の死線を共に乗り越えてきた一番の相棒関係。',
    color: '#3b82f6'
  },
  {
    id: 'rel-2',
    fromId: 'char-2',
    toId: 'char-3',
    fromLabel: '頼れる頭脳（口喧嘩相手）',
    toLabel: '頼もしい盾（脳筋扱い）',
    type: 'bidirectional',
    detail: '性格は正反対でよく言い争うが、実力は認め合っている凸凹コンビ。',
    color: '#8b5cf6'
  },
  {
    id: 'rel-3',
    fromId: 'char-3',
    toId: 'char-1',
    fromLabel: '研究対象 兼 放っておけない',
    toLabel: '博識な頼れる仲間',
    type: 'bidirectional',
    detail: '無茶ばかりするルシアに小言を言いつつも、いつも的確なサポートをする。',
    color: '#10b981'
  }
];

const COLOR_PRESETS = [
  { name: 'スカイブルー', color: '#0284c7' },
  { name: 'クリムゾンレッド', color: '#dc2626' },
  { name: 'エメラルドグリーン', color: '#059669' },
  { name: 'アンバーゴールド', color: '#d97706' },
  { name: 'パープルバイオレット', color: '#7c3aed' },
  { name: 'ローズピンク', color: '#e11d48' },
  { name: 'ミッドナイト', color: '#1e293b' },
];

const RELATION_TAG_SUGGESTIONS = [
  '信頼・相棒', 'ライバル', '親友・幼馴染', '片思い', '好意・両思い',
  '主従関係', '師弟関係', '敵対・因縁', '憧れ・尊敬', '腐れ縁', 'ビジネス仲間'
];

export default function CharacterSheetPage() {
  const [characters, setCharacters] = useState<Character[]>(SAMPLE_CHARACTERS);
  const [relations, setRelations] = useState<Relation[]>(SAMPLE_RELATIONS);
  const [selectedCharId, setSelectedCharId] = useState<string>(SAMPLE_CHARACTERS[0].id);
  const [activeTab, setActiveTab] = useState<'profile' | 'chart' | 'relations_list'>('chart');
  
  // 新規・編集関係性フォーム用
  const [editingRelId, setEditingRelId] = useState<string | null>(null);
  const [newRelFrom, setNewRelFrom] = useState<string>('');
  const [newRelTo, setNewRelTo] = useState<string>('');
  const [newRelFromLabel, setNewRelFromLabel] = useState<string>('');
  const [newRelToLabel, setNewRelToLabel] = useState<string>('');
  const [newRelType, setNewRelType] = useState<'bidirectional' | 'unidirectional'>('bidirectional');
  const [newRelDetail, setNewRelDetail] = useState<string>('');

  // モチーフ追加用
  const [newMotif, setNewMotif] = useState('');
  const [copied, setCopied] = useState(false);

  // ドラッグ操作用
  const [draggingCharId, setDraggingCharId] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  // LocalStorageから復元
  useEffect(() => {
    const savedChars = localStorage.getItem('cb_characters');
    const savedRels = localStorage.getItem('cb_relations');
    if (savedChars) {
      try {
        const parsed = JSON.parse(savedChars);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCharacters(parsed);
          setSelectedCharId(parsed[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (savedRels) {
      try {
        const parsedR = JSON.parse(savedRels);
        if (Array.isArray(parsedR)) setRelations(parsedR);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // データ保存
  const saveAll = (newChars: Character[], newRels: Relation[]) => {
    setCharacters(newChars);
    setRelations(newRels);
    localStorage.setItem('cb_characters', JSON.stringify(newChars));
    localStorage.setItem('cb_relations', JSON.stringify(newRels));
  };

  const selectedCharacter = characters.find((c) => c.id === selectedCharId) || characters[0];

  const updateSelectedCharacter = (fields: Partial<Character>) => {
    const updated = characters.map((c) => (c.id === selectedCharId ? { ...c, ...fields } : c));
    saveAll(updated, relations);
  };

  // キャラクターの新規追加
  const handleAddCharacter = () => {
    const count = characters.length + 1;
    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: `新規キャラクター${count}`,
      nameKana: `しんききゃらくたー${count}`,
      catchphrase: '設定を入力してください',
      role: '役割 / 肩書',
      age: '18歳',
      gender: '不明',
      themeColor: COLOR_PRESETS[count % COLOR_PRESETS.length].color,
      personality: '',
      appearance: '',
      motifs: [],
      likes: '',
      dislikes: '',
      quote: '',
      story: '',
      x: 200 + (count % 3) * 150,
      y: 150 + Math.floor(count / 3) * 150
    };
    const updated = [...characters, newChar];
    saveAll(updated, relations);
    setSelectedCharId(newChar.id);
  };

  // キャラクターの削除
  const handleDeleteCharacter = (idToDelete: string) => {
    if (characters.length <= 1) {
      alert('最低1人のキャラクターが必要です。');
      return;
    }
    if (!window.confirm('このキャラクターと関連する関係性を削除しますか？')) return;
    
    const updatedChars = characters.filter((c) => c.id !== idToDelete);
    const updatedRels = relations.filter((r) => r.fromId !== idToDelete && r.toId !== idToDelete);
    saveAll(updatedChars, updatedRels);
    if (selectedCharId === idToDelete) {
      setSelectedCharId(updatedChars[0].id);
    }
  };

  // モチーフの追加・削除
  const handleAddMotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMotif.trim() || !selectedCharacter) return;
    if (!selectedCharacter.motifs.includes(newMotif.trim())) {
      updateSelectedCharacter({ motifs: [...selectedCharacter.motifs, newMotif.trim()] });
    }
    setNewMotif('');
  };

  const handleRemoveMotif = (indexToRemove: number) => {
    if (!selectedCharacter) return;
    updateSelectedCharacter({
      motifs: selectedCharacter.motifs.filter((_, idx) => idx !== indexToRemove)
    });
  };

  // キャラクターAとBの入れ替え（スワップ）
  const handleSwapCharacters = () => {
    const tempFrom = newRelFrom;
    const tempTo = newRelTo;
    setNewRelFrom(tempTo);
    setNewRelTo(tempFrom);
  };

  // 関係性の編集開始
  const handleStartEditRelation = (rel: Relation) => {
    setEditingRelId(rel.id);
    setNewRelFrom(rel.fromId);
    setNewRelTo(rel.toId);
    setNewRelFromLabel(rel.fromLabel);
    setNewRelToLabel(rel.toLabel || '');
    setNewRelType(rel.type);
    setNewRelDetail(rel.detail || '');
    setActiveTab('relations_list');
  };

  // 関係性の編集キャンセル
  const handleCancelEditRelation = () => {
    setEditingRelId(null);
    setNewRelFromLabel('');
    setNewRelToLabel('');
    setNewRelDetail('');
  };

  // 関係性の追加 または 編集保存
  const handleAddRelation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelFrom || !newRelTo || newRelFrom === newRelTo || !newRelFromLabel.trim()) {
      alert('関係を結ぶ2人のキャラクターと関係名を入力してください。');
      return;
    }

    const fromChar = characters.find((c) => c.id === newRelFrom);

    if (editingRelId) {
      // 編集保存
      const updated = relations.map((r) => {
        if (r.id === editingRelId) {
          return {
            ...r,
            fromId: newRelFrom,
            toId: newRelTo,
            fromLabel: newRelFromLabel.trim(),
            toLabel: newRelType === 'bidirectional' ? (newRelToLabel.trim() || newRelFromLabel.trim()) : undefined,
            type: newRelType,
            detail: newRelDetail.trim() || undefined,
            color: fromChar?.themeColor || '#64748b'
          };
        }
        return r;
      });
      saveAll(characters, updated);
      setEditingRelId(null);
    } else {
      // 新規作成
      const newRel: Relation = {
        id: `rel-${Date.now()}`,
        fromId: newRelFrom,
        toId: newRelTo,
        fromLabel: newRelFromLabel.trim(),
        toLabel: newRelType === 'bidirectional' ? (newRelToLabel.trim() || newRelFromLabel.trim()) : undefined,
        type: newRelType,
        detail: newRelDetail.trim() || undefined,
        color: fromChar?.themeColor || '#64748b'
      };
      saveAll(characters, [...relations, newRel]);
    }

    setNewRelFromLabel('');
    setNewRelToLabel('');
    setNewRelDetail('');
  };

  // 関係性の削除
  const handleDeleteRelation = (relId: string) => {
    const updated = relations.filter((r) => r.id !== relId);
    saveAll(characters, updated);
  };

  // サンプルリセット
  const handleResetSample = () => {
    if (window.confirm('初期のサンプルデータに戻しますか？')) {
      saveAll(SAMPLE_CHARACTERS, SAMPLE_RELATIONS);
      setSelectedCharId(SAMPLE_CHARACTERS[0].id);
    }
  };

  // 全クリア
  const handleClearAll = () => {
    if (window.confirm('すべてのキャラクターと相関図をリセットして新しく作り直しますか？')) {
      const initialChar: Character = {
        id: `char-${Date.now()}`,
        name: '主人公',
        nameKana: 'しゅじんこう',
        catchphrase: '',
        role: '主人公',
        age: '',
        gender: '',
        themeColor: '#0284c7',
        personality: '',
        appearance: '',
        motifs: [],
        likes: '',
        dislikes: '',
        quote: '',
        story: '',
        x: 350,
        y: 250
      };
      saveAll([initialChar], []);
      setSelectedCharId(initialChar.id);
    }
  };

  // 相関図の円形自動整列
  const handleAutoAlignCircle = () => {
    const centerX = 380;
    const centerY = 280;
    const radius = Math.min(220, 100 + characters.length * 25);
    const updated = characters.map((c, idx) => {
      const angle = (idx / characters.length) * 2 * Math.PI - Math.PI / 2;
      return {
        ...c,
        x: Math.round(centerX + radius * Math.cos(angle)),
        y: Math.round(centerY + radius * Math.sin(angle))
      };
    });
    saveAll(updated, relations);
  };

  // ドラッグ操作（SVG相関図内）
  const handleMouseDownNode = (charId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const char = characters.find((c) => c.id === charId);
    if (!char) return;
    setDraggingCharId(charId);
    dragOffset.current = {
      x: e.clientX - char.x,
      y: e.clientY - char.y
    };
  };

  const handleMouseMoveSvg = (e: React.MouseEvent) => {
    if (!draggingCharId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const boundedX = Math.max(70, Math.min(730, currentX));
    const boundedY = Math.max(60, Math.min(540, currentY));

    setCharacters((prev) =>
      prev.map((c) => (c.id === draggingCharId ? { ...c, x: boundedX, y: boundedY } : c))
    );
  };

  const handleMouseUpSvg = () => {
    if (draggingCharId) {
      setDraggingCharId(null);
      saveAll(characters, relations);
    }
  };

  // テキストエクスポート
  const handleExportText = () => {
    let text = `【作品・キャラクター相関図設定】\n\n`;
    text += `■ 登場キャラクター一覧 (${characters.length}名)\n`;
    characters.forEach((c) => {
      text += `---------------------------------\n`;
      text += `【${c.name}】（${c.nameKana}） - ${c.role}\n`;
      if (c.catchphrase) text += `キャッチコピー: ${c.catchphrase}\n`;
      text += `年齢/性別: ${c.age || '未設定'} / ${c.gender || '未設定'}\n`;
      if (c.motifs.length > 0) text += `モチーフ: ${c.motifs.join(', ')}\n`;
      if (c.quote) text += `代表セリフ: ${c.quote}\n`;
      if (c.personality) text += `性格: ${c.personality}\n`;
      if (c.story) text += `背景設定: ${c.story}\n`;
    });

    text += `\n■ キャラクター相関・関係性一覧 (${relations.length}件)\n`;
    relations.forEach((r) => {
      const from = characters.find((c) => c.id === r.fromId)?.name || '不明';
      const to = characters.find((c) => c.id === r.toId)?.name || '不明';
      text += `・ [${from}] ➔ [${to}]: ${r.fromLabel}\n`;
      if (r.type === 'bidirectional' && r.toLabel) {
        text += `  [${to}] ➔ [${from}]: ${r.toLabel}\n`;
      }
      if (r.detail) text += `  補足: ${r.detail}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ナビゲーション・ヘッダー */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <Link 
              href="/"
              className="text-xs text-blue-600 hover:underline font-medium inline-flex items-center gap-1 mb-1"
            >
              ← ポートフォリオトップへ戻る
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>🕸️</span> キャラクター設定 & 相関図ジェネレーター
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              複数キャラクターの設定整理と、直感的なビジュアル相関図（関係マップ）をワンストップで作成できる創作支援ツール
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetSample}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              サンプル読込
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
              新規クリア
            </button>
            <button
              onClick={handleExportText}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1"
            >
              {copied ? '✓ 相関図設定をコピー！' : '📋 全設定をコピー'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              🖨️ 印刷 / PDF保存
            </button>
          </div>
        </header>

        {/* タブ切り替えバー */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === 'chart' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🕸️ ビジュアル相関図
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👤 個別設定シート ({characters.length})
            </button>
            <button
              onClick={() => setActiveTab('relations_list')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === 'relations_list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 関係性一覧・追加 ({relations.length})
            </button>
          </div>

          {/* キャラクター切り替えクイックバー */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">キャラ:</span>
            {characters.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCharId(c.id);
                  if (activeTab === 'relations_list') setActiveTab('profile');
                }}
                className={`px-2.5 py-1 text-xs rounded-full font-medium flex items-center gap-1.5 transition whitespace-nowrap border ${
                  selectedCharId === c.id
                    ? 'border-slate-800 bg-slate-800 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.themeColor }} />
                <span>{c.name || '無名'}</span>
              </button>
            ))}
            <button
              onClick={handleAddCharacter}
              className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition whitespace-nowrap flex items-center gap-1"
            >
              <span>＋</span> 追加
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. ビジュアル相関図タブ */}
        {/* ======================================================== */}
        {activeTab === 'chart' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>🕸️</span> インタラクティブ相関図マップ
                  </h2>
                  <p className="text-xs text-slate-500">
                    💡 キャラクターの丸アイコンをドラッグ＆ドロップして自由に配置できます。クリックで個別設定を開きます。
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAutoAlignCircle}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1"
                  >
                    <span>🔄</span> 円形に整列
                  </button>
                  <button
                    onClick={() => setActiveTab('relations_list')}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-1"
                  >
                    <span>＋</span> 新しい関係性を結ぶ
                  </button>
                </div>
              </div>

              {/* 相関図SVGキャンバス */}
              <div className="relative w-full h-[580px] bg-slate-900/5 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden select-none">
                <svg
                  ref={svgRef}
                  className="w-full h-full cursor-crosshair"
                  onMouseMove={handleMouseMoveSvg}
                  onMouseUp={handleMouseUpSvg}
                  viewBox="0 0 800 600"
                >
                  <defs>
                    {/* 矢印マーカー */}
                    <marker
                      id="arrow-end"
                      viewBox="0 0 10 10"
                      refX="22"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                    <marker
                      id="arrow-start"
                      viewBox="0 0 10 10"
                      refX="-12"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                    >
                      <path d="M 10 1 L 0 5 L 10 9 z" fill="#64748b" />
                    </marker>
                  </defs>

                  {/* グリッド背景ドット */}
                  <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#dotGrid)" />

                  {/* 描画用エッジリストの生成（A→B, B→Aが重ならないよう曲線化） */}
                  {(() => {
                    interface RenderEdge {
                      id: string;
                      fromChar: Character;
                      toChar: Character;
                      label: string;
                      detail?: string;
                      color: string;
                      hasReverse: boolean;
                    }

                    const renderEdges: RenderEdge[] = [];

                    relations.forEach((rel) => {
                      const fromChar = characters.find((c) => c.id === rel.fromId);
                      const toChar = characters.find((c) => c.id === rel.toId);
                      if (!fromChar || !toChar) return;

                      if (rel.type === 'bidirectional') {
                        renderEdges.push({
                          id: `${rel.id}-f2t`,
                          fromChar,
                          toChar,
                          label: rel.fromLabel,
                          detail: rel.detail,
                          color: rel.color || fromChar.themeColor || '#3b82f6',
                          hasReverse: true,
                        });
                        renderEdges.push({
                          id: `${rel.id}-t2f`,
                          fromChar: toChar,
                          toChar: fromChar,
                          label: rel.toLabel || rel.fromLabel,
                          detail: rel.detail,
                          color: toChar.themeColor || '#dc2626',
                          hasReverse: true,
                        });
                      } else {
                        const hasReverse = relations.some(
                          (r) =>
                            (r.id !== rel.id && r.fromId === rel.toId && r.toId === rel.fromId) ||
                            (r.id !== rel.id && r.type === 'bidirectional' && (
                              (r.fromId === rel.toId && r.toId === rel.fromId) ||
                              (r.fromId === rel.fromId && r.toId === rel.toId)
                            ))
                        );
                        renderEdges.push({
                          id: rel.id,
                          fromChar,
                          toChar,
                          label: rel.fromLabel,
                          detail: rel.detail,
                          color: rel.color || fromChar.themeColor || '#3b82f6',
                          hasReverse,
                        });
                      }
                    });

                    // 選択中の矢印が最前面に来るようソート
                    renderEdges.sort((a, b) => {
                      const aScore = a.fromChar.id === selectedCharId ? 2 : (a.toChar.id === selectedCharId ? 1 : 0);
                      const bScore = b.fromChar.id === selectedCharId ? 2 : (b.toChar.id === selectedCharId ? 1 : 0);
                      return aScore - bScore;
                    });

                    return renderEdges.map((edge) => {
                      const { fromChar, toChar, label, detail, color, hasReverse } = edge;

                      // 選択キャラとの関係判定
                      const isOutGoingFromSelected = selectedCharId === fromChar.id;
                      const isInComingToSelected = selectedCharId === toChar.id;
                      const isRelated = isOutGoingFromSelected || isInComingToSelected;

                      // 太さと不透明度の計算（選択中のキャラから出る矢印を太く強調）
                      let strokeWidth = 2.5;
                      let opacity = 0.85;
                      let markerSize = 7;
                      let badgeScaleClass = '';

                      if (selectedCharId) {
                        if (isOutGoingFromSelected) {
                          strokeWidth = 5; // 太線化！
                          opacity = 1;
                          markerSize = 9.5;
                          badgeScaleClass = 'scale-110 ring-2 ring-white shadow-xl z-20';
                        } else if (isInComingToSelected) {
                          strokeWidth = 3.5;
                          opacity = 0.9;
                          markerSize = 8;
                          badgeScaleClass = 'z-10 shadow-md';
                        } else {
                          strokeWidth = 1.5;
                          opacity = 0.18; // 無関係な矢印は薄く
                          markerSize = 5;
                          badgeScaleClass = 'opacity-30';
                        }
                      }

                      // 自己ループの場合
                      if (fromChar.id === toChar.id) {
                        const sx = fromChar.x - 18;
                        const sy = fromChar.y - 32;
                        const ex = fromChar.x + 18;
                        const ey = fromChar.y - 32;
                        const pathD = `M ${sx} ${sy} C ${sx - 35} ${sy - 60}, ${ex + 35} ${ey - 60}, ${ex} ${ey}`;
                        const midX = fromChar.x;
                        const midY = fromChar.y - 70;

                        return (
                          <g key={edge.id} className="transition-all duration-200">
                            <defs>
                              <marker
                                id={`arrow-${edge.id}`}
                                viewBox="0 0 10 10"
                                refX="6"
                                refY="5"
                                markerWidth={markerSize}
                                markerHeight={markerSize}
                                orient="auto"
                              >
                                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={color} />
                              </marker>
                            </defs>
                            <path
                              d={pathD}
                              fill="none"
                              stroke={color}
                              strokeWidth={strokeWidth}
                              markerEnd={`url(#arrow-${edge.id})`}
                              opacity={opacity}
                            />
                            <foreignObject x={midX - 70} y={midY - 14} width="140" height="36" className="overflow-visible pointer-events-auto">
                              <div className="flex justify-center">
                                <span 
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow transition-all ${badgeScaleClass}`} 
                                  style={{ backgroundColor: color }}
                                >
                                  {label}
                                </span>
                              </div>
                            </foreignObject>
                          </g>
                        );
                      }

                      // 2点間の幾何計算
                      const dx = toChar.x - fromChar.x;
                      const dy = toChar.y - fromChar.y;
                      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                      const ux = dx / dist;
                      const uy = dy / dist;
                      const nx = -uy;
                      const ny = ux;

                      const nodeRadius = 38;
                      // 重なり防止のため、逆向きがある場合はカーブ高さをしっかり確保（52px）
                      const curveHeight = hasReverse ? 52 : 30;

                      const startX = fromChar.x + ux * nodeRadius + nx * 8;
                      const startY = fromChar.y + uy * nodeRadius + ny * 8;
                      const endX = toChar.x - ux * (nodeRadius + 6) + nx * 8;
                      const endY = toChar.y - uy * (nodeRadius + 6) + ny * 8;

                      const ctrlX = (fromChar.x + toChar.x) / 2 + nx * (curveHeight * 2);
                      const ctrlY = (fromChar.y + toChar.y) / 2 + ny * (curveHeight * 2);

                      const pathD = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;

                      const midX = 0.25 * startX + 0.5 * ctrlX + 0.25 * endX;
                      const midY = 0.25 * startY + 0.5 * ctrlY + 0.25 * endY;

                      return (
                        <g key={edge.id} className="transition-all duration-200 group">
                          <defs>
                            <marker
                              id={`arrow-${edge.id}`}
                              viewBox="0 0 10 10"
                              refX="6"
                              refY="5"
                              markerWidth={markerSize}
                              markerHeight={markerSize}
                              orient="auto"
                            >
                              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={color} />
                            </marker>
                          </defs>

                          {/* 湾曲した矢印パス */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke={color}
                            strokeWidth={strokeWidth}
                            markerEnd={`url(#arrow-${edge.id})`}
                            opacity={opacity}
                            strokeLinecap="round"
                            className="transition-all duration-200"
                          />

                          {/* ラベル背景バッジ（カーブ頂点に配置） */}
                          <foreignObject
                            x={midX - 75}
                            y={midY - 14}
                            width="150"
                            height="40"
                            className="overflow-visible pointer-events-auto"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <div 
                                onClick={() => {
                                  const orig = relations.find((r) => r.id === edge.id || edge.id.startsWith(r.id));
                                  if (orig) handleStartEditRelation(orig);
                                }}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/80 max-w-[145px] truncate cursor-pointer hover:scale-105 transition-all duration-200 ${badgeScaleClass}`}
                                style={{ backgroundColor: color }}
                                title={`クリックして編集: ${fromChar.name} ➔ ${toChar.name}: ${label}`}
                              >
                                <span>➔ {label}</span>
                                <span className="opacity-70 text-[9px]">✏️</span>
                              </div>
                              {detail && isRelated && (
                                <span className="text-[9px] text-slate-700 bg-white/95 font-medium px-1.5 py-0.5 rounded shadow-xs mt-0.5 border border-slate-200 truncate max-w-[140px]">
                                  {detail}
                                </span>
                              )}
                            </div>
                          </foreignObject>
                        </g>
                      );
                    });
                  })()}

                  {/* キャラクターノード (Draggable Nodes) */}
                  {characters.map((char) => {
                    const isSelected = char.id === selectedCharId;
                    const isConnected = relations.some(
                      (r) =>
                        (r.fromId === selectedCharId && r.toId === char.id) ||
                        (r.toId === selectedCharId && r.fromId === char.id)
                    );
                    const nodeOpacity = selectedCharId
                      ? (isSelected || isConnected ? 1 : 0.4)
                      : 1;

                    return (
                      <g
                        key={char.id}
                        transform={`translate(${char.x}, ${char.y})`}
                        onMouseDown={(e) => handleMouseDownNode(char.id, e)}
                        onClick={() => setSelectedCharId(char.id)}
                        className="cursor-grab active:cursor-grabbing group transition-opacity duration-200"
                        opacity={nodeOpacity}
                      >
                        {/* 選択リング */}
                        {isSelected && (
                          <>
                            <circle r="46" fill="none" stroke={char.themeColor} strokeWidth="2.5" opacity="0.4" className="animate-ping" />
                            <circle r="44" fill="none" stroke={char.themeColor} strokeWidth="3" strokeDasharray="6 3" className="animate-spin" />
                          </>
                        )}

                        {/* メイン円 */}
                        <circle
                          r="36"
                          fill="white"
                          stroke={char.themeColor}
                          strokeWidth={isSelected ? "5" : "3.5"}
                          className="drop-shadow-md group-hover:scale-105 transition-transform"
                        />

                        {/* キャラクターアイコン/イニシャル */}
                        <circle r="26" fill={char.themeColor} opacity="0.92" />
                        <text
                          textAnchor="middle"
                          dy="6"
                          fill="white"
                          fontSize="16"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {char.name ? char.name.slice(0, 2) : '無名'}
                        </text>

                        {/* 名前と役職ラベル */}
                        <foreignObject x="-75" y="42" width="150" height="45" className="overflow-visible pointer-events-none">
                          <div className="flex flex-col items-center">
                            <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md shadow-sm whitespace-nowrap max-w-[140px] truncate transition-colors ${
                              isSelected ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-slate-900 text-white'
                            }`}>
                              {char.name}
                            </span>
                            {char.role && (
                              <span className="text-[10px] text-slate-500 font-medium truncate max-w-[130px] mt-0.5">
                                {char.role}
                              </span>
                            )}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* 選択中のキャラクター詳細クイックプレビュー */}
            {selectedCharacter && (
              <div 
                className="p-4 bg-white rounded-xl border-l-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ borderLeftColor: selectedCharacter.themeColor }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{selectedCharacter.nameKana}</span>
                    <h3 className="text-base font-bold text-slate-900">{selectedCharacter.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {selectedCharacter.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    {selectedCharacter.catchphrase || selectedCharacter.quote || selectedCharacter.personality || '設定を入力してください'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    ✏️ このキャラの設定を編集
                  </button>
                  <button
                    onClick={() => {
                      setEditingRelId(null);
                      setNewRelFrom(selectedCharacter.id);
                      setActiveTab('relations_list');
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    🔗 このキャラの関係性を追加
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. 個別キャラクター設定シートタブ */}
        {/* ======================================================== */}
        {activeTab === 'profile' && selectedCharacter && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 左側: 入力フォーム (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-5 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto max-h-[85vh]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>✏️</span> {selectedCharacter.name || 'キャラクター'}の設定
                </h2>
                <button
                  onClick={() => handleDeleteCharacter(selectedCharacter.id)}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  このキャラを削除
                </button>
              </div>

              {/* テーマカラー */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">テーマカラー</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => updateSelectedCharacter({ themeColor: p.color })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        selectedCharacter.themeColor === p.color ? 'scale-110 border-slate-900 ring-2 ring-slate-400' : 'border-white'
                      }`}
                      style={{ backgroundColor: p.color }}
                      title={p.name}
                    />
                  ))}
                  <div className="flex items-center gap-1.5 pl-2">
                    <input
                      type="color"
                      value={selectedCharacter.themeColor}
                      onChange={(e) => updateSelectedCharacter({ themeColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-slate-400 font-mono">{selectedCharacter.themeColor}</span>
                  </div>
                </div>
              </div>

              {/* 基本情報 */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">キャラクター名 *</label>
                  <input
                    type="text"
                    value={selectedCharacter.name}
                    onChange={(e) => updateSelectedCharacter({ name: e.target.value })}
                    placeholder="例: ルシア・シルフィード"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ふりがな / ローマ字</label>
                  <input
                    type="text"
                    value={selectedCharacter.nameKana}
                    onChange={(e) => updateSelectedCharacter({ nameKana: e.target.value })}
                    placeholder="例: るしあ・しるふぃーど"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">キャッチコピー / 一言</label>
                  <input
                    type="text"
                    value={selectedCharacter.catchphrase}
                    onChange={(e) => updateSelectedCharacter({ catchphrase: e.target.value })}
                    placeholder="例: 風を味方に、まだ見ぬ世界を描く旅人"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1">年齢</label>
                    <input
                      type="text"
                      value={selectedCharacter.age}
                      onChange={(e) => updateSelectedCharacter({ age: e.target.value })}
                      placeholder="例: 17歳"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1">性別</label>
                    <input
                      type="text"
                      value={selectedCharacter.gender}
                      onChange={(e) => updateSelectedCharacter({ gender: e.target.value })}
                      placeholder="例: 女性"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1">役割/肩書</label>
                    <input
                      type="text"
                      value={selectedCharacter.role}
                      onChange={(e) => updateSelectedCharacter({ role: e.target.value })}
                      placeholder="例: 主人公"
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
                    placeholder="例: 風, 羽根 (Enterで追加)"
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
                  {selectedCharacter.motifs.map((motif, idx) => (
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
                    value={selectedCharacter.appearance}
                    onChange={(e) => updateSelectedCharacter({ appearance: e.target.value })}
                    placeholder="髪型、目の色、服装、持ち物などの特徴"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">性格・特徴</label>
                  <textarea
                    rows={2}
                    value={selectedCharacter.personality}
                    onChange={(e) => updateSelectedCharacter({ personality: e.target.value })}
                    placeholder="性格の傾向、長所、短所、癖など"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">好きなもの</label>
                    <input
                      type="text"
                      value={selectedCharacter.likes}
                      onChange={(e) => updateSelectedCharacter({ likes: e.target.value })}
                      placeholder="例: 甘いお菓子"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">苦手なもの</label>
                    <input
                      type="text"
                      value={selectedCharacter.dislikes}
                      onChange={(e) => updateSelectedCharacter({ dislikes: e.target.value })}
                      placeholder="例: 暗い場所"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">代表セリフ / 口癖</label>
                  <input
                    type="text"
                    value={selectedCharacter.quote}
                    onChange={(e) => updateSelectedCharacter({ quote: e.target.value })}
                    placeholder="例: 「迷ったら、風が吹く方へ進んでみようよ！」"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">生い立ち・背景ストーリー</label>
                  <textarea
                    rows={3}
                    value={selectedCharacter.story}
                    onChange={(e) => updateSelectedCharacter({ story: e.target.value })}
                    placeholder="世界観における立ち位置、過去の出来事、動機など"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

            </div>

            {/* 右側: リアルタイムプレビュー (lg:col-span-7) */}
            <div className="lg:col-span-7">
              <div className="sticky top-6">
                
                {/* プレビューカード */}
                <div 
                  className="bg-white rounded-2xl border-2 shadow-md overflow-hidden transition-all duration-300"
                  style={{ borderColor: selectedCharacter.themeColor || '#cbd5e1' }}
                >
                  {/* カード上部バナー */}
                  <div 
                    className="p-6 text-white relative overflow-hidden"
                    style={{ backgroundColor: selectedCharacter.themeColor || '#0284c7' }}
                  >
                    <div className="relative z-10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-widest uppercase opacity-90">
                          Character Profile
                        </span>
                        {selectedCharacter.role && (
                          <span className="px-2.5 py-0.5 bg-black/20 backdrop-blur-sm rounded-full text-xs font-medium">
                            {selectedCharacter.role}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs opacity-90">{selectedCharacter.nameKana || 'ふりがな'}</p>
                        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                          {selectedCharacter.name || 'キャラクター名'}
                        </h3>
                      </div>
                      {selectedCharacter.catchphrase && (
                        <p className="text-xs md:text-sm font-medium opacity-95 pt-1 italic">
                          “ {selectedCharacter.catchphrase} ”
                        </p>
                      )}
                    </div>
                  </div>

                  {/* カード本文 */}
                  <div className="p-6 md:p-8 space-y-6">

                    {/* 代表セリフ */}
                    {selectedCharacter.quote && (
                      <div 
                        className="p-4 rounded-xl border-l-4 bg-slate-50 italic font-serif text-slate-800 text-sm md:text-base leading-relaxed"
                        style={{ borderLeftColor: selectedCharacter.themeColor || '#0284c7' }}
                      >
                        {selectedCharacter.quote}
                      </div>
                    )}

                    {/* 基本スペック */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">年齢</span>
                        <span className="font-bold text-slate-700">{selectedCharacter.age || '未設定'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">性別</span>
                        <span className="font-bold text-slate-700">{selectedCharacter.gender || '未設定'}</span>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-slate-400 block mb-0.5">テーマカラー</span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <span 
                            className="w-3 h-3 rounded-full inline-block border border-slate-200" 
                            style={{ backgroundColor: selectedCharacter.themeColor }}
                          />
                          <span className="font-mono text-[11px]">{selectedCharacter.themeColor}</span>
                        </div>
                      </div>
                    </div>

                    {/* 他キャラとの関係性（このキャラが関わる関係一覧） */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Relationships (他キャラとの相関)
                      </h4>
                      <div className="space-y-2">
                        {relations
                          .filter((r) => r.fromId === selectedCharacter.id || r.toId === selectedCharacter.id)
                          .map((r) => {
                            const isFrom = r.fromId === selectedCharacter.id;
                            const targetChar = characters.find((c) => c.id === (isFrom ? r.toId : r.fromId));
                            if (!targetChar) return null;
                            const myLabel = isFrom ? r.fromLabel : (r.toLabel || r.fromLabel);

                            return (
                              <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: targetChar.themeColor }} />
                                  <span className="font-bold text-slate-800">{targetChar.name}</span>
                                  <span className="text-slate-400">に対して:</span>
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded">
                                    {myLabel}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {r.detail && <span className="text-slate-500 text-[11px] italic">{r.detail}</span>}
                                  <button
                                    onClick={() => handleStartEditRelation(r)}
                                    className="text-blue-600 hover:underline text-[11px] font-bold"
                                  >
                                    編集
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        {relations.filter((r) => r.fromId === selectedCharacter.id || r.toId === selectedCharacter.id).length === 0 && (
                          <p className="text-xs text-slate-400 italic">まだ関係性が登録されていません。</p>
                        )}
                      </div>
                    </div>

                    {/* モチーフ */}
                    {selectedCharacter.motifs.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Motifs & Elements
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCharacter.motifs.map((motif, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 text-xs font-medium rounded-md border"
                              style={{ 
                                backgroundColor: `${selectedCharacter.themeColor}15`, 
                                borderColor: `${selectedCharacter.themeColor}40`,
                                color: selectedCharacter.themeColor 
                              }}
                            >
                              #{motif}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 外見・性格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</h4>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
                          {selectedCharacter.appearance || '（未設定）'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personality</h4>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
                          {selectedCharacter.personality || '（未設定）'}
                        </p>
                      </div>
                    </div>

                    {/* 背景ストーリー */}
                    {selectedCharacter.story && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Background Story
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                          {selectedCharacter.story}
                        </p>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 3. 関係性一覧・追加/編集タブ */}
        {/* ======================================================== */}
        {activeTab === 'relations_list' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 左側: 関係性追加/編集フォーム (lg:col-span-5) */}
            <div className={`lg:col-span-5 bg-white p-5 md:p-6 rounded-2xl border shadow-sm space-y-4 transition-all ${
              editingRelId ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{editingRelId ? '✏️' : '➕'}</span>
                  {editingRelId ? '関係性を編集する' : '新しい関係性を追加'}
                </h2>
                {editingRelId && (
                  <button
                    type="button"
                    onClick={handleCancelEditRelation}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-0.5 bg-slate-100 rounded hover:bg-slate-200 transition"
                  >
                    ✕ キャンセル
                  </button>
                )}
              </div>

              {editingRelId && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center justify-between">
                  <span>💡 既存の関係性を編集中です</span>
                  <button
                    type="button"
                    onClick={handleCancelEditRelation}
                    className="underline font-bold text-[11px]"
                  >
                    新規追加に戻る
                  </button>
                </div>
              )}

              <form onSubmit={handleAddRelation} className="space-y-4">
                {/* 2人のキャラクター選択 (中央に ⇄ スワップボタン) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">関係を結ぶキャラクター</label>
                    <button
                      type="button"
                      onClick={handleSwapCharacters}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-md hover:bg-blue-100 transition active:scale-95 border border-blue-200"
                      title="発信側(A)と対象側(B)を入れ替える"
                    >
                      <span>⇄</span> 向きを入れ替える
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* キャラクター A */}
                    <div className="flex-1">
                      <div className="text-[10px] text-slate-400 font-bold mb-0.5 flex items-center gap-1">
                        <span>👤</span> 発信側 (From)
                      </div>
                      <select
                        value={newRelFrom}
                        onChange={(e) => setNewRelFrom(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-xs"
                      >
                        <option value="">選択してください</option>
                        {characters.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* 中央の入れ替えボタン */}
                    <div className="pt-4 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={handleSwapCharacters}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white border border-slate-300 flex items-center justify-center text-slate-600 text-sm font-bold shadow-sm transition-all active:scale-90"
                        title="ワンクリックで A と B を入れ替え"
                      >
                        ⇄
                      </button>
                    </div>

                    {/* キャラクター B */}
                    <div className="flex-1">
                      <div className="text-[10px] text-slate-400 font-bold mb-0.5 flex items-center gap-1">
                        <span>🎯</span> 対象側 (To)
                      </div>
                      <select
                        value={newRelTo}
                        onChange={(e) => setNewRelTo(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-xs"
                      >
                        <option value="">選択してください</option>
                        {characters.map((c) => (
                          <option key={c.id} value={c.id} disabled={c.id === newRelFrom}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 向き（双方向 or 一方向） */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">関係のタイプ</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRelType('bidirectional')}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg border text-center transition ${
                        newRelType === 'bidirectional' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ⇄ 双方向の関係
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRelType('unidirectional')}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg border text-center transition ${
                        newRelType === 'unidirectional' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ➔ 一方向の関係
                    </button>
                  </div>
                </div>

                {/* 関係ラベル */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {newRelType === 'bidirectional' ? 'AからBへの関係 / 感情 *' : '関係の名称 *'}
                  </label>
                  <input
                    type="text"
                    value={newRelFromLabel}
                    onChange={(e) => setNewRelFromLabel(e.target.value)}
                    placeholder="例: 相棒、ライバル、幼馴染"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* クイックサジェスト */}
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {RELATION_TAG_SUGGESTIONS.slice(0, 6).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setNewRelFromLabel(tag)}
                        className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {newRelType === 'bidirectional' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      BからAへの関係 / 感情（空欄の場合は同名）
                    </label>
                    <input
                      type="text"
                      value={newRelToLabel}
                      onChange={(e) => setNewRelToLabel(e.target.value)}
                      placeholder="例: 守るべき存在、親友"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* 関係の詳細・エピソード */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">関係の詳細・エピソード（任意）</label>
                  <textarea
                    rows={2}
                    value={newRelDetail}
                    onChange={(e) => setNewRelDetail(e.target.value)}
                    placeholder="例: 幼い頃に助けられた恩義がある、いつも口喧嘩ばかりしているなど"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>{editingRelId ? '✓' : '＋'}</span>
                    {editingRelId ? '変更を保存する' : '関係性を追加して相関図に反映'}
                  </button>
                  
                  {editingRelId ? (
                    <button
                      type="button"
                      onClick={handleCancelEditRelation}
                      className="w-full py-1.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                      編集をキャンセル
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSwapCharacters}
                      className="w-full py-1.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <span>⇄</span> 向き（AとB）を反転して続けて入力
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* 右側: 登録済み関係性一覧 (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>📋</span> 登録済みの相関・関係性 ({relations.length}件)
              </h2>

              <div className="space-y-3">
                {relations.map((rel) => {
                  const fromChar = characters.find((c) => c.id === rel.fromId);
                  const toChar = characters.find((c) => c.id === rel.toId);
                  if (!fromChar || !toChar) return null;
                  const isEditing = editingRelId === rel.id;

                  return (
                    <div 
                      key={rel.id} 
                      className={`p-4 rounded-xl space-y-2 transition-all ${
                        isEditing
                          ? 'bg-blue-50/70 border-2 border-blue-500 shadow-sm'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isEditing && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                              編集中
                            </span>
                          )}
                          <span className="font-bold text-slate-800 text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-xs">
                            {fromChar.name}
                          </span>
                          <span className="text-slate-400 font-bold text-sm">
                            {rel.type === 'bidirectional' ? '⇄' : '➔'}
                          </span>
                          <span className="font-bold text-slate-800 text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-xs">
                            {toChar.name}
                          </span>
                          <span 
                            className="px-2.5 py-0.5 text-xs font-bold text-white rounded-full ml-1 shadow-xs"
                            style={{ backgroundColor: rel.color || '#3b82f6' }}
                          >
                            {rel.fromLabel}
                            {rel.type === 'bidirectional' && rel.toLabel && rel.toLabel !== rel.fromLabel && ` / ${rel.toLabel}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEditRelation(rel)}
                            className="text-[11px] text-slate-700 hover:text-slate-900 font-bold px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition flex items-center gap-1 shadow-xs"
                            title="関係性の内容を編集"
                          >
                            <span>✏️</span> 編集
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewRelFrom(rel.toId);
                              setNewRelTo(rel.fromId);
                              setNewRelFromLabel('');
                              setNewRelType('unidirectional');
                              setEditingRelId(null);
                            }}
                            className="text-[11px] text-blue-600 hover:text-blue-800 font-bold px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition flex items-center gap-1"
                            title="逆向き（B ➔ A）の関係性を新規追加"
                          >
                            <span>⇄</span> 逆向きを追加
                          </button>
                          <button
                            onClick={() => handleDeleteRelation(rel.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1"
                            title="関係性を削除"
                          >
                            削除
                          </button>
                        </div>
                      </div>

                      {rel.detail && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                          {rel.detail}
                        </p>
                      )}
                    </div>
                  );
                })}

                {relations.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-8 text-center">
                    まだ関係性が登録されていません。左のフォームから追加してください。
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
