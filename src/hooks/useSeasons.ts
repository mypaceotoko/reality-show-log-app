"use client";

import { useState, useEffect, useCallback } from "react";
import { Season } from "@/types";
import { storage } from "@/lib/storage";
import { generateId } from "@/lib/id";

export function useSeasons(showId: string) {
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    const all = storage.getSeasons();
    setSeasons(all.filter((s) => s.showId === showId));
  }, [showId]);

  const addSeason = useCallback(
    (data: { number: number; title?: string }) => {
      const newSeason: Season = {
        id: generateId(),
        showId,
        ...data,
        createdAt: new Date().toISOString(),
      };
      const all = storage.getSeasons();
      const updated = [...all, newSeason];
      storage.saveSeasons(updated);
      setSeasons((prev) => [...prev, newSeason]);
      return newSeason;
    },
    [showId]
  );

  const updateSeason = useCallback((id: string, data: Partial<Pick<Season, "number" | "title">>) => {
    const all = storage.getSeasons().map((s) => (s.id === id ? { ...s, ...data } : s));
    storage.saveSeasons(all);
    setSeasons(all.filter((s) => s.showId === showId));
  }, [showId]);

  const deleteSeason = useCallback(
    (id: string) => {
      const all = storage.getSeasons().filter((s) => s.id !== id);
      storage.saveSeasons(all);
      setSeasons(all.filter((s) => s.showId === showId));

      const episodes = storage.getEpisodes().filter((e) => e.seasonId !== id);
      storage.saveEpisodes(episodes);
    },
    [showId]
  );

  return { seasons, addSeason, updateSeason, deleteSeason };
}
