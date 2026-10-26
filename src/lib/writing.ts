import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'writing'>;

/** Articles to show: everything in dev, only non-drafts in the deployed build. */
export async function getArticles(): Promise<Article[]> {
  return getCollection('writing', ({ data }) => import.meta.env.DEV || !data.draft);
}

/** Group articles by topic, topics and articles both in alphabetical order. */
export function groupByTopic(articles: Article[]): [string, Article[]][] {
  const groups = new Map<string, Article[]>();
  for (const article of articles) {
    const list = groups.get(article.data.topic) ?? [];
    list.push(article);
    groups.set(article.data.topic, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([topic, list]) => [topic, list.sort((a, b) => a.data.title.localeCompare(b.data.title))]);
}

export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
}
