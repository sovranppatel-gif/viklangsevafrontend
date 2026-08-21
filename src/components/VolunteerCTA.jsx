import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function VolunteerCTA() {
  const { t } = useLanguage()

  return (
    <section id="volunteer" className="section-padding bg-muted scroll-mt-28">
      <div className="container-page">
        <div className="grid items-center gap-0 overflow-hidden rounded-2xl bg-navy sm:rounded-3xl lg:grid-cols-2">
          <div className="p-5 text-white sm:p-8 md:p-12">
            <p className="section-label text-accent-yellow">
              {t('Be the Change', 'परिवर्तन बनें')}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight break-words sm:text-3xl md:text-4xl">
              {t('Your Time Can Make a Difference', 'आपका समय फर्क ला सकता है')}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              {t(
                'Join Viklang Sewa Sansthan as a volunteer. Whether you can teach, support events, help with outreach or strengthen our programs — your time creates real impact for persons with disabilities and their families.',
                'विकलांग सेवा संस्थान से स्वयंसेवक के रूप में जुड़ें। शिक्षण, कार्यक्रम, आउटरीच या कार्यक्रमों को मजबूत करने में मदद — आपका समय दिव्यांगजनों और उनके परिवारों के लिए वास्तविक प्रभाव बनाता है।',
              )}
            </p>
            <div className="mt-6 sm:mt-8">
              <Link to="/volunteer" className="btn-primary">
                {t('Become a Volunteer', 'स्वयंसेवक बनें')}
              </Link>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-52 sm:h-72 lg:h-full lg:min-h-[320px]"
          >
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80"
              alt={t(
                'Volunteers smiling together during a community service activity',
                'सामुदायिक सेवा के दौरान स्वयंसेवक',
              )}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
