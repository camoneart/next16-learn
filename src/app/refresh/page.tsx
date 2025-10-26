import { Suspense } from 'react';
import { headers } from 'next/headers';
import RefreshButton from './RefreshButton';

// サーバーコンポーネント：現在の時刻を表示
async function ServerTimeDisplay() {
  await headers();
  const time = new Date().toLocaleString('ja-JP');
  await new Promise((resolve) => setTimeout(resolve, 100));
  return (
    <div className="rounded border bg-blue-50 p-4">
      <h3 className="mb-2 font-bold">サーバーコンポーネント</h3>
      <p className="text-xl" suppressHydrationWarning>
        現在時刻: {time}
      </p>
      <p className="mt-2 text-sm text-gray-600">※ サーバー側でレンダリングされた時刻</p>
    </div>
  );
}

// サーバーコンポーネント：ランダムな数値を表示
async function RandomNumberDisplay() {
  await headers();
  const randomNum = Math.floor(Math.random() * 1000);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return (
    <div className="rounded border bg-green-50 p-4">
      <h3 className="mb-2 font-bold">ランダム数値</h3>
      <p className="text-2xl font-bold" suppressHydrationWarning>
        {randomNum}
      </p>
      <p className="mt-2 text-sm text-gray-600">※ サーバー側で生成されたランダム数値</p>
    </div>
  );
}

export default function RefreshDemo() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">refresh() デモ</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">機能説明</h2>
        <p className="mb-2">
          <code>refresh()</code>
          は、クライアントサイドからサーバーコンポーネントを再レンダリングするための関数です。
        </p>
        <ul className="list-disc space-y-1 pl-6 text-gray-700">
          <li>クライアントコンポーネントから呼び出してサーバーコンポーネントを更新</li>
          <li>ページ全体をリロードせずにサーバーサイドの最新データを取得</li>
          <li>ユーザーインタラクションに応じてデータを更新できる</li>
          <li>キャッシュを無視して常に最新のデータを取得</li>
          <li>Next.js 16の新機能で、より細かいコントロールが可能になりました</li>
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

      <div className="mt-8 rounded border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 font-bold">試してみよう</h3>
        <ol className="list-decimal space-y-1 pl-6">
          <li>現在の時刻とランダム数値を確認してください</li>
          <li>「refresh() を実行」ボタンをクリック</li>
          <li>ページ全体がリロードされずに、サーバーデータが更新されます</li>
          <li>時刻とランダム数値が新しい値に変わります</li>
        </ol>
      </div>

      <div className="mt-8 rounded border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="mb-2 font-bold">他の更新方法との違い</h3>
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

      <div className="mt-8 rounded border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 font-bold">コード例</h3>
        <pre className="overflow-x-auto rounded bg-gray-800 p-4 text-sm text-white">
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
