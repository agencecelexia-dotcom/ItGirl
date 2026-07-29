import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DayEntry, Goal } from "./types";
import { StoreContext, type AppState, type Store } from "./use-store";
import { toDateKey, weekRange } from "./date";

/**
 * Persistance temporaire en localStorage, structurée comme le modèle final.
 * L'étape 7 remplacera cette couche par Dexie + Supabase sans toucher aux écrans.
 */
const STORAGE_KEY = "mon-mois-a-paris/v1";

function uid(): string {
  return Math.random().toString(36).slice(2, 11);
}

function seed(): AppState {
  const now = new Date().toISOString();
  return {
    goals: [
      {
        id: "balades",
        name: "Balades",
        target: 3,
        unit: "balade",
        color: "terre",
        note: "Une balade, c'est sortir de chez toi et marcher. Même dix minutes.",
        created_at: now,
      },
      {
        id: "sorties",
        name: "Sorties culturelles",
        target: 1,
        unit: "sortie",
        color: "rose",
        note: "Musée, expo, ce que tu veux.",
        created_at: now,
      },
      {
        id: "lecture",
        name: "Lecture",
        target: 0,
        unit: "fois",
        color: "terre",
        note: "Objectif volontairement flou : lire un chapitre compte.",
        created_at: now,
      },
    ],
    goalLogs: [],
    tasks: [],
    habits: [
      { id: "eau", label: "Boire de l'eau", active: true, position: 0 },
      { id: "lire", label: "Lire un peu", active: true, position: 1 },
      { id: "soin", label: "Prendre soin de moi", active: true, position: 2 },
    ],
    habitLogs: [],
    dayEntries: [],
    events: [],
  };
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    return { ...seed(), ...(JSON.parse(raw) as Partial<AppState>) } as AppState;
  } catch {
    return seed();
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Quota plein ou stockage indisponible : on garde l'état en mémoire.
    }
  }, [state]);

  const addTask = useCallback((date: string, text: string, goalId?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      tasks: [
        ...s.tasks,
        {
          id: uid(),
          date,
          text: trimmed,
          done: false,
          goal_id: goalId,
          position: s.tasks.filter((t) => t.date === date).length,
        },
      ],
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => {
      const task = s.tasks.find((t) => t.id === id);
      if (!task) return s;
      const done = !task.done;
      const tasks = s.tasks.map((t) => (t.id === id ? { ...t, done } : t));
      let goalLogs = s.goalLogs;
      if (task.goal_id) {
        goalLogs = done
          ? [...goalLogs, { id: uid(), goal_id: task.goal_id, date: task.date, task_id: task.id }]
          : goalLogs.filter((l) => l.task_id !== task.id);
      }
      return { ...s, tasks, goalLogs };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.filter((t) => t.id !== id),
      goalLogs: s.goalLogs.filter((l) => l.task_id !== id),
    }));
  }, []);

  const setTaskGoal = useCallback((id: string, goalId?: string) => {
    setState((s) => {
      const task = s.tasks.find((t) => t.id === id);
      if (!task) return s;
      const tasks = s.tasks.map((t) => (t.id === id ? { ...t, goal_id: goalId } : t));
      let goalLogs = s.goalLogs.filter((l) => l.task_id !== id);
      if (task.done && goalId) {
        goalLogs = [...goalLogs, { id: uid(), goal_id: goalId, date: task.date, task_id: id }];
      }
      return { ...s, tasks, goalLogs };
    });
  }, []);

  /** Recrée la tâche à la date du jour. Rien ne se reporte tout seul : c'est elle qui décide. */
  const repeatTaskToday = useCallback((id: string) => {
    const today = toDateKey(new Date());
    setState((s) => {
      const task = s.tasks.find((t) => t.id === id);
      if (!task) return s;
      return {
        ...s,
        tasks: [
          ...s.tasks,
          {
            id: uid(),
            date: today,
            text: task.text,
            done: false,
            goal_id: task.goal_id,
            position: s.tasks.filter((t) => t.date === today).length,
          },
        ],
      };
    });
  }, []);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setState((s) => {
      const existing = s.habitLogs.find((l) => l.habit_id === habitId && l.date === date);
      return {
        ...s,
        habitLogs: existing
          ? s.habitLogs.filter((l) => l !== existing)
          : [...s.habitLogs, { id: uid(), habit_id: habitId, date }],
      };
    });
  }, []);

  const addHabit = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      habits: [...s.habits, { id: uid(), label: trimmed, active: true, position: s.habits.length }],
    }));
  }, []);

  const removeHabit = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      habits: s.habits.filter((h) => h.id !== id),
      habitLogs: s.habitLogs.filter((l) => l.habit_id !== id),
    }));
  }, []);

  const updateEntry = useCallback(
    (date: string, patch: Partial<Omit<DayEntry, "id" | "date">>) => {
      setState((s) => {
        const existing = s.dayEntries.find((e) => e.date === date);
        return {
          ...s,
          dayEntries: existing
            ? s.dayEntries.map((e) => (e.date === date ? { ...e, ...patch } : e))
            : [...s.dayEntries, { id: uid(), date, ...patch }],
        };
      });
    },
    [],
  );

  const addGoal = useCallback((name: string, target: number, unit: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      goals: [
        ...s.goals,
        {
          id: uid(),
          name: trimmed,
          target: Math.max(0, target),
          unit: unit.trim() || "fois",
          color: "terre",
          created_at: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const updateGoal = useCallback(
    (id: string, patch: Partial<Omit<Goal, "id" | "created_at">>) => {
      setState((s) => ({
        ...s,
        goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      }));
    },
    [],
  );

  const deleteGoal = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.filter((g) => g.id !== id),
      goalLogs: s.goalLogs.filter((l) => l.goal_id !== id),
      tasks: s.tasks.map((t) => (t.goal_id === id ? { ...t, goal_id: undefined } : t)),
    }));
  }, []);

  const addGoalLog = useCallback((goalId: string, date: Date) => {
    setState((s) => ({
      ...s,
      goalLogs: [...s.goalLogs, { id: uid(), goal_id: goalId, date: toDateKey(date) }],
    }));
  }, []);

  const removeGoalLog = useCallback((goalId: string, date: Date) => {
    const [from, to] = weekRange(date);
    setState((s) => {
      const manual = s.goalLogs.filter(
        (l) => l.goal_id === goalId && !l.task_id && l.date >= from && l.date <= to,
      );
      const last = manual[manual.length - 1];
      if (!last) return s;
      return { ...s, goalLogs: s.goalLogs.filter((l) => l.id !== last.id) };
    });
  }, []);

  const addEvent = useCallback(
    (date: string, title: string, startTime?: string, endTime?: string) => {
      const trimmed = title.trim();
      if (!trimmed || !date) return;
      setState((s) => ({
        ...s,
        events: [
          ...s.events,
          {
            id: uid(),
            date,
            title: trimmed,
            start_time: startTime || undefined,
            end_time: endTime || undefined,
            kind: "rendez-vous",
          },
        ],
      }));
    },
    [],
  );

  const deleteEvent = useCallback((id: string) => {
    setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      addTask,
      toggleTask,
      deleteTask,
      setTaskGoal,
      repeatTaskToday,
      tasksFor: (date) =>
        state.tasks.filter((t) => t.date === date).sort((a, b) => a.position - b.position),
      toggleHabit,
      isHabitDone: (habitId, date) =>
        state.habitLogs.some((l) => l.habit_id === habitId && l.date === date),
      addHabit,
      removeHabit,
      entryFor: (date) => state.dayEntries.find((e) => e.date === date),
      updateEntry,
      goalProgress: (goalId, date) => {
        const [from, to] = weekRange(date);
        return state.goalLogs.filter(
          (l) => l.goal_id === goalId && l.date >= from && l.date <= to,
        ).length;
      },
      addGoal,
      updateGoal,
      deleteGoal,
      addGoalLog,
      removeGoalLog,
      manualLogCount: (goalId, date) => {
        const [from, to] = weekRange(date);
        return state.goalLogs.filter(
          (l) => l.goal_id === goalId && !l.task_id && l.date >= from && l.date <= to,
        ).length;
      },
      addEvent,
      deleteEvent,
      eventsFor: (date) =>
        state.events
          .filter((e) => e.date === date)
          .sort((a, b) => (a.start_time ?? "").localeCompare(b.start_time ?? "")),
      goalsDoneOn: (date) => [
        ...new Set(state.goalLogs.filter((l) => l.date === date).map((l) => l.goal_id)),
      ],
    }),
    [
      state,
      addTask,
      toggleTask,
      deleteTask,
      setTaskGoal,
      repeatTaskToday,
      toggleHabit,
      addHabit,
      removeHabit,
      updateEntry,
      addGoal,
      updateGoal,
      deleteGoal,
      addGoalLog,
      removeGoalLog,
      addEvent,
      deleteEvent,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
