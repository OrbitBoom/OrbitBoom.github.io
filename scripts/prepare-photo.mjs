import sharp from "sharp";
import { access, mkdir } from "node:fs/promises";
import path from "node:path";

const [input, output] = process.argv.slice(2);
if (!input || !output?.endsWith(".webp"))
  throw new Error(
    "Usage: npm run photo -- /path/to/original.jpg path/to/output.webp",
  );
const exists = await access(output).then(
  () => true,
  () => false,
);
if (exists) throw new Error("Output already exists: " + output);
await mkdir(path.dirname(output), { recursive: true });
await sharp(input)
  .rotate()
  .resize({
    width: 3200,
    height: 3200,
    fit: "inside",
    withoutEnlargement: true,
  })
  .webp({ quality: 90 })
  .toFile(output);
console.log("Saved an oriented, metadata-stripped web copy at " + output);
