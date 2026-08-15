import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import {
  Form80GNotice,
  FrequencyToggle,
  ImpactLine,
  TrustStrip,
  UpiPaymentPanel,
} from '../components/donation/DonationWidgets'
import { DONATE_COPY } from '../data/donateDefaults'
import { donationAmounts, organization } from '../data/organization'
import { useLanguage } from '../context/LanguageContext'
import { submitDonationIntent } from '../services/api'
import { formatCurrencyINR } from '../utils/format'

export default function Donate() {
  const { t, lang } = useLanguage()
  const [params] = useSearchParams()
  const initialAmount = Number(params.get('amount')) || 1000
  const initialFrequency = params.get('frequency') === 'monthly' ? 'monthly' : 'once'

  const [amount, setAmount] = useState(donationAmounts.includes(initialAmount) ? initialAmount : 1000)
  const [custom, setCustom] = useState(donationAmounts.includes(initialAmount) ? '' : String(initialAmount))
  const [frequency, setFrequency] = useState(initialFrequency)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [paidConfirm, setPaidConfirm] = useState(false)

  const selectedAmount = useMemo(() => (custom ? Number(custom) || 0 : amount), [amount, custom])

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    try {
      const result = await submitDonationIntent({
        amount: selectedAmount,
        method: 'upi',
        frequency,
        name,
        email,
        phone,
        paidConfirm,
        lang,
      })
      setStatus(
        result.message ||
          t(DONATE_COPY.successMessage, DONATE_COPY.successMessageHi),
      )
    } catch (error) {
      setStatus(
        error?.response?.data?.message ||
          t('Unable to process donation right now.', 'अभी दान प्रक्रिया पूरी नहीं हो सकी।'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHero
        label={t('Donate', 'दान करें')}
        title={t('Your Support Creates Possibilities', 'आपका सहयोग संभावनाएँ बनाता है')}
        description={t(
          'Donate via UPI in seconds. Every contribution strengthens education, rehabilitation and inclusion — with 80G tax benefit. Please fill the form to avail 80G.',
          'सेकंडों में UPI से दान करें। हर योगदान शिक्षा, पुनर्वास और समावेशन को मज़बूत करता है — 80G कर लाभ के साथ। 80G की सेवा का लाभ पाने के लिए फॉर्म भरना न भूलें।',
        )}
        crumbs={[
          { label: t('Home', 'होम'), to: '/' },
          { label: t('Donate', 'दान') },
        ]}
      />
      <section className="section-padding">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy">
              {t(DONATE_COPY.whyTitle, DONATE_COPY.whyTitleHi)}
            </h2>
            <p className="mt-4 leading-relaxed text-text-muted">
              {t(DONATE_COPY.whyBody, DONATE_COPY.whyBodyHi)}
            </p>

            <Form80GNotice className="mt-6" />

            <div className="mt-6">
              <TrustStrip className="text-navy" />
            </div>

            <div className="mt-8">
              <UpiPaymentPanel amount={selectedAmount || 1000} />
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-muted p-6">
              <h3 className="font-bold text-navy">{t('Bank / support contact', 'बैंक / सहायता संपर्क')}</h3>
              <p className="mt-2 text-sm text-text-muted">
                {t('Phone', 'फ़ोन')}: {organization.phone}
              </p>
              <p className="text-sm text-text-muted">
                {t('Email', 'ईमेल')}: {organization.email}
              </p>
              <p className="mt-3 text-xs text-text-muted">
                {organization.payment.bankName}. {t(organization.payment.note, organization.payment.noteHi)}
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="card space-y-5">
            <h3 className="text-xl font-bold text-navy">{t('Make a Contribution', 'योगदान करें')}</h3>
            <Form80GNotice compact />

            <FrequencyToggle value={frequency} onChange={setFrequency} />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {donationAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAmount(value)
                    setCustom('')
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                    !custom && amount === value
                      ? 'border-brand bg-brand text-white'
                      : 'border-border bg-muted text-navy'
                  }`}
                >
                  {formatCurrencyINR(value)}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              placeholder={t('Other Amount', 'अन्य राशि')}
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
            />

            <ImpactLine amount={selectedAmount} />

            <div>
              <label htmlFor="donor-name" className="mb-1.5 block text-sm font-medium text-navy">
                {t('Full Name', 'पूरा नाम')}
              </label>
              <input
                id="donor-name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="donor-email" className="mb-1.5 block text-sm font-medium text-navy">
                {t('Email (for 80G receipt)', 'ईमेल (80G रसीद हेतु)')}
              </label>
              <input
                id="donor-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="donor-phone" className="mb-1.5 block text-sm font-medium text-navy">
                {t('WhatsApp / Phone', 'WhatsApp / फ़ोन')}
              </label>
              <input
                id="donor-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-navy">
              <input
                type="checkbox"
                checked={paidConfirm}
                onChange={(event) => setPaidConfirm(event.target.checked)}
                className="mt-1"
              />
              <span>
                {t(
                  'I have completed / will complete UPI payment using the QR or UPI ID shown.',
                  'मैंने दिखाए गए QR / UPI ID से भुगतान पूरा कर लिया है / करूँगा।',
                )}
              </span>
            </label>

            <button type="submit" className="btn-primary w-full" disabled={loading || !selectedAmount}>
              {loading
                ? t('Saving…', 'सेव हो रहा है…')
                : `${t('Confirm donation', 'दान पुष्टि करें')} ${formatCurrencyINR(selectedAmount || 0)}`}
            </button>
            {status ? (
              <p className="text-sm text-accent-green" role="status">
                {status}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </>
  )
}
