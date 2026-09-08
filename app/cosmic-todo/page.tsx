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
  PRIORITY_CONFIG 
} from './types';
import { soundManager } from './utils/sound';

const STORAGE_KEY = 'cosmic_todo_tasks_v1';

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
          setIsLoaded(true);
          return;
        }
      }
    } catch {
      // LocalStorage error fallback
    }
    setTasks(INITIAL_TASKS);
    setIsLoaded(true);
  }, []);

  // 保存
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks, isLoaded]);

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
    if (window.confirm('宇宙のデータを初期状態にリセットしますか？')) {
      setTasks(INITIAL_TASKS);
      setPrevLevel(0);
      setSelectedCelestial(null);
      localStorage.removeItem(STORAGE_KEY);
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
    const categories: Task['category'][] = ['creative', 'tech', 'study', 'life', 'quest'];
    const priorities: Task['priority'][] = ['high', 'medium', 'low'];

    const newTasks: Task[] = [];
    for (let i = 0; i < diff; i++) {
      const idx = completedCount + i + 1;
      newTasks.push({
        id: `demo_task_${Date.now()}_${idx}`,
        title: `★ 達成ミッション #${idx}: 宇宙の開拓者`,
        category: categories[idx % categories.length],
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
        onSelectCelestial={setSelectedCelestial}
        selectedCelestialId={selectedCelestial?.id || null}
        newCompletedTaskId={newCompletedTaskId}
        onAnimationFinish={() => setNewCompletedTaskId(null)}
      />

      {/* タスク管理パネル（Zen Mode時は非表示） */}
      {!zenMode && (
        <TaskPanel
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          isCollapsed={isPanelCollapsed}
          onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
        />
      )}

      {/* 星・惑星の詳細モーダル */}
      {selectedCelestial && (
        <StarDetailModal
          celestial={selectedCelestial}
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
