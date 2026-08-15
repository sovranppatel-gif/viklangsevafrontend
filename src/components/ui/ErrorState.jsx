export default function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again in a moment.',
  onRetry,
}) {
  return (
    <div className="rounded-2xl border border-brand/20 bg-brand-soft px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2 text-sm text-text-muted">{description}</p>
      {onRetry ? (
        <button type="button" className="btn-primary mt-5" onClick={onRetry}>
          Try Again
        </button>
      ) : null}
    </div>
  )
}
