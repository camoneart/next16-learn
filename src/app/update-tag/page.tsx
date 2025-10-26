import { Suspense } from "react";
import { updateTag, cacheTag } from "next/cache";

// カウンターのデータを保持（デモ用の簡易的な状態管理）
let counter = 0;

// キャッシュされたカウンターコンポーネント
async function CachedCounter() {
  "use cache";
  cacheTag("counter");
  counter++;
  const timestamp = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 100));
  return (
    <div className="p-4 border rounded bg-green-50">
      <h3 className="font-bold mb-2">キャッシュされたカウンター</h3>
      <p className="text-2xl font-bold">カウント: {counter}</p>
      <p className="text-sm">タイムスタンプ: {timestamp}</p>
      <p className="text-sm text-gray-600 mt-2">
        ※ このデータは &quot;counter&quot; タグでキャッシュされています
      </p>
      <p className="text-sm text-gray-600">
        ※ リロードしても値は変わりません（updateTag実行まで）
      </p>
    </div>
  );
}

// updateTagを実行するServer Action
async function updateAction() {
  "use server";
  await updateTag("counter");
  console.log("updateTag('counter') を実行しました");
}

// updateTagボタン
function UpdateButton() {
  return (
    <form action={updateAction}>
      <button
        type="submit"
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        updateTag(&quot;counter&quot;) を実行
      </button>
    </form>
  );
}

export default function UpdateTagDemo() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">updateTag() デモ</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">機能説明</h2>
        <p className="mb-2">
          <code>updateTag(tag)</code>
          は、キャッシュを無効化せずに更新する新しい関数です。
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>
            revalidateTag()との違い：キャッシュを「無効化」ではなく「更新」します
          </li>
          <li>
            より効率的：既存のキャッシュをベースに差分更新が可能になります
          </li>
          <li>Server Actionsやルートハンドラーで使用します</li>
          <li>
            段階的な更新が可能：全体を再生成せずに特定の部分だけを更新できます
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<div>Loading counter...</div>}>
          <CachedCounter />
        </Suspense>

        <UpdateButton />
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">試してみよう</h3>
        <ol className="list-decimal pl-6 space-y-1">
          <li>最初のカウント値とタイムスタンプを確認してください</li>
          <li>ページをリロードしても値は変わりません（キャッシュが効いています）</li>
          <li>「updateTag(&quot;counter&quot;) を実行」ボタンをクリック</li>
          <li>カウンターが更新され、新しいタイムスタンプが表示されます（キャッシュが更新されました）</li>
        </ol>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold mb-2">revalidateTag() との違い</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">revalidateTag()</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              <li>キャッシュを完全に無効化</li>
              <li>次回アクセス時に全体を再生成</li>
              <li>大きな変更時に適している</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">updateTag()</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              <li>キャッシュを保持したまま更新</li>
              <li>既存のキャッシュをベースに差分更新</li>
              <li>頻繁な小さな更新に適している</li>
              <li>より高速でリソース効率が良い</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="font-bold mb-2">コード例</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto text-sm">
          {`async function CachedData() {
  "use cache";
  cacheTag("data"); // タグを設定
  const data = await fetchData();
  return <div>{data}</div>;
}

// Server Action - 差分更新
async function updateAction() {
  "use server";
  await updateTag("data"); // キャッシュを保持したまま更新
}

// Server Action - 完全無効化
async function revalidateAction() {
  "use server";
  revalidateTag("data"); // キャッシュを完全に無効化
}`}
        </pre>
      </div>
    </div>
  );
}
