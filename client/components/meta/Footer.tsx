import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-10 border-t border-white/10">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="text-sm text-foreground/70">
              © {year}{" "}
              <span className="font-semibold text-foreground">Brown prod</span>.
              All rights reserved.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-full bg-gradient-to-r from-fuchsia-500/20 via-sky-500/20 to-emerald-500/20 px-3 py-1 text-xs text-foreground/70 [background-size:200%_200%] animate-gradient-x-slow"
          >
            Built with React • Tailwind • Framer Motion
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
