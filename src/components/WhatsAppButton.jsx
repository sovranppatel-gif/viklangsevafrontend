import { useLanguage } from '../context/LanguageContext'
import { useOrganization } from '../context/OrganizationContext'
import whatsappLogo from '../assets/whatsapplogo.png'

export default function WhatsAppButton() {
  const { t } = useLanguage()
  const { organization } = useOrganization()
  const href = `https://wa.me/${organization.whatsapp}?text=${encodeURIComponent(
    t(
      'Hello Viklang Sewa Sansthan, I want to donate and support your work. Please guide me for UPI / 80G receipt.',
      'नमस्ते विकलांग सेवा संस्थान, मैं दान करके आपका सहयोग करना चाहता/चाहती हूँ। कृपया UPI / 80G रसीद के बारे में मार्गदर्शन करें।',
    ),
  )}`

  return (
    <div className="float-corner pointer-events-none fixed right-3 z-40 flex flex-col items-end gap-3 md:right-6">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={t('Chat on WhatsApp', 'WhatsApp पर चैट करें')}
        className="pointer-events-auto inline-flex h-12 w-12 overflow-hidden rounded-full shadow-xl ring-2 ring-white/80 transition hover:scale-105 sm:h-14 sm:w-14"
      >
        <img
          src={whatsappLogo}
          alt=""
          className="h-full w-full object-cover"
        />
      </a>
    </div>
  )
}
