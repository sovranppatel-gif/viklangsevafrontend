import { DONATE_COPY } from './donateDefaults'
import { organization } from './organization'

export const DEFAULT_DONATE_SETTINGS = {
  upiId: organization.payment.upiId,
  upiName: organization.payment.upiName,
  qrImageUrl: '',
  accountName: organization.payment.accountName,
  accountNumber: organization.payment.accountNumber,
  ifsc: organization.payment.ifsc,
  bankName: organization.payment.bankName,
  branch: '',
  note: organization.payment.note,
  noteHi: organization.payment.noteHi,
  pageLabel: 'Donate',
  pageLabelHi: 'दान करें',
  pageTitle: 'Your Support Creates Possibilities',
  pageTitleHi: 'आपका सहयोग संभावनाएँ बनाता है',
  pageDescription:
    'Donate via UPI in seconds. Every contribution strengthens education, rehabilitation and inclusion — with 80G tax benefit. Please fill the form to avail 80G.',
  pageDescriptionHi:
    'सेकंडों में UPI से दान करें। हर योगदान शिक्षा, पुनर्वास और समावेशन को मज़बूत करता है — 80G कर लाभ के साथ। 80G की सेवा का लाभ पाने के लिए फॉर्म भरना न भूलें।',
  whyTitle: DONATE_COPY.whyTitle,
  whyTitleHi: DONATE_COPY.whyTitleHi,
  whyBody: DONATE_COPY.whyBody,
  whyBodyHi: DONATE_COPY.whyBodyHi,
  landingTitle: 'Your Contribution Can Change a Life',
  landingTitleHi: 'आपका योगदान एक जीवन बदल सकता है',
  landingBody: 'Pick an amount, see exactly what it supports, and donate via UPI in under a minute.',
  landingBodyHi: 'राशि चुनें, देखें कि वह क्या सहयोग करती है, और एक मिनट में UPI से दान करें।',
  form80gTitle: DONATE_COPY.form80gTitle,
  form80gTitleHi: DONATE_COPY.form80gTitleHi,
  form80gNotice: DONATE_COPY.form80gNotice,
  form80gNoticeHi: DONATE_COPY.form80gNoticeHi,
  form80gShort: DONATE_COPY.form80gShort,
  form80gShortHi: DONATE_COPY.form80gShortHi,
  successMessage: DONATE_COPY.successMessage,
  successMessageHi: DONATE_COPY.successMessageHi,
}

export function mergeDonateSettings(data = {}) {
  return {
    ...DEFAULT_DONATE_SETTINGS,
    ...data,
  }
}
