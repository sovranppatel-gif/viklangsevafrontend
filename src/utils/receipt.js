const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
]

const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function twoDigits(n) {
  if (n < 20) return ones[n]
  const t = Math.floor(n / 10)
  const o = n % 10
  return `${tens[t]}${o ? ` ${ones[o]}` : ''}`
}

function threeDigits(n) {
  const h = Math.floor(n / 100)
  const rest = n % 100
  if (!h) return twoDigits(rest)
  return `${ones[h]} Hundred${rest ? ` ${twoDigits(rest)}` : ''}`
}

/** Convert integer amount to Indian-style English words (e.g. One Thousand Only) */
export function amountInWordsINR(amount) {
  const value = Math.round(Number(amount) || 0)
  if (value <= 0) return 'Zero Rupees Only'

  const crore = Math.floor(value / 10000000)
  const lakh = Math.floor((value % 10000000) / 100000)
  const thousand = Math.floor((value % 100000) / 1000)
  const hundred = value % 1000

  const parts = []
  if (crore) parts.push(`${threeDigits(crore)} Crore`)
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`)
  if (hundred) parts.push(threeDigits(hundred))

  return `${parts.join(' ')} Rupees Only`
}

export function formatReceiptDate(value) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return '—'
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function buildReceiptSerial(donation) {
  if (donation?.receiptNumber) return donation.receiptNumber
  const year = new Date(donation?.donationDate || donation?.createdAt || Date.now()).getFullYear()
  const short = String(donation?.id || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(-4)
    .toUpperCase()
  return `VSS-${year}-${short || '0001'}`
}

export function printDonationReceipt() {
  const existing = document.querySelector('style[data-donation-print]')
  existing?.remove()

  const style = document.createElement('style')
  style.setAttribute('data-donation-print', 'true')
  style.textContent = '@media print { @page { size: A4 portrait; margin: 8mm; } }'
  document.head.appendChild(style)
  document.body.classList.add('printing-donation-receipt')

  const cleanup = () => {
    style.remove()
    document.body.classList.remove('printing-donation-receipt')
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)
  window.print()
}
