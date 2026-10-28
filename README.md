# alfinalee.github.io

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

Create `src/content/writing/<slug>.md`:

```md
---
title: Notes on RAG
summary: One or two sentences on what it covers.
topic: RAG                 # articles are grouped by topic on /writing/
date: 2026-10-26
projects: [brain, custos]  # project file names; each project page links back
draft: true                # visible in `npm run dev`, hidden on the live site
---
```

Set `draft: false` (or delete the line) to publish. The "Writing" link in the header appears once at least one article is published.

## Links

Footer links (LinkedIn, X, GitHub, email) live in `src/consts.ts`.

Don't add anything under `/solo-business-agent-system/`; that path is served by a separate repo.
