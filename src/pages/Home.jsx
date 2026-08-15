import AboutSection from '../components/AboutSection'
import BlogSection from '../components/BlogSection'
import CampaignProgress from '../components/CampaignProgress'
import ContactSection from '../components/ContactSection'
import DonationSection from '../components/DonationSection'
import Events from '../components/Events'
import Gallery from '../components/Gallery'
import Hero from '../components/Hero'
import ImpactStats from '../components/ImpactStats'
import ImpactStories from '../components/ImpactStories'
import Programs from '../components/Programs'
import Reports from '../components/Reports'
import VolunteerCTA from '../components/VolunteerCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <ImpactStories limit={3} />
      <DonationSection />
      <CampaignProgress />
      <AboutSection />
      <Programs />
      <Events />
      <Gallery />
      <VolunteerCTA />
      <BlogSection />
      <Reports />
      <ContactSection />
    </>
  )
}
