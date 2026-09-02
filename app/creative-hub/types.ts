export type ProjectStatus = 'concept' | 'planning' | 'in_progress' | 'polishing' | 'completed' | 'archived';

export type ProjectCategory = 
  | 'illustration' // イラスト集・画集
  | 'comic'        // 漫画・Webtoon
  | 'game'         // ゲーム企画・開発
  | 'novel'        // 小説・シナリオ
  | 'goods'        // グッズ・同人企画
  | 'other';       // その他

export type IdeaCategory = 
  | 'worldview'   // 世界観・舞台設定
  | 'plot'        // プロット・ストーリー展開
  | 'character'   // キャラクター・セリフ
  | 'visual'      // ビジュアル・構図・衣装
  | 'gimmick'     // ギミック・小ネタ
  | 'general';    // 雑記・思いつき

export type IdeaStatus = 'spark' | 'reviewing' | 'accepted' | 'shelved';

export type TaskLane = 'idea' | 'plot' | 'rough' | 'production' | 'review' | 'done';

export interface KanbanTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  lane: TaskLane;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreativeIdea {
  id: string;
  projectId?: string; // 紐づくプロジェクト（未設定可）
  title: string;
  content: string;
  category: IdeaCategory;
  status: IdeaStatus;
  tags: string[];
  color?: string; // カードアクセントカラー
  inspirationSource?: string; // 発想のきっかけ・メモ
  createdAt: string;
  updatedAt: string;
}

export interface WorldLore {
  id: string;
  projectId: string;
  term: string; // 用語・設定名
  category: string; // 地理、魔法/テクノロジー、組織/勢力、歴史、種族など
  description: string;
  secretNotes?: string; // 裏設定・伏線メモ
  updatedAt: string;
}

export interface PlotOutline {
  id: string;
  projectId: string;
  chapterNumber: number;
  title: string;
  phase: 'introduction' | 'development' | 'twist' | 'climax' | 'resolution'; // 起承転結/エピローグ
  summary: string;
  keyEvents: string[];
  foreshadowingNotes?: string; // 伏線・回収メモ
  updatedAt: string;
}

export interface CreativeProject {
  id: string;
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  summary: string;
  concept: string; // コンセプト・ターゲット層・テーマ
  targetDeadline?: string;
  progressPercent: number; // 0 - 100
  color: string; // テーマカラー
  tags: string[];
  links?: { title: string; url: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreativeHubData {
  projects: CreativeProject[];
  ideas: CreativeIdea[];
  tasks: KanbanTask[];
  lores: WorldLore[];
  plots: PlotOutline[];
}
