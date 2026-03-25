interface Props {
  message: string;
  description?: string;
}

export default function EmptyState({ message, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
      <div className="text-5xl mb-4">📭</div>
      <p className="text-lg font-medium text-gray-500">{message}</p>
      {description && <p className="mt-1 text-sm">{description}</p>}
    </div>
  );
}
