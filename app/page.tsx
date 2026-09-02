import React from 'react';
import Link from 'next/link';

interface HistoryItem {
  period: string;
  title: string;
  description: string;
  books?: {
    title: string;
    role: string;
    description: string;
    link: string;
    tag: string;
  }[];
  link?: string;
  linkText?: string;
  links?: {
    text: string;
    url: string;
  }[];
}

export default function Home() {
  const profile = {
    name: "長谷川 優希",
    nameKana: "はせがわ ゆき",
    university: "東京都市大学 メディア情報学部 社会メディア学科",
    bio: "「好き」と思ってもらえるキャラクターや作品を生み出すことを目標に、イラストを中心とした創作に取り組んでいます。ゲームやグッズ、出版、シナリオなど、ひとつの作品をさまざまな形で広げていくことにも強く関心があります。将来は、制作だけでなく企画やアイデアの提案にも携わり、作品の魅力をより多くの人へ届けられるクリエイターになりたいです。",
    
    // スキル（適宜追加・編集してください）
    skills: ["イラスト制作", "Clip Studio Paint", "キャラクターデザイン", "Next.js", "React", "HTML/CSS", "GitHub"],
    
    // 略歴・活動実績
    history: [
      {
        period: "2026年2月 〜 現在",
        title: "株式会社Tekuru 長期インターン",
        description: "書籍制作やデジタルメディアに関わる実務経験を積んでいます。"
      },
      {
        period: "実績",
        title: "書籍制作（Googleアプリの教科書シリーズ）",
        description: "株式会社Tekuruにて、Googleアプリの解説書籍の制作・執筆に携わりました。",
        books: [
          {
            title: "Googleフォームの教科書",
            role: "制作・執筆協力",
            description: "アンケート作成や集計の自動化など、基本操作から実践的な活用法までを図解入りで分かりやすく解説。",
            link: "https://amzn.asia/d/0ckpZlEq",
            tag: "Kindle / 書籍"
          },
          {
            title: "Googleドキュメントの教科書",
            role: "制作・執筆協力",
            description: "文書作成やリアルタイムでの共同編集など、Googleドキュメントを効率的に使いこなすノウハウを網羅。",
            link: "https://amzn.asia/d/0gQIcndy",
            tag: "Kindle / 書籍"
          }
        ]
      },
      {
        period: "実績",
        title: "LightningMiniHack 本選出場",
        description: "ハッカソンイベント「LightningMiniHack」の本選に出場しました。",
        links: [
          {
            text: "イベント詳細を見る",
            url: "https://developer.salesforce.com/jpblogs/2026/04/lightning-minihack-live-2026-jp"
          },
          {
            text: "参加者インタビュー記事を見る",
            url: "https://developer.salesforce.com/jpblogs/2026/08/tdx-tokyo-2026-lightning-minihack-live"
          }
        ]
      }
    ] as HistoryItem[],

    // 制作物
    works: [
      {
        title: "創作プロジェクト管理＋アイデア整理ハブ (Creative Studio Hub)",
        category: "Web Application / Creative Tool",
        description: "イラスト集・同人誌・コミック・ゲーム企画・シナリオなどの創作活動におけるプロジェクト進捗管理と、思いついたアイデア・世界観設定・章立てプロットを一元管理できるWebアプリケーションです。創作カンバン、アイデアストック、用語事典、Markdown/JSON書き出しに対応しています。",
        link: "/creative-hub",
        linkText: "アプリを使ってみる",
        badge: "New Release"
      },
      {
        title: "キャラクター設定シート ジェネレーター",
        category: "Web Application / Creative Tool",
        description: "オリジナルキャラクターの設定・ビジュアル・性格・モチーフ・名言などを整理し、美しいカード形式でリアルタイムプレビュー＆印刷・テキスト出力できる創作支援ツールです。創作の壁打ちや設定の散らかり防止をサポートします。",
        link: "/character-sheet",
        linkText: "アプリを使ってみる",
        badge: "Popular"
      },
      {
        title: "ポートフォリオWebサイト",
        category: "Web Development",
        description: "Next.jsとVercelを活用して構築した自己紹介・実績紹介ポートフォリオサイトです。レスポンシブデザインとモダンなUI設計を採用しています。"
      },
      {
        title: "キャラクターデザイン・イラスト作品（準備中）",
        category: "Illustration / Design",
        description: "オリジナルキャラクターのビジュアルおよびポーズ・背景描画等の作品を順次追加予定です。"
      }
    ],

    // 連絡先
    contact: {
      email: "yuki.hasegawa.28@gmail.com",
      github: "https://github.com/xmryy962-arch"
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 px-6 py-12 md:py-20 font-sans">
      <div className="max-w-3xl mx-auto space-y-16">
        
        {/* ヘッダー / プロフィール */}
        <section className="space-y-4">
          <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-full font-medium tracking-wide">
            Portfolio
          </div>
          <div>
            <span className="text-sm text-slate-500 font-medium block">{profile.nameKana}</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mt-1">
              {profile.name}
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-600 bg-slate-100 inline-block px-3 py-1.5 rounded-md">
            🎓 {profile.university}
          </p>
          <p className="text-slate-600 leading-relaxed pt-2 whitespace-pre-line">
            {profile.bio}
          </p>
        </section>

        {/* 略歴・活動実績 */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Experience & Activities
          </h2>
          <div className="space-y-4">
            {profile.history.map((item, index) => (
              <div key={index} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                  <span>{item.period}</span>
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* 書籍実績がある場合はカード表示 */}
                {item.books && item.books.length > 0 && (
                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    {item.books.map((book, bIndex) => (
                      <div 
                        key={bIndex} 
                        className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-medium rounded text-[11px]">
                              {book.tag}
                            </span>
                            <span className="text-slate-500 text-[11px]">{book.role}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                            <span>📖</span>
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {book.description}
                          </p>
                        </div>
                        <div className="pt-1">
                          <a
                            href={book.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors gap-1"
                          >
                            <span>Amazonで見る</span>
                            <span className="text-slate-400">↗</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* リンクがある場合の表示 */}
                {item.links && item.links.length > 0 && (
                  <div className="pt-1 flex flex-col gap-1.5 items-start">
                    {item.links.map((linkItem, lIndex) => (
                      <a 
                        key={lIndex}
                        href={linkItem.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <span>{linkItem.text}</span>
                        <span>↗</span>
                      </a>
                    ))}
                  </div>
                )}
                {item.link && !item.links && (
                  <div className="pt-1">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>{item.linkText || "詳細を見る"}</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* スキル */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Skills & Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-md shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* 制作物 */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Works & Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-1">
            {profile.works.map((work, index) => (
              <div 
                key={index}
                className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider">
                    {work.category}
                  </span>
                  {work.badge && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                      {work.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {work.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {work.description}
                </p>
                {work.link && (
                  <div className="pt-2">
                    <Link
                      href={work.link}
                      className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors gap-1.5 shadow-sm"
                    >
                      <span>{work.linkText || "使ってみる"}</span>
                      <span>➔</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* コンタクト */}
        <section className="pt-8 border-t border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p className="text-sm text-slate-600">
            ご連絡の際はメールまたはGitHubよりお願いいたします。
          </p>
          <div className="space-y-2 text-sm text-slate-700 font-medium">
            <p>
              📧 Mail: <a href={`mailto:${profile.contact.email}`} className="text-blue-600 hover:underline">{profile.contact.email}</a>
            </p>
            <p>
              💻 GitHub: <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.contact.github}</a>
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}