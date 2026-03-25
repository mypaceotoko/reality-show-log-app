"use client";

import { useState } from "react";
import { Episode } from "@/types";

interface Props {
  initial?: Partial<Episode>;
  onSubmit: (data: {
    number: number;
    title?: string;
    impression?: string;
    watchedAt?: string;
  }) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function EpisodeForm({ initial, onSubmit, onCancel, submitLabel = "追加する" }: Props) {
  const [number, setNumber] = useState(initial?.number?.toString() ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [impression, setImpression] = useState(initial?.impression ?? "");
  const [watchedAt, setWatchedAt] = useState(
    initial?.watchedAt ? initial.watchedAt.slice(0, 10) : ""
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(number, 10);
    if (!number || isNaN(num) || num < 1) {
      setError("話数を正しく入力してください（1以上の整数）");
      return;
    }
    onSubmit({
      number: num,
      title: title.trim() || undefined,
      impression: impression.trim() || undefined,
      watchedAt: watchedAt || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            話数 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={number}
            onChange={(e) => { setNumber(e.target.value); setError(""); }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：運命の出会い"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">視聴日</label>
        <input
          type="date"
          value={watchedAt}
          onChange={(e) => setWatchedAt(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">感想</label>
        <textarea
          value={impression}
          onChange={(e) => setImpression(e.target.value)}
          placeholder="このエピソードの感想を書いてね"
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="flex-1 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
