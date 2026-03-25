"use client";

import { useState, useEffect, useCallback } from "react";
import { Show, ShowStatus } from "@/types";
import { storage } from "@/lib/storage";
import { generateId } from "@/lib/id";

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    setShows(storage.getShows());
  }, []);

  const addShow = useCallback(
    (data: { title: string; status: ShowStatus; memo?: string }) => {
      const now = new Date().toISOString();
      const newShow: Show = {
        id: generateId(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const updated = [...shows, newShow];
      storage.saveShows(updated);
      setShows(updated);
      return newShow;
    },
    [shows]
  );

  const updateShow = useCallback(
    (id: string, data: Partial<Omit<Show, "id" | "createdAt">>) => {
      const updated = shows.map((s) =>
        s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
      );
      storage.saveShows(updated);
      setShows(updated);
    },
    [shows]
  );

  const deleteShow = useCallback(
    (id: string) => {
      const updated = shows.filter((s) => s.id !== id);
      storage.saveShows(updated);
      setShows(updated);

      // 関連シーズン・エピソードも削除
      const seasons = storage.getSeasons().filter((s) => s.showId !== id);
      storage.saveSeasons(seasons);
      const episodes = storage.getEpisodes().filter((e) => e.showId !== id);
      storage.saveEpisodes(episodes);
    },
    [shows]
  );

  return { shows, addShow, updateShow, deleteShow };
}
