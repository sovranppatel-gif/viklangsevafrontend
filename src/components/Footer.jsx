import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useOrganization } from '../context/OrganizationContext'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Programs', to: '/programs' },
  { label: 'Impact', to: '/impact' },
  { label: 'News & Events', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
]

const involveLinks = [
  { label: 'Donate', to: '/donate' },
  { label: 'Become a Volunteer', to: '/volunteer' },
]

export default function Footer() {
  const { organization } = useOrganization()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const social = [
    { name: 'Facebook', href: organization.social.facebook, icon: FaFacebookF },
    { name: 'Instagram', href: organization.social.instagram, icon: FaInstagram },
    { name: 'YouTube', href: organization.social.youtube, icon: FaYoutube },
    { name: 'Twitter/X', href: organization.social.twitter, icon: FaXTwitter },
  ]

  const handleSubscribe = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setMessage('Thank you for subscribing. Updates will reach your inbox soon.')
    setEmail('')
  }

  return (
    <footer className="bg-navy text-white">
      <div className="container-page section-padding pb-10">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt={`${organization.name} logo`}
                className="h-12 w-auto shrink-0 object-contain sm:h-14"
              />
              <div className="min-w-0">
                <p className="text-base font-bold sm:text-lg">{organization.name}</p>
                <p className="text-xs text-white/70">{organization.tagline}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/75">{organization.description}</p>
            <div className="mt-5 flex gap-2">
              {social.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="rounded-full bg-white/10 p-2 transition hover:bg-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase">Get Involved</h3>
            <ul className="mt-4 space-y-2">
              {involveLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {organization.address.line1}, {organization.address.line2},{' '}
                  {organization.address.city}, {organization.address.state}{' '}
                  {organization.address.pincode}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${organization.phone}`}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {organization.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${organization.email}`}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {organization.email}
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h3 className="text-sm font-bold tracking-wider uppercase">Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                  className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-brand focus:outline-none"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </form>
              {message ? (
                <p className="mt-2 text-xs text-accent-green" role="status">
                  {message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="container-page flex flex-col gap-3 py-5 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p className="text-xs sm:text-sm">© 2026 {organization.name}. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms & Conditions
            </Link>
            <Link to="/disclaimer" className="hover:text-white">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
