export default function LoadingState({ label = 'Loading content…' }) {
  return (
    <div
      className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-muted/60 p-8"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
      <p className="text-sm font-medium text-text-muted">{label}</p>
    </div>
  )
}
