import { Suspense } from "react";
import { revalidateTag, cacheTag } from "next/cache";

// ランダムな数値を生成（重い計算のシミュレーション）
function generateData() {
  const randomNum = Math.floor(Math.random() * 1000);
  const timestamp = Date.now();
  return { randomNum, timestamp };
}

// キャッシュされたデータを取得するコンポーネント
async function CachedData() {
  "use cache";
  cacheTag("my-data");
  const data = generateData();
  await new Promise((resolve) => setTimeout(resolve, 100));
  return (
    <div className="p-4 border rounded bg-green-50">
      <h3 className="font-bold mb-2">キャッシュされたデータ</h3>
      <p>ランダム数値: {data.randomNum}</p>
      <p className="text-sm">タイムスタンプ: {data.timestamp}</p>
      <p className="text-sm text-gray-600 mt-2">
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
  "use server";
  // Next.js 16では第2引数"max"が必要
  revalidateTag("my-data", "max");
  console.log("revalidateTag('my-data', 'max') を実行しました");
}

// クライアントコンポーネント用のボタン
function RevalidateButton() {
  return (
    <form action={revalidateAction}>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        revalidateTag(&quot;my-data&quot;, &quot;max&quot;) を実行
      </button>
    </form>
  );
}

export default function RevalidateTagDemo() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">revalidateTag() デモ</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">機能説明</h2>
        <p className="mb-2">
          <code>revalidateTag(tag)</code>
          は、特定のタグに関連付けられたキャッシュを無効化する関数です。
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Server Actionsやルートハンドラーで使用します</li>
          <li>指定したタグのキャッシュのみを無効化します</li>
          <li>
            revalidatePath()よりも細かい制御が可能（特定のデータのみを更新）
          </li>
          <li>fetchのcacheタグやcacheTag()と組み合わせて使用します</li>
        </ul>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<div>Loading data...</div>}>
          <CachedData />
        </Suspense>

        <RevalidateButton />
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">試してみよう</h3>
        <ol className="list-decimal pl-6 space-y-1">
          <li>最初のランダム数値とタイムスタンプを確認してください</li>
          <li>ページをリロードしても値は変わりません（キャッシュが効いています）</li>
          <li>
            「revalidateTag(&quot;my-data&quot;, &quot;max&quot;) を実行」ボタンをクリック
          </li>
          <li>ページがリロードされ、新しい値が表示されます（キャッシュが無効化されました）</li>
        </ol>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold mb-2">コード例</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
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
