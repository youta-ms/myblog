import type { Element, Root, RootContent } from "hast";
import type { Plugin } from "unified";

// ```mermaid のコードブロック（<pre><code class="language-mermaid">）を
// <div class="mermaid">…ソース…</div> へ変換するだけの軽量プラグイン。
// 実際の作図はブラウザ側の <Mermaid /> が mermaid を読み込んで行う。
// rehype-mermaid は playwright を要求し静的ビルドに不向きなため自前で用意した。
// 注意1: rehype-pretty-code より前に実行すること（先に mermaid ブロックを抜く）。
// 注意2: pre のままだとコードブロック用 <Pre> に吸収され class が落ちるため div にする。

function getText(node: RootContent): string {
  if (node.type === "text") return node.value;
  if ("children" in node && node.children) {
    return node.children.map(getText).join("");
  }
  return "";
}

function isMermaidCode(node: RootContent): node is Element {
  if (node.type !== "element" || node.tagName !== "code") return false;
  const cls = node.properties?.className;
  const list = Array.isArray(cls) ? cls : typeof cls === "string" ? [cls] : [];
  return list.includes("language-mermaid");
}

function walk(nodes: RootContent[]): void {
  for (const node of nodes) {
    if (node.type !== "element") continue;
    if (
      node.tagName === "pre" &&
      node.children.length === 1 &&
      isMermaidCode(node.children[0])
    ) {
      const source = getText(node.children[0]);
      node.tagName = "div";
      node.properties = { className: ["mermaid"] };
      node.children = [{ type: "text", value: source }];
      continue;
    }
    walk(node.children);
  }
}

export const rehypeMermaidPre: Plugin<[], Root> = () => (tree) => {
  walk(tree.children);
};
