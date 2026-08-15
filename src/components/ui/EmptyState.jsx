export default function EmptyState({ title = 'Nothing here yet', description }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/50 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      {description ? <p className="mt-2 text-sm text-text-muted">{description}</p> : null}
    </div>
  )
}
