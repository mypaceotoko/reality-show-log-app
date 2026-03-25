"use client";

import { useState, useEffect, useCallback } from "react";
import { Episode } from "@/types";
import { storage } from "@/lib/storage";
import { generateId } from "@/lib/id";

export function useEpisodes(seasonId: string) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const all = storage.getEpisodes();
    setEpisodes(all.filter((e) => e.seasonId === seasonId).sort((a, b) => a.number - b.number));
  }, [seasonId]);

  const addEpisode = useCallback(
    (data: { showId: string; number: number; title?: string; impression?: string; watchedAt?: string }) => {
      const newEpisode: Episode = {
        id: generateId(),
        seasonId,
        ...data,
        createdAt: new Date().toISOString(),
      };
      const all = storage.getEpisodes();
      const updated = [...all, newEpisode];
      storage.saveEpisodes(updated);
      setEpisodes(
        updated.filter((e) => e.seasonId === seasonId).sort((a, b) => a.number - b.number)
      );
      return newEpisode;
    },
    [seasonId]
  );

  const updateEpisode = useCallback(
    (id: string, data: Partial<Pick<Episode, "number" | "title" | "impression" | "watchedAt">>) => {
      const all = storage.getEpisodes().map((e) => (e.id === id ? { ...e, ...data } : e));
      storage.saveEpisodes(all);
      setEpisodes(
        all.filter((e) => e.seasonId === seasonId).sort((a, b) => a.number - b.number)
      );
    },
    [seasonId]
  );

  const deleteEpisode = useCallback(
    (id: string) => {
      const all = storage.getEpisodes().filter((e) => e.id !== id);
      storage.saveEpisodes(all);
      setEpisodes(
        all.filter((e) => e.seasonId === seasonId).sort((a, b) => a.number - b.number)
      );
    },
    [seasonId]
  );

  return { episodes, addEpisode, updateEpisode, deleteEpisode };
}
