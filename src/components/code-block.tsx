"use client";

import { Check, Copy } from "lucide-react";
import { type ComponentProps, useRef, useState } from "react";

export function Pre({ children, ...props }: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const lang = (props as Record<string, string>)["data-language"] ?? "code";

  async function onCopy() {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard 不可環境では無視 */
    }
  }

  return (
    <div className="not-prose group my-6 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-white/10 border-b bg-[#1b1f23] px-4 py-1.5">
        <span className="font-mono text-xs text-zinc-400">{lang}</span>
        <button
          type="button"
          onClick={onCopy}
          aria-label="コードをコピー"
          className="inline-flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              コピーしました
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              コピー
            </>
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        {...props}
        className="m-0 overflow-x-auto rounded-none p-4 text-sm"
      >
        {children}
      </pre>
    </div>
  );
}
