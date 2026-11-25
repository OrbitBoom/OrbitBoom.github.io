import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

function writing(section: "projects" | "research") {
  const base = "./src/content/" + section;
  const pattern = ["**/*.md"];
  // Exclude drafts before Markdown renders, so their embedded images are never emitted.
  if (import.meta.env.PROD) {
    for (const file of globSync("**/*.md", { cwd: base })) {
      const { data } = matter(readFileSync(path.join(base, file), "utf8"));
      if (data.draft === true) pattern.push("!" + file);
    }
  }
  return defineCollection({
    loader: glob({ pattern, base }),
    schema: z.object({
      title: z.string(),
      shortTitle: z.string().optional(),
      summary: z.string(),
      kind: z.string(),
      order: z.number(),
      featured: z.number().optional(),
      draft: z.boolean().default(false),
      topics: z.array(z.string()).default([]),
      repository: z.url().optional(),
      cover: z
        .enum(["words", "flight", "bottle", "road", "market", "python"])
        .optional(),
    }),
  });
}
export const collections = {
  projects: writing("projects"),
  research: writing("research"),
};
