# Next.js 16

**公開日:** 2025年10月21日（火曜日）

**原文:** https://nextjs.org/blog/next-16

---

投稿者: Jimmy Lai (@feedthejim), Josh Story (@joshcstory), Sebastian Markbåge (@sebmarkbage), Tim Neutkens (@timneutkens)

来たる[Next.js Conf 2025](https://nextjs.org/conf)に先駆けて、Next.js 16が利用可能になったよ。

このリリースでは、Turbopack、キャッシング、そしてNext.jsアーキテクチャに関する最新の改善が提供されているんだ。前回のベータリリース以降、いくつかの新機能と改善が追加されたよ：

- [**Cache Components**](#cache-components): Partial Pre-Rendering (PPR)と`use cache`を使った瞬時のナビゲーションを実現する新しいモデル
- [**Next.js Devtools MCP**](#nextjs-devtools-mcp): デバッグとワークフローを改善するModel Context Protocol統合
- [**Proxy**](#proxyts-formerly-middlewarets): ネットワーク境界を明確にするため、Middlewareが`proxy.ts`に置き換えられた
- [**DX**](#logging-improvements): ビルドと開発リクエストのロギング改善

念のため、以下の機能は前回のベータリリースから利用可能だったものだよ：

- [**Turbopack (安定版)**](#turbopack-stable): すべてのアプリでデフォルトのバンドラーとなり、Fast Refreshが最大5-10倍高速化、ビルドが2-5倍高速化
- [**Turbopack File System Caching (ベータ版)**](#turbopack-file-system-caching-beta): 最大規模のアプリでもさらに高速な起動とコンパイル時間を実現
- [**React Compiler Support (安定版)**](#react-compiler-support-stable): 自動メモ化のための組み込み統合
- [**Build Adapters API (アルファ版)**](#build-adapters-api-alpha): ビルドプロセスを変更するカスタムアダプターの作成
- [**Enhanced Routing**](#enhanced-routing-and-navigation): レイアウトの重複排除とインクリメンタルなプリフェッチによるナビゲーションとプリフェッチの最適化
- [**Improved Caching APIs**](#improved-caching-apis): 新しい`updateTag()`と改良された`revalidateTag()`
- [**React 19.2**](#react-192-and-canary-features): View Transitions、`useEffectEvent()`、`<Activity/>`
- [**Breaking Changes**](#breaking-changes-and-other-updates): 非同期params、`next/image`のデフォルト値など

Next.js 16にアップグレードする：

```bash
# 自動アップグレードCLIを使用
npx @next/codemod@canary upgrade latest

# ...または手動でアップグレード
npm install next@latest react@latest react-dom@latest

# ...または新しいプロジェクトを開始
npx create-next-app@latest
```

コードモッドがコードを完全に移行できないケースについては、[アップグレードガイド](https://nextjs.org/docs/app/guides/upgrading/version-16)を読んでね。

## 新機能と改善

### Cache Components

Cache Componentsは、Next.jsでのキャッシングをより明示的で柔軟にするために設計された新機能セットなんだ。新しい`"use cache"`ディレクティブを中心としていて、ページ、コンポーネント、関数のキャッシュに使用でき、コンパイラを活用して使用される場所で自動的にキャッシュキーを生成するんだよ。

以前のApp Routerで見られた暗黙的なキャッシングとは異なり、Cache Componentsによるキャッシングは完全にオプトインなんだ。すべてのページ、レイアウト、またはAPIルート内の動的コードは、デフォルトでリクエスト時に実行されるため、Next.jsは開発者がフルスタックアプリケーションフレームワークに期待するものとより整合性のある、箱から出してすぐ使える体験を提供するんだ。

Cache Componentsは、2023年に最初に導入されたPartial Prerendering (PPR)のストーリーも完成させるよ。PPR以前は、Next.jsは各URLを静的にレンダリングするか動的にレンダリングするかを選択する必要があり、中間はなかったんだ。PPRはこの二分法を排除し、開発者が完全に静的なページの高速な初期ロードを犠牲にすることなく、静的ページの一部を(Suspenseを介して)動的レンダリングにオプトインできるようにしたんだよ。

`next.config.ts`ファイルでCache Componentsを有効にできるよ：

```typescript
const nextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

10月22日の[Next.js Conf 2025](https://nextjs.org/conf)でCache Componentsとその使い方についてさらに詳しく共有するし、今後数週間でブログとドキュメントでさらにコンテンツを共有していく予定だよ。

> **注意:** ベータリリースで以前発表されたように、以前の実験的な`experimental.ppr`フラグと設定オプションは、Cache Components設定に置き換わり削除されたんだ。

詳細はドキュメント[こちら](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)で確認してね。

### Next.js Devtools MCP

Next.js 16は**Next.js DevTools MCP**を導入するよ。これは、アプリケーションに関するコンテキスト情報を使ったAI支援デバッグのためのModel Context Protocol統合なんだ。

Next.js DevTools MCPは、AIエージェントに以下を提供するんだ：

- **Next.jsの知識**: ルーティング、キャッシング、レンダリングの動作
- **統合ログ**: コンテキストを切り替えることなくブラウザとサーバーのログを表示
- **自動エラーアクセス**: 手動でコピーすることなく詳細なスタックトレースを取得
- **ページ認識**: アクティブなルートのコンテキスト理解

これにより、AIエージェントが開発ワークフロー内で直接問題を診断し、動作を説明し、修正を提案できるようになるんだよ。

詳細はドキュメント[こちら](https://nextjs.org/docs/app/guides/mcp)で確認してね。

### `proxy.ts` (旧 `middleware.ts`)

`proxy.ts`は`middleware.ts`を置き換え、アプリのネットワーク境界を明示的にするんだ。`proxy.ts`はNode.jsランタイムで実行されるよ。

- **やること**: `middleware.ts` → `proxy.ts`にリネームして、エクスポートされた関数を`proxy`にリネーム。ロジックは同じまま。
- **理由**: より明確な命名と、リクエストインターセプションのための単一で予測可能なランタイム。

```typescript
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}
```

> **注意:** `middleware.ts`ファイルはEdgeランタイムのユースケースで引き続き利用可能だけど、非推奨であり、将来のバージョンで削除される予定だよ。

詳細はドキュメント[こちら](https://nextjs.org/docs/app/getting-started/proxy)で確認してね。

### ロギングの改善

Next.js 16では、開発リクエストログが拡張されて、どこに時間が費やされているかが表示されるようになったよ。

- Compile: ルーティングとコンパイル
- Render: コードの実行とReactレンダリング

ビルドも拡張されて、どこに時間が費やされているかが表示されるようになったんだ。ビルドプロセスの各ステップが、完了にかかった時間とともに表示されるよ。

```bash
   ▲ Next.js 16 (Turbopack)

 ✓ Compiled successfully in 615ms
 ✓ Finished TypeScript in 1114ms
 ✓ Collecting page data in 208ms
 ✓ Generating static pages in 239ms
 ✓ Finalizing page optimization in 5ms
```

---

以下の機能は、ベータリリースで[以前に](https://nextjs.org/blog/next-16-beta)発表されたものだよ：

### 開発者体験

#### Turbopack (安定版)

Turbopackは、開発とプロダクションビルドの両方で安定性に達し、すべての新しいNext.jsプロジェクトでデフォルトのバンドラーになったんだ。今年の夏のベータリリース以降、採用は急速に拡大していて、Next.js 15.3+での開発セッションの50%以上、プロダクションビルドの20%がすでにTurbopackで実行されているよ。

Turbopackを使うと、以下が期待できるんだ：

- プロダクションビルドが2-5倍高速化
- Fast Refreshが最大10倍高速化

すべてのNext.js開発者にこれらのパフォーマンス向上をもたらすため、設定不要でTurbopackをデフォルトにしているよ。カスタムwebpack設定を持つアプリの場合、以下を実行してwebpackを引き続き使用できるんだ：

```bash
next dev --webpack
next build --webpack
```

#### Turbopack File System Caching (ベータ版)

Turbopackは開発環境でのファイルシステムキャッシングをサポートするようになり、実行間でコンパイラのアーティファクトをディスクに保存することで、特に大規模プロジェクトでの再起動時のコンパイル時間が大幅に高速化されるんだ。

設定でファイルシステムキャッシングを有効にするよ：

```typescript
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
```

すべての内部Vercelアプリはすでにこの機能を使用していて、大規模リポジトリ全体で開発者の生産性に顕著な改善が見られているよ。

ファイルシステムキャッシングを反復していく中で、フィードバックを聞きたいんだ。ぜひ試してみて、体験を共有してね。

#### シンプルになった `create-next-app`

`create-next-app`は、シンプルになったセットアップフロー、更新されたプロジェクト構造、改善されたデフォルト値で再設計されたよ。新しいテンプレートには、デフォルトでApp Router、TypeScript優先の設定、Tailwind CSS、ESLintが含まれているんだ。

#### Build Adapters API (アルファ版)

[Build Adapters RFC](https://github.com/vercel/next.js/discussions/77740)に続いて、コミュニティとデプロイメントプラットフォームと協力して、Build Adapters APIの最初のアルファバージョンを提供したんだ。

Build Adaptersを使うと、ビルドプロセスにフックするカスタムアダプターを作成でき、デプロイメントプラットフォームやカスタムビルド統合がNext.js設定を変更したり、ビルド出力を処理したりできるようになるよ。

```javascript
const nextConfig = {
  experimental: {
    adapterPath: require.resolve('./my-adapter.js'),
  },
};

module.exports = nextConfig;
```

[RFCディスカッション](https://github.com/vercel/next.js/discussions/77740)でフィードバックを共有してね。

#### React Compiler Support (安定版)

React Compilerの組み込みサポートは、React Compilerの1.0リリースに続いて、Next.js 16で安定版になったよ。React Compilerはコンポーネントを自動的にメモ化し、手動でのコード変更なしで不要な再レンダリングを削減するんだ。

`reactCompiler`設定オプションは、`experimental`から安定版に昇格したよ。異なるアプリケーションタイプでビルドパフォーマンスデータを収集し続けているため、デフォルトでは有効になっていないんだ。React CompilerはBabelに依存しているため、このオプションを有効にすると、開発中およびビルド中のコンパイル時間が長くなることが予想されるよ。

```typescript
const nextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

React Compilerプラグインの最新バージョンをインストールしてね：

```bash
npm install babel-plugin-react-compiler@latest
```

### コア機能とアーキテクチャ

#### Enhanced Routing and Navigation

Next.js 16には、ルーティングとナビゲーションシステムの完全な見直しが含まれていて、ページ遷移がよりスリムで高速になったんだ。

**レイアウトの重複排除**: 共有レイアウトを持つ複数のURLをプリフェッチする際、レイアウトは各Linkごとに個別にダウンロードされるのではなく、一度だけダウンロードされるよ。たとえば、50個の製品リンクを持つページは、共有レイアウトを50回ではなく1回ダウンロードするため、ネットワーク転送サイズが劇的に削減されるんだ。

**インクリメンタルなプリフェッチ**: Next.jsは、ページ全体ではなく、まだキャッシュにない部分のみをプリフェッチするようになったよ。プリフェッチキャッシュは今：

- リンクがビューポートを離れたときにリクエストをキャンセル
- ホバー時またはビューポートに再度入ったときにリンクのプリフェッチを優先
- データが無効化されたときにリンクを再プリフェッチ
- Cache Componentsのような今後の機能とシームレスに連携

**トレードオフ**: 個別のプリフェッチリクエストが増える可能性があるけど、総転送サイズははるかに小さくなるよ。これはほぼすべてのアプリケーションにとって正しいトレードオフだと信じているんだ。リクエスト数の増加が問題を引き起こす場合は、教えてほしいんだ。データチャンクをより効率的にインライン化するための追加の最適化に取り組んでいるよ。

これらの変更はコードの変更を必要とせず、すべてのアプリでパフォーマンスを向上させるように設計されているんだ。

#### Improved Caching APIs

Next.js 16では、キャッシュ動作をより明示的に制御するための洗練されたキャッシングAPIが導入されたよ。

##### `revalidateTag()` (更新)

`revalidateTag()`は、stale-while-revalidate (SWR)動作を有効にするために、2番目の引数として**[`cacheLife`プロファイル](https://nextjs.org/docs/app/api-reference/functions/cacheLife#reference)**を必要とするようになったんだ：

```typescript
import { revalidateTag } from 'next/cache';

// ✅ 組み込みcacheLifeプロファイルを使用（ほとんどのケースで'max'を推奨）
revalidateTag('blog-posts', 'max');

// または他の組み込みプロファイルを使用
revalidateTag('news-feed', 'hours');
revalidateTag('analytics', 'days');

// またはカスタム再検証時間を持つインラインオブジェクトを使用
revalidateTag('products', { revalidate: 3600 });

// ⚠️ 非推奨 - 単一引数形式
revalidateTag('blog-posts');
```

プロファイル引数は、組み込みの`cacheLife`プロファイル名（`'max'`、`'hours'`、`'days'`など）または`next.config`で定義された[カスタムプロファイル](https://nextjs.org/docs/app/api-reference/functions/cacheLife#defining-reusable-cache-profiles)を受け入れるよ。インライン`{ expire: number }`オブジェクトを渡すこともできるんだ。ほとんどのケースで`'max'`を使うことを推奨するよ。これは長期コンテンツのバックグラウンド再検証を有効にするからね。ユーザーがタグ付けされたコンテンツをリクエストすると、Next.jsがバックグラウンドで再検証している間、すぐにキャッシュされたデータを受け取るんだ。

stale-while-revalidate動作で適切にタグ付けされたキャッシュエントリのみを無効化したい場合は、`revalidateTag()`を使うよ。これは、最終的な整合性を許容できる静的コンテンツに理想的なんだ。

> **移行ガイダンス**: SWR動作のために`cacheLife`プロファイル（`'max'`を推奨）を持つ2番目の引数を追加するか、read-your-writesセマンティクスが必要な場合はServer Actionsで`updateTag()`を使ってね。

##### `updateTag()` (新機能)

`updateTag()`は、**read-your-writes**セマンティクスを提供する新しいServer Actions専用APIで、同じリクエスト内でキャッシュを期限切れにし、即座に新しいデータを読み取るんだ：

```typescript
'use server';

import { updateTag } from 'next/cache';

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile);

  // キャッシュを期限切れにして即座に更新 - ユーザーはすぐに変更を確認できる
  updateTag(`user-${userId}`);
}
```

これにより、インタラクティブな機能が変更を即座に反映することが保証されるんだ。フォーム、ユーザー設定、ユーザーが更新を即座に確認することを期待するワークフローに最適だよ。

##### `refresh()` (新機能)

`refresh()`は、**キャッシュされていないデータのみ**を更新するための新しいServer Actions専用APIなんだ。キャッシュには一切触れないよ：

```typescript
'use server';

import { refresh } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  // データベース内の通知を更新
  await db.notifications.markAsRead(notificationId);

  // ヘッダーに表示される通知カウントを更新
  // (これは個別に取得され、キャッシュされていない)
  refresh();
}
```

このAPIは、クライアント側の`router.refresh()`を補完するものなんだ。アクションを実行した後、ページの他の場所に表示されているキャッシュされていないデータを更新する必要がある場合に使うよ。キャッシュされたページシェルと静的コンテンツは高速なままで、通知カウント、ライブメトリクス、ステータスインジケーターのような動的データが更新されるんだ。

#### React 19.2とCanary機能

Next.js 16のApp Routerは、最新のReact [Canaryリリース](https://react.dev/blog/2023/05/03/react-canaries)を使用していて、新しくリリースされたReact 19.2機能と、段階的に安定化されている他の機能が含まれているよ。ハイライトは以下：

- **[View Transitions](https://react.dev/reference/react/ViewTransition)**: TransitionまたはNavigation内で更新される要素をアニメーション化
- **[`useEffectEvent`](https://react.dev/reference/react/useEffectEvent)**: Effectから非リアクティブなロジックを再利用可能なEffect Event関数に抽出
- **[Activity](https://react.dev/reference/react/Activity)**: 状態を維持しEffectをクリーンアップしながら、`display: none`でUIを非表示にして「バックグラウンドアクティビティ」をレンダリング

詳細は[React 19.2のアナウンス](https://react.dev/blog/2025/10/01/react-19-2)で確認してね。

### Breaking Changesとその他の更新

#### バージョン要件

| 変更              | 詳細                                                               |
| ----------------- | ------------------------------------------------------------------ |
| **Node.js 20.9+** | 最小バージョンは20.9.0 (LTS)に; Node.js 18はサポートされなくなった |
| **TypeScript 5+** | 最小バージョンは5.1.0に                                            |
| **ブラウザ**      | Chrome 111+、Edge 111+、Firefox 111+、Safari 16.4+                 |

#### 削除

以前非推奨とされていたこれらの機能が削除されたよ：

| 削除されたもの                                          | 代替                                                                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AMPサポート**                                         | すべてのAMP APIと設定が削除された (`useAmp`、`export const config = { amp: true }`)                                                                     |
| **`next lint`コマンド**                                 | BiomeまたはESLintを直接使用; `next build`はリンティングを実行しなくなった。コードモッドが利用可能: `npx @next/codemod@canary next-lint-to-eslint-cli .` |
| **`devIndicators`オプション**                           | `appIsrStatus`、`buildActivity`、`buildActivityPosition`が設定から削除された。インジケーターは残る。                                                    |
| **`serverRuntimeConfig`、`publicRuntimeConfig`**        | 環境変数(`.env`ファイル)を使用                                                                                                                          |
| **`experimental.turbopack`の場所**                      | 設定がトップレベルの`turbopack`に移動 (`experimental`内ではなくなった)                                                                                  |
| **`experimental.dynamicIO`フラグ**                      | `cacheComponents`にリネーム                                                                                                                             |
| **`experimental.ppr`フラグ**                            | PPRフラグは削除; Cache Componentsプログラミングモデルに進化中                                                                                           |
| **`export const experimental_ppr`**                     | ルートレベルのPPRエクスポートは削除; Cache Componentsプログラミングモデルに進化中                                                                       |
| **自動`scroll-behavior: smooth`**                       | オプトインするにはHTML documentに`data-scroll-behavior="smooth"`を追加                                                                                  |
| **`unstable_rootParams()`**                             | 今後のマイナーリリースで提供予定の代替APIに取り組み中                                                                                                   |
| **同期`params`、`searchParams` props**アクセス          | 非同期で使う必要がある: `await params`、`await searchParams`                                                                                            |
| **同期`cookies()`、`headers()`、`draftMode()`**アクセス | 非同期で使う必要がある: `await cookies()`、`await headers()`、`await draftMode()`                                                                       |
| **Metadataイメージルートの`params`引数**                | 非同期`params`に変更; `generateImageMetadata`からの`id`は`Promise<string>`に                                                                            |
| **`next/image`のローカルsrcとクエリ文字列**             | 列挙攻撃を防ぐため、`images.localPatterns`設定が必要に                                                                                                  |

#### 動作変更

Next.js 16でこれらの機能は新しいデフォルト動作を持つようになったよ：

| 変更された動作                             | 詳細                                                                                                                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **デフォルトバンドラー**                   | Turbopackがすべてのアプリのデフォルトバンドラーに; `next build --webpack`でオプトアウト                                                                                |
| **`images.minimumCacheTTL`のデフォルト**   | 60秒から4時間(14400秒)に変更; cache-controlヘッダーなしの画像の再検証コストを削減                                                                                      |
| **`images.imageSizes`のデフォルト**        | デフォルトサイズから`16`を削除 (プロジェクトの4.2%のみが使用); srcsetサイズとAPIバリエーションを削減                                                                   |
| **`images.qualities`のデフォルト**         | `[1..100]`から`[75]`に変更; `quality` propは`images.qualities`の最も近い値に強制される                                                                                 |
| **`images.dangerouslyAllowLocalIP`**       | 新しいセキュリティ制限がデフォルトでローカルIP最適化をブロック; プライベートネットワークのみ`true`に設定                                                               |
| **`images.maximumRedirects`のデフォルト**  | 無制限から最大3リダイレクトに変更; 無効にするには`0`に設定、またはレアケースのために増やす                                                                             |
| **`@next/eslint-plugin-next`のデフォルト** | ESLint Flat Config形式がデフォルトに。ESLint v10でレガシー設定サポートが削除されることに対応                                                                           |
| **プリフェッチキャッシュの動作**           | レイアウトの重複排除とインクリメンタルなプリフェッチによる完全な書き直し                                                                                               |
| **`revalidateTag()`のシグネチャ**          | stale-while-revalidate動作のために2番目の引数として`cacheLife`プロファイルが必要に                                                                                     |
| **TurbopackでのBabel設定**                 | babel設定が見つかった場合、自動的にBabelを有効化 (以前はハードエラーで終了)                                                                                            |
| **ターミナル出力**                         | より明確なフォーマット、より良いエラーメッセージ、改善されたパフォーマンスメトリクスで再設計                                                                           |
| **開発とビルドの出力ディレクトリ**         | `next dev`と`next build`が別々の出力ディレクトリを使用し、同時実行を可能に                                                                                             |
| **ロックファイルの動作**                   | 同じプロジェクトで複数の`next dev`または`next build`インスタンスを防ぐロックファイルメカニズムを追加                                                                   |
| **Parallel routesの`default.js`**          | すべてのparallel routeスロットで明示的な`default.js`ファイルが必要に; ない場合はビルドが失敗。以前の動作のために`notFound()`を呼び出すか`null`を返す`default.js`を作成 |
| **モダンSass API**                         | `sass-loader`をv16にバージョンアップ。モダンSass構文と新機能をサポート                                                                                                 |

#### 非推奨

これらの機能はNext.js 16で非推奨とされ、将来のバージョンで削除される予定だよ：

| 非推奨                            | 詳細                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `middleware.ts`ファイル名         | ネットワーク境界とルーティングフォーカスを明確にするため`proxy.ts`にリネーム                          |
| `next/legacy/image`コンポーネント | 改善されたパフォーマンスと機能のために`next/image`を使用                                              |
| `images.domains`設定              | 改善されたセキュリティ制限のために`images.remotePatterns`設定を使用                                   |
| `revalidateTag()`の単一引数       | SWRには`revalidateTag(tag, profile)`を使用、またはActionsでread-your-writesには`updateTag(tag)`を使用 |

#### その他の改善

- **パフォーマンス改善**: `next dev`と`next start`コマンドに対する大幅なパフォーマンス最適化
- **`next.config.ts`のためのNode.jsネイティブTypeScript**: `--experimental-next-config-strip-types`フラグを付けて`next dev`、`next build`、`next start`コマンドを実行すると、`next.config.ts`のネイティブTypeScriptが有効になる。

ドキュメントで安定版リリースに先駆けて、より包括的な移行ガイドを共有することを目指しているよ。

## フィードバックとコミュニティ

フィードバックを共有して、Next.jsの未来を形作ることに協力してね：

- [GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [GitHub Issues](https://github.com/vercel/next.js/issues)
- [Discord Community](https://nextjs.org/discord)

## 貢献者

Next.jsは、3,000人以上の個人開発者の総合的な作業の結果なんだ。このリリースは以下の方々によって実現されたよ：

- **Next.js**チーム: Andrew、Hendrik、Janka、Jiachi、Jimmy、Jiwon、JJ、Josh、Jude、Sam、Sebastian、Sebbie、Wyatt、Zack
- **Turbopack**チーム: Benjamin、Josh、Luke、Niklas、Tim、Tobias、Will
- **Next.js Docs**チーム: Delba、Rich、Ismael、Joseph

@mischnic、@timneutkens、@unstubbable、@wyattjoh、@Cy-Tek、@lukesandberg、@OoMNoO、@ztanner、@icyJoseph、@huozhi、@gnoff、@ijjk、@povilasv、@dwrth、@obendev、@aymericzip、@devjiwonchoi、@SyMind、@vercel-release-bot、@Shireee、@eps1lon、@dharun36、@kachkaev、@bgw、@yousefdawood7、@TheAlexLichter、@sokra、@ericx0099、@leerob、@Copilot、@fireairforce、@fufuShih、@anvibanga、@hayes、@Milancen123、@martinfrancois、@lubieowoce、@gaojude、@lachlanjc、@liketiger、@styfle、@aaronbrown-vercel、@Samii2383、@FelipeChicaiza、@kevva、@m1abdullahh、@F7b5、@Anshuman71、@RobertFent、@poteto、@chloe-yan、@sireesha-siri、@brian-lou、@joao4xz、@stefanprobst、@samselikoff、@acdlite、@gwkline、@bgub、@brock-statsig、@karlhorkyの皆さん、協力ありがとう！
