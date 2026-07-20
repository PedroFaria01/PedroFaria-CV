# Pedro Faria — Interactive Career Journey CV

An interactive, scroll/swipe-driven CV that walks through my career as a series of chapters on
an animated map — from my first contact with programming during a Mechatronics degree to my
current work as a Front End Developer.

**Live site:** https://pedrofaria01.github.io/PedroFaria-CV/

## Features

- Chapter-by-chapter career journey navigated by mouse wheel, touch swipe, keyboard arrows, or
  the progress dots
- Animated world/Portugal map background that highlights each chapter's location
- "About" and "Contact" panels accessible from the header
- Built with accessibility in mind: `aria-live` chapters, focus management on panels, keyboard
  navigation

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [anime.js](https://animejs.com/) for scene/transition animations
- [dotted-map](https://github.com/Guillecabo/dotted-map) for the generated map grids
- [Oxlint](https://oxc.rs/) for linting

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint       # run Oxlint
```

## Project structure

```
src/
  components/     # header, footer, map background, career scene/overlay, info panel, nav arrows
  data/            # career chapters content and generated map grids
  utils/           # animation helpers (anime.js)
  scripts/         # one-off scripts to regenerate the map grid JSON (see below)
```

To regenerate the dotted map data after changing `scripts/gen-map.mjs` or
`scripts/gen-portugal-map.mjs`:

```bash
node scripts/gen-map.mjs
node scripts/gen-portugal-map.mjs
```

## Deployment

The site is built and published to the `gh-pages` branch (classic branch-based GitHub Pages,
no CI required), served at `https://pedrofaria01.github.io/PedroFaria-CV/`
(see `base` in `vite.config.js`):

```bash
npm run build
npx gh-pages -d dist
```
