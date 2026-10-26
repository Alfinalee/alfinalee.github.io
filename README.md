# li-yiqian.github.io

Personal site, built with [Astro](https://astro.build) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Add a project

Create `src/content/projects/<slug>.md`:

```md
---
title: Custos
summary: One sentence on what it is.
tags: [AI agents, TypeScript]
date: 2026-10-26
# externalUrl: https://...   # set this to link out instead of getting a detail page
# image: ./custos/cover.png  # optional, path relative to this file; also used as the share image
---

## Problem
## Design
## Result
## What I learned
```

Without `externalUrl`, the page is built at `/projects/<slug>/`. Cards on the home page are sorted newest `date` first.

## Add an article

Create `src/content/writing/<slug>.md` with `title`, `summary`, `topic`, `date` in the frontmatter. There is no writing page yet, so articles aren't rendered until that route is added.

## Links

Footer links (LinkedIn, X, GitHub, email) live in `src/consts.ts`.

Don't add anything under `/solo-business-agent-system/`; that path is served by a separate repo.
