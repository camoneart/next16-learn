import { Suspense } from 'react';
import { revalidateTag, cacheTag } from 'next/cache';

// ランダムな数値を生成（重い計算のシミュレーション）
function generateData() {
  const randomNum = Math.floor(Math.random() * 1000);
  const timestamp = Date.now();
  return { randomNum, timestamp };
}

// キャッシュされたデータを取得するコンポーネント
async function CachedData() {
  'use cache';
  cacheTag('my-data');
  const data = generateData();
  await new Promise((resolve) => setTimeout(resolve, 100));
  return (
    <div className="rounded border bg-green-50 p-4">
      <h3 className="mb-2 font-bold">キャッシュされたデータ</h3>
      <p>ランダム数値: {data.randomNum}</p>
      <p className="text-sm">タイムスタンプ: {data.timestamp}</p>
      <p className="mt-2 text-sm text-gray-600">
        ※ このデータは &quot;my-data&quot; タグでキャッシュされています
      </p>
      <p className="text-sm text-gray-600">
        ※ リロードしても値は変わりません（revalidateTag実行まで）
      </p>
    </div>
  );
}

// revalidateTagを実行するServer Action
async function revalidateAction() {
  'use server';
  // Next.js 16では第2引数"max"が必要
  revalidateTag('my-data', 'max');
  console.log("revalidateTag('my-data', 'max') を実行しました");
}

// クライアントコンポーネント用のボタン
function RevalidateButton() {
  return (
    <form action={revalidateAction}>
      <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        revalidateTag(&quot;my-data&quot;, &quot;max&quot;) を実行
      </button>
    </form>
  );
}

export default function RevalidateTagDemo() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">revalidateTag() デモ</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">機能説明</h2>
        <p className="mb-2">
          <code>revalidateTag(tag)</code>
          は、特定のタグに関連付けられたキャッシュを無効化する関数です。
        </p>
        <ul className="list-disc space-y-1 pl-6 text-gray-700">
          <li>Server Actionsやルートハンドラーで使用します</li>
          <li>指定したタグのキャッシュのみを無効化します</li>
          <li>revalidatePath()よりも細かい制御が可能（特定のデータのみを更新）</li>
          <li>fetchのcacheタグやcacheTag()と組み合わせて使用します</li>
        </ul>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<div>Loading data...</div>}>
          <CachedData />
        </Suspense>

        <RevalidateButton />
      </div>

      <div className="mt-8 rounded border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 font-bold">試してみよう</h3>
        <ol className="list-decimal space-y-1 pl-6">
          <li>最初のランダム数値とタイムスタンプを確認してください</li>
          <li>ページをリロードしても値は変わりません（キャッシュが効いています）</li>
          <li>「revalidateTag(&quot;my-data&quot;, &quot;max&quot;) を実行」ボタンをクリック</li>
          <li>ページがリロードされ、新しい値が表示されます（キャッシュが無効化されました）</li>
        </ol>
      </div>

      <div className="mt-8 rounded border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="mb-2 font-bold">コード例</h3>
        <pre className="overflow-x-auto rounded bg-gray-800 p-4 text-white">
          {`async function CachedData() {
  "use cache";
  cacheTag("my-data"); // タグを設定
  const data = await fetchData();
  return <div>{data}</div>;
}

// Server Action
async function revalidateAction() {
  "use server";
  revalidateTag("my-data"); // タグを無効化
}`}
        </pre>
      </div>
    </div>
  );
}
