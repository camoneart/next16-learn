import { Suspense } from "react";
import { headers } from "next/headers";
import RefreshButton from "./RefreshButton";

// サーバーコンポーネント：現在の時刻を表示
async function ServerTimeDisplay() {
  await headers();
  const time = new Date().toLocaleString("ja-JP");
  await new Promise((resolve) => setTimeout(resolve, 100));
  return (
    <div className="p-4 border rounded bg-blue-50">
      <h3 className="font-bold mb-2">サーバーコンポーネント</h3>
      <p className="text-xl">現在時刻: {time}</p>
      <p className="text-sm text-gray-600 mt-2">
        ※ サーバー側でレンダリングされた時刻
      </p>
    </div>
  );
}

// サーバーコンポーネント：ランダムな数値を表示
async function RandomNumberDisplay() {
  await headers();
  const randomNum = Math.floor(Math.random() * 1000);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return (
    <div className="p-4 border rounded bg-green-50">
      <h3 className="font-bold mb-2">ランダム数値</h3>
      <p className="text-2xl font-bold">{randomNum}</p>
      <p className="text-sm text-gray-600 mt-2">
        ※ サーバー側で生成されたランダム数値
      </p>
    </div>
  );
}

export default function RefreshDemo() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">refresh() デモ</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">機能説明</h2>
        <p className="mb-2">
          <code>refresh()</code>
          は、クライアントサイドからサーバーコンポーネントを再レンダリングするための関数です。
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>
            クライアントコンポーネントから呼び出してサーバーコンポーネントを更新
          </li>
          <li>ページ全体をリロードせずにサーバーサイドの最新データを取得</li>
          <li>ユーザーインタラクションに応じてデータを更新できる</li>
          <li>キャッシュを無視して常に最新のデータを取得</li>
          <li>
            Next.js 16の新機能で、より細かいコントロールが可能になりました
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<div>Loading server time...</div>}>
          <ServerTimeDisplay />
        </Suspense>

        <Suspense fallback={<div>Loading random number...</div>}>
          <RandomNumberDisplay />
        </Suspense>

        <RefreshButton />
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">試してみよう</h3>
        <ol className="list-decimal pl-6 space-y-1">
          <li>現在の時刻とランダム数値を確認してください</li>
          <li>「refresh() を実行」ボタンをクリック</li>
          <li>ページ全体がリロードされずに、サーバーデータが更新されます</li>
          <li>時刻とランダム数値が新しい値に変わります</li>
        </ol>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold mb-2">他の更新方法との違い</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">window.location.reload()</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              <li>ページ全体をリロード</li>
              <li>クライアント状態が失われる</li>
              <li>ネットワークリクエストが多い</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">router.refresh()</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              <li>現在のルートのみを再レンダリング</li>
              <li>クライアント状態は保持される</li>
              <li>キャッシュを考慮する</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">refresh()</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              <li>特定のサーバーコンポーネントのみを更新</li>
              <li>クライアント状態は保持される</li>
              <li>キャッシュを無視して常に最新データを取得</li>
              <li>最も細かい制御が可能</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="font-bold mb-2">コード例</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto text-sm">
          {`// サーバーコンポーネント
async function ServerData() {
  const data = await fetchLatestData();
  return <div>{data}</div>;
}

// クライアントコンポーネント
"use client";
import { refresh } from "next/cache";

export default function RefreshButton() {
  const handleRefresh = async () => {
    await refresh(); // サーバーコンポーネントを再レンダリング
  };

  return (
    <button onClick={handleRefresh}>
      更新
    </button>
  );
}`}
        </pre>
      </div>
    </div>
  );
}
