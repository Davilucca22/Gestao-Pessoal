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