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

// Keep this in sync with lib/admin/mockContent.ts
const testimonials = [
  {
    id: "tt_1",
    quote:
      "Rentsmiths made my Canada admission feel effortless. From SOP to visa interview prep — every detail was covered.",
    name: "Adaeze O.",
    role: "MSc, University of Toronto",
  },
  {
    id: "tt_2",
    quote:
      "I had been rejected twice before. The team rebuilt my application and I got into my top choice with a partial scholarship.",
    name: "Tunde A.",
    role: "MBA, Warwick Business School",
  },
  {
    id: "tt_3",
    quote:
      "Beyond admissions — they helped me find housing and a part-time job in Manchester within two weeks of arrival.",
    name: "Chiamaka E.",
    role: "BSc, University of Manchester",
  },
];

const draftRef = db.doc("site/content/versions/draft");
const publishedRef = db.doc("site/content/versions/published");

async function main() {
  const snap = await draftRef.get();
  const existing = snap.exists ? snap.data()?.content : null;

  const next = {
    ...(existing ?? {}),
    testimonials,
  };

  await draftRef.set({ content: next, updatedAt: new Date() }, { merge: true });
  await publishedRef.set({ content: next, updatedAt: new Date(), publishedAt: new Date() }, { merge: true });

  console.log("Seeded testimonials to Firestore draft + published.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
