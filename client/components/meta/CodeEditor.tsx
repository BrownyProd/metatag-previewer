import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export type CodeEditorProps = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  onFileLoad?: (content: string) => void;
};

// Very lightweight HTML syntax highlighting
function highlightHtml(code: string) {
  const esc = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc
    .replace(
      /(&lt;!--[\s\S]*?--&gt;)/g,
      '<span class="text-emerald-400/80">$1</span>',
    )
    .replace(
      /(&lt;\/?)([a-zA-Z0-9:-]+)([^&]*?)(\/?&gt;)/g,
      (_m, p1, p2, p3, p4) => {
        const attrs = p3.replace(
          /([a-zA-Z-:]+)(=)("[^"]*"|'[^']*')/g,
          '<span class="text-cyan-300">$1</span>$2<span class="text-amber-300">$3</span>',
        );
        return `<span class="text-fuchsia-300">${p1}</span><span class="text-sky-300">${p2}</span>${attrs}<span class="text-fuchsia-300">${p4}</span>`;
      },
    );
}

export function CodeEditor({
  value,
  onChange,
  className,
  placeholder,
  onFileLoad,
}: CodeEditorProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const html = useMemo(() => highlightHtml(value), [value]);

  const syncScroll = () => {
    const pre = preRef.current;
    const ta = textRef.current;
    if (!pre || !ta) return;
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
  };

  const openFile = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onFileLoad?.(String(reader.result || ""));
    reader.readAsText(f);
  };

  return (
    <div
      className={cn(
        "group relative w-full rounded-xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 text-xs text-foreground/70">
        <div className="font-medium">HTML Head</div>
        <div className="flex items-center gap-2">
          <button
            onClick={openFile}
            className="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15 transition"
          >
            Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".html,.htm,.txt"
            className="hidden"
            onChange={onFile}
          />
        </div>
      </div>
      <div className="relative">
        <pre
          ref={preRef}
          aria-hidden
          className="pointer-events-none m-0 max-h-[60vh] min-h-[260px] w-full overflow-auto rounded-b-xl pl-4 pr-12 pb-4 pt-3 font-mono text-sm leading-6 text-white/90"
        >
          <code
            className="inline-block min-w-max whitespace-pre"
            dangerouslySetInnerHTML={{
              __html: html || (placeholder ? highlightHtml(placeholder) : ""),
            }}
          />
        </pre>
        <textarea
          ref={textRef}
          spellCheck={false}
          wrap="off"
          value={value}
          onScroll={syncScroll}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="absolute inset-0 h-full w-full resize-none rounded-b-xl bg-transparent pl-4 pr-12 pb-4 pt-3 font-mono text-sm leading-6 text-transparent caret-white outline-none selection:bg-white/20 selection:text-transparent whitespace-pre overflow-auto"
        />
      </div>
    </div>
  );
}

export default CodeEditor;
