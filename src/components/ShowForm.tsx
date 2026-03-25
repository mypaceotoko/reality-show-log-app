"use client";

import { useState } from "react";
import { Show, ShowStatus, SHOW_STATUS_LABELS, StreamingService, STREAMING_SERVICE_LABELS } from "@/types";

interface Props {
  initial?: Partial<Show>;
  onSubmit: (data: { title: string; status: ShowStatus; streamingService?: StreamingService; castMemo?: string; memo?: string }) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ShowForm({ initial, onSubmit, onCancel, submitLabel = "登録する" }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [status, setStatus] = useState<ShowStatus>(initial?.status ?? "plan_to_watch");
  const [streamingService, setStreamingService] = useState<StreamingService | "">(initial?.streamingService ?? "");
  const [castMemo, setCastMemo] = useState(initial?.castMemo ?? "");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    onSubmit({
      title: title.trim(),
      status,
      streamingService: streamingService || undefined,
      castMemo: castMemo.trim() || undefined,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(""); }}
          placeholder="例：バチェラー・ジャパン"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ShowStatus)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          {(Object.entries(SHOW_STATUS_LABELS) as [ShowStatus, string][]).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">配信サービス</label>
        <select
          value={streamingService}
          onChange={(e) => setStreamingService(e.target.value as StreamingService | "")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">未設定</option>
          {(Object.entries(STREAMING_SERVICE_LABELS) as [StreamingService, string][]).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">キャストメモ</label>
        <textarea
          value={castMemo}
          onChange={(e) => setCastMemo(e.target.value)}
          placeholder="推しメンや印象に残った人を書いてね"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="作品についての自由メモ"
          rows={2}
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
