import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useOrganization } from '../context/OrganizationContext'

const navItems = [
  { label: 'HOME', to: '/', sectionId: 'home' },
  {
    label: 'ABOUT',
    to: '/about',
    sectionId: 'about',
    children: [
      { label: 'Our Story', to: '/about/our-story' },
      { label: 'Mission & Vision', to: '/about/mission-vision' },
      { label: 'Our Team', to: '/about/team' },
      { label: 'Our Journey', to: '/about/journey' },
    ],
  },
  {
    label: 'PROGRAMS',
    to: '/programs',
    sectionId: 'programs',
    children: [
      { label: 'Education', to: '/programs/education' },
      { label: 'Rehabilitation', to: '/programs/rehabilitation' },
      { label: 'Skill Development', to: '/programs/skill-development' },
      { label: 'Healthcare', to: '/programs/healthcare' },
      { label: 'Community Development', to: '/programs/community-development' },
      { label: 'Social Inclusion', to: '/programs/social-inclusion' },
    ],
  },
  {
    label: 'IMPACT',
    to: '/impact',
    sectionId: 'impact',
    children: [
      { label: 'Success Stories', to: '/impact/stories' },
      { label: 'Our Activities', to: '/impact/activities' },
      { label: 'Impact Statistics', to: '/impact/statistics' },
    ],
  },
  {
    label: 'NEWS & EVENTS',
    to: '/news',
    sectionId: 'news',
    children: [
      { label: 'Blog', to: '/news/blog' },
      { label: 'News', to: '/news/news' },
      { label: 'Events', to: '/news/events' },
    ],
  },
  {
    label: 'GALLERY',
    to: '/gallery',
    sectionId: 'gallery',
    children: [
      { label: 'Photos', to: '/gallery/photos' },
      { label: 'Videos', to: '/gallery/videos' },
    ],
  },
  {
    label: 'GET INVOLVED',
    to: '/get-involved',
    sectionId: 'get-involved',
    children: [
      { label: 'Volunteer', to: '/get-involved/volunteer' },
      { label: 'Partner With Us', to: '/get-involved/partner' },
      { label: 'Fundraise', to: '/get-involved/fundraise' },
    ],
  },
  { label: 'CONTACT', to: '/contact', sectionId: 'contact' },
]

const SECTION_ORDER = navItems.map((item) => item.sectionId).filter(Boolean)

function navItemClass(active) {
  return `relative inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-1.5 text-[11px] font-semibold tracking-wide transition hover:text-brand xl:px-2 xl:text-xs ${
    active ? 'text-brand' : 'text-navy'
  } after:pointer-events-none after:absolute after:right-1.5 after:bottom-0 after:left-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-brand after:transition-transform after:duration-300 xl:after:right-2 xl:after:left-2 ${
    active ? 'after:scale-x-100' : 'after:scale-x-0'
  }`
}

function DesktopDropdown({ item, active }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const timeoutRef = useRef(null)

  const show = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120)
  }

  const close = () => {
    clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) close()
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        type="button"
        className={navItemClass(active)}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          clearTimeout(timeoutRef.current)
          setOpen((value) => !value)
        }}
      >
        {item.label}
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </button>
      {open ? (
        <div
          className={`absolute top-full z-50 mt-1 min-w-52 rounded-xl border border-border bg-white p-2 shadow-xl ${
            item.label === 'GALLERY' || item.label === 'GET INVOLVED' ? 'right-0' : 'left-0'
          }`}
          role="menu"
        >
          {item.children.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              role="menuitem"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-navy transition hover:bg-muted hover:text-brand"
              onClick={close}
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function isRouteActive(pathname, item) {
  if (item.to === '/') return pathname === '/'
  return pathname === item.to || pathname.startsWith(`${item.to}/`)
}

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const { organization } = useOrganization()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [activeSection, setActiveSection] = useState('home')
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isHome) {
      setActiveSection(null)
      return undefined
    }

    const updateActiveSection = () => {
      const marker = window.scrollY + Math.min(160, window.innerHeight * 0.28)
      let current = 'home'

      for (const id of SECTION_ORDER) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= marker) current = id
      }

      setActiveSection(current)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const itemIsActive = (item) =>
    isHome ? activeSection === item.sectionId : isRouteActive(pathname, item)

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-white transition-shadow ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-1.5 px-2 py-2.5 sm:gap-3 sm:px-3 lg:px-4">
        <Link
          to="/"
          className="flex min-w-0 flex-1 items-center gap-2 xl:flex-none xl:shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <img
            src="/logo.png"
            alt="Viklang Sewa Sansthan logo"
            className="h-9 w-auto shrink-0 object-contain sm:h-10 md:h-11"
          />
          <div className="min-w-0 max-w-[8.5rem] sm:max-w-[14rem] md:max-w-none">
            <p className="truncate text-[11px] font-bold tracking-wide text-navy uppercase sm:text-xs md:text-[15px]">
              {organization.name}
            </p>
            <p className="hidden max-w-[220px] truncate text-[10px] leading-snug text-text-muted xl:block">
              {organization.tagline}
            </p>
          </div>
        </Link>

        <nav
          className="ml-auto hidden items-center justify-end gap-0.5 xl:flex 2xl:gap-1"
          aria-label="Primary"
        >
          {navItems.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} active={itemIsActive(item)} />
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={() => navItemClass(itemIsActive(item))}
                aria-current={itemIsActive(item) ? 'page' : undefined}
              >
                {item.label}
              </NavLink>
            ),
          )}
          <Link
            to="/donate?amount=1000&method=upi"
            className="ml-2 inline-flex items-center justify-center rounded-full border-2 border-brand px-3.5 py-1.5 text-[11px] font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            {t('Donate Now', 'अभी दान करें')}
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 xl:hidden">
          <div
            className="inline-flex shrink-0 overflow-hidden rounded-full border border-border text-[10px] font-bold md:hidden"
            role="group"
            aria-label={t('Language', 'भाषा')}
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-1 ${lang === 'en' ? 'bg-navy text-white' : 'text-navy'}`}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2 py-1 ${lang === 'hi' ? 'bg-navy text-white' : 'text-navy'}`}
              aria-pressed={lang === 'hi'}
            >
              हिं
            </button>
          </div>
          <Link
            to="/donate?amount=1000&method=upi"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-brand-dark sm:px-3"
          >
            {t('Donate', 'दान')}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-navy"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={2.25} /> : <Menu className="h-5 w-5" strokeWidth={2.25} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="absolute inset-x-0 top-full z-40 max-h-[min(80dvh,calc(100dvh-4rem))] overflow-y-auto border-t border-border bg-white shadow-xl xl:hidden">
          <nav className="container-page space-y-1 py-3 pb-6" aria-label="Mobile">
            {navItems.map((item) => {
              const active = itemIsActive(item)
              return (
                <div key={item.label} className="border-b border-border">
                  <div className="flex items-center justify-between">
                    {item.children ? (
                      <button
                        type="button"
                        className={`relative flex flex-1 items-center justify-between py-3 text-left text-sm font-semibold transition ${
                          active ? 'text-brand' : 'text-navy'
                        }`}
                        aria-expanded={expanded === item.label}
                        onClick={() =>
                          setExpanded((current) => (current === item.label ? null : item.label))
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition ${
                            expanded === item.label ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={`absolute bottom-1 left-0 h-0.5 rounded-full bg-brand transition-all duration-300 ${
                            active ? 'w-8 opacity-100' : 'w-0 opacity-0'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        className={`relative flex-1 py-3 text-sm font-semibold transition ${
                          active ? 'text-brand' : 'text-navy'
                        }`}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.label}
                        <span
                          className={`absolute bottom-1 left-0 h-0.5 rounded-full bg-brand transition-all duration-300 ${
                            active ? 'w-8 opacity-100' : 'w-0 opacity-0'
                          }`}
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                  </div>
                  {item.children && expanded === item.label ? (
                    <div className="space-y-1 pb-3 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-muted hover:text-brand"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
            <Link
              to="/donate?amount=1000&method=upi"
              className="btn-primary mt-4 w-full"
              onClick={() => setMobileOpen(false)}
            >
              {t('Donate Now', 'अभी दान करें')}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
