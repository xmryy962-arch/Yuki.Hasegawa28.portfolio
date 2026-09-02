"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Lightbulb,
  KanbanSquare,
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit3,
  ExternalLink,
  Download,
  Upload,
  RotateCcw,
  Copy,
  Share2,
  Clock,
  FileText,
  X,
  Layers,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import {
  CreativeHubData,
  CreativeProject,
  CreativeIdea,
  KanbanTask,
  WorldLore,
  PlotOutline,
  ProjectStatus,
  ProjectCategory,
  IdeaCategory,
  IdeaStatus,
  TaskLane
} from './types';
import { initialCreativeData } from './sampleData';

const STORAGE_KEY = 'creative_studio_hub_data_v1';

export default function CreativeHubPage() {
  // --- データ状態 ---
  const [data, setData] = useState<CreativeHubData>(initialCreativeData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- ナビゲーション・タブ ---
  const [activeTab, setActiveTab] = useState<'projects' | 'ideas' | 'kanban' | 'lore' | 'export'>('projects');

  // --- フィルタ・検索 ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // --- モーダル管理 ---
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<CreativeProject | null>(null);

  const [ideaModalOpen, setIdeaModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<CreativeIdea | null>(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);

  const [loreModalOpen, setLoreModalOpen] = useState(false);
  const [editingLore, setEditingLore] = useState<WorldLore | null>(null);

  const [plotModalOpen, setPlotModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<PlotOutline | null>(null);

  const [detailProjectModal, setDetailProjectModal] = useState<CreativeProject | null>(null);

  // --- LocalStorage 読み込み ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // --- LocalStorage 保存 ---
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save data to localStorage', e);
      }
    }
  }, [data, isLoaded]);

  // --- トースト通知 ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- プロジェクト CRUD ---
  const handleSaveProject = (project: CreativeProject) => {
    setData((prev) => {
      const exists = prev.projects.some((p) => p.id === project.id);
      let updatedProjects: CreativeProject[];
      if (exists) {
        updatedProjects = prev.projects.map((p) =>
          p.id === project.id ? { ...project, updatedAt: new Date().toISOString().split('T')[0] } : p
        );
      } else {
        updatedProjects = [
          ...prev.projects,
          {
            ...project,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          }
        ];
      }
      return { ...prev, projects: updatedProjects };
    });
    setProjectModalOpen(false);
    setEditingProject(null);
    showToast('プロジェクトを保存しました✨');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('このプロジェクトを削除しますか？関連するタスクやアイデアの設定は維持されます。')) {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id)
      }));
      if (detailProjectModal?.id === id) {
        setDetailProjectModal(null);
      }
      showToast('プロジェクトを削除しました');
    }
  };

  // --- アイデア CRUD ---
  const handleSaveIdea = (idea: CreativeIdea) => {
    setData((prev) => {
      const exists = prev.ideas.some((i) => i.id === idea.id);
      let updated: CreativeIdea[];
      if (exists) {
        updated = prev.ideas.map((i) =>
          i.id === idea.id ? { ...idea, updatedAt: new Date().toISOString().split('T')[0] } : i
        );
      } else {
        updated = [
          {
            ...idea,
            id: `idea-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          },
          ...prev.ideas
        ];
      }
      return { ...prev, ideas: updated };
    });
    setIdeaModalOpen(false);
    setEditingIdea(null);
    showToast('アイデアを記録しました💡');
  };

  const handleQuickStatusChangeIdea = (id: string, status: IdeaStatus) => {
    setData((prev) => ({
      ...prev,
      ideas: prev.ideas.map((i) => (i.id === id ? { ...i, status, updatedAt: new Date().toISOString().split('T')[0] } : i))
    }));
    showToast('ステータスを更新しました');
  };

  const handleDeleteIdea = (id: string) => {
    setData((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((i) => i.id !== id)
    }));
    showToast('アイデアを削除しました');
  };

  // --- タスク CRUD ---
  const handleSaveTask = (task: KanbanTask) => {
    setData((prev) => {
      const exists = prev.tasks.some((t) => t.id === task.id);
      let updated: KanbanTask[];
      if (exists) {
        updated = prev.tasks.map((t) =>
          t.id === task.id ? { ...task, updatedAt: new Date().toISOString().split('T')[0] } : t
        );
      } else {
        updated = [
          ...prev.tasks,
          {
            ...task,
            id: `task-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          }
        ];
      }
      return { ...prev, tasks: updated };
    });
    setTaskModalOpen(false);
    setEditingTask(null);
    showToast('タスクを保存しました📋');
  };

  const handleMoveTaskLane = (taskId: string, direction: 'prev' | 'next') => {
    const lanes: TaskLane[] = ['idea', 'plot', 'rough', 'production', 'review', 'done'];
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const currentIdx = lanes.indexOf(t.lane);
        const targetIdx = direction === 'next' ? Math.min(lanes.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
        return {
          ...t,
          lane: lanes[targetIdx],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    }));
  };

  const handleDeleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id)
    }));
    showToast('タスクを削除しました');
  };

  // --- 設定・用語 (Lore) CRUD ---
  const handleSaveLore = (lore: WorldLore) => {
    setData((prev) => {
      const exists = prev.lores.some((l) => l.id === lore.id);
      let updated: WorldLore[];
      if (exists) {
        updated = prev.lores.map((l) =>
          l.id === lore.id ? { ...lore, updatedAt: new Date().toISOString().split('T')[0] } : l
        );
      } else {
        updated = [
          ...prev.lores,
          {
            ...lore,
            id: `lore-${Date.now()}`,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        ];
      }
      return { ...prev, lores: updated };
    });
    setLoreModalOpen(false);
    setEditingLore(null);
    showToast('世界観設定を保存しました📖');
  };

  const handleDeleteLore = (id: string) => {
    setData((prev) => ({
      ...prev,
      lores: prev.lores.filter((l) => l.id !== id)
    }));
    showToast('設定を削除しました');
  };

  // --- プロット (Plot) CRUD ---
  const handleSavePlot = (plot: PlotOutline) => {
    setData((prev) => {
      const exists = prev.plots.some((p) => p.id === plot.id);
      let updated: PlotOutline[];
      if (exists) {
        updated = prev.plots.map((p) =>
          p.id === plot.id ? { ...plot, updatedAt: new Date().toISOString().split('T')[0] } : p
        );
      } else {
        updated = [
          ...prev.plots,
          {
            ...plot,
            id: `plot-${Date.now()}`,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        ];
      }
      return { ...prev, plots: updated };
    });
    setPlotModalOpen(false);
    setEditingPlot(null);
    showToast('プロットを保存しました🎬');
  };

  const handleDeletePlot = (id: string) => {
    setData((prev) => ({
      ...prev,
      plots: prev.plots.filter((p) => p.id !== id)
    }));
    showToast('プロットを削除しました');
  };

  // --- データリセット・インポート・エクスポート ---
  const handleResetToSample = () => {
    if (confirm('サンプルデータに初期化しますか？現在のデータは上書きされます。')) {
      setData(initialCreativeData);
      showToast('サンプルデータを復元しました');
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSONファイルをダウンロードしました');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.projects && parsed.ideas) {
          setData(parsed);
          showToast('データを正常にインポートしました🎉');
        } else {
          alert('ファイルの形式が正しくありません。');
        }
      } catch (err) {
        alert('JSONの解析に失敗しました。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- 全体Markdown生成 ---
  const generateMarkdownSummary = () => {
    let md = `# 創作プロジェクト・アイデア管理まとめ\n\n`;
    md += `*出力日時: ${new Date().toLocaleString('ja-JP')}*\n\n`;

    md += `## 1. 進行中プロジェクト一覧 (${data.projects.length}件)\n\n`;
    data.projects.forEach((p, idx) => {
      md += `### ${idx + 1}. ${p.title} (${categoryLabels[p.category]?.label || p.category})\n`;
      if (p.subtitle) md += `*${p.subtitle}*\n\n`;
      md += `- **ステータス**: ${statusLabels[p.status]?.label || p.status} (進捗 ${p.progressPercent}%)\n`;
      if (p.targetDeadline) md += `- **目標締切**: ${p.targetDeadline}\n`;
      md += `- **概要**: ${p.summary}\n`;
      md += `- **コンセプト・世界観**: \n  ${p.concept.replace(/\n/g, '\n  ')}\n`;
      md += `- **タグ**: ${p.tags.join(', ')}\n\n`;
    });

    md += `## 2. ストックアイデア (${data.ideas.length}件)\n\n`;
    data.ideas.forEach((idea) => {
      const proj = data.projects.find((p) => p.id === idea.projectId);
      const cat = ideaCategoryLabels[idea.category]?.label || idea.category;
      const stat = ideaStatusLabels[idea.status]?.label || idea.status;
      md += `### [${cat}] ${idea.title} (${stat})\n`;
      if (proj) md += `*関連PJ: ${proj.title}*\n\n`;
      md += `${idea.content}\n\n`;
      if (idea.inspirationSource) md += `> 発想メモ: ${idea.inspirationSource}\n\n`;
      md += `- タグ: ${idea.tags.join(', ')}\n\n`;
    });

    md += `## 3. 世界観・用語集 (${data.lores.length}件)\n\n`;
    data.lores.forEach((l) => {
      const proj = data.projects.find((p) => p.id === l.projectId);
      md += `### 【${l.term}】 (${l.category})\n`;
      if (proj) md += `*対象PJ: ${proj.title}*\n\n`;
      md += `${l.description}\n\n`;
      if (l.secretNotes) md += `> 🔒 裏設定・伏線: ${l.secretNotes}\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownSummary();
    navigator.clipboard.writeText(md);
    showToast('Markdownをクリップボードにコピーしました📋');
  };

  // --- ヘルパーマッピング（白基調・高コントラストデザイン） ---
  const categoryLabels: Record<ProjectCategory, { label: string; bg: string; text: string; border: string }> = {
    illustration: { label: 'イラスト集・画集', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    comic: { label: '漫画・Webtoon', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    game: { label: 'ゲーム企画', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    novel: { label: '小説・シナリオ', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    goods: { label: 'グッズ・企画', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    other: { label: 'その他創作', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' }
  };

  const statusLabels: Record<ProjectStatus, { label: string; bg: string; text: string; border: string }> = {
    concept: { label: '構想中', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
    planning: { label: '企画・プロット中', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    in_progress: { label: '制作進行中', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    polishing: { label: '仕上げ・校正中', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    completed: { label: '完成・頒布中', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    archived: { label: 'アーカイブ', bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-300' }
  };

  const ideaCategoryLabels: Record<IdeaCategory, { label: string; icon: string }> = {
    worldview: { label: '世界観・設定', icon: '🌌' },
    plot: { label: 'プロット・展開', icon: '📜' },
    character: { label: 'キャラ・セリフ', icon: '👤' },
    visual: { label: 'ビジュアル・構図', icon: '🎨' },
    gimmick: { label: 'ギミック・小ネタ', icon: '⚙️' },
    general: { label: '雑記・思いつき', icon: '💭' }
  };

  const ideaStatusLabels: Record<IdeaStatus, { label: string; badge: string }> = {
    spark: { label: 'ひらめき💡', badge: 'bg-amber-50 text-amber-800 border-amber-300' },
    reviewing: { label: '検討中🤔', badge: 'bg-blue-50 text-blue-800 border-blue-300' },
    accepted: { label: '採用確定✨', badge: 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold' },
    shelved: { label: '保留中📦', badge: 'bg-slate-100 text-slate-600 border-slate-300' }
  };

  const kanbanLaneConfig: Record<TaskLane, { label: string; icon: string; desc: string; topBorder: string }> = {
    idea: { label: 'アイデア・構想', icon: '💡', desc: 'ネタ出し・検討', topBorder: 'border-t-amber-400' },
    plot: { label: 'プロット・構成', icon: '📝', desc: 'ネーム・章立て', topBorder: 'border-t-indigo-400' },
    rough: { label: 'ネーム・下書き', icon: '✏️', desc: 'ラフ画・素案', topBorder: 'border-t-blue-500' },
    production: { label: '本制作・執筆', icon: '🎨', desc: '線画・着色・執筆', topBorder: 'border-t-purple-500' },
    review: { label: '仕上げ・校正', icon: '🔍', desc: '調整・校正', topBorder: 'border-t-rose-400' },
    done: { label: '完了・公開', icon: '✨', desc: '頒布・完了', topBorder: 'border-t-emerald-500' }
  };

  // --- フィルタ済みアイテム ---
  const filteredProjects = useMemo(() => {
    return data.projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
      const matchStat = selectedStatusFilter === 'all' || p.status === selectedStatusFilter;
      return matchSearch && matchCat && matchStat;
    });
  }, [data.projects, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

  const filteredIdeas = useMemo(() => {
    return data.ideas.filter((i) => {
      const matchSearch =
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchProj = selectedProjectFilter === 'all' || i.projectId === selectedProjectFilter;
      const matchCat = selectedCategoryFilter === 'all' || i.category === selectedCategoryFilter;
      const matchStat = selectedStatusFilter === 'all' || i.status === selectedStatusFilter;
      return matchSearch && matchProj && matchCat && matchStat;
    });
  }, [data.ideas, searchQuery, selectedProjectFilter, selectedCategoryFilter, selectedStatusFilter]);

  const filteredTasks = useMemo(() => {
    return data.tasks.filter((t) => {
      const matchProj = selectedProjectFilter === 'all' || t.projectId === selectedProjectFilter;
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchProj && matchSearch;
    });
  }, [data.tasks, selectedProjectFilter, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-8 font-sans">
      {/* トースト通知 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ナビゲーション・ヘッダー（白基調カード） */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <Link 
              href="/"
              className="text-xs text-blue-600 hover:underline font-medium inline-flex items-center gap-1 mb-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ポートフォリオトップへ戻る</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <span>🎨</span>
              <span>創作プロジェクト管理 ＆ アイデア整理ハブ</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              イラスト集・同人誌・コミック・ゲーム企画・シナリオの進捗管理、アイデア発想・世界観設定・プロット章立てを一元化できる創作支援ツール
            </p>
          </div>

          {/* クイックアクションボタン */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => {
                setEditingIdea({
                  id: '',
                  title: '',
                  content: '',
                  category: 'worldview',
                  status: 'spark',
                  tags: [],
                  createdAt: '',
                  updatedAt: ''
                });
                setIdeaModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-xl transition shadow-xs"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>アイデアを記録</span>
            </button>
            <button
              onClick={() => {
                setEditingProject({
                  id: `proj-${Date.now()}`,
                  title: '',
                  category: 'illustration',
                  status: 'concept',
                  summary: '',
                  concept: '',
                  progressPercent: 0,
                  color: '#3b82f6',
                  tags: [],
                  createdAt: '',
                  updatedAt: ''
                });
                setProjectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>新規プロジェクト</span>
            </button>
          </div>
        </header>

        {/* 統計サマリーカード（白基調） */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">制作プロジェクト</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{data.projects.length} <span className="text-xs font-normal text-slate-500">件</span></span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">ストックアイデア</span>
              <span className="text-2xl font-black text-amber-600 mt-0.5 block">{data.ideas.length} <span className="text-xs font-normal text-slate-500">件</span></span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">進行中タスク</span>
              <span className="text-2xl font-black text-indigo-600 mt-0.5 block">{data.tasks.filter(t => t.lane !== 'done').length} <span className="text-xs font-normal text-slate-500">件</span></span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <KanbanSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">世界観・プロット</span>
              <span className="text-2xl font-black text-purple-600 mt-0.5 block">{data.lores.length + data.plots.length} <span className="text-xs font-normal text-slate-500">件</span></span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* タブナビゲーションバー（白基調） */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>プロジェクト ({data.projects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'ideas'
                  ? 'bg-white text-amber-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>アイデア整理 ({data.ideas.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'kanban'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <KanbanSquare className="w-4 h-4" />
              <span>創作カンバン ({data.tasks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('lore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'lore'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>世界観＆プロット ({data.lores.length + data.plots.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'export'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>保存・エクスポート</span>
            </button>
          </nav>

          {/* 検索入力欄 */}
          <div className="relative flex-1 sm:w-64 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="キーワードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-2 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. プロジェクト一覧タブ */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* フィルタバー */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-600 font-semibold">絞り込み:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">すべてのカテゴリ</option>
                  <option value="illustration">イラスト集・画集</option>
                  <option value="comic">漫画・Webtoon</option>
                  <option value="game">ゲーム企画</option>
                  <option value="novel">小説・シナリオ</option>
                  <option value="goods">グッズ・企画</option>
                  <option value="other">その他創作</option>
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="concept">構想中</option>
                  <option value="planning">企画・プロット中</option>
                  <option value="in_progress">制作進行中</option>
                  <option value="polishing">仕上げ・校正中</option>
                  <option value="completed">完成・頒布中</option>
                </select>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                表示中: <strong className="text-slate-900 font-bold">{filteredProjects.length}</strong> 件
              </span>
            </div>

            {/* プロジェクトカードグリッド */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const projIdeas = data.ideas.filter((i) => i.projectId === project.id);
                const projTasks = data.tasks.filter((t) => t.projectId === project.id);
                const projLores = data.lores.filter((l) => l.projectId === project.id);
                const catInfo = categoryLabels[project.category] || categoryLabels.other;
                const statInfo = statusLabels[project.status] || statusLabels.concept;

                return (
                  <div
                    key={project.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs"
                    style={{ borderTop: `4px solid ${project.color || '#3b82f6'}` }}
                  >
                    <div className="space-y-3.5">
                      {/* カテゴリ & ステータスバッジ */}
                      <div className="flex items-center justify-between text-[11px] gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold border ${catInfo.bg} ${catInfo.text} ${catInfo.border}`}>
                          {catInfo.label}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold border ${statInfo.bg} ${statInfo.text} ${statInfo.border}`}>
                          {statInfo.label}
                        </span>
                      </div>

                      {/* タイトル＆サブタイトル */}
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                          {project.title}
                        </h3>
                        {project.subtitle && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
                            {project.subtitle}
                          </p>
                        )}
                      </div>

                      {/* 概要 */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {project.summary}
                      </p>

                      {/* 進捗バー */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                          <span>制作進捗</span>
                          <span className="font-bold text-slate-900">{project.progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${project.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* 関連データ数カウント */}
                      <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-medium" title="関連アイデア">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          {projIdeas.length}
                        </span>
                        <span className="flex items-center gap-1 font-medium" title="タスク">
                          <KanbanSquare className="w-3.5 h-3.5 text-indigo-500" />
                          {projTasks.length}
                        </span>
                        <span className="flex items-center gap-1 font-medium" title="世界観・設定">
                          <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                          {projLores.length}
                        </span>
                        {project.targetDeadline && (
                          <span className="flex items-center gap-1 ml-auto text-slate-500 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-rose-500" />
                            {project.targetDeadline}
                          </span>
                        )}
                      </div>

                      {/* タグ */}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {project.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* アクションボタン */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setDetailProjectModal(project)}
                        className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>詳細・設定を開く</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setProjectModalOpen(true);
                        }}
                        className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                        title="編集"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
                        title="削除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 text-sm font-semibold">該当するプロジェクトがありません</p>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('all');
                    setSelectedStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs text-blue-600 font-bold hover:underline"
                >
                  フィルターをリセットする
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. アイデア整理ノート (Idea Canvas) */}
        {/* ======================================================== */}
        {activeTab === 'ideas' && (
          <div className="space-y-6">
            {/* フィルタ & 新規追加 */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedProjectFilter}
                  onChange={(e) => setSelectedProjectFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">すべてのプロジェクト</option>
                  {data.projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">すべてのネタ種別</option>
                  <option value="worldview">🌌 世界観・設定</option>
                  <option value="plot">📜 プロット・展開</option>
                  <option value="character">👤 キャラ・セリフ</option>
                  <option value="visual">🎨 ビジュアル・構図</option>
                  <option value="gimmick">⚙️ ギミック・小ネタ</option>
                  <option value="general">💭 雑記・思いつき</option>
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="spark">💡 ひらめき</option>
                  <option value="reviewing">🤔 検討中</option>
                  <option value="accepted">✨ 採用確定</option>
                  <option value="shelved">📦 保留</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingIdea({
                    id: '',
                    projectId: selectedProjectFilter !== 'all' ? selectedProjectFilter : undefined,
                    title: '',
                    content: '',
                    category: 'worldview',
                    status: 'spark',
                    tags: [],
                    createdAt: '',
                    updatedAt: ''
                  });
                  setIdeaModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新しいアイデアを追加</span>
              </button>
            </div>

            {/* アイデアカード一覧 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIdeas.map((idea) => {
                const proj = data.projects.find((p) => p.id === idea.projectId);
                const catLabel = ideaCategoryLabels[idea.category] || ideaCategoryLabels.general;

                return (
                  <div
                    key={idea.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-3.5 hover:border-amber-400 hover:shadow-md transition shadow-xs"
                    style={{ borderLeft: `5px solid ${idea.color || '#f59e0b'}` }}
                  >
                    <div className="space-y-2.5">
                      {/* カテゴリ & プロジェクト */}
                      <div className="flex items-center justify-between text-[11px] gap-2">
                        <span className="flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          <span>{catLabel.icon}</span>
                          <span>{catLabel.label}</span>
                        </span>
                        {proj ? (
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold truncate max-w-[130px]">
                            {proj.title}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">全体アイデア</span>
                        )}
                      </div>

                      {/* タイトル */}
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {idea.title}
                      </h4>

                      {/* 内容 */}
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        {idea.content}
                      </p>

                      {/* 発想メモ */}
                      {idea.inspirationSource && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200 flex items-start gap-1">
                          <span className="text-amber-600 font-bold">💡</span>
                          <span>{idea.inspirationSource}</span>
                        </p>
                      )}

                      {/* タグ */}
                      {idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {idea.tags.map((t, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200 font-medium">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ステータス変更＆アクションバー */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* クイックステータス切り替え */}
                      <div className="flex items-center gap-1">
                        {(['spark', 'reviewing', 'accepted', 'shelved'] as IdeaStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleQuickStatusChangeIdea(idea.id, st)}
                            className={`px-2 py-1 text-[10px] rounded-md transition border font-bold ${
                              idea.status === st
                                ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-2xs'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                            title={ideaStatusLabels[st].label}
                          >
                            {st === 'spark' && '💡'}
                            {st === 'reviewing' && '🤔'}
                            {st === 'accepted' && '✨'}
                            {st === 'shelved' && '📦'}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingIdea(idea);
                            setIdeaModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                          title="編集"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteIdea(idea.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                          title="削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredIdeas.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 text-sm font-semibold">アイデアがまだありません</p>
                <button
                  onClick={() => {
                    setEditingIdea({
                      id: '',
                      title: '',
                      content: '',
                      category: 'worldview',
                      status: 'spark',
                      tags: [],
                      createdAt: '',
                      updatedAt: ''
                    });
                    setIdeaModalOpen(true);
                  }}
                  className="mt-3 text-xs text-amber-600 font-bold hover:underline"
                >
                  最初のアイデアを記録する →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. 創作カンバン (Creative Kanban) */}
        {/* ======================================================== */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            {/* フィルタ & タスク追加 */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-600 font-semibold">プロジェクト選択:</span>
                <select
                  value={selectedProjectFilter}
                  onChange={(e) => setSelectedProjectFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">すべてのプロジェクトのタスク</option>
                  {data.projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingTask({
                    id: '',
                    projectId: selectedProjectFilter !== 'all' ? selectedProjectFilter : (data.projects[0]?.id || ''),
                    title: '',
                    lane: 'idea',
                    priority: 'medium',
                    createdAt: '',
                    updatedAt: ''
                  });
                  setTaskModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>タスクを追加</span>
              </button>
            </div>

            {/* 6レーンカンバン */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {(['idea', 'plot', 'rough', 'production', 'review', 'done'] as TaskLane[]).map((laneKey) => {
                const laneConf = kanbanLaneConfig[laneKey];
                const laneTasks = filteredTasks.filter((t) => t.lane === laneKey);

                return (
                  <div
                    key={laneKey}
                    className={`bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between min-h-[480px] shadow-xs ${laneConf.topBorder} border-t-4`}
                  >
                    <div>
                      {/* レーンヘッダー */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span>{laneConf.icon}</span>
                          <h4 className="text-xs font-bold text-slate-800">{laneConf.label}</h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                          {laneTasks.length}
                        </span>
                      </div>

                      {/* タスクカード群 */}
                      <div className="space-y-2.5">
                        {laneTasks.map((task) => {
                          const proj = data.projects.find((p) => p.id === task.projectId);

                          return (
                            <div
                              key={task.id}
                              className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-xs hover:border-indigo-400 hover:shadow-sm transition group"
                            >
                              {/* プロジェクト名 & 優先度 */}
                              <div className="flex items-center justify-between text-[10px] gap-1">
                                {proj && (
                                  <span className="font-bold text-blue-700 truncate max-w-[100px]">
                                    {proj.title}
                                  </span>
                                )}
                                <span
                                  className={`px-1.5 py-0.5 rounded font-bold ${
                                    task.priority === 'high'
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                      : task.priority === 'medium'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}
                                >
                                  {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                                </span>
                              </div>

                              {/* タイトル */}
                              <h5 className="text-xs font-bold text-slate-900 leading-snug">
                                {task.title}
                              </h5>

                              {/* 説明 */}
                              {task.description && (
                                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-1.5 rounded border border-slate-100">
                                  {task.description}
                                </p>
                              )}

                              {/* 期日 */}
                              {task.dueDate && (
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                  <Clock className="w-3 h-3 text-indigo-500" />
                                  <span>{task.dueDate}</span>
                                </div>
                              )}

                              {/* アクションバー（レーン移動） */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <button
                                  onClick={() => handleMoveTaskLane(task.id, 'prev')}
                                  disabled={laneKey === 'idea'}
                                  className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:hover:text-slate-400"
                                  title="前工程へ"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingTask(task);
                                      setTaskModalOpen(true);
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-800"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-1 text-rose-500 hover:text-rose-700"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleMoveTaskLane(task.id, 'next')}
                                  disabled={laneKey === 'done'}
                                  className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:hover:text-slate-400"
                                  title="次工程へ"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {laneTasks.length === 0 && (
                          <div className="py-8 text-center text-slate-400 text-[11px] font-medium">
                            タスクなし
                          </div>
                        )}
                      </div>
                    </div>

                    {/* レーン下部の追加ボタン */}
                    <button
                      onClick={() => {
                        setEditingTask({
                          id: '',
                          projectId: selectedProjectFilter !== 'all' ? selectedProjectFilter : (data.projects[0]?.id || ''),
                          title: '',
                          lane: laneKey,
                          priority: 'medium',
                          createdAt: '',
                          updatedAt: ''
                        });
                        setTaskModalOpen(true);
                      }}
                      className="mt-3 w-full py-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-1 transition shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>タスク追加</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. 世界観＆プロット (Lore & Plot) */}
        {/* ======================================================== */}
        {activeTab === 'lore' && (
          <div className="space-y-8">
            {/* プロジェクト切り替え */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-slate-600 font-semibold">対象プロジェクト:</span>
                <select
                  value={selectedProjectFilter}
                  onChange={(e) => setSelectedProjectFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">すべてのプロジェクト</option>
                  {data.projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingLore({
                      id: '',
                      projectId: selectedProjectFilter !== 'all' ? selectedProjectFilter : (data.projects[0]?.id || ''),
                      term: '',
                      category: '魔法・鉱石',
                      description: '',
                      updatedAt: ''
                    });
                    setLoreModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 font-bold text-xs rounded-xl transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>用語・設定を追加</span>
                </button>
                <button
                  onClick={() => {
                    setEditingPlot({
                      id: '',
                      projectId: selectedProjectFilter !== 'all' ? selectedProjectFilter : (data.projects[0]?.id || ''),
                      chapterNumber: data.plots.length + 1,
                      title: '',
                      phase: 'introduction',
                      summary: '',
                      keyEvents: [],
                      updatedAt: ''
                    });
                    setPlotModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>章プロットを追加</span>
                </button>
              </div>
            </div>

            {/* 1. 世界観・設定用語集 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>🌌</span> 世界観・用語事典 (Lore & Glossary)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {data.lores.filter(l => selectedProjectFilter === 'all' || l.projectId === selectedProjectFilter).length} 項目
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.lores
                  .filter(l => selectedProjectFilter === 'all' || l.projectId === selectedProjectFilter)
                  .map((lore) => {
                    const proj = data.projects.find((p) => p.id === lore.projectId);

                    return (
                      <div
                        key={lore.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition shadow-xs"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                              {lore.category}
                            </span>
                            {proj && (
                              <span className="text-slate-500 font-medium truncate max-w-[120px]">
                                {proj.title}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-extrabold text-slate-900">
                            {lore.term}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {lore.description}
                          </p>

                          {lore.secretNotes && (
                            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-[11px] text-purple-900 space-y-1">
                              <span className="font-bold flex items-center gap-1 text-purple-700">
                                <span>🔒</span> 裏設定・伏線メモ:
                              </span>
                              <p className="leading-relaxed">{lore.secretNotes}</p>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingLore(lore);
                              setLoreModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLore(lore.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 2. 章立てプロット・タイムライン */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>📜</span> 章立て・プロットタイムライン (Plot Outline)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {data.plots.filter(p => selectedProjectFilter === 'all' || p.projectId === selectedProjectFilter).length} 章
                </span>
              </div>

              <div className="space-y-4">
                {data.plots
                  .filter(p => selectedProjectFilter === 'all' || p.projectId === selectedProjectFilter)
                  .sort((a, b) => a.chapterNumber - b.chapterNumber)
                  .map((plot) => {
                    const proj = data.projects.find((p) => p.id === plot.projectId);
                    const phaseColors = {
                      introduction: 'bg-emerald-50 text-emerald-700 border-emerald-300',
                      development: 'bg-blue-50 text-blue-700 border-blue-300',
                      twist: 'bg-amber-50 text-amber-700 border-amber-300',
                      climax: 'bg-rose-50 text-rose-700 border-rose-300',
                      resolution: 'bg-purple-50 text-purple-700 border-purple-300'
                    };

                    const phaseLabels = {
                      introduction: '起（導入）',
                      development: '承（展開）',
                      twist: '転（転換・波乱）',
                      climax: '結（クライマックス）',
                      resolution: 'エピローグ（後日談）'
                    };

                    return (
                      <div
                        key={plot.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 hover:border-blue-300 hover:shadow-md transition shadow-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                              {plot.chapterNumber}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900">
                              {plot.title}
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${phaseColors[plot.phase]}`}>
                              {phaseLabels[plot.phase]}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {proj && (
                              <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-bold">
                                {proj.title}
                              </span>
                            )}
                            <button
                              onClick={() => {
                                setEditingPlot(plot);
                                setPlotModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePlot(plot.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {plot.summary}
                        </p>

                        {/* 主要イベント */}
                        {plot.keyEvents && plot.keyEvents.length > 0 && (
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-800 block">⚡ 主な出来事・シーン:</span>
                            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                              {plot.keyEvents.map((evt, idx) => (
                                <li key={idx}>{evt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 伏線メモ */}
                        {plot.foreshadowingNotes && (
                          <p className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5 font-medium">
                            <span className="font-bold text-amber-700">💡 伏線・回収メモ:</span>
                            <span>{plot.foreshadowingNotes}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. まとめ・保存・エクスポート (Export & Data) */}
        {/* ======================================================== */}
        {activeTab === 'export' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  データの出力・バックアップ・共有
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ブラウザのLocalStorageに自動保存されている創作プロジェクト・アイデア・設定・タスクデータを自由にバックアップおよびMarkdown形式で書き出せます。
                </p>
              </div>

              {/* アクションボタン群 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <button
                  onClick={handleCopyMarkdown}
                  className="p-5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl text-left space-y-2.5 transition group shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Copy className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    Markdownをコピー
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    全プロジェクトとアイデア・設定を整理したMarkdownテキストをクリップボードにコピーします。
                  </p>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="p-5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-400 rounded-2xl text-left space-y-2.5 transition group shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                    JSONバックアップ保存
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    全データをJSON形式でPCにダウンロードします。別端末への移行や復元に使えます。
                  </p>
                </button>

                <label className="p-5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 rounded-2xl text-left space-y-2.5 transition group cursor-pointer shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                    JSON復元・インポート
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    保存したJSONファイルを選択してデータを復元します。
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>

              {/* サンプルデータ復元 */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">
                  初期のデモデータ（星導のエクリプス等）に戻したい場合：
                </span>
                <button
                  onClick={handleResetToSample}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold rounded-xl transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>サンプルデータにリセット</span>
                </button>
              </div>
            </div>

            {/* プレビューエリア */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Markdown出力プレビュー
                </h4>
                <button
                  onClick={handleCopyMarkdown}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>コピー</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed whitespace-pre-wrap">
                {generateMarkdownSummary()}
              </pre>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* モーダル: プロジェクト詳細ビュー */}
      {/* ======================================================== */}
      {detailProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl text-slate-800">
            {/* ヘッダー */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {categoryLabels[detailProjectModal.category]?.label || '創作企画'}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-2">
                  {detailProjectModal.title}
                </h2>
                {detailProjectModal.subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{detailProjectModal.subtitle}</p>
                )}
              </div>
              <button
                onClick={() => setDetailProjectModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 進捗 & 概要 */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200">
                <div className="flex justify-between text-slate-700 font-semibold">
                  <span>制作進捗率</span>
                  <span className="font-bold text-slate-900">{detailProjectModal.progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${detailProjectModal.progressPercent}%` }}
                  />
                </div>
                {detailProjectModal.targetDeadline && (
                  <div className="text-slate-500 pt-1 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>目標締切: {detailProjectModal.targetDeadline}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-1">【概要・ストーリー要約】</h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {detailProjectModal.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-1">【企画コンセプト・世界観テーマ】</h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {detailProjectModal.concept}
                </p>
              </div>

              {/* 外部リンク */}
              {detailProjectModal.links && detailProjectModal.links.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-700 mb-2">【関連リンク・ツール】</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailProjectModal.links.map((lnk, idx) => (
                      <Link
                        key={idx}
                        href={lnk.url}
                        target={lnk.url.startsWith('http') ? '_blank' : undefined}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition font-bold"
                      >
                        <span>{lnk.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 紐づくアイデア */}
              <div>
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>このプロジェクトのアイデアストック ({data.ideas.filter(i => i.projectId === detailProjectModal.id).length}件)</span>
                </h4>
                <div className="space-y-2">
                  {data.ideas.filter(i => i.projectId === detailProjectModal.id).map(idea => (
                    <div key={idea.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{idea.title}</span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{ideaStatusLabels[idea.status]?.label}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{idea.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* フッター */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingProject(detailProjectModal);
                  setDetailProjectModal(null);
                  setProjectModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                プロジェクトを編集
              </button>
              <button
                onClick={() => setDetailProjectModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* モーダル: プロジェクト編集・新規作成 */}
      {/* ======================================================== */}
      {projectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingProject.id.startsWith('proj-') && editingProject.title ? 'プロジェクトを編集' : '新規プロジェクト作成'}
              </h3>
              <button onClick={() => setProjectModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">プロジェクト名 *</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="例: 星導のエクリプス"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">サブタイトル・キャッチコピー</label>
                <input
                  type="text"
                  value={editingProject.subtitle || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  placeholder="例: 星の魔導器と古の遺跡をめぐる幻想ファンタジー設定集"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">カテゴリ</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="illustration">イラスト集・画集</option>
                    <option value="comic">漫画・Webtoon</option>
                    <option value="game">ゲーム企画</option>
                    <option value="novel">小説・シナリオ</option>
                    <option value="goods">グッズ・企画</option>
                    <option value="other">その他創作</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ステータス</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="concept">構想中</option>
                    <option value="planning">企画・プロット中</option>
                    <option value="in_progress">制作進行中</option>
                    <option value="polishing">仕上げ・校正中</option>
                    <option value="completed">完成・頒布中</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">作品の概要・ストーリー</label>
                <textarea
                  rows={3}
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  placeholder="作品全体のストーリーや世界観のあらすじ..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">企画コンセプト・テーマ・ターゲット</label>
                <textarea
                  rows={3}
                  value={editingProject.concept}
                  onChange={(e) => setEditingProject({ ...editingProject, concept: e.target.value })}
                  placeholder="ターゲット読者、世界観のこだわり、頒布目標など..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">進捗率 (%) : {editingProject.progressPercent}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingProject.progressPercent}
                    onChange={(e) => setEditingProject({ ...editingProject, progressPercent: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">目標締切日</label>
                  <input
                    type="date"
                    value={editingProject.targetDeadline || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, targetDeadline: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">タグ (カンマ区切り)</label>
                <input
                  type="text"
                  value={editingProject.tags.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    })
                  }
                  placeholder="例: ファンタジー, イラスト本, キャラデザ"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setProjectModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
              >
                キャンセル
              </button>
              <button
                disabled={!editingProject.title.trim()}
                onClick={() => handleSaveProject(editingProject)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* モーダル: アイデア追加・編集 */}
      {/* ======================================================== */}
      {ideaModalOpen && editingIdea && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>アイデアの記録・編集</span>
              </h3>
              <button onClick={() => setIdeaModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">アイデアタイトル *</label>
                <input
                  type="text"
                  value={editingIdea.title}
                  onChange={(e) => setEditingIdea({ ...editingIdea, title: e.target.value })}
                  placeholder="例: 感情で光が変化する星鉱石のランタン"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">カテゴリ</label>
                  <select
                    value={editingIdea.category}
                    onChange={(e) => setEditingIdea({ ...editingIdea, category: e.target.value as IdeaCategory })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="worldview">🌌 世界観・設定</option>
                    <option value="plot">📜 プロット・展開</option>
                    <option value="character">👤 キャラ・セリフ</option>
                    <option value="visual">🎨 ビジュアル・構図</option>
                    <option value="gimmick">⚙️ ギミック・小ネタ</option>
                    <option value="general">💭 雑記・思いつき</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">関連プロジェクト</label>
                  <select
                    value={editingIdea.projectId || ''}
                    onChange={(e) => setEditingIdea({ ...editingIdea, projectId: e.target.value || undefined })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="">未指定（全体アイデア）</option>
                    {data.projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">アイデア詳細・メモ *</label>
                <textarea
                  rows={4}
                  value={editingIdea.content}
                  onChange={(e) => setEditingIdea({ ...editingIdea, content: e.target.value })}
                  placeholder="思いついた設定、セリフ、演出、ギミックなどを自由に記述..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-amber-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">発想のきっかけ・インスピレーションメモ</label>
                <input
                  type="text"
                  value={editingIdea.inspirationSource || ''}
                  onChange={(e) => setEditingIdea({ ...editingIdea, inspirationSource: e.target.value })}
                  placeholder="例: 夜景を見ていて / アクリル印刷のフェアを見て"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ステータス</label>
                  <select
                    value={editingIdea.status}
                    onChange={(e) => setEditingIdea({ ...editingIdea, status: e.target.value as IdeaStatus })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="spark">💡 ひらめき</option>
                    <option value="reviewing">🤔 検討中</option>
                    <option value="accepted">✨ 採用確定</option>
                    <option value="shelved">📦 保留</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">タグ (カンマ区切り)</label>
                  <input
                    type="text"
                    value={editingIdea.tags.join(', ')}
                    onChange={(e) =>
                      setEditingIdea({
                        ...editingIdea,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                      })
                    }
                    placeholder="例: アイテム, 名言"
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIdeaModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
              >
                キャンセル
              </button>
              <button
                disabled={!editingIdea.title.trim() || !editingIdea.content.trim()}
                onClick={() => handleSaveIdea(editingIdea)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* モーダル: タスク追加・編集 */}
      {/* ======================================================== */}
      {taskModalOpen && editingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <KanbanSquare className="w-4 h-4 text-indigo-600" />
                <span>タスク編集</span>
              </h3>
              <button onClick={() => setTaskModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">タスク名 *</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="例: 表紙イラストのラフ3案作成"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">対象プロジェクト *</label>
                  <select
                    value={editingTask.projectId}
                    onChange={(e) => setEditingTask({ ...editingTask, projectId: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    {data.projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">工程 (レーン)</label>
                  <select
                    value={editingTask.lane}
                    onChange={(e) => setEditingTask({ ...editingTask, lane: e.target.value as TaskLane })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="idea">💡 アイデア・構想</option>
                    <option value="plot">📝 プロット・構成</option>
                    <option value="rough">✏️ ネーム・下書き</option>
                    <option value="production">🎨 本制作・執筆</option>
                    <option value="review">🔍 仕上げ・校正</option>
                    <option value="done">✨ 完了・公開</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">詳細説明・作業メモ</label>
                <textarea
                  rows={3}
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="作業内容、チェック項目など..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">優先度</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="high">高 (優先)</option>
                    <option value="medium">中 (通常)</option>
                    <option value="low">低 (余裕あり)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">締切日</label>
                  <input
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setTaskModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
              >
                キャンセル
              </button>
              <button
                disabled={!editingTask.title.trim()}
                onClick={() => handleSaveTask(editingTask)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* モーダル: 世界観設定 (Lore) 追加・編集 */}
      {/* ======================================================== */}
      {loreModalOpen && editingLore && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>世界観・設定用語の編集</span>
              </h3>
              <button onClick={() => setLoreModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">用語・設定名 *</label>
                <input
                  type="text"
                  value={editingLore.term}
                  onChange={(e) => setEditingLore({ ...editingLore, term: e.target.value })}
                  placeholder="例: アストラル・コア（星核石）"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">対象プロジェクト</label>
                  <select
                    value={editingLore.projectId}
                    onChange={(e) => setEditingLore({ ...editingLore, projectId: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    {data.projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">カテゴリ種別</label>
                  <input
                    type="text"
                    value={editingLore.category}
                    onChange={(e) => setEditingLore({ ...editingLore, category: e.target.value })}
                    placeholder="例: 魔法・鉱石 / 地理 / 組織"
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">設定の説明 *</label>
                <textarea
                  rows={3}
                  value={editingLore.description}
                  onChange={(e) => setEditingLore({ ...editingLore, description: e.target.value })}
                  placeholder="作中での公開設定・基礎知識..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-purple-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-purple-900 font-bold mb-1">🔒 裏設定・伏線メモ（作者用）</label>
                <textarea
                  rows={2}
                  value={editingLore.secretNotes || ''}
                  onChange={(e) => setEditingLore({ ...editingLore, secretNotes: e.target.value })}
                  placeholder="物語後半で明かされる真実や伏線..."
                  className="w-full bg-purple-50 border border-purple-200 text-purple-950 rounded-xl p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setLoreModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
              >
                キャンセル
              </button>
              <button
                disabled={!editingLore.term.trim() || !editingLore.description.trim()}
                onClick={() => handleSaveLore(editingLore)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* モーダル: プロット (Plot) 追加・編集 */}
      {/* ======================================================== */}
      {plotModalOpen && editingPlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>章プロット編集</span>
              </h3>
              <button onClick={() => setPlotModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-slate-700 font-bold mb-1">第何章</label>
                  <input
                    type="number"
                    value={editingPlot.chapterNumber}
                    onChange={(e) => setEditingPlot({ ...editingPlot, chapterNumber: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">章タイトル *</label>
                  <input
                    type="text"
                    value={editingPlot.title}
                    onChange={(e) => setEditingPlot({ ...editingPlot, title: e.target.value })}
                    placeholder="例: 第1章：星降る遺跡の目覚め"
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">対象プロジェクト</label>
                  <select
                    value={editingPlot.projectId}
                    onChange={(e) => setEditingPlot({ ...editingPlot, projectId: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    {data.projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">起承転結フェーズ</label>
                  <select
                    value={editingPlot.phase}
                    onChange={(e) => setEditingPlot({ ...editingPlot, phase: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="introduction">起（導入）</option>
                    <option value="development">承（展開）</option>
                    <option value="twist">転（転換・波乱）</option>
                    <option value="climax">結（クライマックス）</option>
                    <option value="resolution">エピローグ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">章のあらすじ・要約 *</label>
                <textarea
                  rows={3}
                  value={editingPlot.summary}
                  onChange={(e) => setEditingPlot({ ...editingPlot, summary: e.target.value })}
                  placeholder="この章で起こることの要約..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">主要イベント（改行で箇条書き）</label>
                <textarea
                  rows={3}
                  value={editingPlot.keyEvents.join('\n')}
                  onChange={(e) =>
                    setEditingPlot({
                      ...editingPlot,
                      keyEvents: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  placeholder="主人公が鉱石を発見する&#10;遺跡の崩落事故と出会い"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">伏線・回収メモ</label>
                <input
                  type="text"
                  value={editingPlot.foreshadowingNotes || ''}
                  onChange={(e) => setEditingPlot({ ...editingPlot, foreshadowingNotes: e.target.value })}
                  placeholder="例: 第1章の青紫の鉱石がラストの鍵になる"
                  className="w-full bg-amber-50 border border-amber-200 text-amber-950 rounded-xl p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setPlotModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
              >
                キャンセル
              </button>
              <button
                disabled={!editingPlot.title.trim() || !editingPlot.summary.trim()}
                onClick={() => handleSavePlot(editingPlot)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
