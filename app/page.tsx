import React from 'react';

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
        link: "https://developer.salesforce.com/jpblogs/2026/04/lightning-minihack-live-2026-jp",
        linkText: "イベント詳細を見る"
      }
    ],

    // 制作物（準備中の仮データ）
    works: [
      {
        title: "ポートフォリオWebサイト",
        category: "Web Development",
        description: "Next.jsとVercelを活用して構築した自己紹介・実績紹介ポートフォリオサイトです。"
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
      github: "https://github.com" // ← ご自身のGitHubプロフィールURLに書き換えてください
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
                {item.link && (
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
                className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2"
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {work.category}
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {work.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {work.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* コンタクト */}
        <section className="pt-8 border-t border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p className="text-sm text-slate-600">
            ご連絡やお仕事のご相談はメールまたはGitHubよりお願いいたします。
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