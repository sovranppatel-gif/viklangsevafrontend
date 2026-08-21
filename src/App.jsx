import { useCallback, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'
import MainLayout from './components/layout/MainLayout'
import About from './pages/About'
import OurJourney from './pages/about/OurJourney'
import OurStory from './pages/about/OurStory'
import OurTeam from './pages/about/OurTeam'
import MissionVision from './pages/about/MissionVision'
import Contact from './pages/Contact'
import Disclaimer from './pages/Disclaimer'
import Donate from './pages/Donate'
import GalleryPage from './pages/Gallery'
import Photos from './pages/gallery/Photos'
import Videos from './pages/gallery/Videos'
import Volunteer from './pages/getInvolved/Volunteer'
import Home from './pages/Home'
import Impact from './pages/Impact'
import Activities from './pages/impact/Activities'
import Statistics from './pages/impact/Statistics'
import Stories from './pages/impact/Stories'
import StoryDetails from './pages/impact/StoryDetails'
import NotFound from './pages/NotFound'
import Blog from './pages/news/Blog'
import BlogDetails from './pages/news/BlogDetails'
import EventDetails from './pages/news/EventDetails'
import EventsPage from './pages/news/Events'
import News from './pages/news/News'
import NewsHub from './pages/news/NewsHub'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ProgramDetails from './pages/ProgramDetails'
import ProgramsPage from './pages/Programs'
import ReportsPage from './pages/Reports'
import Terms from './pages/Terms'
import MasterAdminAuthLayout from './pages/master-admin/layouts/MasterAdminAuthLayout'
import MasterAdminLayout from './pages/master-admin/layouts/MasterAdminLayout'
import MasterAdminDashboard from './pages/master-admin/pages/Dashboard'
import HeroCmsPage from './pages/master-admin/pages/cms/HeroCmsPage'
import AboutCmsPage from './pages/master-admin/pages/cms/AboutCmsPage'
import ProgramsCmsPage from './pages/master-admin/pages/cms/ProgramsCmsPage'
import BlogCmsPage from './pages/master-admin/pages/cms/BlogCmsPage'
import GalleryCmsPage from './pages/master-admin/pages/cms/GalleryCmsPage'
import ReportsCmsPage from './pages/master-admin/pages/cms/ReportsCmsPage'
import ImpactCmsPage from './pages/master-admin/pages/cms/ImpactCmsPage'
import EnquiriesPage from './pages/master-admin/pages/EnquiriesPage'
import VolunteersPage from './pages/master-admin/pages/VolunteersPage'
import VolunteerFormPage from './pages/master-admin/pages/VolunteerFormPage'
import StudentsPage from './pages/master-admin/pages/StudentsPage'
import StudentFormPage from './pages/master-admin/pages/StudentFormPage'
import ContactSettingsPage from './pages/master-admin/pages/ContactSettingsPage'
import DonateSettingsPage from './pages/master-admin/pages/DonateSettingsPage'
import AllDonorsPage from './pages/master-admin/pages/AllDonorsPage'
import CreateDonorPage from './pages/master-admin/pages/CreateDonorPage'
import MasterAdminLogin from './pages/master-admin/pages/Login'

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/master-admin')
  const [showSplash, setShowSplash] = useState(() => !window.location.pathname.startsWith('/master-admin'))
  const finishSplash = useCallback(() => setShowSplash(false), [])

  return (
    <>
      {showSplash && !isAdmin ? <SplashScreen onFinish={finishSplash} /> : null}
      <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path="about" element={<About />} />
        <Route path="about/our-story" element={<OurStory />} />
        <Route path="about/mission-vision" element={<MissionVision />} />
        <Route path="about/team" element={<OurTeam />} />
        <Route path="about/journey" element={<OurJourney />} />

        <Route path="programs" element={<ProgramsPage />} />
        <Route path="programs/:slug" element={<ProgramDetails />} />

        <Route path="impact" element={<Impact />} />
        <Route path="impact/stories" element={<Stories />} />
        <Route path="impact/stories/:slug" element={<StoryDetails />} />
        <Route path="impact/activities" element={<Activities />} />
        <Route path="impact/statistics" element={<Statistics />} />

        <Route path="news" element={<NewsHub />} />
        <Route path="news/blog" element={<Blog />} />
        <Route path="news/blog/:slug" element={<BlogDetails />} />
        <Route path="news/news" element={<News />} />
        <Route path="news/events" element={<EventsPage />} />
        <Route path="news/events/:slug" element={<EventDetails />} />

        <Route path="gallery" element={<GalleryPage />} />
        <Route path="gallery/photos" element={<Photos />} />
        <Route path="gallery/videos" element={<Videos />} />

        <Route path="volunteer" element={<Volunteer />} />
        <Route path="get-involved" element={<Navigate to="/volunteer" replace />} />
        <Route path="get-involved/volunteer" element={<Navigate to="/volunteer" replace />} />

        <Route path="donate" element={<Donate />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="contact" element={<Contact />} />

        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="disclaimer" element={<Disclaimer />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin/*" element={<Navigate to="/master-admin" replace />} />

      <Route path="master-admin">
        <Route element={<MasterAdminAuthLayout />}>
          <Route index element={<MasterAdminLogin />} />
        </Route>
        <Route element={<MasterAdminLayout />}>
          <Route path="dashboard" element={<MasterAdminDashboard />} />
          <Route path="cms/hero" element={<HeroCmsPage />} />
          <Route path="cms/about/:section" element={<AboutCmsPage />} />
          <Route path="cms/programs/:section" element={<ProgramsCmsPage />} />
          <Route path="cms/blog/:section" element={<BlogCmsPage />} />
          <Route path="cms/gallery/:section" element={<GalleryCmsPage />} />
          <Route path="cms/reports/:section" element={<ReportsCmsPage />} />
          <Route path="cms/impact/:section" element={<ImpactCmsPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="volunteers/create" element={<VolunteerFormPage />} />
          <Route path="volunteers/:id/edit" element={<VolunteerFormPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/create" element={<StudentFormPage />} />
          <Route path="students/:id/edit" element={<StudentFormPage />} />
          <Route path="donations" element={<AllDonorsPage />} />
          <Route path="donations/create" element={<CreateDonorPage />} />
          <Route path="donations/settings" element={<DonateSettingsPage />} />
          <Route path="settings/contact" element={<ContactSettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/master-admin" replace />} />
      </Route>
    </Routes>
    </>
  )
}
