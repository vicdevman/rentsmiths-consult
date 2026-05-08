import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
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

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !cloudApiKey || !cloudApiSecret) {
  throw new Error(
    "Missing Cloudinary env vars. Required: CLOUDINARY_CLOUD_NAME (or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME), CLOUDINARY_API_KEY (or NEXT_PUBLIC_CLOUDINARY_API_KEY), CLOUDINARY_API_SECRET.",
  );
}

const serviceAccount = JSON.parse(readFileSync(resolve(serviceAccountPath), "utf8"));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const auth = getAuth();

function toBasicAuthHeader(apiKey, apiSecret) {
  const raw = `${apiKey}:${apiSecret}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

async function uploadLocalImageToCloudinary({ localPath, publicId }) {
  const fileBuffer = readFileSync(localPath);
  const blob = new Blob([fileBuffer]);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const form = new FormData();
  form.append("file", blob, publicId ? `${publicId}.jpg` : "upload.jpg");
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

function withCloudinaryUrlMap(content, urlMap) {
  return {
    ...content,
    services: (content.services ?? []).map((s) => ({
      ...s,
      imageUrl: urlMap[s.imageUrl] || s.imageUrl,
    })),
    gallery: (content.gallery ?? []).map((g) => ({
      ...g,
      imageUrl: urlMap[g.imageUrl] || g.imageUrl,
    })),
  };
}

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  try {
    await auth.getUserByEmail(email);
    console.log(`Admin user already exists: ${email}`);
  } catch (err) {
    if (err?.code === 'auth/configuration-not-found') {
      console.log(`\n⚠️ Firebase Auth is not enabled in your project.`);
      console.log(`Please go to the Firebase Console -> Authentication -> Get Started.`);
      console.log(`Then run this script again to create the admin user.\n`);
    } else {
      try {
        await auth.createUser({ email, password });
        console.log(`Created admin user: ${email}`);
      } catch (createErr) {
        console.error(`Failed to create admin user:`, createErr.message || createErr);
      }
    }
  }
}

async function main() {
  // Keep this in sync with lib/admin/mockContent.ts
  const content = {
    services: [
      {
        id: "service_university_admissions",
        title: "University Admissions",
        description:
          "Strategic university shortlisting, SOPs, and application packaging that gets you in.",
        imageUrl: "/assets/service-1.jpg",
        tag: "Most popular",
      },
      {
        id: "service_scholarship_strategy",
        title: "Scholarship Strategy",
        description: "We surface and pursue scholarships that match your profile, scores, and ambitions.",
        imageUrl: "/assets/service-2.jpg",
      },
      {
        id: "service_visa_immigration",
        title: "Visa & Immigration",
        description: "End-to-end visa documentation, mock interviews, and embassy follow-through.",
        imageUrl: "/assets/service-3.jpg",
      },
    ],
    stats: [
      { id: "stat_years", value: 8, suffix: "+", label: "Years of expertise" },
      { id: "stat_students", value: 500, suffix: "+", label: "Students placed" },
      { id: "stat_partners", value: 50, suffix: "+", label: "Partner universities" },
    ],
    testimonials: [
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
    ],
    gallery: [
      {
        id: "gallery_1",
        title: "Student Success",
        imageUrl: "",
        alt: "",
      },
    ],
  };

  const assetsDir = resolve(process.cwd(), "assets");

  const uploadTargets = [
    { key: "/assets/service-1.jpg", path: join(assetsDir, "service-1.jpg"), publicId: "service-1" },
    { key: "/assets/service-2.jpg", path: join(assetsDir, "service-2.jpg"), publicId: "service-2" },
    { key: "/assets/service-3.jpg", path: join(assetsDir, "service-3.jpg"), publicId: "service-3" },
  ];

  const urlMap = {};
  for (const t of uploadTargets) {
    console.log(`Uploading ${t.key} -> Cloudinary…`);
    const url = await uploadLocalImageToCloudinary({ localPath: t.path, publicId: t.publicId });
    urlMap[t.key] = url;
    console.log(`Uploaded: ${url}`);
  }

  const finalContent = withCloudinaryUrlMap(content, urlMap);

  const draftRef = db.doc("site/content/versions/draft");
  const publishedRef = db.doc("site/content/versions/published");

  await draftRef.set({ content: finalContent, updatedAt: new Date() }, { merge: true });
  await publishedRef.set(
    { content: finalContent, updatedAt: new Date(), publishedAt: new Date() },
    { merge: true },
  );

  console.log("Seeded ALL content (with Cloudinary image URLs) to Firestore draft + published.");

  await ensureAdminUser();
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    console.log("Admin user creation checked.");
  } else {
    console.log("Admin user not created (set ADMIN_EMAIL and ADMIN_PASSWORD to enable)." );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
