import { useState } from 'react'
import { donationAmounts } from '../data/organization'
import { useLanguage } from '../context/LanguageContext'
import { formatCurrencyINR } from '../utils/format'
import {
  DonateCtaLink,
  Form80GNotice,
  FrequencyToggle,
  ImpactLine,
  TrustStrip,
  UpiPaymentPanel,
} from './donation/DonationWidgets'

export default function DonationSection() {
  const { t } = useLanguage()
  const [amount, setAmount] = useState(1000)
  const [custom, setCustom] = useState('')
  const [frequency, setFrequency] = useState('once')
  const [showUpi, setShowUpi] = useState(false)

  const selectedAmount = custom ? Number(custom) || 0 : amount

  return (
    <section className="relative overflow-hidden" id="donate-now">
      <img
        src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1800&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand/92 to-navy/95 sm:bg-gradient-to-r sm:from-brand-dark sm:via-brand/90 sm:to-navy/90" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-6 py-12 sm:gap-8 sm:py-16 md:py-20 lg:grid-cols-2 lg:gap-10">
        <div className="text-white">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            {t('Your Contribution Can Change a Life', 'आपका योगदान एक जीवन बदल सकता है')}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/85 sm:mt-4 sm:text-base md:text-lg">
            {t(
              'Pick an amount, see exactly what it supports, and donate via UPI in under a minute.',
              'राशि चुनें, देखें कि वह क्या सहयोग करती है, और एक मिनट में UPI से दान करें।',
            )}
          </p>
          <div className="mt-4 sm:mt-6">
            <TrustStrip className="text-[11px] text-white/90 sm:text-sm [&_svg]:text-accent-yellow" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-6 md:p-8">
          <h3 className="text-lg font-bold text-navy sm:text-xl">{t('Choose an Amount', 'राशि चुनें')}</h3>
          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            {t('100% toward programs · 80G receipt on request', '100% कार्यक्रमों के लिए · अनुरोध पर 80G रसीद')}
          </p>
          <Form80GNotice compact className="mt-3 rounded-xl border border-accent-yellow/40 bg-accent-yellow/10 px-3 py-2" />

          <div className="mt-4">
            <FrequencyToggle value={frequency} onChange={setFrequency} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
            {donationAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAmount(value)
                  setCustom('')
                }}
                className={`min-h-16 rounded-xl border px-2.5 py-2.5 text-left transition sm:px-3 sm:py-3 ${
                  !custom && amount === value
                    ? 'border-brand bg-brand text-white'
                    : 'border-border bg-muted text-navy hover:border-brand'
                }`}
              >
                <span className="block text-sm font-bold">{formatCurrencyINR(value)}</span>
                <span
                  className={`mt-1 block text-[10px] leading-snug sm:text-[11px] ${
                    !custom && amount === value ? 'text-white/85' : 'text-text-muted'
                  }`}
                >
                  {t(
                    value === 500
                      ? '1 therapy session'
                      : value === 1000
                        ? 'Learning kit support'
                        : value === 2500
                          ? 'Assistive aid'
                          : '1 month rehab',
                    value === 500
                      ? '1 थेरेपी सत्र'
                      : value === 1000
                        ? 'लर्निंग किट'
                        : value === 2500
                          ? 'सहायक उपकरण'
                          : '1 माह पुनर्वास',
                  )}
                </span>
              </button>
            ))}
            <label className="col-span-2">
              <span className="sr-only">{t('Other amount', 'अन्य राशि')}</span>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                placeholder={t('Other Amount', 'अन्य राशि')}
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 text-base text-navy focus:border-brand focus:outline-none sm:text-sm"
              />
            </label>
          </div>

          <ImpactLine amount={selectedAmount} className="mt-4 text-xs sm:text-sm" />

          {frequency === 'monthly' ? (
            <p className="mt-3 text-xs font-medium text-brand">
              {t(
                'Monthly gifts create steady care — thank you for choosing recurring support.',
                'मासिक दान निरंतर देखभाल बनाता है — आवर्ती सहयोग चुनने के लिए धन्यवाद।',
              )}
            </p>
          ) : null}

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setShowUpi((value) => !value)}
              className="btn-outline w-full"
            >
              {showUpi
                ? t('Hide UPI / QR', 'UPI / QR छिपाएँ')
                : t('Pay with UPI / QR', 'UPI / QR से भुगतान')}
            </button>
            <DonateCtaLink
              amount={selectedAmount || 1000}
              method="upi"
              frequency={frequency}
              className="btn-primary w-full"
            />
          </div>

          {showUpi ? (
            <div className="mt-4">
              <UpiPaymentPanel amount={selectedAmount || 1000} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
