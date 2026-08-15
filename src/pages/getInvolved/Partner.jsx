import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero'

export default function Partner() {
  return (
    <>
      <PageHero
        label="Partner With Us"
        title="Build Impact Together"
        description="We welcome partnerships with institutions, CSR teams, schools and community organizations."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Get Involved', to: '/get-involved' },
          { label: 'Partner With Us' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page max-w-3xl">
          <p className="text-lg leading-relaxed text-text-muted">
            Partnerships help us expand education support, rehabilitation services, healthcare
            outreach and livelihood opportunities for persons with disabilities. If your
            organization shares our commitment to inclusion, we would love to collaborate.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-text-muted">
            <li>• CSR and institutional collaborations</li>
            <li>• School and training partnerships</li>
            <li>• Healthcare and community outreach alliances</li>
            <li>• Awareness and advocacy campaigns</li>
          </ul>
          <Link to="/contact" className="btn-primary mt-8">
            Start a Partnership Conversation
          </Link>
        </div>
      </section>
    </>
  )
}
