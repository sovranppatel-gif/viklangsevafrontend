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
      <div className="container-page flex items-center justify-between py-2 text-xs lg:text-sm">
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
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
          <span className="inline-flex items-center gap-2 text-white/80">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {organization.location}
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
          <span className="text-white/70">{t('Follow Us', 'हमें फॉलो करें')}</span>
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
