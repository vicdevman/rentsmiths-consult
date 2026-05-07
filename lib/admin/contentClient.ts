import type { EditableContent } from "./types";
import { mockContent } from "./mockContent";

const STORAGE_KEY = "rentsmiths_admin_content_v1";

export async function getEditableContent(): Promise<EditableContent> {
  if (typeof window === "undefined") return mockContent;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return mockContent;

  try {
    return JSON.parse(raw) as EditableContent;
  } catch {
    return mockContent;
  }
}

export async function saveEditableContent(next: EditableContent): Promise<void> {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function loginWithPassword(_email: string, _password: string): Promise<{ token: string }> {
  return { token: "dev-token" };
}

export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("rentsmiths_auth_token");
}
