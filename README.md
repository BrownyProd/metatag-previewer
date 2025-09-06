# MetaTag Previewer  

**MetaTag Previewer** is a modern, client-side developer tool for SEO and social sharing validation. Paste or upload your HTML `<head>` and instantly preview how your page will appear on:  

- **Google Search (SERP)**  
- **Discord / Slack embeds**  
- **Twitter (X) Cards**  
- **LinkedIn shares**  

🚀 **Live demo**: [meta.brownyprod.xyz](https://meta.brownyprod.xyz)  

**Tech stack:** React + Vite · Tailwind CSS · Framer Motion · Radix UI  

---

## ✨ Features  

- **Editor** → Paste or upload HTML with lightweight syntax highlighting and smooth scrolling  
- **Metadata Parser** → Extracts `<title>`, meta description, keywords, canonical URL, Open Graph, and Twitter tags  
- **Previews** → Real-time Google SERP, Discord/Slack embed, Twitter summary_large_image, LinkedIn share  
- **Warnings** → Detects missing or critical tags (e.g. no description, no `og:image`)  
- **Utilities** → Copy metadata/HTML/JSON/Markdown with feedback toasts  
- **Export** → Download JSON and Markdown SEO reports  
- **Theming** → Dark/light mode toggle, fully responsive, mobile-friendly layout  
- **Design** → Subtle glassmorphism, glowing conic accents, and tasteful Framer Motion animations  

---

## ⚙️ How It Works  

- **Client-side only** → Uses the browser’s `DOMParser` to extract metadata; no data ever leaves your device  
- **Tag coverage**:  
  - **Standard** → `<title>`, `meta[name="description"]`, `meta[name="keywords"]`, `link[rel="canonical"]`  
  - **Open Graph** → `meta[property^="og:"]`  
  - **Twitter** → `meta[name^="twitter:"]` (including `summary_large_image`)  
- **Previews** are approximations of real platforms for quick iteration and validation  

---

## 🚀 Getting Started  

**Requirements** → Node.js 18+ recommended  

Install dependencies:  
```bash
pnpm install
# or
npm install
# or
yarn install
```

Run dev server:  
```bash
pnpm dev
npm run dev
yarn dev
```

Build production:  
```bash
pnpm build
npm run build
yarn build
```

Output → `dist/spa`  

---

## 🌍 Deployment  

Static site – deploy anywhere:  

- **Vercel** → Import repo, framework auto-detects Vite, output `dist/spa`  
- **Netlify** → Set build command `npm run build`, publish dir `dist/spa`  
- **GitHub Pages / Cloudflare Pages** → Serve `dist/spa` after build  

---

## 🧑‍💻 Usage  

1. Paste your HTML `<head>` or upload a `.html/.htm` file  
2. Parser extracts metadata → previews update instantly  
3. Review warnings for missing/invalid tags  
4. Copy or export metadata in JSON/Markdown  

---

## ⚠️ Notes & Limitations  

- Image previews load directly from URLs in your tags → ensure assets are public  
- SERP and embeds are **best-effort approximations**; real platforms may render differently  
- 100% client-side → private, secure, and offline-friendly  

---

## 📂 Project Structure  

```
client/
  pages/Index.tsx       → main app (editor + previews + metadata)
  components/meta/       → editor, previews, theme toggle, footer
  components/ui/         → Radix UI + Tailwind primitives
  lib/meta.ts            → HTML metadata parser + JSON/Markdown helpers
public/                  → static assets
```

---

## 🤝 Contributing  

PRs and issues welcome!  
- Improvements to parsing, previews, or UX  
- Keep the app **static and privacy-first** (no backend)  
