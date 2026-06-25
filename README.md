# ひなたの技術メモ

Next.js (App Router) × MDX で作る、IT系の技術ブログです。静的エクスポートして GitHub Pages にデプロイします。

## 技術スタック

- **Next.js 16** (App Router / Turbopack / `output: "export"` で静的書き出し)
- **MDX** … 記事は `src/content/posts/*.mdx`（frontmatter + Markdown + React）
  - `next-mdx-remote` でビルド時にコンパイル → 完全に静的
  - `remark-gfm`（GFM）/ `rehype-slug`（見出しID）/ `rehype-pretty-code` + `shiki`（コードハイライト）
- **Tailwind CSS v4** + **shadcn/ui** + `@tailwindcss/typography`、ブランドアクセント配色
- **next-themes** によるダークモード切替（システム連動 + 手動トグル）
- **フォント**: `next/font/google` の Noto Sans JP（本文）/ JetBrains Mono（コード）。ビルド時に取得・セルフホストされます（**初回ビルドはネットワーク必須**）。
- **記事機能**: タグ別ページ（`/tags`, `/tags/[tag]`）、目次(TOC)、前後ナビ、読了時間
- **Biome**（lint + format を一本化。ESLint / Prettier は不使用）
- **GitHub Pages**（GitHub Actions で自動デプロイ）

## セットアップ

```bash
npm install
npm run dev      # http://localhost:3000
```

ビルド & 静的エクスポート（`out/` に出力）:

```bash
npm run build
npx serve out    # ローカルで静的出力を確認
```

## Lint / Format（Biome）

lint と format は [Biome](https://biomejs.dev/) に統一しています。設定は `biome.json`。

```bash
npm run lint     # biome lint .            （チェックのみ）
npm run format   # biome format --write .  （整形を適用）
npm run check    # biome check --write .   （lint + 整形 + import整理をまとめて適用）
```

- `src/app/globals.css` は Tailwind v4 の独自 at-rule（`@import`, `@plugin`, `@theme` 等）を含むため、Biome の対象から除外しています。
- VS Code を使う場合は拡張機能「Biome」を入れ、既定フォーマッタに設定すると保存時整形が効きます。

## 記事を書く

`src/content/posts/` に `.mdx` を追加するだけで一覧に反映されます。ファイル名が URL のスラッグになります（例: `my-post.mdx` → `/posts/my-post`）。

```mdx
---
title: "記事タイトル"
description: "一覧やOGに使う説明文"
date: "2026-06-24"
tags: ["Next.js", "TypeScript"]
---

本文を Markdown で書きます。コードブロックは自動でハイライトされます。
```

## 画像を入れる

画像は `public/images/` に置き、記事から参照します。`basePath`（GitHub Pages のサブパス）は自動で付与されます。

### 1. Markdown 記法（基本・おすすめ）

plain `<img>` でレンダリングされるため、寸法指定は不要です。手軽に貼るならこちら。

```mdx
![代替テキスト](/images/sample.png)
```

### 2. `next/image`（寸法必須）

遅延読み込みやレイアウトシフト防止を厳密にやりたい場合に。MDX 内に直接 JSX で書けます（`src/components/mdx.tsx` で `Image` を登録済みなので import 不要）。

**`width` / `height` は必須で、値は文字列（`"1200"`）で書きます。** `public/` のパス指定画像は実寸を推定できないため未指定だとエラーになります。

```mdx
<Image src="/images/sample.png" width="1200" height="630" alt="説明" />
```

> ⚠️ 注意: MDX は数値の式属性（`width={1200}`）を脱落させる挙動があり、そのまま書くと `Image with src "..." is missing required "width" property.` というエラーになります。**必ず文字列 `width="1200"` で指定してください**（ラッパー側で number に変換しています）。

寸法が分からない／可変にしたい場合は `fill` を使い、親に高さ（aspect比）を持たせます。

```mdx
<div style={{ position: "relative", aspectRatio: "1200 / 630" }}>
  <Image src="/images/sample.png" fill alt="説明" />
</div>
```

> 補足: この静的エクスポート構成では `next/image` は basePath を自動付与しないため、`src/components/mdx.tsx` のラッパー側で補っています。外部URL（`https://...`）の画像はそのまま使えます（basePath は付きません）。

## GitHub Pages へのデプロイ

1. このリポジトリを GitHub に push（ブランチ `main`）。
2. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に変更。
3. `main` への push で `.github/workflows/deploy.yml` が走り、自動でビルド・公開されます。

### basePath について

`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開する場合、サブパス配信になるため `basePath` が必要です。本構成では GitHub Actions の `configure-pages` が出力する `base_path` を環境変数 `NEXT_PUBLIC_BASE_PATH` 経由で `next.config.ts` に渡し、自動設定します。手元での確認時は未設定（ルート配信）で動きます。

- 独自ドメイン、または `<ユーザー名>.github.io` リポジトリ（ルート配信）の場合は basePath は空のままで OK。

## ディレクトリ構成

```
src/
  app/
    layout.tsx              # ヘッダー/フッター共通レイアウト
    page.tsx                # トップ（記事一覧）
    posts/[slug]/page.tsx   # 記事詳細（generateStaticParams で全記事を静的生成）
  components/               # site-header, post-card, ui/（shadcn）
  content/posts/*.mdx       # 記事本体
  lib/posts.ts              # frontmatter の読み込み・一覧取得
next.config.ts              # 静的エクスポート / basePath / MDX 設定
biome.json                  # Biome（lint + format）設定
.github/workflows/deploy.yml
```

## 参考リンク

- Next.js Static Exports: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Next.js × GitHub Pages サンプル (gregrickaby/nextjs-github-pages): https://github.com/gregrickaby/nextjs-github-pages
- Biome（公式・設定ガイド）: https://biomejs.dev/guides/configure-biome/
- Biome を Next.js で使う: https://www.timsanteford.com/posts/how-to-use-biome-with-next-js-for-linting-and-formatting/
- shadcn/ui: https://ui.shadcn.com/docs/installation/next
- next-mdx-remote: https://github.com/hashicorp/next-mdx-remote
