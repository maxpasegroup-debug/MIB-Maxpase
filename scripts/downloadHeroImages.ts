/**
 * Download student/career photos from Unsplash for the hero section.
 * Saves to public/images/hero/
 * Run: npx tsx scripts/downloadHeroImages.ts
 */
import * as fs from "fs";
import * as path from "path";

const HERO_DIR = path.join(process.cwd(), "public", "images", "hero");

// Unsplash source URLs (direct image links; replace with your own or use Unsplash API key for higher res)
const IMAGES = [
  { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80", file: "students-1.jpg" },
  { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", file: "students-2.jpg" },
  { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80", file: "student-thinking.jpg" },
];

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  if (!fs.existsSync(HERO_DIR)) {
    fs.mkdirSync(HERO_DIR, { recursive: true });
  }
  for (const img of IMAGES) {
    const filePath = path.join(HERO_DIR, img.file);
    console.log("Downloading", img.file, "...");
    try {
      const buffer = await download(img.url);
      fs.writeFileSync(filePath, buffer);
      console.log("  Saved", filePath);
    } catch (e) {
      console.error("  Failed:", e);
    }
  }
}

main().catch(console.error);
