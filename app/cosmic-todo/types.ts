export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = string;

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
}

export type CelestialType = 'star' | 'giant' | 'planet' | 'satellite';

export interface CelestialBody {
  id: string;
  taskId: string;
  taskTitle: string;
  category: TaskCategory;
  priority: TaskPriority;
  completedAt: string;
  type: CelestialType;
  angle: number; // 軌道上の角度 (ラジアン)
  distance: number; // 中心からの基本半径
  orbitSpeed: number; // 回転速度
  size: number;
  color: string;
  glowColor: string;
  twinkleSpeed: number;
  twinklePhase: number;
  hasRing?: boolean;
  ringColor?: string;
  ringRadius?: number;
  moons?: {
    distance: number;
    size: number;
    angle: number;
    speed: number;
    color: string;
  }[];
}

export interface UniverseStage {
  level: number;
  name: string;
  subtitle: string;
  description: string;
  minTasks: number;
  iconName: string;
  unlockedFeatures: string[];
}

export const UNIVERSE_STAGES: UniverseStage[] = [
  {
    level: 0,
    name: "Stage 0: 虚空の静寂",
    subtitle: "The Primordial Void",
    description: "宇宙はまだ静寂のなかにあります。中央に灯る原始の光核が、あなたの最初の行動を待っています。",
    minTasks: 0,
    iconName: "Sparkle",
    unlockedFeatures: ["原始の光核 (Proto-Singularity)"]
  },
  {
    level: 1,
    name: "Stage 1: 最初の瞬き",
    subtitle: "The First Sparks",
    description: "タスクの達成が光のエネルギーとなり、宇宙に初めての星々が誕生しました！中心核が温かい光を放ちます。",
    minTasks: 1,
    iconName: "Sun",
    unlockedFeatures: ["恒星の誕生", "星のクリック情報閲覧", "宇宙の微光グロー"]
  },
  {
    level: 2,
    name: "Stage 2: 星座の繋がり",
    subtitle: "Constellation Web",
    description: "星と星の間に見えない絆が結ばれ、幾何学的な星座ライン（星図）が宇宙空間に浮かび上がります。",
    minTasks: 3,
    iconName: "Activity",
    unlockedFeatures: ["星座ラインの形成", "コロナフレアの拡大"]
  },
  {
    level: 3,
    name: "Stage 3: 虹彩の星雲",
    subtitle: "Cosmic Nebula",
    description: "達成のエネルギーがガスとなり、紫やマゼンタ、シアンにゆらめく神秘の星雲が宇宙を満たします。",
    minTasks: 6,
    iconName: "CloudRain",
    unlockedFeatures: ["多層グラデーション星雲", "大気スペクトル効果"]
  },
  {
    level: 4,
    name: "Stage 4: 惑星系の胎動",
    subtitle: "Planetary System",
    description: "重力場が成熟し、美しい環（リング）を持つ惑星や周回する衛星が独自の軌道を描いて公転し始めました。",
    minTasks: 10,
    iconName: "Globe",
    unlockedFeatures: ["リング付き惑星の公転", "周回衛星（月）の誕生", "ケプラー軌道ライン"]
  },
  {
    level: 5,
    name: "Stage 5: 小惑星帯と流星雨",
    subtitle: "Asteroids & Meteors",
    description: "躍動する小惑星帯が宇宙を巡り、時折画面を鮮やかに横切る神秘的な流れ星が降り注ぎます。",
    minTasks: 15,
    iconName: "Flame",
    unlockedFeatures: ["アステロイドベルト（小惑星帯）", "リアルタイム流星群 (Shooting Stars)"]
  },
  {
    level: 6,
    name: "Stage 6: 壮麗なる大銀河",
    subtitle: "Grand Spiral Galaxy",
    description: "無数の達成が織りなす究極の調和。巨大なスパイラル銀河の渦と永遠のオーロラが宇宙を支配します。",
    minTasks: 20,
    iconName: "Compass",
    unlockedFeatures: ["銀河スパイラルアーム", "ディープオーロラ発光", "称号「Master of Cosmos」"]
  }
];

export interface CategoryInfo {
  id: string;
  label: string;
  color: string;
  glow: string;
  bg?: string;
  border?: string;
  isCustom?: boolean;
}

export function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function createCategoryConfig(id: string, label: string, color: string, isCustom = true): CategoryInfo {
  return {
    id,
    label,
    color,
    glow: hexToRgba(color, 0.6),
    bg: '',
    border: '',
    isCustom,
  };
}

export const DEFAULT_CATEGORY_CONFIG: Record<string, CategoryInfo> = {
  creative: {
    id: "creative",
    label: "創作・アート",
    color: "#f43f5e", // ローズピンク
    glow: "rgba(244, 63, 94, 0.6)",
    bg: "bg-rose-500/10 text-rose-300",
    border: "border-rose-500/30",
    isCustom: false,
  },
  tech: {
    id: "tech",
    label: "開発・IT",
    color: "#06b6d4", // シアン
    glow: "rgba(6, 182, 212, 0.6)",
    bg: "bg-cyan-500/10 text-cyan-300",
    border: "border-cyan-500/30",
    isCustom: false,
  },
  study: {
    id: "study",
    label: "学習・読書",
    color: "#eab308", // アンバーゴールド
    glow: "rgba(234, 179, 8, 0.6)",
    bg: "bg-amber-500/10 text-amber-300",
    border: "border-amber-500/30",
    isCustom: false,
  },
  life: {
    id: "life",
    label: "生活・健康",
    color: "#10b981", // エメラルド
    glow: "rgba(16, 185, 129, 0.6)",
    bg: "bg-emerald-500/10 text-emerald-300",
    border: "border-emerald-500/30",
    isCustom: false,
  },
  quest: {
    id: "quest",
    label: "特別クエスト",
    color: "#a855f7", // パープル
    glow: "rgba(168, 85, 247, 0.6)",
    bg: "bg-purple-500/10 text-purple-300",
    border: "border-purple-500/30",
    isCustom: false,
  }
};

export const CATEGORY_CONFIG: Record<string, CategoryInfo> = DEFAULT_CATEGORY_CONFIG;

export function getCategoryInfo(categories: Record<string, CategoryInfo> | undefined, catId: string): CategoryInfo {
  if (categories && categories[catId]) {
    return categories[catId];
  }
  if (DEFAULT_CATEGORY_CONFIG[catId]) {
    return DEFAULT_CATEGORY_CONFIG[catId];
  }
  return {
    id: catId,
    label: catId,
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.6)',
    isCustom: true,
  };
}

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; exp: number; color: string; badge: string }> = {
  high: {
    label: "最重要 (大星・惑星誕生)",
    exp: 100,
    color: "#f97316", // オレンジ
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40"
  },
  medium: {
    label: "通常 (輝く恒星誕生)",
    exp: 50,
    color: "#38bdf8", // スカイブルー
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/40"
  },
  low: {
    label: "日常 (小星・流星誕生)",
    exp: 25,
    color: "#94a3b8", // スレート
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/40"
  }
};
