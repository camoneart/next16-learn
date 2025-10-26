import Link from 'next/link';

export default function Home() {
  const demos = [
    {
      title: 'Cache Components',
      description: '"use cache"ディレクティブでコンポーネント全体をキャッシュする機能',
      link: '/cache-components',
      icon: '💾',
      features: [
        'コンポーネントレベルでのキャッシュ',
        'サーバーコンポーネントで使用可能',
        'パフォーマンス向上',
      ],
    },
    {
      title: 'revalidateTag()',
      description: '特定のタグに関連付けられたキャッシュを無効化する関数',
      link: '/revalidate-tag',
      icon: '🔄',
      features: ['タグベースのキャッシュ無効化', 'Server Actionsで使用', '細かい制御が可能'],
    },
    {
      title: 'updateTag()',
      description: 'キャッシュを無効化せずに更新する新しい関数',
      link: '/update-tag',
      icon: '⚡',
      features: [
        'キャッシュを保持したまま更新',
        '既存キャッシュの差分更新',
        'より効率的なキャッシュ管理',
      ],
    },
    {
      title: 'refresh()',
      description: 'クライアント側からサーバーコンポーネントを再レンダリングする関数',
      link: '/refresh',
      icon: '🔃',
      features: ['クライアントからサーバー更新', 'ページリロード不要', '最新データを取得'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-6xl p-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-800">Next.js 16 新機能デモ</h1>
          <p className="text-xl text-gray-600">キャッシュとデータ更新の新機能を実際に体験しよう</p>
          <div className="mt-4 inline-block rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white">
            Next.js 16.0.0 | React 19.2.0
          </div>
        </header>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {demos.map((demo) => (
            <Link
              key={demo.link}
              href={demo.link}
              className="block rounded-lg border-2 border-transparent bg-white p-6 shadow-lg transition-shadow hover:border-blue-400 hover:shadow-xl"
            >
              <div className="mb-4 flex items-start">
                <span className="mr-4 text-4xl">{demo.icon}</span>
                <div className="flex-1">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">{demo.title}</h2>
                  <p className="text-gray-600">{demo.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {demo.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">機能の比較と使い分け</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 font-semibold">機能</th>
                  <th className="border p-3 font-semibold">用途</th>
                  <th className="border p-3 font-semibold">実行場所</th>
                  <th className="border p-3 font-semibold">キャッシュ動作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-mono text-sm">&quot;use cache&quot;</td>
                  <td className="border p-3">コンポーネントのキャッシュ</td>
                  <td className="border p-3">サーバーコンポーネント</td>
                  <td className="border p-3">自動キャッシュ</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-3 font-mono text-sm">revalidateTag()</td>
                  <td className="border p-3">キャッシュの無効化</td>
                  <td className="border p-3">Server Actions</td>
                  <td className="border p-3">完全に無効化</td>
                </tr>
                <tr>
                  <td className="border p-3 font-mono text-sm">updateTag()</td>
                  <td className="border p-3">キャッシュの差分更新</td>
                  <td className="border p-3">Server Actions</td>
                  <td className="border p-3">保持したまま更新</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-3 font-mono text-sm">refresh()</td>
                  <td className="border p-3">サーバー側の再レンダリング</td>
                  <td className="border p-3">クライアント</td>
                  <td className="border p-3">最新データ取得</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-xl font-bold text-gray-800">参考リンク</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://nextjs.org/blog/next-16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📝 Next.js 16 公式ブログ
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org/docs/app/getting-started/cache-components"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📚 Cache Components ドキュメント
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org/docs/app/api-reference/functions/revalidateTag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📚 revalidateTag() ドキュメント
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org/docs/app/api-reference/functions/updateTag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📚 updateTag() ドキュメント
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org/docs/app/api-reference/functions/refresh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📚 refresh() ドキュメント
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-xl font-bold text-gray-800">始め方</h3>
            <ol className="list-decimal space-y-2 pl-6 text-gray-700">
              <li>各デモページをクリックして機能を確認</li>
              <li>ボタンやアクションを試して挙動を観察</li>
              <li>ブラウザの開発者ツールでネットワークタブを開いて動作を確認</li>
              <li>コード例を参考に実際のプロジェクトで活用</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
