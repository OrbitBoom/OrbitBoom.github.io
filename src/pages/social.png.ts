import sharp from "sharp";
import profile from "../content/personal/profile.json";
export async function GET() {
  const escape = (s: string) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f8f7f1"/><path d="M80 95h1040M80 535h1040" stroke="#65675b"/><text x="82" y="322" fill="#252920" font-family="serif" font-size="105">' +
    escape(profile.name) +
    '</text><text x="86" y="396" fill="#55594f" font-family="sans-serif" font-size="32">' +
    escape(profile.designation) +
    "</text></svg>";
  return new Response(
    new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer()),
    { headers: { "Content-Type": "image/png" } },
  );
}
