import type { APIRoute } from "astro";
import sharp from "sharp";
import { gallery, type Photo } from "../../lib/gallery";

export async function getStaticPaths() {
  const albums = await gallery(import.meta.env.DEV);
  return albums.flatMap((album) =>
    album.photos.flatMap((photo) =>
      photo.widths.map((width) => ({
        params: { file: photo.id + "-" + width },
        props: { photo, width },
      })),
    ),
  );
}
export const GET: APIRoute<{ photo: Photo; width: number }> = async ({
  props,
}) => {
  const bytes = await sharp(props.photo.input)
    .rotate()
    .resize({ width: props.width })
    .webp({ quality: 83 })
    .toBuffer();
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": "image/webp" },
  });
};
