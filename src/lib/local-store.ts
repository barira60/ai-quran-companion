// Client-side persistence in localStorage (no auth required).
import { useSyncExternalStore } from "react";

export type LocalThread = {
  id: string;
  title: string;
  mood: string | null;
  updated_at: string;
  created_at: string;
};

export type LocalMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: unknown[];
};

export type LocalFavorite = {
  id: string;
  surah_number: number;
  ayah_number: number;
  surah_name?: string;
  arabic?: string;
  translation?: string;
  note?: string;
  created_at: string;
};

const THREADS_KEY = "qc.threads";
const MESSAGES_PREFIX = "qc.messages.";
const FAVORITES_KEY = "qc.favorites";

const isBrowser = typeof window !== "undefined";

// ---- generic listener bus ----
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function emit() {
  for (const l of listeners) l();
}
if (isBrowser) {
  window.addEventListener("storage", () => emit());
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  invalidate(key);
  emit();
}

// Cached snapshots so useSyncExternalStore returns stable references
// between calls until the underlying key actually changes.
const snapshotCache = new Map<string, unknown>();
function invalidate(key: string) {
  snapshotCache.delete(key);
}
function cached<T>(key: string, compute: () => T): T {
  if (snapshotCache.has(key)) return snapshotCache.get(key) as T;
  const value = compute();
  snapshotCache.set(key, value);
  return value;
}
if (isBrowser) {
  window.addEventListener("storage", (e) => {
    if (e.key) invalidate(e.key);
    else snapshotCache.clear();
  });
}

function newId() {
  if (isBrowser && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ---- Threads ----
export function getThreads(): LocalThread[] {
  return read<LocalThread[]>(THREADS_KEY, []).sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  );
}

export function createLocalThread(input: { title?: string; mood?: string }): LocalThread {
  const now = new Date().toISOString();
  const t: LocalThread = {
    id: newId(),
    title: (input.title?.slice(0, 80) || "New conversation"),
    mood: input.mood ?? null,
    updated_at: now,
    created_at: now,
  };
  write(THREADS_KEY, [t, ...getThreads()]);
  return t;
}

export function deleteLocalThread(id: string) {
  write(THREADS_KEY, getThreads().filter((t) => t.id !== id));
  if (isBrowser) window.localStorage.removeItem(MESSAGES_PREFIX + id);
  invalidate(MESSAGES_PREFIX + id);
  emit();
}

export function renameLocalThread(id: string, title: string) {
  write(
    THREADS_KEY,
    getThreads().map((t) => (t.id === id ? { ...t, title: title.slice(0, 80) } : t)),
  );
}

export function touchThread(id: string, titleHint?: string) {
  const now = new Date().toISOString();
  write(
    THREADS_KEY,
    getThreads().map((t) =>
      t.id === id
        ? { ...t, updated_at: now, title: titleHint ? titleHint.slice(0, 80) : t.title }
        : t,
    ),
  );
}

// ---- Messages ----
export function getMessages(threadId: string): LocalMessage[] {
  return read<LocalMessage[]>(MESSAGES_PREFIX + threadId, []);
}

export function saveLocalMessages(
  threadId: string,
  messages: { role: LocalMessage["role"]; parts: unknown[] }[],
  titleHint?: string,
) {
  const stored: LocalMessage[] = messages.map((m) => ({
    id: newId(),
    role: m.role,
    parts: m.parts,
  }));
  write(MESSAGES_PREFIX + threadId, stored);
  touchThread(threadId, titleHint);
}

// ---- Favorites ----
export function getFavorites(): LocalFavorite[] {
  return read<LocalFavorite[]>(FAVORITES_KEY, []).sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}

export function addLocalFavorite(input: Omit<LocalFavorite, "id" | "created_at">): LocalFavorite {
  const existing = getFavorites();
  const dup = existing.find(
    (f) => f.surah_number === input.surah_number && f.ayah_number === input.ayah_number,
  );
  if (dup) return dup;
  const fav: LocalFavorite = { ...input, id: newId(), created_at: new Date().toISOString() };
  write(FAVORITES_KEY, [fav, ...existing]);
  return fav;
}

export function removeLocalFavorite(id: string) {
  write(FAVORITES_KEY, getFavorites().filter((f) => f.id !== id));
}

const EMPTY_THREADS: LocalThread[] = [];
const EMPTY_MESSAGES: LocalMessage[] = [];
const EMPTY_FAVORITES: LocalFavorite[] = [];

// ---- React hooks ----
export function useLocalThreads(): LocalThread[] {
  return useSyncExternalStore(
    subscribe,
    () => cached(THREADS_KEY, getThreads),
    () => EMPTY_THREADS,
  );
}

export function useLocalMessages(threadId: string): LocalMessage[] {
  const key = MESSAGES_PREFIX + threadId;
  return useSyncExternalStore(
    subscribe,
    () => cached(key, () => getMessages(threadId)),
    () => EMPTY_MESSAGES,
  );
}

export function useLocalFavorites(): LocalFavorite[] {
  return useSyncExternalStore(
    subscribe,
    () => cached(FAVORITES_KEY, getFavorites),
    () => EMPTY_FAVORITES,
  );
}
