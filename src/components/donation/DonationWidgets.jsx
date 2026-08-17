import { CheckCircle2, Copy, FileText, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buildUpiQrImageUrl } from '../../data/organization'
import { useLanguage } from '../../context/LanguageContext'
import { useOrganization } from '../../context/OrganizationContext'
import { formatCurrencyINR } from '../../utils/format'
import { mediaUrl } from '../../utils/media'

export function TrustStrip({ className = '' }) {
  const { t, isHi } = useLanguage()
  const { organization } = useOrganization()

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold sm:gap-x-4 sm:text-sm ${className}`}
    >
      {(isHi ? organization.trustPointsHi : organization.trustPoints).map((point) => (
        <span key={point} className="inline-flex max-w-full items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent-green sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="leading-snug">{point}</span>
        </span>
      ))}
      <span className="inline-flex max-w-full items-center gap-1.5 text-accent-green">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
        <span className="leading-snug">{t('80G tax benefit receipt', '80G कर छूट रसीद')}</span>
      </span>
    </div>
  )
}

export function Form80GNotice({ compact = false, className = '' }) {
  const { t } = useLanguage()
  const { donate } = useOrganization()

  if (compact) {
    return (
      <p className={`text-xs font-medium leading-relaxed text-navy sm:text-sm ${className}`}>
        <span className="font-bold text-brand">{t(donate.form80gTitle, donate.form80gTitleHi)}: </span>
        {t(donate.form80gShort, donate.form80gShortHi)}
      </p>
    )
  }

  return (
    <div
      className={`rounded-2xl border border-accent-yellow/40 bg-accent-yellow/10 p-4 sm:p-5 ${className}`}
      role="note"
    >
      <p className="flex items-start gap-2 text-sm font-bold text-navy sm:text-base">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand sm:h-5 sm:w-5" aria-hidden="true" />
        <span>{t(donate.form80gTitle, donate.form80gTitleHi)}</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {t(donate.form80gNotice, donate.form80gNoticeHi)}
      </p>
    </div>
  )
}

export function UpiPaymentPanel({ amount }) {
  const { t } = useLanguage()
  const { organization } = useOrganization()
  const [copied, setCopied] = useState(false)
  const upi = organization.payment
  const qrUrl = upi.qrImageUrl
    ? mediaUrl(upi.qrImageUrl)
    : buildUpiQrImageUrl(amount || 0, 220, upi)

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upi.upiId)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const whatsappHref = `https://wa.me/${organization.whatsapp}?text=${encodeURIComponent(
    `Namaste Viklang Sewa Sansthan, I donated ${amount ? formatCurrencyINR(amount) : ''} via UPI (${upi.upiId}). Please share 80G receipt. My name: `,
  )}`

  return (
    <div className="rounded-2xl border border-border bg-muted p-3 sm:p-4">
      <p className="text-sm font-bold text-navy">{t('Pay via UPI / QR', 'UPI / QR से भुगतान करें')}</p>
      <p className="mt-1 text-xs leading-relaxed text-text-muted">
        {t(
          'Scan QR in any UPI app, or copy UPI ID. Then share screenshot on WhatsApp for 80G receipt.',
          'किसी भी UPI ऐप में QR स्कैन करें या UPI ID कॉपी करें। 80G रसीद के लिए WhatsApp पर स्क्रीनशॉट भेजें।',
        )}
      </p>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <img
          src={qrUrl}
          alt={t('UPI QR code for donation', 'दान के लिए UPI QR कोड')}
          width={160}
          height={160}
          className="h-36 w-36 rounded-xl border border-border bg-white p-2 sm:h-[180px] sm:w-[180px]"
        />
        <div className="w-full min-w-0 space-y-3">
          <div>
            <p className="text-xs font-medium text-text-muted">{t('UPI ID', 'UPI ID')}</p>
            <div className="mt-1 flex min-w-0 items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 text-xs font-semibold text-navy sm:text-sm">
                {upi.upiId}
              </code>
              <button
                type="button"
                onClick={copyUpi}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-navy hover:border-brand"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? t('Copied', 'कॉपी') : t('Copy', 'कॉपी')}
              </button>
            </div>
          </div>
          <p className="text-xs text-text-muted">
            {t('Payee', 'प्राप्तकर्ता')}: {upi.upiName}
            {amount ? ` · ${formatCurrencyINR(amount)}` : ''}
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn-outline w-full px-3 py-2 text-xs"
          >
            {t('Share payment on WhatsApp', 'भुगतान WhatsApp पर भेजें')}
          </a>
          <p className="text-[11px] leading-relaxed text-text-muted">
            {t(upi.note, upi.noteHi)}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FrequencyToggle({ value, onChange }) {
  const { t } = useLanguage()
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
      {[
        { id: 'once', label: t('One-time', 'एक बार') },
        { id: 'monthly', label: t('Monthly', 'मासिक') },
      ].map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            value === option.id ? 'bg-white text-navy shadow-sm' : 'text-text-muted'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function DonateCtaLink({ amount, method = 'upi', frequency = 'once', className = 'btn-primary w-full' }) {
  const { t } = useLanguage()
  return (
    <Link
      to={`/donate?amount=${amount || 1000}&method=${method}&frequency=${frequency}`}
      className={className}
    >
      {t('Donate', 'दान करें')} {formatCurrencyINR(amount || 1000)}
    </Link>
  )
}
