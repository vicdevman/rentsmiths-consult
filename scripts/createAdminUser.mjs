import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
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

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password) {
  throw new Error("Missing ADMIN_EMAIL and/or ADMIN_PASSWORD env vars.");
}

const serviceAccount = JSON.parse(readFileSync(resolve(serviceAccountPath), "utf8"));

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();

async function main() {
  try {
    const existing = await auth.getUserByEmail(email);
    console.log(`Admin user already exists: ${existing.email}`);
    return;
  } catch {
    // continue
  }

  const user = await auth.createUser({
    email,
    password,
  });

  console.log(`Created admin user: ${user.email} (uid=${user.uid})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
