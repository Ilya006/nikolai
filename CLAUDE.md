# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page landing site for a car-towing service ("Эвакуатор") operating in Нефтеюганск and nearby towns (Пыть-Ях, Сургут). Plain HTML/CSS/JS built with Vite — no UI framework, no client-side router, no component system. The entire page lives in one `index.html`; behavior is a handful of small, independent vanilla JS modules.

The site is explicitly SEO-driven: content, structure, and markup decisions across the page are guided by `/Users/ilya/Projects/Stream/SEO_GUIDE.md` (outside this repo, on the same machine) — a brief covering Yandex-specific SEO requirements, local-SEO/NAP guidance, and a pre-launch checklist. Consult it before making structural/content changes (headings, meta tags, schema, image alt text, etc.).

## Commands

```bash
npm install      # install deps
npm run dev       # Vite dev server on :5173
npm run build     # production build to dist/ (gitignored)
npm run preview   # serve the production build locally
```

There is no lint or test tooling configured in this project — don't invent `npm run lint`/`npm test` commands.

## Architecture

### Stack
- **Vite** as the only build tool (`vite.config.js`), with **vite-plugin-html** (`createHtmlPlugin`) wired in for EJS-style templating (`<% %>`) and data injection via `inject.data`. It's configured but currently unused — no loops/conditionals are in `index.html` right now; if you need to render a repeated block (e.g. a grid of geo-pages or FAQ items) from a data array, this is the mechanism, not a new dependency.
- **Tailwind CSS v3** (`tailwind.config.js` — content globs `index.html` + `src/**/*`) via PostCSS (`postcss.config.js`). No custom theme beyond the `fontFamily.sans` override.
- CSS is loaded via a plain `<link rel="stylesheet" href="/src/styles/style.css">` in `index.html`'s `<head>`, **not** imported from JS. This is deliberate — importing CSS from `main.js` makes Vite inject it via a JS-run `<style>` tag in dev, which causes a visible flash/mispositioning before styles apply. Keep CSS linked in `<head>`, keep JS imports for behavior only.

### Single-file page structure
`index.html` is one long document; sections are identified by `id` and match the nav anchors 1:1 (`#hero`, `#tariffs`, `#request`, `#about`, `#fleet`, `#contacts`). Section background colors alternate `white`/`gray-50` in document order for visual rhythm — if you reorder or insert a section, re-check this alternation, it's manually assigned per section, not computed.

`#contacts` is a `<footer>`, not a `<section>` — it's the last block on the page and doubles as the site footer.

### Sticky header + nav, and the full-viewport hero
`<header>` and `<nav>` are both `position: sticky`, stacked (nav sticks at `top: var(--header-h)` so it sits right under the header). They are **structurally outside** the flex wrapper that contains `#hero` — a `position: sticky` element only sticks within its own parent's box, so if header/nav were inside the same viewport-height wrapper as the hero, they'd stop sticking as soon as you scrolled past one screen. That wrapper now only contains `<section id="hero">` and is sized `min-h-[calc(100svh-var(--header-h,72px)-var(--nav-h,56px))]` so hero+nav+header still fill exactly one screen on load.

`--header-h` and `--nav-h` are runtime CSS custom properties, not hardcoded — `src/script/header-height.js` measures the real rendered height of `<header>`/`<nav>` (via `offsetHeight` + `ResizeObserver`) and writes them onto `document.documentElement.style`. The Tailwind arbitrary-value fallbacks (`72px`, `56px`) only matter for the first paint before that script runs. If you change header/nav padding or content, you don't need to touch the CSS — the JS keeps the calc() in sync automatically.

### Icons: two different systems, don't conflate them
There is no SVG sprite/build pipeline for icons anymore (a `vite-plugin-svg-sprite` setup was tried and removed — see `src/icons/*.svg` for the source files it used to reference, they're still there as raw reference material but nothing imports them).

- **Simple monochrome icons** (phone, checkmark) are pasted as raw `<svg>` markup directly in `index.html`, using `stroke="currentColor"`/`fill="currentColor"` so their color is fully controlled by the wrapping element's Tailwind `text-*` class. Safe to copy-paste these wherever needed.
- **Brand messenger icons** (Telegram/WhatsApp/Viber) are also raw inline `<svg>` in `index.html`, but their coloring is **not** self-contained: they use hashed CSS classes (e.g. `.path-i6o3677ab`, `.stop-i4p9vs72k`) that only exist because they were copied verbatim from an external icon generator's markup, and the colors for those classes are hand-reconstructed in `src/styles/style.css` (grep for "Telegram" / "WhatsApp" / "Viber" there). **If you copy one of these `<svg>` blocks to a new place in the page, the styling still works** (the CSS classes are global), but if you ever replace one of these icons with a fresh copy from the source generator, its hashed class names will be different from what's in `style.css` and you must update the CSS to match, or the icon renders colorless/black.

### Fonts
Self-hosted variable Montserrat, loaded via `@font-face` in `src/styles/fonts.css` (imported by `style.css`). Two files cover every weight/style: `src/styles/Montserrat/Montserrat-VariableFont_wght.ttf` (normal, weight range 100–900) and the `-Italic-` counterpart. `src/styles/_fonts/Montserrat/` is the full original Google Fonts download (every static weight + license/readme) kept only as a source archive — it is not referenced by any code. If the page ever needs to drop the variable-font approach for specific static weights (smaller payload), pull them from `_fonts/` and update `fonts.css`.

### JS modules
`src/script/main.js` is the only entry point (`<script type="module">` in `index.html`) and just imports the feature modules below. Each module is self-contained, queries its own DOM element(s) at the top, and no-ops (`if (el) { ... }`) if that element isn't on the page — so they can be added/removed independently without touching `main.js` beyond the import line.

- `lead-form.js` — handles `#lead-form` submit: client-side required-phone check, disables the submit button and shows an inline status message while in flight, `fetch('/api/lead', …)`. **`/api/lead` does not exist** — there is no backend. This is a known placeholder; wiring a real endpoint (or a third-party form backend / serverless function / Telegram bot webhook) is unfinished work, not a bug.
- `phone-mask.js` — live-formats `#lead-phone` into `+7 (999) 123-45-67` as the user types. Re-derives the formatted value from scratch on every event (`input`, `change`, `paste`, `focus`) by stripping to digits and reformatting — it does not track partial internal state, which is what makes it resilient to autofill/paste filling the whole field at once (a common failure mode for naive character-by-character phone masks). `input` handling is deferred one tick (`setTimeout(fn, 0)`) because some autofill implementations update `.value` after the `input` event fires.
- `header-height.js` — see "Sticky header + nav" above.

### Structured data & content placeholders
There's a `LocalBusiness` JSON-LD block in `<head>`. Company name, phone number (`8 (800) 888-88-88` / `+78008888888`), email (`info@example.com`), messenger usernames (`t.me/username`), and the "8 years / 12 000+ jobs" stats in `#about` are **all placeholders**, marked with `TODO` comments where they appear. Don't treat any of them as real data, and don't invent a fake street address (this was deliberate — see the `TODO` next to the JSON-LD `address` block) — only the city/region are filled in.

`https://example.com` is used as a placeholder domain in `<link rel="canonical">`, the Open Graph/Twitter `og:url`, and in `public/robots.txt` / `public/sitemap.xml` (the `Sitemap:` line and `<loc>`) — all four need updating together once the real domain is known. `og:image`/`twitter:image` point at a picsum placeholder too, marked `TODO` — swap for a real branded 1200×630 image before launch. `public/favicon.svg` is a plain letter-mark ("Э" on brand green), not a real logo.

### SEO/meta files
`public/robots.txt` and `public/sitemap.xml` are static files — Vite copies everything under `public/` verbatim to the root of `dist/` (and serves them at `/robots.txt` / `/sitemap.xml` in dev too), no build step involved. `sitemap.xml` currently lists only the homepage; add an entry per page if the site ever grows beyond one.
