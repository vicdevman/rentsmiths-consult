import type { EditableContent } from "./types";
import { mockContent } from "./mockContent";
import { auth, db } from "@/lib/firebaseConfig";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AUTH_TOKEN_KEY = "rentsmiths_auth_token";
const CONTENT_DOC_PATH = (id: "draft" | "published") => doc(db, "site", "content", "versions", id);

function coerceEditableContent(raw: unknown): EditableContent {
  if (!raw || typeof raw !== "object") return mockContent;
  const r = raw as Partial<EditableContent>;
  return {
    services: Array.isArray(r.services) ? (r.services as EditableContent["services"]) : mockContent.services,
    stats: Array.isArray(r.stats) ? (r.stats as EditableContent["stats"]) : mockContent.stats,
    testimonials: Array.isArray(r.testimonials) ? (r.testimonials as EditableContent["testimonials"]) : mockContent.testimonials,
    gallery: Array.isArray(r.gallery) ? (r.gallery as EditableContent["gallery"]) : mockContent.gallery,
  };
}

export async function getEditableContent(): Promise<EditableContent> {
  if (typeof window === "undefined") return mockContent;

  const draftSnap = await getDoc(CONTENT_DOC_PATH("draft"));
  if (draftSnap.exists()) {
    const data = draftSnap.data() as DocumentData;
    return coerceEditableContent(data?.content);
  }

  const publishedSnap = await getDoc(CONTENT_DOC_PATH("published"));
  if (publishedSnap.exists()) {
    const data = publishedSnap.data() as DocumentData;
    return coerceEditableContent(data?.content);
  }

  return mockContent;
}

export async function saveEditableContent(next: EditableContent): Promise<void> {
  if (typeof window === "undefined") return;
  await setDoc(
    CONTENT_DOC_PATH("draft"),
    {
      content: next,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function publishEditableContent(next: EditableContent): Promise<void> {
  if (typeof window === "undefined") return;
  await setDoc(
    CONTENT_DOC_PATH("published"),
    {
      content: next,
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function revertDraft(): Promise<void> {
  if (typeof window === "undefined") return;

  // Attempt to copy published content into draft. If no published content exists, fall back to mockContent.
  const publishedSnap = await getDoc(CONTENT_DOC_PATH("published"));
  if (publishedSnap.exists()) {
    const data = publishedSnap.data() as DocumentData;
    const content = data?.content ?? mockContent;
    await setDoc(
      CONTENT_DOC_PATH("draft"),
      {
        content,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return;
  }

  // No published version — reset draft to the mock content
  await setDoc(
    CONTENT_DOC_PATH("draft"),
    {
      content: mockContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function loginWithPassword(email: string, password: string): Promise<{ token: string }> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const token = await cred.user.getIdToken();
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  return { token };
}

export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;
  await signOut(auth);
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}
