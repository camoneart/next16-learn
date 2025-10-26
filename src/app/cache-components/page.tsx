import { Suspense } from 'react';
import { headers } from 'next/headers';

// ランダムな数値を生成して重い計算をシミュレート
function expensiveCalculation() {
  const randomNum = Math.floor(Math.random() * 1000);
  // 重い処理のシミュレーション
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return randomNum;
}

// "use cache"を使わない通常のコンポーネント
async function NormalComponent() {
  // Next.js 16では、new Date()を使う前に動的データソースにアクセスする必要がある
  await headers();
  const time = new Date().toLocaleString('ja-JP');
  const randomNum = expensiveCalculation();
  await new Promise((resolve) => setTimeout(resolve, 100)); // 遅延をシミュレート
  return (
    <div className="rounded border bg-red-50 p-4">
      <h3 className="mb-2 font-bold">通常のコンポーネント（キャッシュなし）</h3>
      <p>レンダリング時刻: {time}</p>
      <p>ランダム数値: {randomNum}</p>
      <p className="mt-2 text-sm text-gray-600">
        ※ リロードするたびに時刻とランダム数値が更新されます
      </p>
    </div>
  );
}

// "use cache"を使ったキャッシュコンポーネント
// 固定の計算結果をキャッシュする
async function CachedComponent() {
  'use cache';
  // キャッシュコンポーネント内では動的データソースは使えないが、
  // 計算結果自体はキャッシュされる
  const randomNum = expensiveCalculation();
  await new Promise((resolve) => setTimeout(resolve, 100)); // 遅延をシミュレート
  return (
    <div className="rounded border bg-green-50 p-4">
      <h3 className="mb-2 font-bold">キャッシュコンポーネント（&quot;use cache&quot;）</h3>
      <p>計算結果（キャッシュ済み）: {randomNum}</p>
      <p className="mt-2 text-sm text-gray-600">
        ※ リロードしても数値が変わりません（キャッシュされています）
      </p>
      <p className="mt-1 text-sm text-gray-600">
        ※ 重い計算も一度だけ実行され、結果がキャッシュされます
      </p>
    </div>
  );
}

export default function CacheComponentsDemo() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Cache Components デモ</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">機能説明</h2>
        <p className="mb-2">
          Cache Componentsは、<code>&quot;use cache&quot;</code>
          ディレクティブを使ってコンポーネント全体をキャッシュできる機能です。
        </p>
        <ul className="list-disc space-y-1 pl-6 text-gray-700">
          <li>キャッシュされたコンポーネントは再計算されません</li>
          <li>サーバーコンポーネントで使用できます</li>
          <li>パフォーマンスの向上に役立ちます</li>
        </ul>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<div>Loading normal component...</div>}>
          <NormalComponent />
        </Suspense>

        <Suspense fallback={<div>Loading cached component...</div>}>
          <CachedComponent />
        </Suspense>
      </div>

      <div className="mt-8 rounded border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 font-bold">試してみよう</h3>
        <ol className="list-decimal space-y-1 pl-6">
          <li>このページをリロードしてください（何度でも）</li>
          <li>通常のコンポーネント：時刻とランダム数値が毎回変わります</li>
          <li>キャッシュコンポーネント：ランダム数値が固定されたまま変わりません</li>
          <li>これがCache Componentsの効果です！計算結果がキャッシュされています</li>
        </ol>
      </div>
    </div>
  );
}
