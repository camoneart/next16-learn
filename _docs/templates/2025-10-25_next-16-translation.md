# Next.js 16 ブログ記事の日本語翻訳

- **日付**: 2025-10-25 16:55:44
- **概要**: Next.js 16のブログ記事を日本語に翻訳し、Markdownファイルとして保存

## 実装内容

### 使用したツール
- **Firecrawl MCP サーバー**: 記事の取得に使用
  - `mcp__firecrawl__firecrawl_scrape`を使用してMarkdown形式で記事を取得
  - `maxAge`パラメータを3600000（1時間）に設定してキャッシュを活用

### 翻訳アプローチ
1. **構造の保持**: 元の記事の見出し階層、リスト構造、コードブロックをそのまま維持
2. **技術用語の処理**:
   - 固有名詞（Next.js、Turbopack、React Compilerなど）: 原文のまま
   - 一般的な技術用語: 自然な日本語表現を使用
   - 業界で確立された用語: 原文を使用
3. **メタデータの追加**: 翻訳ファイルの冒頭に公開日と原文URLを記載

## 設計意図

### レイアウト保持の理由
- 元の記事の構造を保つことで、読者が原文と照らし合わせて読みやすくする
- コードブロックやリンクは技術的な正確性を保つため変更しない

### 技術用語の処理方針
- **Cache Components**: 新機能名のため原文のまま
- **PPR (Partial Pre-Rendering)**: 略語は原文のまま、初出時に日本語説明を追加
- **Turbopack**: 製品名のため原文のまま
- その他の一般的な技術用語は自然な日本語に翻訳

## 翻訳のポイント

### 主要な翻訳決定
1. **トーンの維持**: 元の記事のフレンドリーで技術的なトーンを日本語でも維持
2. **コードサンプル**: すべてのコードブロックは原文のまま（コメントも含む）
3. **リンク**: すべての外部リンクとアンカーリンクを保持
4. **表形式データ**: Markdownテーブルの構造を完全に保持

### 特に注意した箇所
- Breaking Changesセクション: 正確性が重要なため、技術的な詳細を慎重に翻訳
- APIの変更点: 開発者が理解しやすいよう、わかりやすい日本語表現を使用
- バージョン要件: 数値とバージョン情報は原文のまま保持

## 副作用

### 外部依存
- 元記事内の画像リンクは外部URL（nextjs.orgおよびVercelのストレージ）を参照
- 画像が削除または移動された場合、リンク切れとなる可能性がある

### 保守性
- Next.js 16の正式リリース後、記事内容が更新される可能性がある
- その場合、この翻訳も更新が必要

## 関連ファイル

- **翻訳ファイル**: `/Users/aoyamaisaoosamu/WebDev/playground/251024_next16/next-16/next-16.md`
- **原文URL**: https://nextjs.org/blog/next-16
- **実装ログ**: `/Users/aoyamaisaoosamu/WebDev/playground/251024_next16/_docs/templates/2025-10-25_next-16-translation.md`

## 翻訳統計

- **元記事の公開日**: 2025年10月21日（火曜日）
- **主要セクション数**: 4（新機能と改善、開発者体験、コア機能とアーキテクチャ、Breaking Changes）
- **翻訳した主要機能**:
  - Cache Components
  - Next.js Devtools MCP
  - proxy.ts（旧middleware.ts）
  - Turbopack（安定版）
  - React Compiler Support（安定版）
  - Enhanced Routing and Navigation
  - Improved Caching APIs
