"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useShows } from "@/hooks/useShows";
import { ShowStatus, SHOW_STATUS_LABELS } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import ShowForm from "@/components/ShowForm";

export default function HomePage() {
  const { shows, addShow } = useShows();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ShowStatus | "all">("all");

  const filtered = useMemo(() => {
    return shows
      .filter((s) => filterStatus === "all" || s.status === filterStatus)
      .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [shows, search, filterStatus]);

  const handleAdd = (data: { title: string; status: ShowStatus; memo?: string }) => {
    addShow(data);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">作品一覧</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          ＋ 作品を追加
        </button>
      </div>

      {/* 検索・フィルター */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="タイトルで検索..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <div className="flex gap-2 flex-wrap">
          {([["all", "すべて"], ...Object.entries(SHOW_STATUS_LABELS)] as [string, string][]).map(
            ([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterStatus(val as ShowStatus | "all")}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterStatus === val
                    ? "bg-pink-500 text-white border-pink-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-pink-300"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* 作品リスト */}
      {filtered.length === 0 ? (
        <EmptyState
          message={shows.length === 0 ? "作品がまだありません" : "該当する作品がありません"}
          description={shows.length === 0 ? "「作品を追加」から記録を始めましょう！" : "検索条件を変えてみてください"}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((show) => (
            <li key={show.id}>
              <Link
                href={`/shows/${show.id}`}
                className="block bg-white rounded-xl border border-gray-100 px-4 py-3 hover:shadow-sm hover:border-pink-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-gray-800 text-sm leading-snug">{show.title}</span>
                  <StatusBadge status={show.status} />
                </div>
                {show.memo && (
                  <p className="mt-1 text-xs text-gray-400 line-clamp-1">{show.memo}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* 作品追加モーダル */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-0">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-base font-bold text-gray-800 mb-4">作品を追加</h2>
            <ShowForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
