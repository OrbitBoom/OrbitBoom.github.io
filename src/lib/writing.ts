import { getCollection, type CollectionEntry } from "astro:content";
export type Section = "projects" | "research";
export type Entry = CollectionEntry<Section>;

export async function entries(section: Section) {
  return (
    await getCollection(
      section,
      ({ data }) => import.meta.env.DEV || !data.draft,
    )
  ).sort((a, b) => a.data.order - b.data.order);
}
export const entryUrl = (entry: Entry) =>
  "/" + entry.collection + "/" + entry.id + "/";
