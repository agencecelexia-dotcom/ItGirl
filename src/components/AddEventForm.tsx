import { useState } from "react";
import { useStore } from "../lib/use-store";

interface AddEventFormProps {
  date: string;
  onDateChange: (date: string) => void;
}

export function AddEventForm({ date, onDateChange }: AddEventFormProps) {
  const { addEvent } = useStore();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    addEvent(date, title, time);
    setTitle("");
    setTime("");
  };

  const field =
    "field mt-1 w-full px-3 py-2.5 text-body placeholder:text-encre/50 focus:border-terre focus:outline-none";

  return (
    <form onSubmit={submit} className="panel tone-fenouil p-5">
      <h2 className="font-display uppercase text-h2">Ajouter</h2>

      <div className="mt-3 flex flex-wrap gap-4">
        <label className="min-w-32 flex-1">
          <span className="text-micro text-encre/70">Quand</span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className={field}
          />
        </label>
        <label className="min-w-24 flex-1">
          <span className="text-micro text-encre/70">Heure, si tu en as une</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={field}
          />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="text-micro text-encre/70">Quoi</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Rendez-vous, cours, dîner…"
          className={field}
        />
      </label>

      <button
        type="submit"
        disabled={!title.trim()}
        className="mt-4 min-h-11 btn px-4 text-small text-encre transition-opacity disabled:opacity-40"
      >
        Ajouter
      </button>
    </form>
  );
}
