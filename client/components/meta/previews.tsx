import { truncate, MetaResult } from "@/lib/meta";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]", className)}>
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-fuchsia-500/10 via-sky-500/5 to-emerald-500/10 blur-2xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

export const FadeIn: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }} className={className}>
    {children}
  </motion.div>
);

export function GooglePreview({ data }: { data: MetaResult }) {
  const title = data.title ? truncate(data.title, 60) : "Untitled Page";
  const desc = data.description ? truncate(data.description, 155) : "No description provided.";
  const url = data.canonicalUrl || data.og["og:url"] || "https://example.com";
  const display = data.urlDisplay || "example.com";
  return (
    <Panel>
      <div className="space-y-1 p-4">
        <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl leading-6 hover:underline cursor-default">{title}</div>
        <div className="text-[#006621] dark:text-emerald-300 text-sm">{display}</div>
        <div className="text-[#545454] dark:text-zinc-300 text-sm">{desc}</div>
      </div>
    </Panel>
  );
}

export function DiscordPreview({ data }: { data: MetaResult }) {
  const title = data.og["og:title"] || data.title || "Untitled";
  const desc = data.og["og:description"] || data.description || "";
  const domain = data.urlDisplay || "example.com";
  const img = data.image;
  return (
    <Panel>
      <div className="flex gap-4 p-4">
        {img ? (
          <img src={img} alt="preview" className="h-32 w-32 flex-none rounded-lg object-cover" />
        ) : (
          <div className="h-32 w-32 flex-none rounded-lg bg-gradient-to-br from-sky-400/30 to-purple-500/30" />
        )}
        <div className="min-w-0">
          <div className="text-base font-semibold">{truncate(title, 80)}</div>
          <div className="mt-1 text-sm text-foreground/70 overflow-hidden">{desc}</div>
          <div className="mt-2 text-xs text-foreground/60">{domain}</div>
        </div>
      </div>
    </Panel>
  );
}

export function TwitterPreview({ data }: { data: MetaResult }) {
  const title = data.twitter["twitter:title"] || data.og["og:title"] || data.title || "Untitled";
  const desc = data.twitter["twitter:description"] || data.og["og:description"] || data.description || "";
  const domain = data.urlDisplay || "example.com";
  const img = data.twitter["twitter:image"] || data.og["og:image"];
  return (
    <Panel>
      {img ? (
        <img src={img} alt="card" className="h-48 w-full rounded-t-xl object-cover" />
      ) : (
        <div className="h-48 w-full rounded-t-xl bg-gradient-to-br from-emerald-400/20 via-fuchsia-500/20 to-sky-400/20" />
      )}
      <div className="p-4">
        <div className="text-sm font-semibold">{truncate(title, 100)}</div>
        <div className="mt-1 text-sm text-foreground/70 overflow-hidden">{desc}</div>
        <div className="mt-2 text-xs text-foreground/60">{domain}</div>
      </div>
    </Panel>
  );
}

export function LinkedInPreview({ data }: { data: MetaResult }) {
  const title = data.og["og:title"] || data.title || "Untitled";
  const desc = data.og["og:description"] || data.description || "";
  const img = data.og["og:image"] || data.twitter["twitter:image"];
  const domain = data.urlDisplay || "example.com";
  return (
    <Panel>
      <div className="grid grid-cols-3 gap-0">
        <div className="col-span-2 p-4">
          <div className="text-base font-semibold">{truncate(title, 80)}</div>
          <div className="mt-1 text-sm text-foreground/70 overflow-hidden">{desc}</div>
          <div className="mt-2 text-xs text-foreground/60">{domain}</div>
        </div>
        <div className="col-span-1">
          {img ? (
            <img src={img} alt="preview" className="h-full w-full rounded-r-xl object-cover" />
          ) : (
            <div className="h-full w-full rounded-r-xl bg-gradient-to-br from-purple-400/20 to-sky-400/20" />
          )}
        </div>
      </div>
    </Panel>
  );
}
