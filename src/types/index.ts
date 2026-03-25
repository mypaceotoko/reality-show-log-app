export type ShowStatus = "watching" | "completed" | "on_hold" | "plan_to_watch" | "dropped";

export type StreamingService =
  | "netflix"
  | "abema"
  | "tver"
  | "hulu"
  | "disneyplus"
  | "amazon"
  | "unext"
  | "other";

export const STREAMING_SERVICE_LABELS: Record<StreamingService, string> = {
  netflix: "Netflix",
  abema: "ABEMA",
  tver: "TVer",
  hulu: "Hulu",
  disneyplus: "Disney+",
  amazon: "Prime Video",
  unext: "U-NEXT",
  other: "その他",
};

export interface Show {
  id: string;
  title: string;
  status: ShowStatus;
  streamingService?: StreamingService;
  castMemo?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Season {
  id: string;
  showId: string;
  number: number;
  title?: string;
  createdAt: string;
}

export interface Episode {
  id: string;
  seasonId: string;
  showId: string;
  number: number;
  title?: string;
  impression?: string;
  watchedAt?: string;
  createdAt: string;
}

export const SHOW_STATUS_LABELS: Record<ShowStatus, string> = {
  watching: "視聴中",
  completed: "視聴完了",
  on_hold: "一時停止",
  plan_to_watch: "視聴予定",
  dropped: "断念",
};

export const SHOW_STATUS_COLORS: Record<ShowStatus, string> = {
  watching: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  plan_to_watch: "bg-gray-100 text-gray-800",
  dropped: "bg-red-100 text-red-800",
};
