import { CreativeHubData } from './types';

export const initialCreativeData: CreativeHubData = {
  projects: [
    {
      id: 'proj-1',
      title: '星導のエクリプス',
      subtitle: '星の魔導器と古の遺跡をめぐる幻想ファンタジー設定集＆イラスト本',
      category: 'illustration',
      status: 'in_progress',
      summary: '青とゴールドを基調とした幻想的な世界観。星光を宿す鉱石「アストラル・コア」と機械人形の少女人形が紡ぐボーイ・ミーツ・ガール。',
      concept: '【ターゲット】王道ファンタジー・スチームパンク愛好家\n【世界観テーマ】星光、失われた古代文明、記憶と約束\n【頒布形態】B5フルカラー36P イラスト本＋アクリルグッズ',
      targetDeadline: '2026-11-15',
      progressPercent: 65,
      color: '#3b82f6', // blue
      tags: ['ファンタジー', 'イラスト本', '世界観設計', 'キャラデザ'],
      links: [
        { title: '設定資料スプレッドシート', url: 'https://docs.google.com' },
        { title: 'キャラクターシート', url: '/character-sheet' }
      ],
      createdAt: '2026-06-01',
      updatedAt: '2026-09-02'
    },
    {
      id: 'proj-2',
      title: '電脳探偵アルカディア',
      subtitle: '記憶を失ったアンドロイド探偵とネオン街の秘密',
      category: 'game',
      status: 'planning',
      summary: 'ネオン輝く近未来都市を舞台にした短編探索アドベンチャー＆ビジュアルノベル企画。UIデザインと立ち絵、シナリオをトータル制作。',
      concept: '【ターゲット】サイバーパンク・ミステリー好き\n【テーマ】人間性と人工知能の境界、情報の真偽\n【展開予定】Steam短編無料配信 ＋ Web連載コミック',
      targetDeadline: '2027-02-28',
      progressPercent: 35,
      color: '#8b5cf6', // purple
      tags: ['サイバーパンク', 'ゲーム企画', 'UI設計', 'シナリオ'],
      createdAt: '2026-07-15',
      updatedAt: '2026-09-01'
    },
    {
      id: 'proj-3',
      title: '四季折々のカフェ時間',
      subtitle: '季節のスイーツと看板娘たちのミニ画集＆グッズ展開',
      category: 'goods',
      status: 'in_progress',
      summary: '日常の温かみと四季の美しさをテーマにしたキャラクターイラストシリーズ。SNS定期連載とイベント展開。',
      concept: '【ターゲット】日常癒やし系・カフェモチーフ好き\n【テーマ】春夏秋冬の旬の果物スイーツ、やわらかな光\n【展開】SNS毎週更新、アクリルスタンド、ミニ画集',
      targetDeadline: '2026-10-20',
      progressPercent: 80,
      color: '#ec4899', // pink
      tags: ['日常系', 'グッズ制作', 'キャラクター', 'ポップ'],
      createdAt: '2026-08-01',
      updatedAt: '2026-09-02'
    }
  ],

  ideas: [
    {
      id: 'idea-1',
      projectId: 'proj-1',
      title: '感情で光が変化する「星鉱石のランタン」',
      content: '持ち主の感情の揺らぎ（安心＝淡い青、緊張＝橙、決意＝透き通る金）で光の周波数と輝きが変わる携帯ランタン。暗闇の迷宮で嘘がつけなくなる演出として使える。',
      category: 'gimmick',
      status: 'accepted',
      tags: ['アイテム設定', '演出ギミック', '小道具'],
      color: '#3b82f6',
      inspirationSource: '夜景を眺めている時に思いついた。物語の心理描写と連動させたい。',
      createdAt: '2026-08-10',
      updatedAt: '2026-08-20'
    },
    {
      id: 'idea-2',
      projectId: 'proj-1',
      title: 'クライマックス：巨大な星時計と針の選択',
      content: '遺跡の最深部にある天空時計。時間を巻き戻せば街は救われるが、機械人形の記憶がリセットされる。主人公が「記憶を残したまま未来へ進む」決断をする熱い展開。',
      category: 'plot',
      status: 'accepted',
      tags: ['プロット', '山場', 'セリフ'],
      color: '#8b5cf6',
      inspirationSource: '切なさと王道の勇気を両立させるためのキープロット。',
      createdAt: '2026-08-15',
      updatedAt: '2026-08-28'
    },
    {
      id: 'idea-3',
      projectId: 'proj-2',
      title: '探偵事務所の空間デザイン（レトロ×サイバー）',
      content: 'ホログラムディスプレイが宙に浮かぶ中に、木製のヴィンテージ机とアンティークな蓄音機。蓄音機に特殊なメモリ管を差し込むと音声ログが流れる演出。',
      category: 'visual',
      status: 'accepted',
      tags: ['背景美術', '空間デザイン', 'スチーム/サイバー'],
      color: '#06b6d4',
      inspirationSource: '新旧の対比がキャラクターのアイデンティティを際立たせる。',
      createdAt: '2026-08-22',
      updatedAt: '2026-09-01'
    },
    {
      id: 'idea-4',
      projectId: 'proj-2',
      title: '名言案：「データの海に沈んでも、誓った約束だけは消せない」',
      content: '記憶メモリが破損しそうになりながらも主人公を庇うアンドロイド相棒の決め台詞。第4章の脱出シーンで使用。',
      category: 'character',
      status: 'accepted',
      tags: ['名言', 'セリフ', 'キャラクター'],
      color: '#f59e0b',
      createdAt: '2026-08-25',
      updatedAt: '2026-08-25'
    },
    {
      id: 'idea-5',
      projectId: 'proj-3',
      title: '二層式アクリルスタンド（木漏れ日レイヤー）',
      content: '手前にキャラクター、奥にカフェテラスの背景、さらに手前に木漏れ日エフェクトのクリアパーツを重ねる3層ジオラマ構造。光にかざすと影が落ちる。',
      category: 'gimmick',
      status: 'reviewing',
      tags: ['グッズ仕様', 'アクリルスタンド', '印刷技術'],
      color: '#10b981',
      inspirationSource: '印刷所の新オプションフェアを見てひらめいた。',
      createdAt: '2026-08-30',
      updatedAt: '2026-09-02'
    },
    {
      id: 'idea-6',
      title: '雨の日限定で現れる路地裏のブックカフェ',
      content: '水たまりに映る空の反射を踏むと入れる異世界の書店。失われた本やまだ書かれていない物語が並んでいる。短編シナリオか一枚絵のモチーフに良さそう。',
      category: 'worldview',
      status: 'spark',
      tags: ['新規ネタ', 'ファンタジー', '短編原案'],
      color: '#6366f1',
      inspirationSource: '雨の日の帰り道カフェに入った時のインスピレーション。',
      createdAt: '2026-09-01',
      updatedAt: '2026-09-01'
    }
  ],

  tasks: [
    {
      id: 'task-1',
      projectId: 'proj-1',
      title: '表紙イラストのラフ3案作成・構図比較',
      description: '星空を背負う構図、遺跡見下ろし構図、キャラ2人のアップの3パターンを比較検討する',
      lane: 'rough',
      priority: 'high',
      dueDate: '2026-09-10',
      tags: ['表紙', '構図'],
      createdAt: '2026-09-01',
      updatedAt: '2026-09-02'
    },
    {
      id: 'task-2',
      projectId: 'proj-1',
      title: '魔導器・武器の設定画クリンナップ',
      description: '設定集本文に掲載する線画＋三面図・解説テキストの清書',
      lane: 'production',
      priority: 'medium',
      dueDate: '2026-09-20',
      tags: ['線画', '設定画'],
      createdAt: '2026-09-01',
      updatedAt: '2026-09-02'
    },
    {
      id: 'task-3',
      projectId: 'proj-1',
      title: '巻末用語集・世界観年表のテキスト校正',
      description: '固有名詞の表記揺れチェックとフォントサイズ統一',
      lane: 'review',
      priority: 'medium',
      dueDate: '2026-10-05',
      tags: ['テキスト', 'デザインDTP'],
      createdAt: '2026-09-01',
      updatedAt: '2026-09-02'
    },
    {
      id: 'task-4',
      projectId: 'proj-2',
      title: 'UIワイヤーフレーム設計（ダイアログ＆証拠一覧）',
      description: 'Figmaでネオングローを取り入れたサイバー感あるUIパーツをプロトタイピング',
      lane: 'plot',
      priority: 'high',
      dueDate: '2026-09-15',
      tags: ['UI', 'Figma'],
      createdAt: '2026-09-01',
      updatedAt: '2026-09-01'
    },
    {
      id: 'task-5',
      projectId: 'proj-2',
      title: '第1章事件のトリックと証拠品のロジック詰め',
      description: 'アンドロイドがなぜ嘘をついたのか、システムログの矛盾点を整理',
      lane: 'idea',
      priority: 'high',
      dueDate: '2026-09-18',
      tags: ['シナリオ', 'ミステリー'],
      createdAt: '2026-09-01',
      updatedAt: '2026-09-01'
    },
    {
      id: 'task-6',
      projectId: 'proj-3',
      title: '秋のモンブラン＆看板娘イラスト 彩色・仕上げ',
      description: '栗とマロンクリームの質感、夕暮れの柔らかいハイライト表現を詰める',
      lane: 'production',
      priority: 'high',
      dueDate: '2026-09-08',
      tags: ['着色', '仕上げ'],
      createdAt: '2026-08-28',
      updatedAt: '2026-09-02'
    },
    {
      id: 'task-7',
      projectId: 'proj-3',
      title: 'アクリルスタンド入稿データ作成（白押さえ・カットライン）',
      description: 'レイヤー分け確認とカットラインのオフセット値チェック',
      lane: 'review',
      priority: 'high',
      dueDate: '2026-09-25',
      tags: ['入稿データ', 'グッズ'],
      createdAt: '2026-09-01',
      updatedAt: '2026-09-02'
    },
    {
      id: 'task-8',
      projectId: 'proj-3',
      title: '告知用SNSヘッダー画像＆お品書きテンプレ制作',
      description: 'X(Twitter)用のお品書きレイアウトベースを作成',
      lane: 'done',
      priority: 'low',
      dueDate: '2026-09-01',
      tags: ['広報', 'デザイン'],
      createdAt: '2026-08-20',
      updatedAt: '2026-09-01'
    }
  ],

  lores: [
    {
      id: 'lore-1',
      projectId: 'proj-1',
      term: 'アストラル・コア（星核石）',
      category: '魔法・鉱石',
      description: '太古に夜空から降り注いだとされる発光性結晶。人間の感情や強い意志に共鳴して莫大な魔導エネルギーを放出する。',
      secretNotes: '実は古代人が打ち上げた宇宙観測ステーションの残骸が結晶化したもの。意志ではなく生体パルスを感知している。',
      updatedAt: '2026-08-20'
    },
    {
      id: 'lore-2',
      projectId: 'proj-1',
      term: '天空都市アイテール',
      category: '地理・国家',
      description: '雲海の上に浮かぶ古代文明の巨大浮遊島。星導エネルギーで浮力を維持しており、地上からは伝説の都と崇められている。',
      secretNotes: '浮力が年々衰えており、あと数年で地上へ落下する危機にあることが物語中盤で判明する。',
      updatedAt: '2026-08-25'
    },
    {
      id: 'lore-3',
      projectId: 'proj-2',
      term: 'ゴースト・プロトコル',
      category: 'テクノロジー・法律',
      description: '自律思考型アンドロイドに課された「自我消去用バックドアプログラム」。一定の違法思考パターンを検知すると自動発動する。',
      secretNotes: '主人公の相棒アンドロイドはこのプロトコルを自力でハッキングして無効化しているが、メモリに負荷がかかり続けている。',
      updatedAt: '2026-08-29'
    }
  ],

  plots: [
    {
      id: 'plot-1',
      projectId: 'proj-1',
      chapterNumber: 1,
      title: '第1章：星降る遺跡の目覚め',
      phase: 'introduction',
      summary: '地上で星鉱石の採掘士として暮らす主人公レイ。崩落した古代遺跡の地下で、長き眠りについていた機械人形の少女ステラと出会う。',
      keyEvents: [
        '主人公が珍しい青紫の星鉱石を発見する',
        '遺跡の崩落事故とステラの起動',
        'ステラが「天空都市へ帰る」という目的を語る'
      ],
      foreshadowingNotes: 'ステラの胸にあるコアは破損しており、旅の中で修復が必要になる',
      updatedAt: '2026-08-20'
    },
    {
      id: 'plot-2',
      projectId: 'proj-1',
      chapterNumber: 2,
      title: '第2章：雲海を渡る風車街',
      phase: 'development',
      summary: '天空都市を目指すため、飛行船を求めて風車が立ち並ぶ渓谷の交易都市へ。そこで飛行船技師と出会い、修理に必要な希少鉱石を探すことに。',
      keyEvents: [
        '風車街の活気と飛行船ドックの風景',
        '星鉱石のランタンを使った暗闇の谷底探索',
        '追っ手となる帝国軍の魔導兵器との遭遇'
      ],
      foreshadowingNotes: '帝国軍が探しているのはステラ本人であることが示唆される',
      updatedAt: '2026-08-24'
    },
    {
      id: 'plot-3',
      projectId: 'proj-1',
      chapterNumber: 3,
      title: '第3章：天空回廊と時計台の決断',
      phase: 'climax',
      summary: 'ついに天空都市アイテールへ到達。しかしそこは無人となり、巨大な星時計だけが動いていた。都市落下を止めるため、二人は過酷な選択を迫られる。',
      keyEvents: [
        '天空都市の廃墟の美しさと真実の開示',
        '星時計の針をめぐるラストバトル',
        'ステラの記憶と主人公の選択'
      ],
      foreshadowingNotes: '第1章の伏線（青紫の星鉱石）が時計のスペアキーとして機能する',
      updatedAt: '2026-08-28'
    }
  ]
};
