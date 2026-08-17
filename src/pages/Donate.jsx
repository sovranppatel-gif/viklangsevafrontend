import PageHero from '../components/ui/PageHero'
import DonationSection from '../components/DonationSection'
import { useLanguage } from '../context/LanguageContext'
import { useOrganization } from '../context/OrganizationContext'

export default function Donate() {
  const { t } = useLanguage()
  const { donate } = useOrganization()

  return (
    <>
      <PageHero
        label={t(donate.pageLabel, donate.pageLabelHi)}
        title={t(donate.pageTitle, donate.pageTitleHi)}
        description={t(donate.pageDescription, donate.pageDescriptionHi)}
        crumbs={[
          { label: t('Home', 'होम'), to: '/' },
          { label: t('Donate', 'दान') },
        ]}
      />
      <DonationSection />
    </>
  )
}
