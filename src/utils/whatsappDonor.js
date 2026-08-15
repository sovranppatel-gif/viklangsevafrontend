import { amountInWordsINR, buildReceiptSerial, formatReceiptDate } from './receipt'
import { formatCurrencyINR } from './format'
import { RECEIPT_80G } from '../data/receipt80g'

/** Normalize phone for wa.me (digits only, default India 91) */
export function toWhatsAppNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 10) return `91${digits}`
  if (digits.startsWith('0') && digits.length === 11) return `91${digits.slice(1)}`
  if (digits.startsWith('91') && digits.length >= 12) return digits
  return digits
}

export function buildDonorWhatsAppMessage(donation) {
  const receiptNo = buildReceiptSerial(donation)
  const dateLabel = formatReceiptDate(donation?.donationDate || donation?.createdAt)
  const amount = formatCurrencyINR(donation?.amount || 0)
  const words = amountInWordsINR(donation?.amount || 0)

  return [
    `नमस्ते ${donation?.name || 'Donor'} जी,`,
    '',
    `विकलांग सेवा संस्थान, नरसिंहपुर को आपके दान (${amount}) के लिए धन्यवाद।`,
    '',
    `रसीद क्र.: ${receiptNo}`,
    `दिनांक: ${dateLabel}`,
    `राशि: ${amount} (${words})`,
    donation?.email ? `ईमेल: ${donation.email}` : null,
    '',
    `80G Approval No.: ${RECEIPT_80G.approvalNumber}`,
    `PAN: ${RECEIPT_80G.pan}`,
    `Valid AY ${RECEIPT_80G.validFromAy} to ${RECEIPT_80G.validToAy}`,
    '',
    'आपकी 80G रसीद तैयार है। आवश्यकता हो तो हम प्रिंटेड कॉपी भी साझा कर सकते हैं।',
    'धन्यवाद!',
  ]
    .filter((line) => line !== null)
    .join('\n')
}

export function buildDonorWhatsAppUrl(donation) {
  const number = toWhatsAppNumber(donation?.phone)
  if (!number) return ''
  return `https://wa.me/${number}?text=${encodeURIComponent(buildDonorWhatsAppMessage(donation))}`
}
