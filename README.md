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

画像は `public/images/` に置き、記事から参照します。`next/image` を使った画像は Netlify 上で自動的に最適化（WebP/AVIF 変換・リサイズ）されます。

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

## Netlify へのデプロイ

Next.js ランタイム（`@netlify/plugin-nextjs`）で動かす構成です。`output: "export"` は使わず、SSG/SSR/ISR と `next/image` の自動最適化が利用できます。

1. このリポジトリを GitHub に push。
2. Netlify で **Add new site → Import an existing project** から該当リポジトリを選択。
3. ビルド設定は `netlify.toml` に定義済み（`npm run build` / Node 24 / Next プラグイン）。そのまま **Deploy** すれば公開されます。

公開URL（OGP・sitemap で使う絶対URL）は、Netlify がビルド時に環境変数 `URL` を自動注入するため通常は設定不要です。独自ドメインに切り替える場合のみ、Netlify の環境変数に `NEXT_PUBLIC_SITE_ORIGIN`（例: `https://example.com`）を設定してください。

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
  lib/site.ts               # サイト共通設定（公開URL / SEO）
  app/sitemap.ts            # sitemap.xml 生成
  app/robots.ts             # robots.txt 生成
next.config.ts              # Next ランタイム / MDX 設定
netlify.toml                # Netlify デプロイ設定
biome.json                  # Biome（lint + format）設定
```

## 参考リンク

- Next.js on Netlify（公式）: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- Next.js Image Component: https://nextjs.org/docs/app/api-reference/components/image
- Biome（公式・設定ガイド）: https://biomejs.dev/guides/configure-biome/
- Biome を Next.js で使う: https://www.timsanteford.com/posts/how-to-use-biome-with-next-js-for-linting-and-formatting/
- shadcn/ui: https://ui.shadcn.com/docs/installation/next
- next-mdx-remote: https://github.com/hashicorp/next-mdx-remote
