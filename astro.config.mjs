import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { gallery } from "./src/lib/gallery.ts";

const hasPhotos = (await gallery(false)).length > 0;
export default defineConfig({
  site: "https://orbitboom.github.io",
  output: "static",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  integrations: [
    sitemap({ filter: (url) => hasPhotos || !url.endsWith("/photography/") }),
  ],
});
