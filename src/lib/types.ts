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
  /** Renseigné quand le log vient d'une session de lecture. */
  session_id?: string;
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

export type BookStatus = "à lire" | "en cours" | "lu";

export interface Book {
  id: string;
  title: string;
  author?: string;
  cover_url?: string;
  unit: "page" | "chapitre";
  total?: number;
  current: number;
  status: BookStatus;
  /** Une phrase écrite à la fin, jamais imposée. */
  note?: string;
  finished_at?: string;
}

/** Une fois qu'elle a lu : où elle s'est arrêtée, et ce qu'elle en retient. */
export interface ReadingSession {
  id: string;
  book_id: string;
  date: string;
  /** La page ou le chapitre où elle s'est arrêtée. */
  position: number;
  note?: string;
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
