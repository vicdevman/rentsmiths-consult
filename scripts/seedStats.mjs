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
const stats = [
  { id: "stat_years", value: 8, suffix: "+", label: "Years of expertise" },
  { id: "stat_students", value: 500, suffix: "+", label: "Students placed" },
  { id: "stat_partners", value: 50, suffix: "+", label: "Partner universities" },
];

const draftRef = db.doc("site/content/versions/draft");
const publishedRef = db.doc("site/content/versions/published");

async function main() {
  const snap = await draftRef.get();
  const existing = snap.exists ? snap.data()?.content : null;

  const next = {
    ...(existing ?? {}),
    stats,
  };

  await draftRef.set({ content: next, updatedAt: new Date() }, { merge: true });
  await publishedRef.set({ content: next, updatedAt: new Date(), publishedAt: new Date() }, { merge: true });

  console.log("Seeded stats to Firestore draft + published.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
