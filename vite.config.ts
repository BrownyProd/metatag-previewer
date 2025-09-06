import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Static SPA config
export default defineConfig({
  plugins: [react()],
  base: "/ui.metatag-viewer.com/", // 👈 must start and end with /
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
    },
  },
  build: {
    outDir: "build",
  },
});
