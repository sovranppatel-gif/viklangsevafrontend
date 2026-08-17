import {
  Bell,
  CalendarDays,
  ChevronDown,
  FolderOpen,
  HandHeart,
  Image,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Megaphone,
  Menu,
  Newspaper,
  GraduationCap,
  HeartHandshake,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  clearMasterAdminSession,
  fetchMasterAdminMe,
  getMasterAdminToken,
  isMasterAdminAuthenticated,
} from '../data/auth'
import { fetchDashboard } from '../../../services/dashboard'

const navItems = [
  { to: '/master-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  {
    label: 'Donations',
    icon: HandHeart,
    children: [
      { to: '/master-admin/donations', label: 'All Donors', end: true },
      { to: '/master-admin/donations/create', label: 'Create Donor' },
      { to: '/master-admin/donations/settings', label: 'Donate Page' },
    ],
  },
  {
    label: 'Students',
    icon: GraduationCap,
    children: [
      { to: '/master-admin/students', label: 'All Students' },
      { to: '/master-admin/students/create', label: 'Add Student' },
    ],
  },
  {
    label: 'Volunteer',
    icon: Users,
    children: [
      { to: '/master-admin/volunteers', label: 'All Volunteers' },
      { to: '/master-admin/volunteers/create', label: 'Add Volunteer' },
    ],
  },
  {
    label: 'Enquiries',
    icon: Mail,
    children: [{ to: '/master-admin/enquiries', label: 'All Enquiries' }],
  },
  {
    label: 'Reports & Documents',
    icon: FolderOpen,
    children: [
      { to: '/master-admin/cms/reports/home-reports', label: 'Reports Section (Home)' },
      { to: '/master-admin/cms/reports/reports-hub', label: 'Reports Page' },
      { to: '/master-admin/cms/reports/report-items', label: 'Manage Documents' },
    ],
  },
  {
    label: 'Manage CMS',
    icon: LayoutTemplate,
    children: [
      { to: '/master-admin/cms/hero', label: 'Hero Section' },
      { to: '/master-admin/cms/about/home-about', label: 'About Section (Home)' },
      { to: '/master-admin/cms/about/about-hub', label: 'About Page' },
      { to: '/master-admin/cms/about/about-story', label: 'Our Story' },
      { to: '/master-admin/cms/about/about-mission-vision', label: 'Mission & Vision' },
      { to: '/master-admin/cms/about/about-team', label: 'Our Team' },
      { to: '/master-admin/cms/about/about-journey', label: 'Our Journey' },
    ],
  },
  {
    label: 'Programs',
    icon: Megaphone,
    children: [
      { to: '/master-admin/cms/programs/home-programs', label: 'Programs Section (Home)' },
      { to: '/master-admin/cms/programs/programs-hub', label: 'Programs Page' },
      { to: '/master-admin/cms/programs/program-education', label: 'Education' },
      { to: '/master-admin/cms/programs/program-rehabilitation', label: 'Rehabilitation' },
      { to: '/master-admin/cms/programs/program-skill-development', label: 'Skill Development' },
      { to: '/master-admin/cms/programs/program-healthcare', label: 'Healthcare' },
      { to: '/master-admin/cms/programs/program-community-development', label: 'Community Development' },
      { to: '/master-admin/cms/programs/program-social-inclusion', label: 'Social Inclusion' },
    ],
  },
  {
    label: 'Blog',
    icon: Newspaper,
    children: [
      { to: '/master-admin/cms/blog/home-blog', label: 'Blog Section (Home)' },
      { to: '/master-admin/cms/blog/news-hub', label: 'News Hub Page' },
      { to: '/master-admin/cms/blog/news-blog', label: 'Blog Page' },
      { to: '/master-admin/cms/blog/news-news', label: 'News Page' },
      { to: '/master-admin/cms/blog/blog-articles', label: 'Manage Articles' },
    ],
  },
  {
    label: 'Events',
    icon: CalendarDays,
    children: [
      { to: '/master-admin/cms/blog/home-events', label: 'Events Section (Home)' },
      { to: '/master-admin/cms/blog/news-events', label: 'Events Page' },
      { to: '/master-admin/cms/blog/event-items', label: 'Manage Events' },
    ],
  },
  {
    label: 'Gallery',
    icon: Image,
    children: [
      { to: '/master-admin/cms/gallery/home-gallery', label: 'Gallery Section (Home)' },
      { to: '/master-admin/cms/gallery/gallery-hub', label: 'Gallery Hub Page' },
      { to: '/master-admin/cms/gallery/gallery-photos', label: 'Photos Page' },
      { to: '/master-admin/cms/gallery/gallery-videos', label: 'Videos Page' },
      { to: '/master-admin/cms/gallery/gallery-photo-items', label: 'Manage Photos' },
      { to: '/master-admin/cms/gallery/gallery-video-items', label: 'Manage Videos' },
    ],
  },
  {
    label: 'Impact',
    icon: HeartHandshake,
    children: [
      { to: '/master-admin/cms/impact/home-stories', label: 'Stories Section (Home)' },
      { to: '/master-admin/cms/impact/stories-hub', label: 'Stories Page' },
      { to: '/master-admin/cms/impact/story-items', label: 'Manage Stories' },
      { to: '/master-admin/cms/impact/impact-stats', label: 'Impact Statistics' },
      { to: '/master-admin/cms/impact/impact-campaign', label: 'Campaign Progress' },
    ],
  },
  {
    label: 'System Settings',
    icon: Settings,
    children: [
      { to: '/master-admin/settings/contact', label: 'Contact & Social' },
    ],
  },
]

function getInitialOpenMenus(pathname) {
  const open = {}
  if (pathname.startsWith('/master-admin/donations')) {
    open.Donations = true
  }
  if (pathname.startsWith('/master-admin/students')) {
    open.Students = true
  }
  if (
    pathname.startsWith('/master-admin/cms/hero') ||
    pathname.startsWith('/master-admin/cms/about')
  ) {
    open['Manage CMS'] = true
  }
  if (pathname.startsWith('/master-admin/cms/programs')) {
    open.Programs = true
  }
  if (
    pathname === '/master-admin/cms/blog/home-events' ||
    pathname === '/master-admin/cms/blog/news-events' ||
    pathname === '/master-admin/cms/blog/event-items' ||
    pathname.startsWith('/master-admin/cms/blog/home-events/') ||
    pathname.startsWith('/master-admin/cms/blog/news-events/') ||
    pathname.startsWith('/master-admin/cms/blog/event-items/')
  ) {
    open.Events = true
  } else if (pathname.startsWith('/master-admin/cms/blog')) {
    open.Blog = true
  }
  if (pathname.startsWith('/master-admin/cms/gallery')) {
    open.Gallery = true
  }
  if (pathname.startsWith('/master-admin/cms/impact')) {
    open.Impact = true
  }
  if (pathname.startsWith('/master-admin/volunteers')) {
    open.Volunteer = true
  }
  if (pathname.startsWith('/master-admin/cms/reports')) {
    open['Reports & Documents'] = true
  }
  if (pathname.startsWith('/master-admin/enquiries')) {
    open.Enquiries = true
  }
  if (pathname.startsWith('/master-admin/settings')) {
    open['System Settings'] = true
  }
  return open
}

function Sidebar({ onClose }) {
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState(() => getInitialOpenMenus(location.pathname))

  useEffect(() => {
    setOpenMenus((prev) => ({
      ...prev,
      ...getInitialOpenMenus(location.pathname),
    }))
  }, [location.pathname])

  function toggleMenu(label) {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <div className="flex h-full flex-col bg-[#0A1628] text-white">
      <div className="relative border-b border-white/10 px-5 py-5 text-center">
        <img
          src="/logo.png"
          alt="Viklang Sewa Sansthan logo"
          className="mx-auto h-14 w-auto object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav
        className="sidebar-scroll relative flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-4"
        aria-label="Master admin"
      >
        {navItems.map((item) => {
          const Icon = item.icon

          if (item.children?.length) {
            const isOpen = Boolean(openMenus[item.label])
            const childActive = item.children.some((child) =>
              location.pathname.startsWith(child.to),
            )

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
                    childActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 opacity-70 transition ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen ? (
                  <div className="mt-0.5 ml-4 space-y-0.5 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        end={child.end}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `block rounded-lg px-3 py-2 text-[12px] font-medium transition ${
                            isActive
                              ? 'bg-brand text-white shadow-md shadow-brand/30'
                              : 'text-white/65 hover:bg-white/10 hover:text-white'
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          }

          if (item.to === '#') {
            return (
              <span
                key={item.label}
                className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-white/60"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.hasSub ? <ChevronDown className="h-3.5 w-3.5 opacity-50" /> : null}
              </span>
            )
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/30'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export default function MasterAdminLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function verifySession() {
      if (!isMasterAdminAuthenticated()) {
        navigate('/master-admin', { replace: true })
        return
      }

      try {
        await fetchMasterAdminMe(getMasterAdminToken())
        if (!cancelled) setReady(true)
      } catch {
        clearMasterAdminSession()
        if (!cancelled) {
          navigate('/master-admin?reason=session', { replace: true })
        }
      }
    }

    verifySession()
    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    if (!ready) return undefined
    let cancelled = false

    async function loadNotifications() {
      try {
        const token = getMasterAdminToken()
        const result = await fetchDashboard(token)
        if (!cancelled && result?.success) {
          setNotificationCount(Number(result.data?.notificationCount) || 0)
        }
      } catch {
        if (!cancelled) setNotificationCount(0)
      }
    }

    loadNotifications()
    return () => {
      cancelled = true
    }
  }, [ready])

  function handleLogout() {
    clearMasterAdminSession()
    navigate('/master-admin')
  }

  if (!ready) {
    return <div className="min-h-screen bg-[#F3F5F9]" />
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 border-b border-border bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              className="rounded-lg border border-border p-2 text-navy lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-extrabold tracking-wide text-brand sm:text-lg">
                VIKLANG SEWA SANSTHAN
              </h1>
              <p className="truncate text-[11px] text-text-muted sm:text-xs">
                Run by: Bramharshi Vashishth Shikshan Prashikshan Evam Sewa Samiti
              </p>
            </div>

            <div className="order-last hidden w-full max-w-sm flex-1 md:order-none md:block lg:mx-6">
              <label className="relative block">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="search"
                  placeholder="Search here..."
                  className="w-full rounded-full border border-border bg-[#F5F7FA] py-2.5 pr-3 pl-10 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="relative rounded-full border border-border p-2.5 text-navy hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                ) : null}
              </button>

              <div className="flex items-center gap-2 rounded-full border border-border py-1.5 pr-2 pl-1.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                  MA
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold text-navy">Master Admin</span>
                  <span className="block text-[11px] text-text-muted">Administrator</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden rounded-lg px-2 py-1 text-[11px] font-semibold text-brand hover:bg-brand-soft sm:inline"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6">
          <Outlet />
        </main>

        <footer className="flex flex-col gap-1 border-t border-border bg-white px-4 py-4 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Viklang Sewa Sansthan. All rights reserved.</p>
          <p>Made with ❤️ for a better tomorrow</p>
        </footer>
      </div>
    </div>
  )
}
