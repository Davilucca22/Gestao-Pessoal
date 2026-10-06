import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";
import type {
  CalendarEvent,
  CustomTransactionType,
  Habit,
  Note,
  Transaction,
  Workout,
} from "../types";

export type UserProfile = {
  id: number | string;
  name: string;
  email: string;
  status: boolean;
};

export type UserDataDocument = {
  transactions: Transaction[];
  customTransactionTypes: CustomTransactionType[];
  habits: Habit[];
  notes: Note[];
  events: CalendarEvent[];
  workouts: Workout[];
};

const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
export const PENDING_SYNC_KEY = "gestao-pessoal:pending-sync";
export const LEGACY_MIGRATION_KEY = "gestao-pessoal:legacy-import-complete";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const payload = (await response.json().catch(() => ({}))) as {
    response?: string;
    data?: T;
  };

  if (!response.ok) {
    throw new ApiError(
      payload.response || "Não foi possível conectar ao servidor.",
      response.status,
    );
  }

  return payload as T;
}

export async function login(email: string, senha: string) {
  const result = await request<{ response: UserProfile }>("/login", {
    method: "POST",
    body: JSON.stringify({ form: { email, senha } }),
  });
  return result.response;
}

export async function register(name: string, email: string, senha: string) {
  const result = await request<{ response: UserProfile }>("/registro", {
    method: "POST",
    body: JSON.stringify({ form: { name, email, senha } }),
  });
  return result.response;
}

export async function getCurrentUser() {
  const result = await request<{ response: UserProfile }>("/me");
  return result.response;
}

export async function getUserData() {
  const result = await request<{ data: UserDataDocument }>("/me/data");
  return result.data;
}

export async function importUserData(data: UserDataDocument) {
  const result = await request<{ data: UserDataDocument }>("/me/data/import", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  return result.data;
}

export async function replaceUserData(data: UserDataDocument) {
  const result = await request<{ data: UserDataDocument }>("/me/data", {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
  return result.data;
}

export async function logout() {
  await request<{ response: string }>("/logout", { method: "POST" });
}

export function readCachedUserData(): UserDataDocument {
  return {
    transactions: readStorage(STORAGE_KEYS.transactions, []),
    customTransactionTypes: readStorage(STORAGE_KEYS.customTransactionTypes, []),
    habits: readStorage(STORAGE_KEYS.habits, []),
    notes: readStorage(STORAGE_KEYS.notes, []),
    events: readStorage(STORAGE_KEYS.events, []),
    workouts: readStorage(STORAGE_KEYS.workouts, []),
  };
}

export function hasCachedUserData(data: UserDataDocument) {
  return Object.values(data).some((records) => records.length > 0);
}

export function cacheUserData(data: UserDataDocument) {
  writeStorage(STORAGE_KEYS.transactions, data.transactions);
  writeStorage(STORAGE_KEYS.customTransactionTypes, data.customTransactionTypes);
  writeStorage(STORAGE_KEYS.habits, data.habits);
  writeStorage(STORAGE_KEYS.notes, data.notes);
  writeStorage(STORAGE_KEYS.events, data.events);
  writeStorage(STORAGE_KEYS.workouts, data.workouts);
}

export function clearCachedUserData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function pendingSyncKey(userId: UserProfile["id"]) {
  return `${PENDING_SYNC_KEY}:${userId}`;
}
