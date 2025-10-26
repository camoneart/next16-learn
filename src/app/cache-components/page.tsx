import { Suspense } from "react";
import { headers } from "next/headers";

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
  const time = new Date().toLocaleString("ja-JP");
  const randomNum = expensiveCalculation();
  await new Promise((resolve) => setTimeout(resolve, 100)); // 遅延をシミュレート
  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="font-bold mb-2">通常のコンポーネント（キャッシュなし）</h3>
      <p>レンダリング時刻: {time}</p>
      <p>ランダム数値: {randomNum}</p>
      <p className="text-sm text-gray-600 mt-2">
        ※ リロードするたびに時刻とランダム数値が更新されます
      </p>
    </div>
  );
}

// "use cache"を使ったキャッシュコンポーネント
// 固定の計算結果をキャッシュする
async function CachedComponent() {
  "use cache";
  // キャッシュコンポーネント内では動的データソースは使えないが、
  // 計算結果自体はキャッシュされる
  const randomNum = expensiveCalculation();
  await new Promise((resolve) => setTimeout(resolve, 100)); // 遅延をシミュレート
  return (
    <div className="p-4 border rounded bg-green-50">
      <h3 className="font-bold mb-2">
        キャッシュコンポーネント（&quot;use cache&quot;）
      </h3>
      <p>計算結果（キャッシュ済み）: {randomNum}</p>
      <p className="text-sm text-gray-600 mt-2">
        ※ リロードしても数値が変わりません（キャッシュされています）
      </p>
      <p className="text-sm text-gray-600 mt-1">
        ※ 重い計算も一度だけ実行され、結果がキャッシュされます
      </p>
    </div>
  );
}

export default function CacheComponentsDemo() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Cache Components デモ</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">機能説明</h2>
        <p className="mb-2">
          Cache Componentsは、<code>&quot;use cache&quot;</code>
          ディレクティブを使ってコンポーネント全体をキャッシュできる機能です。
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
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

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">試してみよう</h3>
        <ol className="list-decimal pl-6 space-y-1">
          <li>このページをリロードしてください（何度でも）</li>
          <li>
            通常のコンポーネント：時刻とランダム数値が毎回変わります
          </li>
          <li>
            キャッシュコンポーネント：ランダム数値が固定されたまま変わりません
          </li>
          <li>
            これがCache Componentsの効果です！計算結果がキャッシュされています
          </li>
        </ol>
      </div>
    </div>
  );
}
