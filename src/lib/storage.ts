import { Show, Season, Episode } from "@/types";

const KEYS = {
  SHOWS: "rsl_shows",
  SEASONS: "rsl_seasons",
  EPISODES: "rsl_episodes",
} as const;

function getItem<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function setItem<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Shows
export const storage = {
  getShows: (): Show[] => getItem<Show>(KEYS.SHOWS),
  saveShows: (shows: Show[]): void => setItem(KEYS.SHOWS, shows),

  getSeasons: (): Season[] => getItem<Season>(KEYS.SEASONS),
  saveSeasons: (seasons: Season[]): void => setItem(KEYS.SEASONS, seasons),

  getEpisodes: (): Episode[] => getItem<Episode>(KEYS.EPISODES),
  saveEpisodes: (episodes: Episode[]): void => setItem(KEYS.EPISODES, episodes),
};
