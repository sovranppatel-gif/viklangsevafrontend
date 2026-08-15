import PageHero from '../components/ui/PageHero'

export default function LegalPage({ title, label, children }) {
  return (
    <>
      <PageHero
        label={label}
        title={title}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: title },
        ]}
      />
      <section className="section-padding">
        <div className="container-page prose prose-navy max-w-3xl text-text-muted">{children}</div>
      </section>
    </>
  )
}
