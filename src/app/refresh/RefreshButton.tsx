'use client';

import { refresh } from 'next/cache';
import { useTransition } from 'react';

export default function RefreshButton() {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      // Next.js 16の新しいrefresh() APIを使用
      refresh();
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleRefresh}
        disabled={isPending}
        className={`rounded px-6 py-3 font-semibold transition-colors ${
          isPending
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isPending ? '更新中...' : 'refresh() を実行'}
      </button>

      <div className="text-sm text-gray-600">
        <p>
          ※ Next.js 16では新しい<code>refresh()</code>
          関数を使用してサーバーコンポーネントを再レンダリングします
        </p>
        <p className="mt-1">
          この方法により、ページ全体をリロードせずにサーバーサイドの最新データを取得できます
        </p>
      </div>
    </div>
  );
}
