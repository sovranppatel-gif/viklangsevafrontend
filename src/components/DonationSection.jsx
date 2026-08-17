import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { donationAmounts } from '../data/organization'
import { useLanguage } from '../context/LanguageContext'
import { useOrganization } from '../context/OrganizationContext'
import { submitDonationIntent } from '../services/api'
import { formatCurrencyINR } from '../utils/format'
import {
  Form80GNotice,
  FrequencyToggle,
  TrustStrip,
  UpiPaymentPanel,
} from './donation/DonationWidgets'

export default function DonationSection() {
  const { t, lang } = useLanguage()
  const { organization, donate } = useOrganization()
  const [params] = useSearchParams()
  const initialAmount = Number(params.get('amount')) || 1000
  const initialFrequency = params.get('frequency') === 'monthly' ? 'monthly' : 'once'

  const [amount, setAmount] = useState(donationAmounts.includes(initialAmount) ? initialAmount : 1000)
  const [custom, setCustom] = useState(donationAmounts.includes(initialAmount) ? '' : String(initialAmount))
  const [frequency, setFrequency] = useState(initialFrequency)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [pan, setPan] = useState('')
  const [status, setStatus] = useState('')
  const [statusError, setStatusError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paidConfirm, setPaidConfirm] = useState(false)

  const selectedAmount = useMemo(() => (custom ? Number(custom) || 0 : amount), [amount, custom])
  const hasAadhaar = aadhaarNumber.length === 12
  const hasPan = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)
  const identityHint = t(
    'Enter Aadhaar or PAN — at least one is required for the 80G receipt.',
    'आधार या पैन दर्ज करें — 80G रसीद के लिए इनमें से कम से कम एक आवश्यक है।',
  )

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus('')
    setStatusError(false)

    if (!hasAadhaar && !hasPan) {
      setStatusError(true)
      setStatus(identityHint)
      return
    }

    setLoading(true)
    try {
      const result = await submitDonationIntent({
        amount: selectedAmount,
        method: 'upi',
        frequency,
        name,
        email,
        phone,
        aadhaarNumber,
        pan,
        paidConfirm,
        lang,
      })
      setStatusError(false)
      setStatus(result.message || t(donate.successMessage, donate.successMessageHi))
    } catch (error) {
      setStatusError(true)
      setStatus(
        error?.response?.data?.message ||
          t('Unable to process donation right now.', 'अभी दान प्रक्रिया पूरी नहीं हो सकी।'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-padding scroll-mt-28" id="donate-now">
      <div className="container-page grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">{t(donate.whyTitle, donate.whyTitleHi)}</h2>
          <p className="mt-4 leading-relaxed text-text-muted">{t(donate.whyBody, donate.whyBodyHi)}</p>

          <Form80GNotice className="mt-6" />

          <div className="mt-6">
            <TrustStrip className="text-navy" />
          </div>

          <div className="mt-8">
            <UpiPaymentPanel amount={selectedAmount || 1000} />
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted p-4 sm:rounded-3xl sm:p-6">
            <h3 className="font-bold text-navy">{t('Bank / support contact', 'बैंक / सहायता संपर्क')}</h3>
            <p className="mt-2 text-sm text-text-muted">
              {t('Phone', 'फ़ोन')}: {organization.phone}
            </p>
            <p className="text-sm text-text-muted">
              {t('Email', 'ईमेल')}: {organization.email}
            </p>
            {organization.payment.accountName ? (
              <p className="mt-3 break-words text-sm text-navy">
                {t('Account name', 'खाता नाम')}: {organization.payment.accountName}
              </p>
            ) : null}
            {organization.payment.bankName ? (
              <p className="text-sm text-navy">
                {t('Bank', 'बैंक')}: {organization.payment.bankName}
                {organization.payment.branch ? ` · ${organization.payment.branch}` : ''}
              </p>
            ) : null}
            {organization.payment.accountNumber ? (
              <p className="text-sm text-navy">
                {t('Account number', 'खाता संख्या')}: {organization.payment.accountNumber}
              </p>
            ) : null}
            {organization.payment.ifsc ? (
              <p className="text-sm text-navy">
                {t('IFSC', 'IFSC')}: {organization.payment.ifsc}
              </p>
            ) : null}
            <p className="mt-3 text-xs text-text-muted">
              {t(organization.payment.note, organization.payment.noteHi)}
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
          <div>
            <label htmlFor="donor-aadhaar" className="mb-1.5 block text-sm font-medium text-navy">
              {t('Aadhaar Number (for 80G receipt)', 'आधार नंबर (80G रसीद हेतु)')}
            </label>
            <input
              id="donor-aadhaar"
              inputMode="numeric"
              autoComplete="off"
              maxLength={12}
              placeholder={t('12-digit Aadhaar', '12 अंकों का आधार')}
              value={aadhaarNumber}
              onChange={(event) =>
                setAadhaarNumber(event.target.value.replace(/\D/g, '').slice(0, 12))
              }
              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              aria-describedby="donor-identity-hint"
            />
          </div>
          <div>
            <label htmlFor="donor-pan" className="mb-1.5 block text-sm font-medium text-navy">
              {t('PAN Number (for 80G receipt)', 'पैन नंबर (80G रसीद हेतु)')}
            </label>
            <input
              id="donor-pan"
              autoComplete="off"
              maxLength={10}
              placeholder={t('e.g. ABCDE1234F', 'उदा. ABCDE1234F')}
              value={pan}
              onChange={(event) =>
                setPan(event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10))
              }
              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              aria-describedby="donor-identity-hint"
            />
            <p id="donor-identity-hint" className="mt-2 text-xs leading-relaxed text-brand">
              {identityHint}
            </p>
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
            <p className={`text-sm ${statusError ? 'text-brand' : 'text-accent-green'}`} role="status">
              {status}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
