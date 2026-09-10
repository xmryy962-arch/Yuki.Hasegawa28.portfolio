'use client';

import React, { useState } from 'react';
import { 
  Task, 
  TaskCategory, 
  TaskPriority, 
  PRIORITY_CONFIG, 
  CategoryInfo, 
  getCategoryInfo, 
  hexToRgba 
} from '../types';
import { 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  CheckCircle2, 
  Circle,
  Clock,
  FileText,
  Filter,
  Edit3
} from 'lucide-react';

const PRESET_COLORS = [
  '#f43f5e', // ローズ
  '#f97316', // コーラルオレンジ
  '#eab308', // ゴールド
  '#10b981', // エメラルド
  '#06b6d4', // シアン
  '#38bdf8', // スカイブルー
  '#6366f1', // インディゴ
  '#a855f7', // パープル
  '#ec4899', // ピンク
  '#14b8a6', // ティール
  '#84cc16', // ライム
  '#f8fafc', // ピュアホワイト
];

interface TaskPanelProps {
  tasks: Task[];
  categories: Record<string, CategoryInfo>;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
  onAddCategory: (data: { label: string; color: string }) => string;
  onDeleteCategory?: (categoryId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function TaskPanel({
  tasks,
  categories,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onAddCategory,
  onDeleteCategory,
  isCollapsed,
  onToggleCollapse,
}: TaskPanelProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // 新規タスク用のState
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('creative');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  // 属性自作用のState
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatColor, setNewCatColor] = useState('#38bdf8');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;

    const newId = onAddCategory({
      label: newCatLabel.trim(),
      color: newCatColor,
    });
    setCategory(newId);
    setNewCatLabel('');
    setShowAddCategory(false);
  };

  // タスク編集用のState
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<TaskCategory>('creative');
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setEditNotes(task.notes || '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const handleSaveEdit = (e: React.FormEvent, originalTask: Task) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    onUpdateTask({
      ...originalTask,
      title: editTitle.trim(),
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate || undefined,
      notes: editNotes.trim() || undefined,
    });

    setEditingTaskId(null);
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const filteredTasks = (activeTab === 'pending' ? pendingTasks : completedTasks).filter((t) => {
    if (categoryFilter === 'all') return true;
    return t.category === categoryFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    setDueDate('');
    setShowAddForm(false);
  };

  return (
    <aside
      className={`fixed md:absolute bottom-0 left-0 md:top-20 md:bottom-6 z-30 w-full md:w-96 transition-all duration-300 ease-in-out pointer-events-auto ${
        isCollapsed
          ? 'translate-y-[calc(100%-48px)] md:translate-y-0 md:-translate-x-[calc(100%-48px)]'
          : 'translate-y-0 md:translate-x-0'
      }`}
    >
      <div className="h-[75vh] md:h-full mx-2 md:mx-4 flex flex-col rounded-t-2xl md:rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* パネル上部ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              ミッション司令室 (Tasks)
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {pendingTasks.length}件 未完了
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs flex items-center gap-1 transition-all"
              title="新規ミッションを追加"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden sm:inline">タスク追加</span>
            </button>

            {/* パネル最小化ボタン */}
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isCollapsed ? 'パネルを展開' : 'パネルを最小化'}
            >
              <span className="md:hidden">
                {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
              <span className="hidden md:inline">
                {isCollapsed ? <ChevronDown className="w-4 h-4 -rotate-90" /> : <ChevronDown className="w-4 h-4 rotate-90" />}
              </span>
            </button>
          </div>
        </div>

        {/* 新規タスク追加フォーム（展開時） */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="p-4 border-b border-slate-800 bg-slate-900/70 space-y-3 animate-fade-in text-xs"
          >
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">ミッション名</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: ポートフォリオのUIデザインを完成させる"
                className="w-full px-3 py-2 rounded-lg bg-slate-850 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs"
                autoFocus
              />
            </div>

            {/* カテゴリ（星の属性）選択 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">星の属性 (カテゴリ)</label>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  {showAddCategory ? '閉じる' : '新しい属性を追加'}
                </button>
              </div>

              {/* 新しい属性の作成フォーム */}
              {showAddCategory && (
                <div className="p-3 rounded-lg bg-slate-950/90 border border-cyan-500/40 space-y-2.5 shadow-lg shadow-cyan-950/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      星の属性をカスタマイズ追加
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(false)}
                      className="text-slate-400 hover:text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 mb-1 block">属性名</label>
                    <input
                      type="text"
                      value={newCatLabel}
                      onChange={(e) => setNewCatLabel(e.target.value)}
                      placeholder="例: 仕事, 趣味, 筋トレ, 勉強..."
                      maxLength={14}
                      className="w-full px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] text-slate-400">星の輝き色 (Color)</label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-mono">{newCatColor}</span>
                        <input
                          type="color"
                          value={newCatColor}
                          onChange={(e) => setNewCatColor(e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border border-slate-600 bg-transparent"
                          title="カラーピッカーで色を選ぶ"
                        />
                      </div>
                    </div>

                    {/* プリセットパレット */}
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewCatColor(c)}
                          className={`w-5 h-5 rounded-full border transition-all ${
                            newCatColor.toLowerCase() === c.toLowerCase()
                              ? 'scale-125 border-white shadow-[0_0_8px_currentColor] ring-1 ring-white/50'
                              : 'border-slate-700 hover:scale-110 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c, color: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* プレビュー & 追加ボタン */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] text-slate-500 flex-shrink-0">プレビュー:</span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1 truncate"
                        style={{
                          backgroundColor: hexToRgba(newCatColor, 0.15),
                          borderColor: hexToRgba(newCatColor, 0.4),
                          color: newCatColor,
                          boxShadow: `0 0 8px ${hexToRgba(newCatColor, 0.3)}`
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: newCatColor }} />
                        <span className="truncate">{newCatLabel.trim() || '属性名'}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!newCatLabel.trim()}
                      onClick={handleCreateCategory}
                      className="px-3 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-[10px] shadow transition-all flex items-center gap-1 flex-shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      追加
                    </button>
                  </div>
                </div>
              )}

              {/* 属性一覧グリッド */}
              <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-0.5 custom-scrollbar">
                {Object.values(categories).map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <div key={cat.id} className="relative group/cat">
                      <button
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`w-full px-2 py-1.5 rounded-md border text-[10px] font-medium flex items-center justify-center gap-1 transition-all truncate`}
                        style={{
                          backgroundColor: isSelected ? hexToRgba(cat.color, 0.2) : 'rgba(15, 23, 42, 0.6)',
                          borderColor: isSelected ? cat.color : 'rgba(51, 65, 85, 0.6)',
                          color: isSelected ? cat.color : '#94a3b8',
                          boxShadow: isSelected ? `0 0 10px ${hexToRgba(cat.color, 0.4)}` : 'none',
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate">{cat.label.split('・')[0]}</span>
                      </button>

                      {/* カスタム属性の削除ボタン */}
                      {cat.isCustom && onDeleteCategory && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`属性「${cat.label}」を削除しますか？`)) {
                              onDeleteCategory(cat.id);
                              if (category === cat.id) {
                                setCategory('creative');
                              }
                            }
                          }}
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity border border-slate-700 text-[8px]"
                          title="このカスタム属性を削除"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 優先度選択（星の大きさ・タイプに影響） */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">天体の規模 (優先度)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2 py-1.5 rounded-md border text-[10px] font-medium transition-all ${
                      priority === p
                        ? `${PRIORITY_CONFIG[p].badge} ring-1 ring-white/20`
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p === 'high' ? '🪐 大星・惑星' : p === 'medium' ? '⭐ 恒星' : '✨ 小星'}
                  </button>
                ))}
              </div>
            </div>

            {/* 期限 & メモ */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" /> 期限
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                  <FileText className="w-3 h-3" /> メモ
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="任意のメモ"
                  className="w-full px-2 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 rounded-md text-slate-400 hover:text-white"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                宇宙へ放つ ✦
              </button>
            </div>
          </form>
        )}

        {/* タブ切り替え & フィルター */}
        <div className="px-3 pt-2 pb-1 border-b border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'pending'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                未完了 ({pendingTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                  activeTab === 'completed'
                    ? 'bg-purple-500/20 text-purple-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                星となった記録 ({completedTasks.length})
              </button>
            </div>

            {/* カテゴリフィルター */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Filter className="w-3 h-3" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 text-[10px] focus:outline-none max-w-[120px]"
              >
                <option value="all">全カテゴリ</option>
                {Object.values(categories).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* タスク一覧リスト */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
          {filteredTasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
              {activeTab === 'pending' ? (
                <>
                  <Sparkles className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
                  <p className="text-slate-400 font-medium">未完了のミッションはありません</p>
                  <p className="text-[11px] text-slate-500 mt-1">「タスク追加」から新しい目標を設定して、宇宙を成長させましょう！</p>
                </>
              ) : (
                <>
                  <Circle className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
                  <p className="text-slate-400 font-medium">まだ誕生した星はありません</p>
                  <p className="text-[11px] text-slate-500 mt-1">タスクを完了すると、ここに星々の軌跡が刻まれます。</p>
                </>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => {
              if (editingTaskId === task.id) {
                return (
                  <form
                    key={task.id}
                    onSubmit={(e) => handleSaveEdit(e, task)}
                    className="p-3.5 rounded-xl border border-cyan-500/50 bg-slate-900/95 shadow-xl shadow-cyan-950/30 space-y-2.5 animate-fade-in text-xs"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                        <Edit3 className="w-3 h-3 text-cyan-400" />
                        ミッションを編集
                      </span>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="text-slate-400 hover:text-white text-xs px-1"
                        title="キャンセル"
                      >
                        ✕
                      </button>
                    </div>

                    {/* ミッション名 */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-semibold">ミッション名</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                        autoFocus
                      />
                    </div>

                    {/* 属性（カテゴリ）選択 */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-semibold">星の属性 (カテゴリ)</label>
                      <div className="grid grid-cols-3 gap-1 max-h-28 overflow-y-auto pr-0.5 custom-scrollbar">
                        {Object.values(categories).map((cat) => {
                          const isSelected = editCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setEditCategory(cat.id)}
                              className="px-2 py-1 rounded border text-[10px] font-medium flex items-center justify-center gap-1 transition-all truncate"
                              style={{
                                backgroundColor: isSelected ? hexToRgba(cat.color, 0.2) : 'rgba(15, 23, 42, 0.6)',
                                borderColor: isSelected ? cat.color : 'rgba(51, 65, 85, 0.6)',
                                color: isSelected ? cat.color : '#94a3b8',
                                boxShadow: isSelected ? `0 0 8px ${hexToRgba(cat.color, 0.3)}` : 'none',
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="truncate">{cat.label.split('・')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 優先度（天体の規模） */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-semibold">天体の規模 (優先度)</label>
                      <div className="grid grid-cols-3 gap-1">
                        {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setEditPriority(p)}
                            className={`px-1.5 py-1 rounded border text-[10px] font-medium transition-all ${
                              editPriority === p
                                ? `${PRIORITY_CONFIG[p].badge} ring-1 ring-white/20`
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {p === 'high' ? '🪐 惑星' : p === 'medium' ? '⭐ 恒星' : '✨ 小星'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 期限 & メモ */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                          <Clock className="w-2.5 h-2.5" /> 期限
                        </label>
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                          <FileText className="w-2.5 h-2.5" /> メモ
                        </label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="任意のメモ"
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-2.5 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        disabled={!editTitle.trim()}
                        className="px-3.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-[11px] shadow transition-all flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        保存する
                      </button>
                    </div>
                  </form>
                );
              }

              const catConfig = getCategoryInfo(categories, task.category);
              const priConfig = PRIORITY_CONFIG[task.priority];

              return (
                <div
                  key={task.id}
                  className={`group relative p-3 rounded-xl border transition-all duration-200 ${
                    task.completed
                      ? 'bg-slate-900/40 border-slate-800/80 hover:border-purple-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 shadow-sm hover:shadow-cyan-950/20'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* チェックボックス（タスク完了トリガー） */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`mt-0.5 flex-shrink-0 w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-gradient-to-tr from-cyan-500 to-purple-500 border-transparent text-white shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                          : 'border-slate-600 hover:border-cyan-400 text-transparent hover:text-cyan-400/50'
                      }`}
                      title={task.completed ? '未完了に戻す（星を宇宙塵に戻す）' : 'タスクを達成して星を誕生させる！'}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>

                    {/* タスク内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-medium leading-snug break-words ${
                            task.completed ? 'text-slate-400 line-through' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => startEditingTask(task)}
                            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
                            title="ミッションを編集"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (editingTaskId === task.id) cancelEditing();
                              onDeleteTask(task.id);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                            title="削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* メモ */}
                      {task.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {task.notes}
                        </p>
                      )}

                      {/* バッジ・メタ情報 */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {/* カテゴリバッジ */}
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1"
                          style={{
                            backgroundColor: hexToRgba(catConfig.color, 0.15),
                            borderColor: hexToRgba(catConfig.color, 0.4),
                            color: catConfig.color,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: catConfig.color }}
                          />
                          {catConfig.label.split('・')[0]}
                        </span>

                        {/* 優先度バッジ */}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${priConfig.badge}`}
                        >
                          +{priConfig.exp} EXP
                        </span>

                        {/* 期限 */}
                        {task.dueDate && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            {task.dueDate}
                          </span>
                        )}

                        {/* 完了日時（完了済みの場合） */}
                        {task.completed && task.completedAt && (
                          <span className="text-[10px] text-purple-300/80 flex items-center gap-0.5 ml-auto font-mono">
                            ✦ 誕生: {new Date(task.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
