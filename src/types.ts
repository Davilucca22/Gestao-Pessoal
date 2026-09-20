export type TransactionType = 'income' | 'expense' | 'investment'

export type Transaction = {
  id: string
  type: TransactionType
  title: string
  category: string
  amount: number
  date: string
}

export type Habit = {
  id: string
  name: string
  color: string
  checks: Record<string, boolean>
}

export type Note = {
  id: string
  title: string
  content: string
  date: string
}

export type CalendarEvent = {
  id: string
  title: string
  date: string
  time: string
  description: string
  remind: boolean
}

export type WorkoutExercise = {
  id: string
  name: string
  sets: number
  reps: number
}

export type Workout = {
  id: string
  title: string
  days: string[]
  exercises: WorkoutExercise[]
  sessions: Record<string, number>
}