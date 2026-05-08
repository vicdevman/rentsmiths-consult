import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


// 1. Get the current file path (necessary in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Point to the .env.local in the root (one level up from /scripts)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountPath) {
  throw new Error(
    "Missing FIREBASE_SERVICE_ACCOUNT_JSON env var (absolute path to service account json).",
  );
}

const serviceAccount = JSON.parse(
  readFileSync(resolve(serviceAccountPath), "utf8"),
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Build gallery by parsing the gallery page so content stays in sync
import { readFileSync as readFileSyncLocal } from 'node:fs';
import { resolve as resolvePath, join } from 'node:path';

// Cloudinary config (optional) - if present we'll upload local assets and seed URLs
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;

function toBasicAuthHeader(apiKey, apiSecret) {
  const raw = `${apiKey}:${apiSecret}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

async function uploadLocalImageToCloudinary({ localPath, publicId }) {
  if (!cloudName || !cloudApiKey || !cloudApiSecret) {
    throw new Error("Missing Cloudinary credentials in env; set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
  }

  const fileBuffer = readFileSyncLocal(localPath);
  const blob = new Blob([fileBuffer]);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const form = new FormData();
  form.append("file", blob, publicId ? `${publicId}` : "upload");
  form.append("folder", "rentsmiths/site");
  if (publicId) form.append("public_id", publicId);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: toBasicAuthHeader(cloudApiKey, cloudApiSecret),
    },
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Cloudinary upload failed for ${localPath}`);
  }
  if (!data?.secure_url) {
    throw new Error(`Cloudinary response missing secure_url for ${localPath}`);
  }

  return data.secure_url;
}

function parseGalleryFromPage() {
  const pagePath = resolvePath(__dirname, '../app/gallery/page.tsx');
  const src = readFileSyncLocal(pagePath, 'utf8');

  // find imports like: import g1 from "@/assets/gallery-1.jpg";
  const importMap = {};
  const importRe = /import\s+(\w+)\s+from\s+["']([^"']+)["']/g;
  let m;
  while ((m = importRe.exec(src)) !== null) {
    importMap[m[1]] = m[2];
  }

  // find the items array literal starting at `const items = [`
  const arrStart = src.indexOf('const items = [');
  if (arrStart === -1) return [];
  const bracketStart = src.indexOf('[', arrStart);
  let i = bracketStart;
  let depth = 0;
  let end = -1;
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++;
    if (src[i] === ']') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return [];
  const arrayText = src.slice(bracketStart + 1, end);

  // crude object scanner: find objects by matching braces
  const items = [];
  let idx = 0;
  while (idx < arrayText.length) {
    const open = arrayText.indexOf('{', idx);
    if (open === -1) break;
    let j = open;
    let d = 0;
    let objEnd = -1;
    for (; j < arrayText.length; j++) {
      if (arrayText[j] === '{') d++;
      if (arrayText[j] === '}') { d--; if (d === 0) { objEnd = j; break; } }
    }
    if (objEnd === -1) break;
    const objText = arrayText.slice(open, objEnd + 1);

    // extract img token, title, desc
    const imgMatch = /img\s*:\s*(\w+)\.src/.exec(objText);
    const titleMatch = /title\s*:\s*["']([^"']+)["']/.exec(objText);
    const descMatch = /desc\s*:\s*["']([^"']+)["']/.exec(objText);

    const imgToken = imgMatch ? imgMatch[1] : null;
    let imageUrl = "";
    if (imgToken && importMap[imgToken]) {
      // convert '@/assets/foo.jpg' -> '/assets/foo.jpg' for seeded value
      const imp = importMap[imgToken];
      imageUrl = imp.replace(/^@\//, '/');
    }

    items.push({
      title: titleMatch ? titleMatch[1] : "",
      desc: descMatch ? descMatch[1] : "",
      imageUrl,
    });

    idx = objEnd + 1;
  }

  // convert into our gallery shape
  return items.map((it, k) => ({ id: `gallery_${k + 1}`, title: it.title || `Item ${k + 1}`, imageUrl: it.imageUrl || "", alt: it.title || "" }));
}
// fallback static gallery (used if parsing fails)
const staticFallback = [
  { src: "/assets/gallery-1.jpg", title: "Class of 2024", desc: "Our largest cohort yet — 80+ students placed in top global universities." },
  { src: "/assets/gallery-2.jpg", title: "Visa Approval Day", desc: "Every stamp represents months of preparation and a future unlocked." },
  { src: "/assets/gallery-3.jpg", title: "Campus Life Begins", desc: "Students settling into their new universities across Canada and the UK." },
  { src: "/assets/gallery-4.jpg", title: "Departure Lounge", desc: "Saying goodbye is hard; sending them off ready makes it worth it." },
  { src: "/assets/gallery-5.jpg", title: "1:1 CV Reviews", desc: "Personal coaching sessions that turn good profiles into compelling applications." },
  { src: "/assets/gallery-6.jpg", title: "Pre-Departure Workshop", desc: "Cultural orientation, banking, housing, and academic prep — all in one room." }
];

function sanitizeGalleryItems(items) {
  return (items || []).map((it, i) => ({
    id: it.id || `gallery_${i + 1}`,
    title: it.title ?? it.title ?? it.name ?? "",
    imageUrl: it.imageUrl ?? it.src ?? it.img ?? "",
    alt: it.alt ?? it.desc ?? "",
  }));
}

const parsed = parseGalleryFromPage();
const gallery = parsed.length ? sanitizeGalleryItems(parsed) : sanitizeGalleryItems(staticFallback);

// If gallery references local assets and Cloudinary is configured, upload them and replace imageUrl
async function ensureGalleryCloudinaryUrls(items) {
  if (!Array.isArray(items) || items.length === 0) return items;
  if (!cloudName || !cloudApiKey || !cloudApiSecret) return items;

  const assetsDir = resolvePath(process.cwd(), "assets");
  const urlMap = {};
  const uploadTargets = [];

  for (const it of items) {
    const img = it.imageUrl || "";
    if (img.startsWith("/assets/")) {
      const filename = img.replace("/assets/", "");
      const localPath = join(assetsDir, filename);
      const publicId = filename.replace(/\.[^.]+$/, "");
      uploadTargets.push({ key: img, path: localPath, publicId });
    }
  }

  for (const t of uploadTargets) {
    console.log(`Uploading ${t.key} -> Cloudinary…`);
    try {
      const url = await uploadLocalImageToCloudinary({ localPath: t.path, publicId: t.publicId });
      urlMap[t.key] = url;
      console.log(`Uploaded: ${url}`);
    } catch (e) {
      console.warn(`Failed to upload ${t.key}:`, e.message || e);
    }
  }

  return items.map((g) => ({ ...g, imageUrl: urlMap[g.imageUrl] || g.imageUrl }));
}

const draftRef = db.doc("site/content/versions/draft");
const publishedRef = db.doc("site/content/versions/published");

async function main() {
  const snap = await draftRef.get();
  const existing = snap.exists ? snap.data()?.content : null;

  let finalGallery = gallery;
  try {
    finalGallery = await ensureGalleryCloudinaryUrls(finalGallery);
  } catch (e) {
    console.warn("Gallery Cloudinary processing failed:", e.message || e);
  }

  // sanitize again to ensure no undefined values (Firestore rejects undefined)
  finalGallery = sanitizeGalleryItems(finalGallery).map((g) => ({ id: g.id, title: g.title || "", imageUrl: g.imageUrl || "", alt: g.alt || "" }));

  const next = {
    ...(existing ?? {}),
    gallery: finalGallery,
  };

  await draftRef.set({ content: next, updatedAt: new Date() }, { merge: true });
  await publishedRef.set({ content: next, updatedAt: new Date(), publishedAt: new Date() }, { merge: true });

  console.log("Seeded gallery to Firestore draft + published.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
