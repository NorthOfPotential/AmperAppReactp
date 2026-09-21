# Amper — React web version

A React/TypeScript recreation of the Amper Unity app's core experience: browsing
the design-method card deck, viewing card detail (with the same front/back flip),
opening a card's video/template/comic content, and building "mixtape" playlists.

## What this is (and isn't)

This is a web front-end covering the app's UI and content flows, built from the
same design data the Unity project ships in `Assets/_Designer`:

- All 88 cards (Core + Expansion) were extracted from the `CardSO` `.asset`
  files, including their real front/back copy, category/mode tags, and
  front/back/template artwork (see `src/data/cards.json` and `public/cards/`).
- Categories/modes come from `Assets/_Designer/Categories/Category.asset`.
- Video/comic URLs are the same external URLs the Unity cards reference
  (Vimeo file links may have expired signatures; comic panels are hosted on
  imgur and should still load).

Not ported, by design:

- **PlayFab backend.** The original app authenticates and stores
  mixtapes/unlock codes via PlayFab. There's no server here — login/sign-up is
  a local mock, and mixtapes are stored in the browser's `localStorage`. Guest
  unlock codes aren't validated against real data; any non-empty code grants
  guest (Core-only) access, matching the "tailored guest" concept without the
  server-side code lookup.
- **AR card scanning.** The Unity app itself hides the scan button in its own
  WebGL build (`#if UNITY_WEBGL` in `MainMenu.cs`), since Vuforia image
  tracking isn't available in that target. This app mirrors that: the "Scan a
  Card" tile is shown but disabled, same as the original web build.

## Running it

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Structure

- `src/data/` — extracted card/category JSON plus TypeScript types.
- `src/state/` — `AuthContext` (login/guest) and `PlaylistsContext` (mixtapes),
  both persisted to `localStorage`.
- `src/pages/` — one component per screen (login, guest unlock, sign up, main
  menu, browse/filter, card detail, template/comic/video viewers, mixtapes).
- `public/cards/` — card artwork copied out of the Unity project's
  `_Designer` assets by GUID lookup.

Card data can be regenerated from the Unity assets with:

```bash
python3 scripts/extract_cards.py
```

It walks `Assets/_Designer/Cards/**/*.asset` and the sibling `.meta` files
(with PyYAML, treating Unity's custom YAML tags as plain mappings), resolves
`FrontPage`/`BackPage`/`Templates` sprite GUIDs to their source images under
`Assets/_Designer/CardsImages`, and writes `src/data/cards.json` +
`src/data/categories.json` plus the copied images in `public/cards/`.

## Deploying to GitHub Pages

The app is set up to work as a static GitHub Pages site out of the box:

- Routing uses `HashRouter` (URLs look like `#/browse`), so deep links and
  page refreshes work on plain static hosting without a server-side rewrite
  rule.
- `vite.config.ts` sets `base: "./"` so built asset paths are relative and
  work at any subpath (a project page like
  `https://<user>.github.io/<repo>/`, a custom domain, anything).
- `.github/workflows/deploy-pages.yml` builds and deploys on every push to
  `main`.

To turn this on for a repo:

1. Push this code to the repo's `main` branch.
2. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**
   (not "Deploy from a branch").
3. Push (or re-run the workflow from the **Actions** tab) — the site
   publishes at the URL shown on the Pages settings page once the
   `deploy-pages` job finishes.
