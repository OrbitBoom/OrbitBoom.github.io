import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("src/content/photography");
const safeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
interface PhotoInput {
  file: string;
  alt: string;
  title?: string;
  caption?: string;
  location?: string;
  camera?: string;
  draft?: boolean;
}
interface CollectionInput {
  title?: string;
  introduction?: string;
  order?: number;
  draft?: boolean;
  photos: PhotoInput[];
}
export interface Photo extends PhotoInput {
  id: string;
  input: string | Buffer;
  width: number;
  height: number;
  widths: number[];
}
export interface Album {
  slug: string;
  title?: string;
  introduction?: string;
  order: number;
  photos: Photo[];
}
export const photoUrl = (photo: Photo, width: number) =>
  "/media/" + photo.id + "-" + width + ".webp";
export const sources = (photo: Photo) =>
  photo.widths.map((w) => photoUrl(photo, w) + " " + w + "w").join(", ");

async function photoEntry(
  slug: string,
  info: PhotoInput,
  input: string | Buffer,
): Promise<Photo> {
  const stem = path.parse(info.file).name;
  if (!safeSlug.test(stem) || !info.alt?.trim())
    throw new Error("Supply a simple filename and alt text for " + info.file);
  const metadata = await sharp(input).metadata();
  const { width, height } = metadata.autoOrient ?? metadata;
  const maxWidth = Math.min(width, 2560);
  const widths = [
    ...new Set([480, 900, 1440, maxWidth].filter((w) => w <= maxWidth)),
  ];
  return { ...info, id: slug + "/" + stem, input, width, height, widths };
}

// The fixture source is generated in memory only when the dev server requests an empty gallery.
async function fixtures(): Promise<Album[]> {
  const photos = await Promise.all(
    [
      [1200, 800],
      [800, 1100],
      [1100, 825],
    ].map(([w, h], i) => {
      const number = String(i + 1);
      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        w +
        '" height="' +
        h +
        '"><rect width="100%" height="100%" fill="' +
        ["#37423d", "#715740", "#4b5360"][i] +
        '"/><path d="M0 0L' +
        w +
        " " +
        h +
        "M" +
        w +
        " 0L0 " +
        h +
        '" stroke="#ffffff55"/><text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="36" fill="white">Development placeholder ' +
        number +
        "</text></svg>";
      return photoEntry(
        "development",
        {
          file: "frame-" + number + ".svg",
          alt: "Development layout placeholder " + number,
        },
        Buffer.from(svg),
      );
    }),
  );
  return [
    {
      slug: "development",
      order: 0,
      title: "Development contact sheet",
      photos,
    },
  ];
}

export async function gallery(dev: boolean): Promise<Album[]> {
  const dirs = await readdir(root, { withFileTypes: true });
  const albums: Album[] = [];
  for (const dir of dirs.filter((d) => d.isDirectory())) {
    const slug = dir.name;
    if (!safeSlug.test(slug))
      throw new Error("Use a lowercase collection slug for " + slug);
    const dirPath = path.join(root, slug);
    const info: CollectionInput = JSON.parse(
      await readFile(path.join(dirPath, "collection.json"), "utf8"),
    );
    if (!dev && info.draft) continue;
    const photos = await Promise.all(
      info.photos
        .filter((p) => dev || !p.draft)
        .map((p) => {
          if (
            path.basename(p.file) !== p.file ||
            !/\.(webp|png|jpe?g)$/i.test(p.file)
          )
            throw new Error("Invalid gallery file " + p.file);
          return photoEntry(slug, p, path.join(dirPath, p.file));
        }),
    );
    if (new Set(photos.map((p) => p.id)).size !== photos.length)
      throw new Error("Repeated photo filename in " + slug);
    if (photos.length)
      albums.push({
        slug,
        title: info.title,
        introduction: info.introduction,
        order: info.order ?? 0,
        photos,
      });
  }
  if (dev && !albums.length) return fixtures();
  return albums.sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}
