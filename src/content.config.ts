import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      tags: z.array(z.string()).default([]),
      date: z.coerce.date(),
      // If set, the card links here and no detail page is generated.
      externalUrl: z.url().optional(),
      image: image().optional(),
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    topic: z.string(),
    date: z.coerce.date(),
    // Projects that use what the article covers; each project page links back.
    projects: z.array(reference('projects')).default([]),
    // Drafts show up in `npm run dev` but are left out of the deployed site.
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
