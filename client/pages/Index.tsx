import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/meta/CodeEditor";
import ThemeToggle from "@/components/meta/ThemeToggle";
import { parseMetaFromHtml, toJson, toMarkdown, MetaResult } from "@/lib/meta";
import { AnimatePresence, motion } from "framer-motion";
import { GooglePreview, DiscordPreview, TwitterPreview, LinkedInPreview, FadeIn } from "@/components/meta/previews";
import Footer from "@/components/meta/Footer";
import { toast } from "sonner";

const SAMPLE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>MetaTag Previewer — Test Page</title>
  <meta name="description" content="Preview how your pages appear on Google, Twitter, Discord, and LinkedIn." />
  <meta name="keywords" content="seo, meta tags, open graph, twitter card" />
  <link rel="canonical" href="https://metatag-previewer.dev/example" />
  <meta property="og:title" content="MetaTag Previewer — Test Page" />
  <meta property="og:description" content="Instantly preview SERP and social embeds from your HTML head." />
  <meta property="og:url" content="https://metatag-previewer.dev/example" />
  <meta property="og:image" content="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=1200&q=80" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="MetaTag Previewer — Test Page" />
  <meta name="twitter:description" content="Instant previews for search and social." />
  <meta name="twitter:image" content="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=1200&q=80" />
</head>
</html>`;

export default function Index() {
  const [html, setHtml] = useState<string>(SAMPLE);
  const [data, setData] = useState<MetaResult | null>(null);

  useEffect(() => {
    try {
      const res = parseMetaFromHtml(html);
      setData(res);
    } catch (e) {
      // ignore parse errors
    }
  }, [html]);

  const copy = async (text: string, label?: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(label ? `${label} copied to clipboard` : "Copied to clipboard");
  };

  const download = (filename: string, content: string, type = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const metaList = useMemo(() => {
    if (!data) return [] as { label: string; value: string }[];
    const list: { label: string; value: string }[] = [];
    if (data.title) list.push({ label: "title", value: data.title });
    if (data.description) list.push({ label: "description", value: data.description });
    if (data.canonicalUrl) list.push({ label: "canonical", value: data.canonicalUrl });
    if (data.keywords.length) list.push({ label: "keywords", value: data.keywords.join(", ") });
    Object.entries(data.og).forEach(([k, v]) => list.push({ label: k, value: v }));
    Object.entries(data.twitter).forEach(([k, v]) => list.push({ label: k, value: v }));
    return list;
  }, [data]);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_-10%_-10%,rgba(99,102,241,0.16),transparent),radial-gradient(800px_400px_at_120%_10%,rgba(16,185,129,0.14),transparent)]">
      <motion.header initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }} className="sticky top-0 z-10 border-b border-white/10 bg-background/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-fuchsia-500 to-sky-500 shadow ring-1 ring-white/10" />
            <div className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">MetaTag Previewer</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setHtml(SAMPLE)}>Load Template</Button>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl animate-float" />
        <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl animate-float" />
        <div className="absolute left-1/3 bottom-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
      </div>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-2">
        <section>
          <CodeEditor
            value={html}
            onChange={setHtml}
            onFileLoad={setHtml}
            placeholder={SAMPLE}
            className=""
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => copy(html, "HTML")}>Copy HTML</Button>
            {data && (
              <>
                <Button size="sm" variant="outline" onClick={() => copy(toJson(data), "JSON")}>Copy JSON</Button>
                <Button size="sm" variant="outline" onClick={() => copy(toMarkdown(data), "Markdown")}>Copy Markdown</Button>
                <Button size="sm" variant="ghost" onClick={() => { download("metatag-report.json", toJson(data), "application/json"); toast.success("Exported JSON"); }}>Export JSON</Button>
                <Button size="sm" variant="ghost" onClick={() => { download("metatag-report.md", toMarkdown(data), "text/markdown"); toast.success("Exported Markdown"); }}>Export Markdown</Button>
              </>
            )}
          </div>

          {data && data.warnings.length > 0 && (
            <Card className="mt-4 border-white/10 bg-amber-500/10 p-3">
              <div className="mb-2 text-sm font-medium">Warnings</div>
              <div className="flex flex-wrap gap-2">
                {data.warnings.map((w, i) => (
                  <Badge key={i} variant="secondary" className="bg-amber-500/20 text-amber-600 dark:text-amber-300">{w}</Badge>
                ))}
              </div>
            </Card>
          )}

        </section>

        <section className="flex flex-col">
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="discord">Discord</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            </TabsList>
            <div className="mt-4 h-[340px]">
              <AnimatePresence mode="wait">
                {data && (
                  <>
                    <TabsContent value="google" className="h-full">
                      <FadeIn>
                        <div className="h-full overflow-auto"><GooglePreview data={data} /></div>
                      </FadeIn>
                    </TabsContent>
                    <TabsContent value="discord" className="h-full">
                      <FadeIn>
                        <div className="h-full overflow-auto"><DiscordPreview data={data} /></div>
                      </FadeIn>
                    </TabsContent>
                    <TabsContent value="twitter" className="h-full">
                      <FadeIn>
                        <div className="h-full overflow-auto"><TwitterPreview data={data} /></div>
                      </FadeIn>
                    </TabsContent>
                    <TabsContent value="linkedin" className="h-full">
                      <FadeIn>
                        <div className="h-full overflow-auto"><LinkedInPreview data={data} /></div>
                      </FadeIn>
                    </TabsContent>
                  </>
                )}
              </AnimatePresence>
            </div>
          </Tabs>

          {data && metaList.length > 0 && (
            <Card className="mt-6 border-white/10 p-3">
              <div className="mb-2 text-sm font-medium">Extracted Metadata</div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {metaList.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-2 text-sm">
                    <div className="truncate font-mono text-foreground/70">{item.label}</div>
                    <div className="max-w-[60%] truncate text-right">{item.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
