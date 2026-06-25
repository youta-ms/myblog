import type { MDXComponents } from "mdx/types";

// MDX 内の要素を Tailwind Typography(prose) に任せるための最小設定。
// 必要に応じてここで独自コンポーネントを差し込めます。
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
