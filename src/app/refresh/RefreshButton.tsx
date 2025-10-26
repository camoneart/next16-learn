"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Next.js 16ではrouter.refresh()を使用してサーバーコンポーネントを更新
    router.refresh();
    // 少し待ってからボタンの状態をリセット
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`px-6 py-3 rounded font-semibold transition-colors ${
          isRefreshing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isRefreshing ? "更新中..." : "router.refresh() を実行"}
      </button>

      <div className="text-sm text-gray-600">
        <p>
          ※ Next.js 16では<code>router.refresh()</code>
          を使用してサーバーコンポーネントを再レンダリングします
        </p>
        <p className="mt-1">
          この方法により、ページ全体をリロードせずにサーバーサイドの最新データを取得できます
        </p>
      </div>
    </div>
  );
}
