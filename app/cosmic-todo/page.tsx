'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CosmicCanvas from './components/CosmicCanvas';
import UniverseStats from './components/UniverseStats';
import TaskPanel from './components/TaskPanel';
import StarDetailModal from './components/StarDetailModal';
import LevelUpModal from './components/LevelUpModal';
import { 
  Task, 
  CelestialBody, 
  UNIVERSE_STAGES, 
  UniverseStage, 
  PRIORITY_CONFIG,
  CategoryInfo,
  DEFAULT_CATEGORY_CONFIG,
  createCategoryConfig,
  getCategoryInfo
} from './types';
import { soundManager } from './utils/sound';

const STORAGE_KEY = 'cosmic_todo_tasks_v1';
const CATEGORIES_STORAGE_KEY = 'cosmic_todo_categories_v1';

const INITIAL_TASKS: Task[] = [
  {
    id: 'init-1',
    title: '✨ 最初の星を誕生させる（左のチェックをクリック！）',
    category: 'quest',
    priority: 'high',
    completed: false,
    notes: 'タスクを達成すると光が集まり、あなただけの宇宙に最初の恒星が誕生します。',
  },
  {
    id: 'init-2',
    title: '🎨 創作・デザインのアイデアスケッチを描く',
    category: 'creative',
    priority: 'high',
    completed: false,
    notes: '高優先度のタスクを完了すると、美しい惑星や超巨星が誕生します。',
  },
  {
    id: 'init-3',
    title: '📚 技術書の気になった章を30分インプットする',
    category: 'study',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'init-4',
    title: '☕ 宇宙のBGMや星の瞬きを眺めながら深呼吸する',
    category: 'life',
    priority: 'low',
    completed: false,
  },
];

export default function CosmicTodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Record<string, CategoryInfo>>(DEFAULT_CATEGORY_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [selectedCelestial, setSelectedCelestial] = useState<CelestialBody | null>(null);
  const [newCompletedTaskId, setNewCompletedTaskId] = useState<string | null>(null);
  const [levelUpStage, setLevelUpStage] = useState<UniverseStage | null>(null);
  const [prevLevel, setPrevLevel] = useState<number>(0);

  // 初回ロード
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          const completedCount = parsed.filter((t: Task) => t.completed).length;
          const currentLvl = calculateLevel(completedCount);
          setPrevLevel(currentLvl);
        } else {
          setTasks(INITIAL_TASKS);
        }
      } else {
        setTasks(INITIAL_TASKS);
      }

      // カテゴリ（属性）のロード
      const savedCats = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (savedCats) {
        const parsedCats = JSON.parse(savedCats);
        if (parsedCats && typeof parsedCats === 'object') {
          setCategories({
            uncategorized: DEFAULT_CATEGORY_CONFIG.uncategorized,
            ...DEFAULT_CATEGORY_CONFIG,
            ...parsedCats,
          });
        }
      }
    } catch {
      // LocalStorage error fallback
      setTasks(INITIAL_TASKS);
    }
    setIsLoaded(true);
  }, []);

  // タスク保存
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks, isLoaded]);

  // カテゴリ（属性）保存
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories, isLoaded]);

  // レベル計算ロジック
  const calculateLevel = (completedCount: number): number => {
    let lvl = 0;
    for (let i = UNIVERSE_STAGES.length - 1; i >= 0; i--) {
      if (completedCount >= UNIVERSE_STAGES[i].minTasks) {
        lvl = UNIVERSE_STAGES[i].level;
        break;
      }
    }
    return lvl;
  };

  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);
  const completedCount = completedTasks.length;

  const totalExp = useMemo(() => {
    return completedTasks.reduce((acc, t) => acc + (PRIORITY_CONFIG[t.priority]?.exp || 25), 0);
  }, [completedTasks]);

  const currentLevel = useMemo(() => calculateLevel(completedCount), [completedCount]);

  const currentStage = useMemo(() => {
    return UNIVERSE_STAGES.find((s) => s.level === currentLevel) || UNIVERSE_STAGES[0];
  }, [currentLevel]);

  const nextStage = useMemo(() => {
    const nextIdx = UNIVERSE_STAGES.findIndex((s) => s.level === currentLevel) + 1;
    return nextIdx < UNIVERSE_STAGES.length ? UNIVERSE_STAGES[nextIdx] : null;
  }, [currentLevel]);

  // レベルアップ検出
  useEffect(() => {
    if (!isLoaded) return;
    if (currentLevel > prevLevel) {
      soundManager.playLevelUp();
      setLevelUpStage(currentStage);
      setPrevLevel(currentLevel);
    } else if (currentLevel < prevLevel) {
      setPrevLevel(currentLevel);
    }
  }, [currentLevel, prevLevel, isLoaded, currentStage]);

  // タスク追加
  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // タスク完了・未完了切り替え
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            // 新星誕生サウンドとエフェクト
            soundManager.playTaskComplete();
            setNewCompletedTaskId(t.id);
            return {
              ...t,
              completed: true,
              completedAt: new Date().toISOString(),
            };
          } else {
            return {
              ...t,
              completed: false,
              completedAt: undefined,
            };
          }
        }
        return t;
      })
    );
  };

  // タスク削除
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedCelestial && selectedCelestial.taskId === taskId) {
      setSelectedCelestial(null);
    }
  };

  // タスク編集・更新
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    if (selectedCelestial && selectedCelestial.taskId === updatedTask.id) {
      const catConfig = getCategoryInfo(categories, updatedTask.category);
      setSelectedCelestial((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          taskTitle: updatedTask.title,
          category: updatedTask.category,
          priority: updatedTask.priority,
          color: catConfig.color,
          glowColor: catConfig.glow,
          ringColor: catConfig.glow,
        };
      });
    }
  };

  // 属性（カテゴリ）追加
  const handleAddCategory = (newCat: { label: string; color: string }): string => {
    const id = 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const catConfig = createCategoryConfig(id, newCat.label, newCat.color, true);
    setCategories((prev) => ({
      ...prev,
      [id]: catConfig,
    }));
    return id;
  };

  // 属性（カテゴリ）削除
  const handleDeleteCategory = (categoryId: string) => {
    if (categoryId === 'uncategorized') return;

    // 1. 削除されたカテゴリに属していた全タスクを自動的に「未分類」に更新
    setTasks((prev) =>
      prev.map((t) => (t.category === categoryId ? { ...t, category: 'uncategorized' } : t))
    );

    // 2. 選択中の天体が削除対象カテゴリだった場合、未分類に同期
    if (selectedCelestial && selectedCelestial.category === categoryId) {
      const uncatConfig = getCategoryInfo(categories, 'uncategorized');
      setSelectedCelestial((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          category: 'uncategorized',
          color: uncatConfig.color,
          glowColor: uncatConfig.glow,
          ringColor: uncatConfig.glow,
        };
      });
    }

    // 3. カテゴリ一覧から削除
    setCategories((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      if (!next.uncategorized) {
        next.uncategorized = DEFAULT_CATEGORY_CONFIG.uncategorized;
      }
      return next;
    });
  };

  // 宇宙のスクリーンショット保存
  const handleCaptureScreenshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `my-cosmo-universe-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('画像の保存に失敗しました。');
    }
  }, []);

  // データ初期化
  const handleResetData = () => {
    if (window.confirm('宇宙のデータと追加した属性を初期状態にリセットしますか？')) {
      setTasks(INITIAL_TASKS);
      setCategories(DEFAULT_CATEGORY_CONFIG);
      setPrevLevel(0);
      setSelectedCelestial(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CATEGORIES_STORAGE_KEY);
    }
  };

  // デモ用高速シミュレーション（審査・体験用）
  const handleFastForwardDemo = () => {
    // 現在の達成数に応じて次のマイルストーン（0 -> 1 -> 3 -> 6 -> 10 -> 15 -> 20）へ瞬時に進める
    const targetMilestones = [1, 3, 6, 10, 15, 20];
    const nextTarget = targetMilestones.find((m) => m > completedCount) || 0;

    if (nextTarget === 0) {
      // 既に最大ならリセット
      alert('宇宙はすでに大銀河（最大レベル）に到達しています！初期状態に戻します。');
      setTasks(INITIAL_TASKS);
      setPrevLevel(0);
      return;
    }

    const diff = nextTarget - completedCount;
    const catKeys = Object.keys(categories);
    const priorities: Task['priority'][] = ['high', 'medium', 'low'];

    const newTasks: Task[] = [];
    for (let i = 0; i < diff; i++) {
      const idx = completedCount + i + 1;
      newTasks.push({
        id: `demo_task_${Date.now()}_${idx}`,
        title: `★ 達成ミッション #${idx}: 宇宙の開拓者`,
        category: catKeys[idx % catKeys.length],
        priority: priorities[idx % priorities.length],
        completed: true,
        completedAt: new Date(Date.now() - (diff - i) * 3600000).toISOString(),
      });
    }

    soundManager.playTaskComplete();
    setTasks((prev) => [...newTasks, ...prev]);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-xs font-mono">宇宙を創成中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* 宇宙ステータスバー・操作バー */}
      <UniverseStats
        completedCount={completedCount}
        totalExp={totalExp}
        currentStage={currentStage}
        nextStage={nextStage}
        zenMode={zenMode}
        onToggleZenMode={() => setZenMode(!zenMode)}
        onCaptureScreenshot={handleCaptureScreenshot}
        onResetData={handleResetData}
        onFastForwardDemo={handleFastForwardDemo}
      />

      {/* 画面中心のインタラクティブ宇宙Canvas */}
      <CosmicCanvas
        completedTasks={completedTasks}
        universeLevel={currentLevel}
        categories={categories}
        onSelectCelestial={setSelectedCelestial}
        selectedCelestialId={selectedCelestial?.id || null}
        newCompletedTaskId={newCompletedTaskId}
        onAnimationFinish={() => setNewCompletedTaskId(null)}
      />

      {/* タスク管理パネル（Zen Mode時は非表示） */}
      {!zenMode && (
        <TaskPanel
          tasks={tasks}
          categories={categories}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          isCollapsed={isPanelCollapsed}
          onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
        />
      )}

      {/* 星・惑星の詳細モーダル */}
      {selectedCelestial && (
        <StarDetailModal
          celestial={selectedCelestial}
          categories={categories}
          onClose={() => setSelectedCelestial(null)}
        />
      )}

      {/* レベルアップ特別祝賀モーダル */}
      {levelUpStage && (
        <LevelUpModal
          stage={levelUpStage}
          onClose={() => setLevelUpStage(null)}
        />
      )}
    </div>
  );
}
