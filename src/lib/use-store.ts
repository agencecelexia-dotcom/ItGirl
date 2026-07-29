import { createContext, useContext } from "react";
import type {
  Book,
  DayEntry,
  Event,
  Goal,
  GoalLog,
  Habit,
  HabitLog,
  Photo,
  ReadingSession,
  Task,
} from "./types";

export interface AppState {
  goals: Goal[];
  goalLogs: GoalLog[];
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  dayEntries: DayEntry[];
  events: Event[];
  books: Book[];
  sessions: ReadingSession[];
  photos: Photo[];
}

export interface Store extends AppState {
  addTask: (date: string, text: string, goalId?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setTaskGoal: (id: string, goalId?: string) => void;
  repeatTaskToday: (id: string) => void;
  tasksFor: (date: string) => Task[];
  toggleHabit: (habitId: string, date: string) => void;
  isHabitDone: (habitId: string, date: string) => boolean;
  addHabit: (label: string) => void;
  removeHabit: (id: string) => void;
  entryFor: (date: string) => DayEntry | undefined;
  updateEntry: (date: string, patch: Partial<Omit<DayEntry, "id" | "date">>) => void;
  goalProgress: (goalId: string, date: Date) => number;
  addGoal: (name: string, target: number, unit: string) => void;
  updateGoal: (id: string, patch: Partial<Omit<Goal, "id" | "created_at">>) => void;
  deleteGoal: (id: string) => void;
  addGoalLog: (goalId: string, date: Date) => void;
  /** Ne retire qu'un log saisi à la main : décocher une tâche reste le seul moyen d'annuler la sienne. */
  removeGoalLog: (goalId: string, date: Date) => void;
  manualLogCount: (goalId: string, date: Date) => number;
  addEvent: (date: string, title: string, startTime?: string, endTime?: string) => void;
  deleteEvent: (id: string) => void;
  /** Sans heure d'abord, puis par heure croissante. */
  eventsFor: (date: string) => Event[];
  goalsDoneOn: (date: string) => string[];
  addBook: (title: string, author: string, unit: Book["unit"], total?: number) => void;
  updateBook: (id: string, patch: Partial<Omit<Book, "id">>) => void;
  deleteBook: (id: string) => void;
  /** Note une lecture : où elle s'est arrêtée et ce qu'elle en retient. Nourrit l'objectif Lecture. */
  logReading: (bookId: string, position: number, note?: string) => void;
  /** De la plus récente à la plus ancienne. */
  sessionsFor: (bookId: string) => ReadingSession[];
  deleteSession: (id: string) => void;
  addPhoto: (url: string, source: Photo["source"], caption?: string, date?: string) => void;
  updatePhoto: (id: string, patch: Partial<Omit<Photo, "id">>) => void;
  deletePhoto: (id: string) => void;
  photosFrom: (source: Photo["source"]) => Photo[];
  photoById: (id?: string) => Photo | undefined;
  /** Une photo sur une tâche cochée devient un souvenir daté, légendé par la tâche. */
  attachPhotoToTask: (taskId: string, url: string) => void;
  /** Vrai quand le stockage local est saturé : plus rien n'est enregistré. */
  storageFull: boolean;
}

export const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore doit être utilisé dans un StoreProvider");
  return store;
}
