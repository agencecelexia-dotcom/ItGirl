import { createContext, useContext } from "react";
import type { DayEntry, Goal, GoalLog, Habit, HabitLog, Task } from "./types";

export interface AppState {
  goals: Goal[];
  goalLogs: GoalLog[];
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  dayEntries: DayEntry[];
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
}

export const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore doit être utilisé dans un StoreProvider");
  return store;
}
