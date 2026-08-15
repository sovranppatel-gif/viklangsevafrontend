import { Link } from 'react-router-dom'

export default function PageHero({
  label,
  title,
  description,
  crumbs = [],
  image = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" aria-hidden="true" />
      <div className="container-page relative py-16 md:py-20">
        {crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                  {index < crumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {label ? <p className="section-label text-accent-yellow">{label}</p> : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">{description}</p>
        ) : null}
      </div>
    </section>
  )
}
