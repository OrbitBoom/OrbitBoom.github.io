# Siddhant Budhia

An editorial index of projects, mathematical investigations and photographs. Astro generates static pages for the root of `orbitboom.github.io`. Fonts, images and scripts are served with the site.

## Make the writing your own

| To change | Edit |
| --- | --- |
| About page | [src/content/personal/about.md](src/content/personal/about.md) |
| Homepage introduction | [src/content/personal/home.md](src/content/personal/home.md) |
| Name, designation, achievements and social links | [src/content/personal/profile.json](src/content/personal/profile.json) |
| Section introductions | [src/content/personal/sections.json](src/content/personal/sections.json) |

The first two files are ordinary paragraphs. Replace the words and leave a blank line between paragraphs. The layout supplies the page title. In JSON, edit the text between quotation marks.

You can do this entirely on GitHub. Open the file on your review branch, click the pencil, edit, then choose **Commit changes**. For later revisions to the published site, commit to a new branch and open a pull request. To see the design as you write, use the local preview below.

## Local development

Use Node.js 24 and npm. With nvm installed, run `nvm install` in this folder.

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal. Edits appear as you save. For the production version, run the following and open the preview URL. The build writes ordinary files to `dist/`.

```sh
npm run check
npm run build
npm run preview
```

## Add a project or investigation

Copy a Markdown file in [projects](src/content/projects) or [research](src/content/research) into the same folder. Choose a stable lowercase filename with hyphens. For example, `research/court-geometry.md` creates `/research/court-geometry/`.

In the block between the two `---` lines, edit `title`, `summary`, `kind` and numeric `order`. Lower orders come first. Optional fields include:

- `topics` lists technologies or methods. `repository` links the source.
- `featured` sets the entry’s position on the homepage. Remove it to show the entry only in its section.
- `shortTitle` supplies a shorter homepage heading. `cover` selects one of the existing project illustrations. Remove it for a text entry.
- `draft: true` previews a work in development locally. Production omits the entry from indexes, routes and the sitemap.

Write the article below the front matter. Use headings as the material warrants, for example the question, approach, limitations or what you learnt. Put a web-sized image beside the article and use standard Markdown image syntax with descriptive alt text. A revised paper can be linked from the article once it is approved for public release. Files in `public/` are copied verbatim into the build.

For equations, use native MathML inside Markdown. [CalcRoad](src/content/research/calcroad.md) includes a working fraction and exponents. The mathematical structure is available in the page HTML and renders without JavaScript. A future custom interactive figure can have its own Astro component.

This repository is public, including its branches and history. Keep private drafts, original assessment papers, unreviewed media, credentials and unpublished work elsewhere.

## Photographs and collections

The independent gallery lives at `/photography/`. When empty, the development server supplies labelled geometry fixtures. Production serves a quiet empty page and omits it from navigation, homepage previews and the sitemap. Adding a published photograph makes all three appear automatically.

1. Pick a collection slug such as `night-walks`. Create a folder with that name under `src/content/photography/`. An untitled folder can hold individual photographs.
2. Keep camera originals outside the repository. Prepare each web copy with the included command. It applies EXIF orientation, bounds both dimensions to 3200 pixels, and writes a WebP copy without EXIF, GPS, IPTC or XMP. Use a descriptive lowercase filename with hyphens. Review faces, signs and locations in the pixels and your captions yourself.
3. Add a `collection.json` beside the web copies. See the example below. The `photos` array controls the sequence. Move an item to reorder it, or remove it and its unused file. Set `order` to position the collection among other collections.

```sh
npm run photo -- /path/outside/repo/original.jpg src/content/photography/night-walks/street-light.webp
```

```json
{
  "title": "Night walks",
  "order": 1,
  "photos": [
    {
      "file": "street-light.webp",
      "alt": "A street light illuminates the edge of an empty pavement."
    }
  ]
}
```

Each photograph requires a file and descriptive alt text. Optional photo fields are `title`, `caption`, `location`, `camera` and `draft`. Collections accept an optional title, `introduction` for a short essay, and `draft`. Share a collection using its fragment, e.g. `/photography/#night-walks`.

At build time, Sharp creates sizes up to 2560 pixels wide without upscaling or cropping. The HTML includes dimensions and responsive image candidates. Only included photos get output URLs. Click or tap to enlarge a photo. Use Previous/Next, arrow keys or a horizontal swipe to move within the collection. Escape or Close returns focus to the originating image. With scripting disabled, the image link opens the large web copy.

## GitHub Pages

The ready-to-install [Pages workflow](deployment/pages.yml) is included in this review branch. With workflow-write permission, move it to `.github/workflows/pages.yml` to activate pull request builds. Publication is a separate, manual action. When you approve a release:

1. Merge the reviewed changes into `main`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Open **Actions → Check and build site → Run workflow**, select `main`, and run it. Only a manual run on `main` can upload the Pages artifact and deploy. Repeat this step for subsequent releases.

The artifact contains only `dist/`. The site URL in [astro.config.mjs](astro.config.mjs) supplies the canonical, sitemap and social preview URLs. [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

For a future custom domain, verify ownership in GitHub, set the domain in **Settings → Pages**, then configure its DNS with your registrar. For a subdomain, use a CNAME pointing to `orbitboom.github.io`. For an apex domain, use GitHub’s documented apex records. Update `site` in the Astro config, rebuild, deploy and enable HTTPS when GitHub makes it available. [GitHub’s custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
