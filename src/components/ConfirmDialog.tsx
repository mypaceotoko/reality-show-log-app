"use client";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
        <p className="text-gray-800 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
