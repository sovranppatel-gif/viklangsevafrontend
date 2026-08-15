import ImpactStats from '../../components/ImpactStats'
import PageHero from '../../components/ui/PageHero'
import { useLanguage } from '../../context/LanguageContext'

export default function Statistics() {
  const { t } = useLanguage()

  return (
    <>
      <PageHero
        label={t('Impact Statistics', 'प्रभाव आँकड़े')}
        title={t('Our Reach at a Glance', 'एक नज़र में हमारी पहुँच')}
        description={t(
          'These figures can be updated anytime from the master admin panel.',
          'ये आँकड़े मास्टर एडमिन पैनल से कभी भी अपडेट किए जा सकते हैं।',
        )}
        crumbs={[
          { label: t('Home', 'होम'), to: '/' },
          { label: t('Impact', 'प्रभाव'), to: '/impact' },
          { label: t('Impact Statistics', 'प्रभाव आँकड़े') },
        ]}
      />
      <div className="section-padding">
        <ImpactStats />
      </div>
    </>
  )
}
