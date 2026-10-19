import type {
  CalendarEvent,
  CustomTransactionType,
  Habit,
  Note,
  Transaction,
  Workout,
} from "../types";

export type AppData = {
  transactions: Transaction[];
  customTransactionTypes: CustomTransactionType[];
  habits: Habit[];
  notes: Note[];
  events: CalendarEvent[];
  workouts: Workout[];
};

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const STORAGE_KEYS = {
  transactions: 'gestao-pessoal:transactions',
  customTransactionTypes: 'gestao-pessoal:custom-transaction-types',
  habits: 'gestao-pessoal:habits',
  notes: 'gestao-pessoal:notes',
  events: 'gestao-pessoal:events',
  workouts: 'gestao-pessoal:workouts',
}

export function readAppData(): AppData {
  return {
    transactions: readStorage(STORAGE_KEYS.transactions, []),
    customTransactionTypes: readStorage(STORAGE_KEYS.customTransactionTypes, []),
    habits: readStorage(STORAGE_KEYS.habits, []),
    notes: readStorage(STORAGE_KEYS.notes, []),
    events: readStorage(STORAGE_KEYS.events, []),
    workouts: readStorage(STORAGE_KEYS.workouts, []),
  };
}