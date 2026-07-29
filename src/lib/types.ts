export interface Goal {
  id: string;
  name: string;
  /** 0 = objectif libre, sans plafond */
  target: number;
  unit: string;
  color: string;
  /** Définition affichée sous le nom, pour lever toute ambiguïté sur ce qui compte. */
  note?: string;
  created_at: string;
}

export interface GoalLog {
  id: string;
  goal_id: string;
  /** YYYY-MM-DD */
  date: string;
  /** Renseigné quand le log vient d'une tâche cochée, pour pouvoir le retirer si elle est décochée. */
  task_id?: string;
}

export interface Task {
  id: string;
  date: string;
  text: string;
  done: boolean;
  goal_id?: string;
  photo_id?: string;
  position: number;
}

/** Un rendez-vous fixe, pas une tâche : il ne se coche pas. */
export interface Event {
  id: string;
  date: string;
  /** HH:MM, facultatif : tout n'a pas une heure. */
  start_time?: string;
  end_time?: string;
  title: string;
  kind: string;
}

export interface Habit {
  id: string;
  label: string;
  active: boolean;
  position: number;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
}

export interface DayEntry {
  id: string;
  date: string;
  mood?: string;
  word?: string;
  text?: string;
  cover_photo_id?: string;
}
