'use client';

import React, { useState } from 'react';
import { Task, TaskCategory, TaskPriority, CATEGORY_CONFIG, PRIORITY_CONFIG } from '../types';
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
  Filter
} from 'lucide-react';

interface TaskPanelProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function TaskPanel({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
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

            {/* カテゴリ選択 */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">星の属性 (カテゴリ)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2 py-1.5 rounded-md border text-[10px] font-medium flex items-center justify-center gap-1 transition-all ${
                      category === cat
                        ? `${CATEGORY_CONFIG[cat].bg} ${CATEGORY_CONFIG[cat].border} ring-1 ring-white/20`
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_CONFIG[cat].color }}
                    />
                    {CATEGORY_CONFIG[cat].label.split('・')[0]}
                  </button>
                ))}
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
                onChange={(e) => setCategoryFilter(e.target.value as TaskCategory | 'all')}
                className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 text-[10px] focus:outline-none"
              >
                <option value="all">全カテゴリ</option>
                <option value="creative">創作・アート</option>
                <option value="tech">開発・IT</option>
                <option value="study">学習・読書</option>
                <option value="life">生活・健康</option>
                <option value="quest">クエスト</option>
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
              const catConfig = CATEGORY_CONFIG[task.category];
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
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-1"
                          title="削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${catConfig.bg} ${catConfig.border}`}
                        >
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
