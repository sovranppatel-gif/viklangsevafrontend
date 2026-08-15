import PageHero from '../../components/ui/PageHero'
import { galleryItems } from '../../data/gallery'

export default function Activities() {
  return (
    <>
      <PageHero
        label="Our Activities"
        title="Programs in Action"
        description="A look at outreach, education support, healthcare and community engagement activities."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Impact', to: '/impact' },
          { label: 'Our Activities' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
              <img src={item.image} alt={item.title} className="h-52 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <p className="text-xs font-semibold tracking-wide text-brand uppercase">{item.category}</p>
                <h3 className="mt-2 text-lg font-bold text-navy">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
