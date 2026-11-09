import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Add one Markdown file in src/content/blog to publish a new article. */
const blog = defineCollection({
  loader: glob({pattern: '**/*.md', base: './src/content/blog'}),
  schema: z.object({
    title: z.string().min(15),
    description: z.string().min(60),
    summary: z.string().min(45),
    category: z.string().min(3),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
