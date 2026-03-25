"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useShows } from "@/hooks/useShows";
import { useSeasons } from "@/hooks/useSeasons";
import { useEpisodes } from "@/hooks/useEpisodes";
import Link from "next/link";
import { Season } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import ShowForm from "@/components/ShowForm";
import EpisodeForm from "@/components/EpisodeForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";

// シーズン内エピソード一覧を表示するサブコンポーネント
function SeasonSection({ season, showId, onDeleteSeason }: { season: Season; showId: string; onDeleteSeason: (id: string) => void }) {
  const { episodes, addEpisode, updateEpisode, deleteEpisode } = useEpisodes(season.id);
  const [showEpForm, setShowEpForm] = useState(false);
  const [editingEpId, setEditingEpId] = useState<string | null>(null);
  const [deletingEpId, setDeletingEpId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* シーズンヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 bg-pink-50">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-pink-700"
        >
          <span>{expanded ? "▾" : "▸"}</span>
          <span>シーズン {season.number}{season.title ? `：${season.title}` : ""}</span>
          <span className="text-xs font-normal text-pink-400">（{episodes.length}話）</span>
        </button>
        <button
          onClick={() => onDeleteSeason(season.id)}
          className="text-xs text-red-400 hover:text-red-600"
        >
          削除
        </button>
      </div>

      {expanded && (
        <div className="divide-y divide-gray-50">
          {episodes.length === 0 && (
            <p className="px-4 py-3 text-xs text-gray-400">エピソードがまだありません</p>
          )}

          {episodes.map((ep) => (
            <div key={ep.id} className="px-4 py-3">
              {editingEpId === ep.id ? (
                <EpisodeForm
                  initial={ep}
                  submitLabel="更新する"
                  onSubmit={(data) => {
                    updateEpisode(ep.id, data);
                    setEditingEpId(null);
                  }}
                  onCancel={() => setEditingEpId(null)}
                />
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      第{ep.number}話{ep.title ? `「${ep.title}」` : ""}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditingEpId(ep.id)} className="text-xs text-gray-400 hover:text-pink-500">編集</button>
                      <button onClick={() => setDeletingEpId(ep.id)} className="text-xs text-gray-400 hover:text-red-500">削除</button>
                    </div>
                  </div>
                  {ep.watchedAt && (
                    <p className="text-xs text-gray-400 mt-0.5">視聴日：{ep.watchedAt.slice(0, 10)}</p>
                  )}
                  {ep.impression && (
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{ep.impression}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* エピソード追加 */}
          <div className="px-4 py-3">
            {showEpForm ? (
              <EpisodeForm
                onSubmit={(data) => {
                  addEpisode({ showId, ...data });
                  setShowEpForm(false);
                }}
                onCancel={() => setShowEpForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowEpForm(true)}
                className="text-sm text-pink-500 hover:text-pink-700 font-medium"
              >
                ＋ エピソードを追加
              </button>
            )}
          </div>
        </div>
      )}

      {deletingEpId && (
        <ConfirmDialog
          message="このエピソードを削除しますか？感想も失われます。"
          onConfirm={() => { deleteEpisode(deletingEpId); setDeletingEpId(null); }}
          onCancel={() => setDeletingEpId(null)}
        />
      )}
    </div>
  );
}

// メインページ
export default function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { shows, updateShow, deleteShow } = useShows();
  const { seasons, addSeason, deleteSeason } = useSeasons(id);

  const [editingShow, setEditingShow] = useState(false);
  const [deletingShow, setDeletingShow] = useState(false);
  const [deletingSeasonId, setDeletingSeasonId] = useState<string | null>(null);
  const [showSeasonForm, setShowSeasonForm] = useState(false);
  const [newSeasonTitle, setNewSeasonTitle] = useState("");

  const show = shows.find((s) => s.id === id);

  if (!show) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">作品が見つかりません</p>
        <Link href="/" className="mt-4 inline-block text-pink-500 text-sm hover:underline">← 一覧に戻る</Link>
      </div>
    );
  }

  const handleDeleteShow = () => {
    deleteShow(id);
    router.push("/");
  };

  const handleAddSeason = () => {
    const nextNumber = seasons.length > 0 ? Math.max(...seasons.map((s) => s.number)) + 1 : 1;
    addSeason({ number: nextNumber, title: newSeasonTitle.trim() || undefined });
    setNewSeasonTitle("");
    setShowSeasonForm(false);
  };

  const sortedSeasons = [...seasons].sort((a, b) => a.number - b.number);

  return (
    <div>
      {/* ナビ */}
      <Link href="/" className="text-sm text-pink-500 hover:underline mb-4 inline-block">← 一覧に戻る</Link>

      {/* 作品情報 */}
      {editingShow ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-4">作品を編集</h2>
          <ShowForm
            initial={show}
            submitLabel="更新する"
            onSubmit={(data) => { updateShow(id, data); setEditingShow(false); }}
            onCancel={() => setEditingShow(false)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-800 leading-snug">{show.title}</h1>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditingShow(true)} className="text-xs text-gray-400 hover:text-pink-500">編集</button>
              <button onClick={() => setDeletingShow(true)} className="text-xs text-gray-400 hover:text-red-500">削除</button>
            </div>
          </div>
          <div className="mt-2">
            <StatusBadge status={show.status} />
          </div>
          {show.memo && <p className="mt-3 text-sm text-gray-500">{show.memo}</p>}
        </div>
      )}

      {/* シーズン一覧 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-700">シーズン</h2>
        <button
          onClick={() => setShowSeasonForm((v) => !v)}
          className="text-sm text-pink-500 hover:text-pink-700 font-medium"
        >
          ＋ シーズンを追加
        </button>
      </div>

      {showSeasonForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3">
          <p className="text-sm font-medium text-gray-700 mb-2">新しいシーズン</p>
          <input
            type="text"
            value={newSeasonTitle}
            onChange={(e) => setNewSeasonTitle(e.target.value)}
            placeholder="タイトル（任意）"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 mb-3"
          />
          <div className="flex gap-2">
            <button onClick={() => setShowSeasonForm(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">キャンセル</button>
            <button onClick={handleAddSeason} className="flex-1 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600">追加する</button>
          </div>
        </div>
      )}

      {sortedSeasons.length === 0 && !showSeasonForm && (
        <EmptyState message="シーズンがまだありません" description="「シーズンを追加」から始めましょう" />
      )}

      <div className="space-y-3">
        {sortedSeasons.map((season) => (
          <SeasonSection
            key={season.id}
            season={season}
            showId={id}
            onDeleteSeason={(seasonId) => setDeletingSeasonId(seasonId)}
          />
        ))}
      </div>

      {/* 削除確認ダイアログ */}
      {deletingShow && (
        <ConfirmDialog
          message={`「${show.title}」を削除しますか？シーズン・エピソードもすべて失われます。`}
          onConfirm={handleDeleteShow}
          onCancel={() => setDeletingShow(false)}
        />
      )}
      {deletingSeasonId && (
        <ConfirmDialog
          message="このシーズンを削除しますか？エピソードもすべて失われます。"
          onConfirm={() => { deleteSeason(deletingSeasonId); setDeletingSeasonId(null); }}
          onCancel={() => setDeletingSeasonId(null)}
        />
      )}
    </div>
  );
}
