import { useEffect, useState } from 'react'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'
import { DEFAULT_ABOUT } from '../../data/aboutDefaults'
import { fetchAboutContent } from '../../services/cms'

export default function OurTeam() {
  const { isHi } = useLanguage()
  const [content, setContent] = useState(DEFAULT_ABOUT['about-team'])

  useEffect(() => {
    let cancelled = false
    fetchAboutContent('about-team').then((data) => {
      if (!cancelled && data) setContent({ ...DEFAULT_ABOUT['about-team'], ...data })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const pick = (en, hi) => (isHi && hi ? hi : en)

  if (content.isActive === false) {
    return (
      <PageHero
        label="Our Team"
        title="Our Team"
        description="This page is currently unavailable."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About', to: '/about' },
          { label: 'Our Team' },
        ]}
      />
    )
  }

  return (
    <>
      <PageHero
        label={pick(content.heroLabel, content.heroLabelHi)}
        title={pick(content.heroTitle, content.heroTitleHi)}
        description={pick(content.heroDescription, content.heroDescriptionHi)}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About', to: '/about' },
          { label: pick(content.heroLabel, content.heroLabelHi) || 'Our Team' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {(content.members || []).map((member) => (
            <article
              key={member.id || member.name}
              className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={pick(member.name, member.nameHi)}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy">{pick(member.name, member.nameHi)}</h3>
                <p className="mt-1 text-sm font-semibold text-brand">
                  {pick(member.role, member.roleHi)}
                </p>
                <p className="mt-3 text-sm text-text-muted">{pick(member.bio, member.bioHi)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
