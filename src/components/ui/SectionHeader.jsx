export default function SectionHeader({
  label,
  title,
  description,
  align = 'center',
  light = false,
  className = '',
}) {
  const alignment =
    align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto'

  return (
    <div className={`mb-10 flex max-w-3xl flex-col md:mb-14 ${alignment} ${className}`}>
      {label ? (
        <span className={`section-label ${light ? 'text-accent-yellow' : ''}`}>{label}</span>
      ) : null}
      <h2 className={`section-title ${light ? 'text-white' : ''}`}>{title}</h2>
      {description ? (
        <p className={`section-desc ${light ? 'text-white/80' : ''} ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
