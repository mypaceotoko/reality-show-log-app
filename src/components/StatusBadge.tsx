import { ShowStatus, SHOW_STATUS_LABELS, SHOW_STATUS_COLORS } from "@/types";

interface Props {
  status: ShowStatus;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${SHOW_STATUS_COLORS[status]}`}>
      {SHOW_STATUS_LABELS[status]}
    </span>
  );
}
