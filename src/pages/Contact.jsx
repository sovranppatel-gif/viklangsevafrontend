import ContactSection from '../components/ContactSection'
import PageHero from '../components/ui/PageHero'

export default function Contact() {
  return (
    <>
      <PageHero
        label="Contact"
        title="We Would Love to Hear From You"
        description="Connect with Viklang Sewa Sansthan for support, volunteering, partnerships or enquiries."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Contact' },
        ]}
      />
      <ContactSection />
    </>
  )
}
