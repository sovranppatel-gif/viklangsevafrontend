import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6'
import { useOrganization } from '../context/OrganizationContext'
import { useLanguage } from '../context/LanguageContext'

export default function TopBar() {
  const { lang, setLang, t } = useLanguage()
  const { organization } = useOrganization()

  const socialLinks = [
    { name: 'Facebook', href: organization.social.facebook, icon: FaFacebookF },
    { name: 'Instagram', href: organization.social.instagram, icon: FaInstagram },
    { name: 'YouTube', href: organization.social.youtube, icon: FaYoutube },
    { name: 'Twitter/X', href: organization.social.twitter, icon: FaXTwitter },
  ]

  return (
    <div className="hidden border-b border-white/10 bg-navy text-white md:block">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 text-xs lg:text-sm">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 lg:gap-6">
          <a
            href={`tel:${organization.phone}`}
            className="inline-flex items-center gap-2 transition hover:text-accent-yellow"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{organization.phone}</span>
          </a>
          <a
            href={`mailto:${organization.email}`}
            className="inline-flex items-center gap-2 transition hover:text-accent-yellow"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{organization.email}</span>
          </a>
          <span className="hidden min-w-0 items-center gap-2 text-white/80 lg:inline-flex">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{organization.location}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="inline-flex overflow-hidden rounded-full border border-white/20 text-[11px] font-semibold"
            role="group"
            aria-label={t('Language', 'भाषा')}
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 transition ${lang === 'en' ? 'bg-white text-navy' : 'text-white/80 hover:bg-white/10'}`}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 transition ${lang === 'hi' ? 'bg-white text-navy' : 'text-white/80 hover:bg-white/10'}`}
              aria-pressed={lang === 'hi'}
            >
              हिं
            </button>
          </div>
          <span className="hidden text-white/70 lg:inline">{t('Follow Us', 'हमें फॉलो करें')}</span>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                className="rounded-full p-1.5 transition hover:bg-white/10 hover:text-accent-yellow"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
