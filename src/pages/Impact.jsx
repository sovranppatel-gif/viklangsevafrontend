import { Link } from 'react-router-dom'
import ImpactStats from '../components/ImpactStats'
import ImpactStories from '../components/ImpactStories'
import PageHero from '../components/ui/PageHero'

export default function Impact() {
  return (
    <>
      <PageHero
        label="Impact"
        title="Measuring Change That Matters"
        description="Stories, activities and outcomes that reflect our commitment to persons with disabilities."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Impact' },
        ]}
      />
      <div className="pt-10">
        <ImpactStats />
      </div>
      <ImpactStories />
      <section className="section-padding bg-muted">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {[
            { title: 'Success Stories', to: '/impact/stories' },
            { title: 'Our Activities', to: '/impact/activities' },
            { title: 'Impact Statistics', to: '/impact/statistics' },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="card card-hover">
              <h3 className="text-lg font-bold text-navy">{item.title}</h3>
              <span className="link-arrow mt-4">View →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
