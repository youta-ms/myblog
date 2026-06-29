"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

// rehype-mermaid の "pre-mermaid" 戦略は ```mermaid ブロックを
// <pre class="mermaid">…ソース…</pre> に変換するだけ（ビルド時に描画しない）。
// 実際の図はこのコンポーネントがブラウザ側で mermaid を読み込んで描画する。
// 静的エクスポート/Netlify でも playwright 不要で動かすための構成。
export function Mermaid() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("div.mermaid")
      );
      if (nodes.length === 0) return;

      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      // テーマ切替時に再描画できるよう、元ソースを data 属性に退避しておく。
      for (const el of nodes) {
        if (!el.dataset.source) el.dataset.source = el.textContent ?? "";
        el.removeAttribute("data-processed");
        el.textContent = el.dataset.source;
      }

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: resolvedTheme === "dark" ? "dark" : "default",
      });

      try {
        await mermaid.run({ nodes });
      } catch {
        /* 構文エラーの図は mermaid 側がエラー表示するため握りつぶす */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resolvedTheme]);

  return null;
}
