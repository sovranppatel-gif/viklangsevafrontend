import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero'

export default function Fundraise() {
  return (
    <>
      <PageHero
        label="Fundraise"
        title="Raise Support for Inclusive Change"
        description="Start a fundraising effort for education kits, rehabilitation support or community programs."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Get Involved', to: '/get-involved' },
          { label: 'Fundraise' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page max-w-3xl">
          <p className="text-lg leading-relaxed text-text-muted">
            Whether you are celebrating a birthday, mobilizing friends or leading a workplace
            campaign, your fundraiser can help expand opportunities for persons with disabilities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/donate" className="btn-primary">
              Donate Directly
            </Link>
            <Link to="/contact" className="btn-outline">
              Plan a Fundraiser
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
