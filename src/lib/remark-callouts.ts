import type { Root } from "mdast";
import type { Plugin } from "unified";

// remark-directive で得られるコンテナディレクティブを、HTML 要素へ変換する。
// 対応記法:
//   :::message            … 情報ボックス（<aside class="callout callout-info">）
//   :::alert              … 警告ボックス（<aside class="callout callout-alert">）
//   :::message{.alert}    … 上のエイリアス（Zenn 風）
//   :::details[タイトル]   … 折りたたみ（<details><summary>タイトル</summary>…）
//
// hName / hProperties を付与して mdast→hast の変換時にタグ名・属性を決める。
// 見た目は globals.css の .callout / details スタイルが受け持つ。

type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: Record<string, string> | null;
  children?: DirectiveChild[];
  data?: Record<string, unknown>;
};

type DirectiveChild = {
  type: string;
  data?: { directiveLabel?: boolean; hName?: string } & Record<string, unknown>;
  children?: DirectiveChild[];
};

function isAlert(node: DirectiveNode): boolean {
  if (node.name === "alert") return true;
  const cls = node.attributes?.class ?? "";
  return cls.split(/\s+/).some((c) => c === "alert" || c === "warning");
}

function transform(node: DirectiveNode): void {
  if (node.type === "containerDirective") {
    const name = node.name;

    if (name === "message" || name === "alert") {
      const variant = isAlert(node) ? "callout-alert" : "callout-info";
      node.data = {
        ...node.data,
        hName: "aside",
        hProperties: { className: ["callout", variant] },
      };
    } else if (name === "details") {
      // ラベル（:::details[...] の [...]）を <summary> に変換する。
      const label = node.children?.find((c) => c.data?.directiveLabel);
      if (label) {
        label.data = { ...label.data, hName: "summary" };
      }
      node.data = {
        ...node.data,
        hName: "details",
        hProperties: { className: ["callout-details"] },
      };
    }
  }

  if (node.children) {
    for (const child of node.children) {
      transform(child as DirectiveNode);
    }
  }
}

export const remarkCallouts: Plugin<[], Root> = () => {
  return (tree) => {
    transform(tree as unknown as DirectiveNode);
  };
};
