import { Link } from 'react-router-dom'
import VolunteerCTA from '../../components/VolunteerCTA'
import PageHero from '../../components/ui/PageHero'

const options = [
  {
    title: 'Volunteer',
    to: '/get-involved/volunteer',
    desc: 'Give your time to education support, events and community outreach.',
  },
  {
    title: 'Partner With Us',
    to: '/get-involved/partner',
    desc: 'Collaborate as an institution, CSR partner or community organization.',
  },
  {
    title: 'Fundraise',
    to: '/get-involved/fundraise',
    desc: 'Start a campaign and mobilize support for inclusive programs.',
  },
]

export default function GetInvolved() {
  return (
    <>
      <PageHero
        label="Get Involved"
        title="Be Part of the Change"
        description="There are many ways to support persons with disabilities — through time, partnership or fundraising."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Get Involved' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {options.map((item) => (
            <Link key={item.to} to={item.to} className="card card-hover">
              <h3 className="text-xl font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{item.desc}</p>
              <span className="link-arrow mt-4">Learn More →</span>
            </Link>
          ))}
        </div>
      </section>
      <VolunteerCTA />
    </>
  )
}
