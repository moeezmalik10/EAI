export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-navy-200 bg-navy-50/50 py-16 text-center">
      <h3 className="font-serif text-lg font-semibold text-navy-800">{title}</h3>
      {message && <p className="max-w-md text-sm text-navy-500">{message}</p>}
      {action}
    </div>
  );
}
