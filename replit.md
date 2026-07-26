# Web

Mobile-first web app. A personal letters gallery built step by step.

## Run & Operate

- `pnpm --filter @workspace/web run dev` — run the web app
- `pnpm --filter @workspace/web run typecheck` — typecheck the web app
- `pnpm --filter @workspace/web run build` — build the web app

## Deploy to Vercel

- Project is configured for Vercel static deployment.
- `vercel.json` at the root sets:
  - Build command: `pnpm --filter @workspace/web run build`
  - Output directory: `artifacts/web/dist/public`
  - Framework: `null` (custom static build)
- `vite.config.ts` falls back to base path `/` and port `3000` when Replit env vars are absent, so it builds cleanly on Vercel.
- Root `package.json` declares `packageManager: "pnpm@10.26.1"` so Vercel uses pnpm.
- To deploy: push to GitHub and import the repository on [vercel.com](https://vercel.com). No backend or database is needed.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web: React + Vite + Tailwind CSS + Framer Motion
- Frontend only — no backend, no database, no API server

## Where things live

- `artifacts/web/src/App.tsx` — main app component
- `artifacts/web/src/index.css` — global styles and grid pattern background
- `artifacts/web/src/main.tsx` — entry point
- `artifacts/web/src/components/FoldedLetter.tsx` — reusable 3-D folded letter component
- `artifacts/web/src/components/LetterStack.tsx` — 3-D swipeable stack of letters

## Architecture decisions

- Frontend-only static app. No backend services.
- Minimal structure: only the files actually needed.
- UI components are added as the project grows, no pre-generated component library.
- The `FoldedLetter` component is controlled by `LetterStack` so the stack can manage open/close and swipe gestures.

## User preferences

- Project structure must be flat and minimal.
- No `artifacts/api-server`, `artifacts/mockup-sandbox`, or pre-generated UI component folders.
- Develop directly on the app.
- Build frontend-only, Vercel-ready projects.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
- See `GLOBAL_PROMPT.md` and `FOLDED_LETTER_COMPONENT.md` for reusable guides.
- See `GUIDE.md` for how to add or replace letters in the gallery.
