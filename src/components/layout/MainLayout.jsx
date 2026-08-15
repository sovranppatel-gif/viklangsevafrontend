import { Outlet } from 'react-router-dom'
import AccessibilityWidget from '../AccessibilityWidget'
import Footer from '../Footer'
import Navbar from '../Navbar'
import StickyDonateBar from '../StickyDonateBar'
import TopBar from '../TopBar'
import WhatsAppButton from '../WhatsAppButton'
import { OrganizationProvider } from '../../context/OrganizationContext'
import ScrollToTop from './ScrollToTop'

export default function MainLayout() {
  return (
    <OrganizationProvider>
      <div className="page-with-sticky-cta min-h-screen overflow-x-clip bg-surface">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <ScrollToTop />
        <TopBar />
        <Navbar />
        <main id="main-content">
          <Outlet />
        </main>
        <Footer />
        <StickyDonateBar />
        <WhatsAppButton />
        <AccessibilityWidget />
      </div>
    </OrganizationProvider>
  )
}
