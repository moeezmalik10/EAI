export default function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-navy-600">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-navy-200 border-t-navy-700" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
